"""Regression tests for destructive fixture CLI safeguards (standard library only)."""
import os
import subprocess
import sys
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parent / "generate.py"


class FixtureSafetyTests(unittest.TestCase):
    def invoke(self, *args, extra_env=None):
        env = os.environ.copy()
        env.pop("APP_ENV", None)
        env.pop("NODE_ENV", None)
        env.pop("DOCKER_HOST", None)
        env.update(extra_env or {})
        return subprocess.run(
            [sys.executable, str(SCRIPT), *args],
            capture_output=True,
            text=True,
            env=env,
            check=False,
        )

    def test_load_requires_explicit_confirmation(self):
        result = self.invoke("--load")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("--confirm-local-reset", result.stderr)

    def test_load_rejected_in_production(self):
        result = self.invoke(
            "--load", "--confirm-local-reset",
            extra_env={"NODE_ENV": "production"},
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("production", result.stderr)

    def test_remote_docker_host_is_rejected(self):
        result = self.invoke(
            "--load", "--confirm-local-reset",
            extra_env={"DOCKER_HOST": "tcp://192.0.2.1:2376"},
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("DOCKER_HOST", result.stderr)


if __name__ == "__main__":
    unittest.main()
