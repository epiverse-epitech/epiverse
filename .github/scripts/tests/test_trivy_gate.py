"""Verify fail-closed Trivy gate with mock scanner data, never a real Docker daemon."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "trivy-image-gate.sh"

def finding(severity, fix="", vuln="CVE-2099-0001"):
    return {
        "VulnerabilityID": vuln,
        "Severity": severity,
        "PkgName": "fake-lib",
        "InstalledVersion": "1.0.0",
        "FixedVersion": fix,
        "Status": "fixed" if fix else "affected",
    }

class TrivyPolicyTests(unittest.TestCase):
    def execute(self, findings=None, *, raw=None):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            fakebin = root / "bin"
            fakebin.mkdir()
            mock = fakebin / "docker"
            mock.write_text("#!/bin/sh\ncat \"$MOCK_TRIVY_JSON\"\n")
            mock.chmod(0o755)
            report = root / "scanner.json"
            if raw is None:
                raw = json.dumps({
                    "SchemaVersion": 2,
                    "Results": [{
                        "Target": "fake:ci",
                        "Class": "os-pkgs",
                        "Vulnerabilities": findings,
                    }]
                })
            report.write_text(raw)
            summary = root / "summary.md"
            env = os.environ.copy()
            env["PATH"] = str(fakebin) + os.pathsep + env["PATH"]
            env["MOCK_TRIVY_JSON"] = str(report)
            env["GITHUB_STEP_SUMMARY"] = str(summary)
            result = subprocess.run(
                ["bash", str(SCRIPT), "fake:ci"],
                text=True, capture_output=True, env=env, check=False,
            )
            return result, summary.read_text() if summary.exists() else ""

    def test_no_findings_pass(self):
        result, summary = self.execute([])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("0", summary)

    def test_unfixed_high_warns_but_does_not_block_development(self):
        result, summary = self.execute([finding("HIGH")])
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("1", summary)
        self.assertIn("CVE-2099-0001", summary)
        self.assertIn("::warning::", result.stdout)

    def test_fixable_high_blocks(self):
        result, _ = self.execute([finding("HIGH", "2.0.0")])
        self.assertEqual(result.returncode, 1)
        self.assertIn("Blocking image vulnerabilities", result.stdout)

    def test_unfixed_critical_blocks(self):
        result, _ = self.execute([finding("CRITICAL")])
        self.assertEqual(result.returncode, 1)
        self.assertIn("CRITICAL=1", result.stdout)

    def test_fixable_critical_blocks(self):
        result, _ = self.execute([finding("CRITICAL", "2.0.0")])
        self.assertEqual(result.returncode, 1)

    def test_corrupt_scanner_output_blocks(self):
        result, _ = self.execute(raw="not json")
        self.assertNotEqual(result.returncode, 0)

    def test_missing_results_blocks(self):
        result, _ = self.execute(raw='{"SchemaVersion": 2}')
        self.assertNotEqual(result.returncode, 0)

if __name__ == "__main__":
    unittest.main()
