"""Tests for the shared config module."""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from esggo.config import (  # noqa: E402
    LIB_DIR,
    REPORTS_DIR,
    SUSTAIN_WRITE_DIR,
    ensure_dirs,
    get_answer_database_ts,
    get_tmp_excel,
)
from esggo.config import (
    PROJECT_ROOT as CFG_ROOT,
)


class TestConfigPaths:
    """Test that config paths are consistent."""

    def test_project_root_matches(self):
        assert CFG_ROOT == PROJECT_ROOT

    def test_project_root_exists(self):
        assert CFG_ROOT.exists()

    def test_project_root_has_pyproject(self):
        assert (CFG_ROOT / 'pyproject.toml').exists()

    def test_lib_dir(self):
        assert LIB_DIR == CFG_ROOT / 'lib'

    def test_sustain_write_dir(self):
        assert SUSTAIN_WRITE_DIR == CFG_ROOT / 'lib' / 'sustain-write'

    def test_reports_dir(self):
        assert REPORTS_DIR == CFG_ROOT / 'reports'

    def test_tmp_excel(self):
        assert get_tmp_excel() == CFG_ROOT / 'tmp_answers.xlsx'

    def test_answer_database_ts(self):
        assert get_answer_database_ts() == SUSTAIN_WRITE_DIR / 'answer-database.ts'


class TestEnsureDirs:
    """Test directory creation."""

    def test_ensure_dirs_runs(self):
        ensure_dirs()
        assert True
