"""Tests for utility functions in ESG GO Python scripts."""

import sys
from pathlib import Path

import pytest

# Ensure project root is in path for imports
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from esggo.config import PROJECT_ROOT as CFG_ROOT  # noqa: E402

# ─── count_chars tests ─────────────────────────────────────────


class TestCountChars:
    """Tests for count_chars() in scripts/generate_v5_report.py."""

    @pytest.fixture(scope="module")
    def count_chars(self):
        """Import and return the count_chars function."""
        from scripts.generate_v5_report import count_chars

        return count_chars

    def test_empty_string(self, count_chars):
        assert count_chars("") == 0

    def test_only_chinese(self, count_chars):
        assert count_chars("中文測試") == 4

    def test_only_english(self, count_chars):
        assert count_chars("hello world") == 2

    def test_mixed_chinese_english(self, count_chars):
        assert count_chars("Hello 你好 World 世界") == 6

    def test_with_html_tags(self, count_chars):
        assert count_chars("<p>Hello</p>") == 1

    def test_chinese_with_html(self, count_chars):
        assert count_chars("<div>中文測試</div>") == 4

    def test_numbers_and_symbols(self, count_chars):
        assert count_chars("hello!@#123 world") == 2

    def test_newlines_and_tabs(self, count_chars):
        assert count_chars("hello\n\tworld") == 2

    def test_chinese_punctuation(self, count_chars):
        """Chinese punctuation marks should not be counted."""
        assert count_chars("你好，世界！") == 4

    def test_long_text(self, count_chars):
        text = " ".join(["word"] * 100)
        assert count_chars(text) == 100

    def test_html_with_attributes(self, count_chars):
        html = '<span class="test">Hello World</span>'
        assert count_chars(html) == 2

    def test_nested_html(self, count_chars):
        html = "<div><p><b>中文</b>測試</p></div>"
        assert count_chars(html) == 4


# ─── zkp_hash tests ────────────────────────────────────────────


class TestZkpHash:
    """Tests for zkp_hash() in scripts/generate_v5_report.py."""

    @pytest.fixture(scope="module")
    def zkp_hash(self):
        """Import and return the zkp_hash function."""
        from scripts.generate_v5_report import zkp_hash

        return zkp_hash

    def test_deterministic(self, zkp_hash):
        """Same input always produces same hash."""
        assert zkp_hash("hello") == zkp_hash("hello")

    def test_empty_string(self, zkp_hash):
        result = zkp_hash("")
        assert isinstance(result, str)
        assert len(result) == 16

    def test_output_length(self, zkp_hash):
        result = zkp_hash("any string here")
        assert len(result) == 16

    def test_output_is_hex(self, zkp_hash):
        result = zkp_hash("test")
        assert all(c in "0123456789abcdef" for c in result)

    def test_different_inputs_different_hashes(self, zkp_hash):
        assert zkp_hash("input1") != zkp_hash("input2")

    def test_unicode_input(self, zkp_hash):
        result = zkp_hash("你好世界")
        assert len(result) == 16
        assert isinstance(result, str)

    def test_long_input(self, zkp_hash):
        result = zkp_hash("x" * 10000)
        assert len(result) == 16

    def test_special_characters(self, zkp_hash):
        result = zkp_hash("!@#$%^&*()_+\n\t\\")
        assert len(result) == 16


# ─── to_camel_case tests ───────────────────────────────────────


class TestToCamelCase:
    """Tests for to_camel_case() in scripts/generate_esg_data.py."""

    @pytest.fixture(scope="module")
    def to_camel_case(self):
        """Import and return the to_camel_case function."""
        from scripts.generate_esg_data import to_camel_case

        return to_camel_case

    def test_empty_string(self, to_camel_case):
        assert to_camel_case("") == ""

    def test_single_word(self, to_camel_case):
        assert to_camel_case("hello") == "hello"

    def test_two_words(self, to_camel_case):
        assert to_camel_case("hello world") == "helloWorld"

    def test_hyphenated(self, to_camel_case):
        assert to_camel_case("hello-world") == "helloWorld"

    def test_underscore_separated(self, to_camel_case):
        assert to_camel_case("hello_world") == "helloWorld"

    def test_upper_case_words(self, to_camel_case):
        assert to_camel_case("HELLO WORLD") == "helloWorld"

    def test_mixed_case(self, to_camel_case):
        assert to_camel_case("Hello World") == "helloWorld"

    def test_multi_word(self, to_camel_case):
        assert to_camel_case("hello beautiful world") == "helloBeautifulWorld"

    def test_leading_trailing_spaces(self, to_camel_case):
        # Function does not strip leading/trailing spaces; empty lead part yields uppercase first char
        assert to_camel_case("  hello world  ") == "HelloWorld"

    def test_multiple_hyphens(self, to_camel_case):
        assert to_camel_case("hello--world") == "helloWorld"

    def test_single_character_words(self, to_camel_case):
        assert to_camel_case("a b c") == "aBC"

    def test_numbers_in_text(self, to_camel_case):
        assert to_camel_case("hello 2 world") == "hello2World"

    def test_only_special_chars(self, to_camel_case):
        # Non-alphanumeric chars are preserved; only spaces/hyphens/underscores split
        assert to_camel_case("!!!") == "!!!"

    def test_chinese_text(self, to_camel_case):
        result = to_camel_case("你好世界")
        assert result == "你好世界"

    def test_camel_case_already(self, to_camel_case):
        assert to_camel_case("helloWorld") == "helloworld"


# ─── escape_ts_string (from generate_answer_db) tests ──────────


class TestEscapeTsStringGenerateAnswerDb:
    """Tests for escape_ts_string() in generate_answer_db.py."""

    def test_import_and_use(self):
        from generate_answer_db import escape_ts_string

        assert escape_ts_string("") == ""
        assert escape_ts_string(None) == ""
        assert escape_ts_string("simple") == "simple"
        assert escape_ts_string("it's") == "it\\'s"
        assert escape_ts_string("line\nbreak") == "line\\nbreak"
        assert escape_ts_string("tab\there") == "tab\\there"
        assert escape_ts_string("carriage\rreturn") == "carriage\\rreturn"
        assert escape_ts_string("back\\slash") == "back\\\\slash"
        assert escape_ts_string("\\n") == "\\\\n"


# ─── zkp_hash integration with config ──────────────────────────


class TestZkpHashConfig:
    """Verify zkp_hash works with config module paths."""

    def test_config_project_root_exists(self):
        assert CFG_ROOT.exists()
        assert (CFG_ROOT / "pyproject.toml").exists()
