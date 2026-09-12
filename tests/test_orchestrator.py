import json
import tempfile
import unittest
from pathlib import Path

from orchestrator.core import Orchestrator


class OrchestratorTests(unittest.TestCase):
    def test_plan_detects_existing_secure_t_tools(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "package.json").write_text("{}")
            (root / "factory").mkdir()
            (root / "factory" / "pyproject.toml").write_text("[project]\n")
            (root / "scripts").mkdir()
            (root / "scripts" / "audit-pii.mjs").write_text("console.log('ok')")

            names = [step.name for step in Orchestrator(root).plan()]
            self.assertEqual(names, ["typecheck", "tests", "python-smoke", "pii-audit"])

    def test_default_run_is_dry_run_and_writes_audit(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "package.json").write_text("{}")
            result = Orchestrator(root).run()

            self.assertTrue(result.changed)
            self.assertFalse(result.executed)
            self.assertTrue(result.success)
            self.assertFalse((root / ".orchestrator-state.json").exists())
            record = json.loads((root / "audit" / "orchestrator-runs.jsonl").read_text())
            self.assertFalse(record["executed"])


if __name__ == "__main__":
    unittest.main()
