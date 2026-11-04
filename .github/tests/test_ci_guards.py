"""Regression tests execute the actual shell guards extracted from ci.yml."""
from pathlib import Path
import re
import subprocess
import tempfile
import unittest

WORKFLOW = Path(__file__).resolve().parents[1] / "workflows" / "ci.yml"

class CIGuards(unittest.TestCase):
    def syntax_guard(self, directory, shell):
        text = WORKFLOW.read_text()
        pattern = r'run: (for script in ' + re.escape(directory) + r'/\*\.sh; do ' + shell + r' -n "\$script" \|\| exit; done)'
        match = re.search(pattern, text)
        self.assertIsNotNone(match, "CI must check every script")
        return match.group(1)

    def run_syntax(self, directory, shell, invalid):
        command = self.syntax_guard(directory, shell)
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            folder = root / directory
            folder.mkdir(parents=True)
            (folder / "a-valid.sh").write_text("echo valid\n")
            (folder / "z-second.sh").write_text("if then\n" if invalid else "echo valid\n")
            return subprocess.run(["bash", "-c", command], cwd=root, capture_output=True).returncode

    def test_bash_rejects_invalid_second_script(self):
        self.assertNotEqual(self.run_syntax("infra/scripts", "bash", True), 0)

    def test_posix_rejects_invalid_second_script(self):
        self.assertNotEqual(self.run_syntax("infra/docker", "sh", True), 0)

    def test_valid_scripts_pass(self):
        for directory, shell in [("infra/scripts", "bash"), ("infra/docker", "sh")]:
            self.assertEqual(self.run_syntax(directory, shell, False), 0)

    def lint_guard(self, names):
        text = WORKFLOW.read_text()
        match = re.search(r"if (! compgen[^\n]+); then", text)
        self.assertIsNotNone(match)
        with tempfile.TemporaryDirectory() as temp:
            for name in names:
                (Path(temp) / name).touch()
            command = "if " + match.group(1) + "; then exit 1; fi"
            return subprocess.run(["bash", "-c", command], cwd=temp).returncode

    def test_flat_config_only(self):
        self.assertEqual(self.lint_guard(["eslint.config.js"]), 0)

    def test_legacy_config_only(self):
        self.assertEqual(self.lint_guard([".eslintrc.json"]), 0)

    def test_missing_config_fails(self):
        self.assertNotEqual(self.lint_guard([]), 0)

if __name__ == "__main__":
    unittest.main()
