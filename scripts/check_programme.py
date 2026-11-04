#!/usr/bin/env python3
"""Validate programme records. Passing is not proof of product readiness."""
import argparse
import datetime
import json
from pathlib import Path
import sys
from urllib.parse import urlparse


def check(root, release=False):
    errors = []
    try:
        controls = json.loads((root / 'docs/programme/controls.json').read_text())
        modules = json.loads((root / 'docs/programme/modules.json').read_text())
        for data, key in [(controls, 'controls'), (modules, 'modules')]:
            if data.get('schema_version') != 1 or not isinstance(data.get(key), list):
                raise ValueError('unsupported schema or missing list')
            datetime.date.fromisoformat(data['baseline'])
    except (OSError, ValueError, KeyError, TypeError) as exc:
        return [f'Invalid registry: {exc}']
    for key, records in [('controls', controls['controls']), ('modules', modules['modules'])]:
        seen = set()
        for record in records:
            if not isinstance(record, dict):
                errors.append(f'{key}: entry must be an object')
                continue
            ident = record.get('id')
            if not isinstance(ident, str) or not ident.strip():
                errors.append(f'{key}: missing ID')
                continue
            if ident in seen:
                errors.append(f'{key}: duplicate {ident}')
            seen.add(ident)
            fields = ('owner', 'title', 'acceptance') if key == 'controls' else ('name', 'dependency', 'risk', 'acceptance')
            for field in fields:
                if not isinstance(record.get(field), str) or not record[field].strip():
                    errors.append(f'{ident}: missing {field}')
            if key == 'modules':
                if record.get('stage') not in {'mvp', 'pilot', 'later', 'restricted'}:
                    errors.append(f'{ident}: invalid stage')
                if record.get('status') not in {'planned', 'in_progress', 'verified'}:
                    errors.append(f'{ident}: invalid status')
                if record.get('status') == 'verified' and not record.get('evidence'):
                    errors.append(f'{ident}: verified module needs evidence')
                continue
            if record.get('priority') not in {'P0', 'P1', 'P2'}:
                errors.append(f'{ident}: invalid priority')
            if type(record.get('release_blocking')) is not bool:
                errors.append(f'{ident}: release_blocking must be boolean')
            status = record.get('status')
            if status not in {'open', 'in_progress', 'verified', 'not_applicable'}:
                errors.append(f'{ident}: invalid status')
            evidence = record.get('evidence')
            if not isinstance(evidence, list):
                errors.append(f'{ident}: evidence must be a list')
                evidence = []
            if status == 'verified' and not evidence:
                errors.append(f'{ident}: verified control needs evidence')
            for item in evidence:
                try:
                    if not isinstance(item, dict):
                        raise ValueError('not an object')
                    for field in ('reference', 'revision', 'reviewed_by', 'result'):
                        if not isinstance(item.get(field), str) or not item[field].strip():
                            raise ValueError('missing ' + field)
                    ref = urlparse(item['reference'])
                    if ref.scheme != 'https' or not ref.netloc or ref.username or ref.password:
                        raise ValueError('reference must be an HTTPS URL without credentials')
                    datetime.date.fromisoformat(item['date'])
                    if item['result'] != 'passed':
                        raise ValueError('evidence result must be passed')
                except (KeyError, TypeError, ValueError) as exc:
                    errors.append(f'{ident}: invalid evidence ({exc})')
            if status == 'not_applicable':
                if not isinstance(record.get('reason'), str) or not record['reason'].strip():
                    errors.append(f'{ident}: non-applicability needs a reason')
                if record.get('release_blocking'):
                    errors.append(f'{ident}: blocking control cannot be non-applicable')
            if release and record.get('release_blocking') and status != 'verified':
                errors.append(f'{ident}: release blocked ({status})')
    if len(modules['modules']) != 36:
        errors.append('The vision catalogue must account for all 36 domains')
    if not controls['controls']:
        errors.append('Control registry must not be empty')
    return errors


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--release', action='store_true')
    args = parser.parse_args()
    problems = check(args.root, args.release)
    for problem in problems:
        print(problem, file=sys.stderr)
    if problems:
        sys.exit(1)
    print('Registry validation passed. Evidence contents and deployed systems require separate review.')
