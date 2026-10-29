# Secure T · BELENTANI Education institutional campus guides

Two supplementary pages, `campus/metodo.html` and `campus/laboratorios.html`, clarify methodology and provide a grounded six-lab directory. They are included automatically by `scripts/build_site.py` because that script publishes the whole `campus/` tree and validates local HTML references. The existing programs, labs, scores and application code are unchanged.

Shared editorial skin in `campus/institutional-education.css` respects dark Secure T identity, structural typography and accessible button sizes. No tracker, remote font, credentials, certificate or runtime AI dependency. Test `pytest -q tests/test_institutional_education.py` and `python scripts/build_site.py` before release; browser E2E, WCAG 2.2 AA and Core Web Vitals require independent verification.
