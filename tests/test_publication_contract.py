from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class PublicationContractTests(unittest.TestCase):
    def test_landing_has_one_deployable_canonical_pair(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertEqual(source.count('<link rel="canonical"'), 1)
        self.assertEqual(source.count('property="og:url"'), 1)
        self.assertIn("__BASE_URL__", source)

    def test_builder_rejects_unresolved_landing_placeholders(self):
        source = (ROOT / "scripts" / "build_site.py").read_text(encoding="utf-8")
        self.assertIn('if "__BASE_URL__" in source:', source)
        self.assertIn('raise RuntimeError("Unresolved URL placeholder in landing")', source)


if __name__ == "__main__":
    unittest.main()
