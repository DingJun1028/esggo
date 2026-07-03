from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
LIB_DIR = PROJECT_ROOT / 'lib'
SUSTAIN_WRITE_DIR = LIB_DIR / 'sustain-write'
REPORTS_DIR = PROJECT_ROOT / 'reports'

def get_tmp_excel():
    return PROJECT_ROOT / 'tmp_answers.xlsx'

def get_answer_database_ts():
    return SUSTAIN_WRITE_DIR / 'answer-database.ts'

def ensure_dirs():
    pass

def get_full_excel():
    return PROJECT_ROOT / 'full_answers.xlsx'
