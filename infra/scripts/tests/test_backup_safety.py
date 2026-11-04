"""Offline regression tests for backup/restore orchestration (no real databases)."""
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]


class BackupSafetyTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.base = self.root / "epiverse"
        self.envdir = self.base / "production"
        self.envdir.mkdir(parents=True)
        self.backups = self.base / "backups" / "production"
        self.backups.mkdir(parents=True)
        self.log = self.root / "calls.log"
        self.mockbin = self.root / "bin"
        self.mockbin.mkdir()
        (self.envdir / "docker-compose.server.yml").write_text("services: {}\n")
        self.set_env(remote="remote:bucket")
        self.stub("docker", r'''#!/bin/sh
echo "docker $*" >> "$MOCK_LOG"
case " $* " in
  *" pg_dump "*) printf 'FAKE-ARCHIVE-CONTENT' ;;
  *" pg_restore --list "*) cat >/dev/null ;;
  *" pg_restore "*) cat >/dev/null ;;
esac
''')
        self.stub("openssl", r'''#!/bin/sh
outfile=""
infile=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    -out) outfile="$2"; shift 2 ;;
    -in) infile="$2"; shift 2 ;;
    *) shift ;;
  esac
done
if [ -n "$outfile" ]; then cat > "$outfile"; exit $?; fi
if [ "${MOCK_BAD_ARCHIVE:-false}" = true ]; then exit 3; fi
cat "$infile"
''')
        self.stub("rclone", r'''#!/bin/sh
case "$1" in
  listremotes) printf 'remote:\n' ;;
  config) printf 'type = s3\n' ;;
  copy)
    echo 'remote-copy' >> "$MOCK_LOG"
    if [ "${MOCK_FAIL_COPY:-false}" = true ]; then exit 42; fi
    ;;
esac
''')
        self.stub("find", r'''#!/bin/sh
echo 'local-prune' >> "$MOCK_LOG"
exec /usr/bin/find "$@"
''')

    def set_env(self, remote):
        (self.envdir / ".env").write_text(
            f"POSTGRES_USER=epiverse\nPOSTGRES_DB=epiverse\n"
            f"BACKUP_DIR={self.backups}\nBACKUP_RETENTION_DAYS=14\n"
            f"BACKUP_RCLONE_REMOTE={remote}\nBACKUP_PASSPHRASE=example-test-key\n"
        )

    def stub(self, name, body):
        target = self.mockbin / name
        target.write_text(body)
        target.chmod(0o755)

    def run_script(self, script, *args, overrides=None):
        env = os.environ.copy()
        env.update({
            "PATH": str(self.mockbin) + os.pathsep + os.environ.get("PATH", ""),
            "EPIVERSE_BASE_DIR": str(self.base),
            "MOCK_LOG": str(self.log),
        })
        env.update(overrides or {})
        return subprocess.run(
            ["bash", str(SCRIPTS / script), *args],
            cwd=self.root, env=env, capture_output=True, text=True, check=False
        )

    def events(self):
        return self.log.read_text() if self.log.exists() else ""

    def test_production_requires_offsite_remote_before_database_access(self):
        self.set_env(remote="")
        result = self.run_script("backup-db.sh", "production")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("BACKUP_RCLONE_REMOTE obligatoire", result.stderr)
        self.assertNotIn("docker", self.events())

    def test_failed_remote_upload_keeps_new_and_previous_backups(self):
        old_backup = self.backups / "epiverse-production-20200101T000000Z.dump.enc"
        old_backup.write_text("old-snapshot")
        result = self.run_script(
            "backup-db.sh", "production", overrides={"MOCK_FAIL_COPY": "true"}
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue(old_backup.exists())
        self.assertEqual(len(list(self.backups.glob("*.dump.enc"))), 2)
        self.assertIn("remote-copy", self.events())
        self.assertNotIn("local-prune", self.events())

    def test_successful_remote_upload_happens_before_pruning(self):
        result = self.run_script("backup-db.sh", "production")
        self.assertEqual(result.returncode, 0, result.stderr)
        events = self.events()
        self.assertLess(events.index("remote-copy"), events.index("local-prune"))

    def test_invalid_restore_is_rejected_before_stopping_api(self):
        archive = self.root / "corrupt.dump.enc"
        archive.write_text("broken")
        result = self.run_script(
            "restore-db.sh", "production", str(archive), "--yes",
            overrides={"MOCK_BAD_ARCHIVE": "true"}
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn("docker compose -f docker-compose.server.yml stop api", self.events())
        self.assertIn("Archive corrompue", result.stderr)


if __name__ == "__main__":
    unittest.main()
