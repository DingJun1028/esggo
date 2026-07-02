"""Tests for TypeScript string escaping functions."""

import sys
from pathlib import Path

# Add project root to path so we can import top-level modules
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from generate_answer_db import escape_ts_string  # noqa: E402
from scripts.build_full_db import esc as esc_double  # noqa: E402
from scripts.generate_esg_data import sanitize_ts_string  # noqa: E402


class TestEscapeTsString:
    """Test single-quote TypeScript escaping."""

    def test_empty_string(self):
        assert escape_ts_string('') == ''
        assert escape_ts_string(None) == ''

    def test_backslash(self):
        assert escape_ts_string('a\\b') == 'a\\\\b'

    def test_single_quote(self):
        assert escape_ts_string("it's") == "it\\'s"

    def test_newline(self):
        assert escape_ts_string('line1\nline2') == 'line1\\nline2'

    def test_tab(self):
        assert escape_ts_string('col1\tcol2') == 'col1\\tcol2'

    def test_carriage_return(self):
        assert escape_ts_string('line1\rline2') == 'line1\\rline2'

    def test_combined(self):
        result = escape_ts_string("it's\na\tb")
        assert result == "it\\'s\\na\\tb"


class TestEscDouble:
    """Test double-quote TypeScript escaping."""

    def test_none(self):
        assert esc_double(None) == ''

    def test_backslash(self):
        assert esc_double('a\\b') == 'a\\\\b'

    def test_double_quote(self):
        assert esc_double('a"b') == 'a\\"b'

    def test_newline_to_space(self):
        assert esc_double('a\nb') == 'a b'

    def test_carriage_return_removed(self):
        assert esc_double('a\rb') == 'ab'


class TestSanitizeTsString:
    """Test the sanitize_ts_string function."""

    def test_none(self):
        assert sanitize_ts_string(None) == ''

    def test_backslash(self):
        assert sanitize_ts_string('a\\b') == 'a\\\\b'

    def test_single_quote(self):
        assert sanitize_ts_string("it's") == "it\\'s"

    def test_newline(self):
        assert sanitize_ts_string('a\nb') == 'a\\nb'
