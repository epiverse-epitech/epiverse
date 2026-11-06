import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('checker', ROOT / 'scripts/check_programme.py')
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


class RegistryTests(unittest.TestCase):
    def run_case(self, change=None, release=False):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            folder = root / 'docs/programme'
            folder.mkdir(parents=True)
            controls = json.loads((ROOT / 'docs/programme/controls.json').read_text())
            if change:
                change(controls)
            (folder / 'controls.json').write_text(json.dumps(controls))
            (folder / 'modules.json').write_text((ROOT / 'docs/programme/modules.json').read_text())
            return checker.check(root, release)

    def test_baseline_structure_valid(self):
        self.assertEqual(self.run_case(), [])

    def test_baseline_does_not_authorize_release(self):
        self.assertTrue(any('release blocked' in e for e in self.run_case(release=True)))

    def test_fake_verification_rejected(self):
        errors = self.run_case(lambda d: d['controls'][0].update(status='verified'))
        self.assertTrue(any('needs evidence' in e for e in errors))

    def test_duplicate_id_rejected(self):
        self.assertTrue(self.run_case(lambda d: d['controls'].append(copy.deepcopy(d['controls'][0]))))

    def test_skip_blocking_control_rejected(self):
        self.assertTrue(self.run_case(lambda d: d['controls'][0].update(status='not_applicable', reason='skip')))

    def test_malformed_evidence_rejected(self):
        self.assertTrue(self.run_case(lambda d: d['controls'][0].update(evidence=[{'reference':'http://example.com'}])))

    def test_non_object_entry_fails_closed(self):
        self.assertTrue(self.run_case(lambda d: d['controls'].append(None)))

    def test_empty_controls_rejected(self):
        self.assertTrue(self.run_case(lambda d: d.update(controls=[])))


if __name__ == '__main__':
    unittest.main()
