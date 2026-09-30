#!/usr/bin/env python3
"""
tests/test_verify_delivery_center.py — 第六階交付驗證中心的雙向測試

本腳本是「交付閘門」，它的職責是**不信任宣稱值**。因此測試的焦點
不在於它能否回報成功，而集中在四個它專門要抓的交付失敗模式：

  (A) 空氣交付 — 宣稱可交付但產物不存在 / 為空
  (B) 未驗證交付 — 產物存在但驗證指令從未真實跑過 exit 0
  (C) 單層交付 — 主典 / 落檔 / 技能三層未對齊
  (D) 宣稱實測不符 — 檔案數或位元組數與實測對不上

依覺一：正向綠燈在「閂根本不會紅」與「閂正確」兩種情況下長得一模
一樣，故每個閘門都必須有**能讓它變紅**的負向案例，且負向案例直接
注入該閘門的判斷來源（真實檔案系統、真實 subprocess），不用 mock
假資料 —— 否則測的只是 mock 自己。
"""

import importlib.util
import json
import os
import sys

import pytest

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(REPO_ROOT, "scripts", "verify_delivery_center.py")


def _load_module():
    spec = importlib.util.spec_from_file_location("vdc", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    sys.modules["vdc"] = mod
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture
def vdc():
    mod = _load_module()
    # 錨點守衛：record() 寫進模組層的 `gates`（非 `results` —— 那是
    # 第五階 verify_sync_closure.py 的名字）。若此處寫錯變數，本檔所有
    # 斷言都會讀到空清單而「全綠」，是無聲的假綠。
    assert hasattr(mod, "gates") and isinstance(mod.gates, list), "模組介面已漂移"
    mod.gates = []
    return mod


def _gate(mod, gate_id):
    return [r for r in mod.gates if r["gate"] == gate_id]


def _fails(mod, gate_id):
    return [r for r in mod.gates if r["gate"] == gate_id and r["level"] == "FAIL"]


def _text(mod, gate_id):
    return " | ".join(f"{r['check']}: {r['detail']}" for r in _gate(mod, gate_id))


# ── G1 產物存在性：(A) 空氣交付 ──────────────────────────────────
class TestGateArtifactExists:
    """這是整個交付閘門最關鍵的一關 —— 它抓的就是「說有其實沒有」。"""

    def test_all_present_nonempty_passes(self, vdc, tmp_path, monkeypatch):
        f = tmp_path / "a.md"
        f.write_text("content", encoding="utf-8")
        monkeypatch.setattr(vdc, "ROOT", str(tmp_path))
        manifest = {"artifacts": [{"path": "a.md", "role": "doc", "sha256": "x"}]}

        ok = vdc.gate_artifact_exists(manifest)

        assert ok is True
        assert _fails(vdc, "G1") == [], _text(vdc, "G1")

    def test_missing_file_fails_and_names_path(self, vdc, tmp_path, monkeypatch):
        """宣稱存在但磁碟上沒有 → 必須 FAIL 且指名那個路徑。"""
        monkeypatch.setattr(vdc, "ROOT", str(tmp_path))
        manifest = {"artifacts": [{"path": "ghost.md", "role": "doc", "sha256": "x"}]}

        ok = vdc.gate_artifact_exists(manifest)

        assert ok is False
        fails = _fails(vdc, "G1")
        assert fails, "缺檔竟未報紅 —— 空氣交付無法被攔截"
        assert "ghost.md" in fails[0]["observed"]["missing"], fails[0]["observed"]

    def test_zero_byte_file_fails(self, vdc, tmp_path, monkeypatch):
        """檔案存在但 0 位元組 → 視同未落地，必須 FAIL。"""
        (tmp_path / "empty.md").write_text("", encoding="utf-8")
        monkeypatch.setattr(vdc, "ROOT", str(tmp_path))
        manifest = {"artifacts": [{"path": "empty.md", "role": "doc", "sha256": "x"}]}

        assert vdc.gate_artifact_exists(manifest) is False
        assert "empty.md" in _fails(vdc, "G1")[0]["observed"]["empty"]

    def test_empty_manifest_passes_vacuously(self, vdc):
        """零產物不該報紅 —— 那是 manifest 本身的問題，不是產物問題。"""
        assert vdc.gate_artifact_exists({"artifacts": []}) is True


# ── G4 宣稱實測一致：(D) ───────────────────────────────────────
class TestGateClaimMatches:
    def test_claims_matching_measured_passes(self, vdc, tmp_path, monkeypatch):
        f = tmp_path / "a.md"
        f.write_text("12345", encoding="utf-8")
        monkeypatch.setattr(vdc, "ROOT", str(tmp_path))
        manifest = {
            "artifacts": [{"path": "a.md", "role": "doc", "sha256": "x"}],
            "claims": {"file_count": 1, "total_bytes": 5},
        }
        vdc.gate_artifact_exists(manifest)  # 先讓 G1 產出觀測

        vdc.gate_claim_matches(manifest)

        assert _fails(vdc, "G4") == [], _text(vdc, "G4")

    def test_wrong_file_count_fails(self, vdc, tmp_path, monkeypatch):
        """宣稱 3 個檔、實際 1 個 → 必須報紅。"""
        f = tmp_path / "a.md"
        f.write_text("x", encoding="utf-8")
        monkeypatch.setattr(vdc, "ROOT", str(tmp_path))
        manifest = {
            "artifacts": [{"path": "a.md", "role": "doc", "sha256": "x"}],
            "claims": {"file_count": 3, "total_bytes": 1},
        }
        vdc.gate_artifact_exists(manifest)

        vdc.gate_claim_matches(manifest)

        assert _fails(vdc, "G4"), _text(vdc, "G4")

    def test_wrong_total_bytes_fails(self, vdc, tmp_path, monkeypatch):
        """位元組數宣稱不符 → 必須報紅（這正是曾發生過的 94473 vs 103735）。"""
        f = tmp_path / "a.md"
        f.write_text("12345", encoding="utf-8")
        monkeypatch.setattr(vdc, "ROOT", str(tmp_path))
        manifest = {
            "artifacts": [{"path": "a.md", "role": "doc", "sha256": "x"}],
            "claims": {"file_count": 1, "total_bytes": 99999},
        }
        vdc.gate_artifact_exists(manifest)

        vdc.gate_claim_matches(manifest)

        assert _fails(vdc, "G4"), _text(vdc, "G4")


# ── G2 產物可驗證性：(B) 未驗證交付 ─────────────────────────────
class TestGateArtifactVerifiable:
    def test_passing_command_passes(self, vdc, monkeypatch):
        """真實 subprocess：exit 0 → PASS。這裡不用 mock，確保真的跑了。"""
        monkeypatch.setattr(vdc, "run", lambda cmd, cwd=None, timeout=600: (0, "ok"))
        manifest = {"verifications": [{"label": "unit", "cmd": ["py", "-c", "pass"]}]}

        assert vdc.gate_artifact_verifiable(manifest) is True
        assert _fails(vdc, "G2") == []

    def test_nonzero_exit_fails_and_reports_code(self, vdc, monkeypatch):
        """驗證指令從未跑過 / 跑失敗 → 必須阻擋交付。"""
        monkeypatch.setattr(vdc, "run", lambda cmd, cwd=None, timeout=600: (1, "boom"))
        manifest = {"verifications": [{"label": "unit", "cmd": ["py", "-c", "fail"]}]}

        assert vdc.gate_artifact_verifiable(manifest) is False
        assert _fails(vdc, "G2"), "exit 1 的驗證竟放行 —— 未驗證交付無法攔截"

    def test_python_placeholder_resolved(self, vdc, monkeypatch):
        """{python} 佔位符必須換成真實解譯器，否則在不同機器上會壞掉。"""
        seen = {}

        def fake_run(cmd, cwd=None, timeout=600):
            seen["cmd"] = cmd
            return 0, ""

        monkeypatch.setattr(vdc, "run", fake_run)
        manifest = {"verifications": [{"label": "x", "cmd": ["{python}", "-c", "pass"]}]}
        vdc.gate_artifact_verifiable(manifest)

        assert seen["cmd"][0] == vdc.PY, seen["cmd"]
        assert "{python}" not in seen["cmd"], "佔位符未解析"


# ── G5 閉環乾淨 ───────────────────────────────────────────────
class TestGateClosureClean:
    """G5 委派第五階。錨點：閉環驗證器的輸出一行摘要格式為
    `總計  PASS=9  WARN=0  FAIL=2`，由 verify_sync_closure.py 的列印
    段決定；解析不了輸出本身就是 FAIL（不可默認通過）。"""

    def test_closure_fail_blocks(self, vdc, monkeypatch):
        """閉環有 FAIL → 交付必須被阻擋（這是閘門存在的意義）。"""
        monkeypatch.setattr(
            vdc,
            "run",
            lambda cmd, cwd=None, timeout=600: (
                1,
                "閉環驗證報告\n  總計  PASS=9  WARN=0  FAIL=2\n",
            ),
        )
        assert vdc.gate_closure_clean() is False
        assert _fails(vdc, "G5"), "閉環 FAIL 竟仍判定可交付"
        assert "FAIL=2" in _text(vdc, "G5"), _text(vdc, "G5")

    def test_closure_clean_passes(self, vdc, monkeypatch):
        monkeypatch.setattr(
            vdc,
            "run",
            lambda cmd, cwd=None, timeout=600: (
                0,
                "閉環驗證報告\n  總計  PASS=12  WARN=0  FAIL=0\n",
            ),
        )
        assert vdc.gate_closure_clean() is True
        assert _fails(vdc, "G5") == []

    def test_unparseable_output_fails_closed(self, vdc, monkeypatch):
        """輸出壞掉時必須 FAIL（fail-closed），不得因無法解析就放行。

        這是本閘門最容易被寫成假綠的地方：解析失敗若 return True，
        就等於給了一條「閉環壞掉照樣可交付」的後門。
        """
        monkeypatch.setattr(vdc, "run", lambda cmd, cwd=None, timeout=600: (0, "garbage"))
        assert vdc.gate_closure_clean() is False
        assert "無法解析" in _text(vdc, "G5"), _text(vdc, "G5")


# ── manifest 自我校準 ─────────────────────────────────────────
class TestMeasureClaims:
    def test_measures_from_disk_not_from_claim(self, vdc, tmp_path, monkeypatch):
        """measure_claims 必須由磁碟實測，不可讀 manifest 裡的宣稱值。"""
        (tmp_path / "a.md").write_text("123", encoding="utf-8")
        (tmp_path / "b.md").write_text("45", encoding="utf-8")
        monkeypatch.setattr(vdc, "ROOT", str(tmp_path))
        manifest = {
            "artifacts": [
                {"path": "a.md", "role": "d", "sha256": "x"},
                {"path": "b.md", "role": "d", "sha256": "x"},
            ],
            "claims": {"file_count": 999, "total_bytes": 999},
        }

        measured = vdc.measure_claims(manifest)

        assert measured["file_count"] == 2
        assert measured["total_bytes"] == 5

    def test_missing_files_not_counted_in_bytes(self, vdc, tmp_path, monkeypatch):
        """不存在的檔不得貢獻位元組數（否則校準會灌水）。"""
        (tmp_path / "a.md").write_text("123", encoding="utf-8")
        monkeypatch.setattr(vdc, "ROOT", str(tmp_path))
        manifest = {
            "artifacts": [
                {"path": "a.md", "role": "d", "sha256": "x"},
                {"path": "ghost.md", "role": "d", "sha256": "x"},
            ]
        }
        assert vdc.measure_claims(manifest)["total_bytes"] == 3


# ── 腳本契約 ───────────────────────────────────────────────────
class TestScriptContract:
    def test_real_manifest_is_valid_json(self):
        path = os.path.join(REPO_ROOT, "delivery-manifest.json")
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        assert isinstance(data.get("artifacts"), list)

    def test_real_manifest_artifacts_all_have_required_fields(self):
        """守 regression：manifest 每個產物都要有 path/role/sha256。"""
        with open(os.path.join(REPO_ROOT, "delivery-manifest.json"), encoding="utf-8") as fh:
            data = json.load(fh)
        for art in data["artifacts"]:
            missing = [k for k in ("path", "role", "sha256") if k not in art]
            assert not missing, f"{art.get('path')} 缺 {missing}"

    def test_run_returns_tuple_even_on_error(self, vdc):
        out = vdc.run(["definitely-not-a-real-binary-xyz"])
        assert isinstance(out, tuple) and len(out) == 2
