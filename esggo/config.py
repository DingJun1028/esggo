"""ESG GO shared configuration module."""

from pathlib import Path

# Project Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
LIB_DIR = PROJECT_ROOT / 'lib'
SUSTAIN_WRITE_DIR = LIB_DIR / 'sustain-write'
REPORTS_DIR = PROJECT_ROOT / 'reports'
SCRIPTS_DIR = PROJECT_ROOT / 'scripts'


def ensure_dirs() -> None:
    """Ensure all required directories exist."""
    for dir_path in [LIB_DIR, SUSTAIN_WRITE_DIR, REPORTS_DIR, SCRIPTS_DIR]:
        dir_path.mkdir(parents=True, exist_ok=True)


def get_tmp_excel() -> Path:
    """Get path to temporary Excel file."""
    return PROJECT_ROOT / 'tmp_answers.xlsx'


def get_full_excel() -> Path:
    """Get path to full ESG Excel data file."""
    return PROJECT_ROOT / 'lib' / 'sustain-write' / 'full.xlsx'


def get_answer_database_ts() -> Path:
    """Get path to answer-database.ts file."""
    return SUSTAIN_WRITE_DIR / 'answer-database.ts'
