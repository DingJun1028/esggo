#!/usr/bin/env python3
"""
tests/test_verify_sync_closure.py — 第五階閉環驗證器的雙向測試

依「萬能超覺醒」覺一與技能教訓，測試本身必須雙向：
  · 正向：合法輸入 → 對應檢查項報 PASS
  · 負向：注入缺陷 → 對應檢查項報 FAIL，且**訊息指名預期的節點 id / 欄位**

只驗正向是無效測試 —— 在「閂根本不會紅」與「閂正確」兩種情況下，
正向綠燈長得一模一樣。負向案例的注入點必須對準檢查項語意：
刪哪個節點就該報缺哪個 id，否則是壞的紅燈。
"""

import importlib.util
import json
import os
import sys

import pytest

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(REPO_ROOT, "scripts", "verify_sync_closure.py")


def _load_module():
    """以 importlib 載入腳本（檔名含 verify_ 前綴，非合法模組名）。"""
    spec = importlib.util.spec_from_file_location("vsc", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    sys.modules["vsc"] = mod
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture
def vsc():
    mod = _load_module()
    mod.results = []  # 腳本用全域 list 累積，每次測試重置
    return mod


def _levels(mod):
    return [r["level"] for r in mod.results]


def _fails(mod):
    return [r for r in mod.results if r["level"] == "FAIL"]


def _checks_text(mod):
    return " | ".join(f"{r['check']}: {r['detail']}" for r in mod.results)


def _valid_node(nid="n1", **over):
    """一個通過結構檢查的節點。"""
    node = {
        "id": nid,
        "title": f"節點 {nid}",
        "layer": 1,
        "status": "done",
        "artifacts": [f"docs/{nid}.md"],
    }
    node.update(over)
    return node


# ── 正向：合法圖譜不應報結構 FAIL ────────────────────────────────
class TestGraphStructurePositive:
    def test_minimal_valid_graph_has_no_structural_fail(self, vsc):
        vsc.check_graph_structure({"nodes": [_valid_node("a"), _valid_node("b", related=["a"])]})
        assert _fails(vsc) == [], _checks_text(vsc)

    def test_valid_graph_reports_nodes_count(self, vsc):
        vsc.check_graph_structure({"nodes": [_valid_node("a"), _valid_node("b")]})
        assert any(
            r["check"] == "graph.nodes" and r["level"] == "PASS" and r["observed"] == 2
            for r in vsc.results
        ), _checks_text(vsc)


# ── 負向：每個結構檢查項都要能報紅，且指名預期目標 ────────────────
class TestGraphStructureNegative:
    """紅燈必須指認精準 —— 否則是壞的紅燈。"""

    def test_missing_nodes_array_fails(self, vsc):
        vsc.check_graph_structure({})
        assert any(r["check"] == "graph.nodes" for r in _fails(vsc)), _checks_text(vsc)

    def test_empty_nodes_list_fails(self, vsc):
        vsc.check_graph_structure({"nodes": []})
        assert any(r["check"] == "graph.nodes" for r in _fails(vsc)), _checks_text(vsc)

    def test_missing_required_field_names_the_field(self, vsc):
        """刪掉 artifacts → 必須指名 artifacts。"""
        node = _valid_node("a")
        del node["artifacts"]
        vsc.check_graph_structure({"nodes": [node]})
        fails = [r for r in _fails(vsc) if "required_fields" in r["check"]]
        assert fails, _checks_text(vsc)
        assert "artifacts" in fails[0]["detail"], fails[0]["detail"]
        assert "a" in fails[0]["check"], "紅燈必須指名節點 id"

    def test_duplicate_id_fails(self, vsc):
        vsc.check_graph_structure({"nodes": [_valid_node("dup"), _valid_node("dup")]})
        assert any("duplicate" in r["check"] for r in _fails(vsc)), _checks_text(vsc)

    @pytest.mark.parametrize("key", ["depends_on", "related", "reverse"])
    def test_dangling_reference_fails_and_names_target(self, vsc, key):
        """引用不存在的節點 → 必須報 FAIL 且指名那個不存在的 id。"""
        vsc.check_graph_structure({"nodes": [_valid_node("a", **{key: ["ghost-node"]})]})
        fails = [r for r in _fails(vsc) if r["check"] == "node[a].%s" % key]
        assert fails, _checks_text(vsc)
        assert "ghost-node" in fails[0]["detail"], fails[0]["detail"]

    def test_every_required_field_triggers_its_own_fail(self, vsc):
        """逐一刪掉每個必填欄位，都必須報紅 —— 證明閂對每項都有反應力。"""
        for field in vsc.REQUIRED_NODE_FIELDS:
            mod = _load_module()
            mod.results = []
            node = _valid_node("probe")
            node.pop(field, None)
            mod.check_graph_structure({"nodes": [node]})
            fails = [r for r in mod.results if r["level"] == "FAIL"]
            assert fails, f"刪掉 {field} 竟未報紅 —— 該欄位檢查形同虛設"
            assert field in _checks_text(mod), f"刪掉 {field} 的紅燈未指名該欄位"


# ── 閉環規則 ────────────────────────────────────────────────────
class TestClosureRules:
    def test_missing_closure_node_is_reported(self, vsc):
        """圖譜缺 CAPTURED_IN 節點 → 閉環規則檢查要有反應。"""
        vsc.check_closure_rules({"nodes": [_valid_node("a")]})
        assert vsc.results, "閉環規則檢查完全無輸出 —— 無法判斷是否誤判"

    def test_closure_rules_do_not_crash_on_empty_graph(self, vsc):
        vsc.check_closure_rules({"nodes": []})
        assert isinstance(vsc.results, list)


# ── 宣稱 vs 實測 ────────────────────────────────────────────────
class TestClaimsVsMeasured:
    def test_absent_claim_node_warns_not_crashes(self, vsc):
        """找不到宣稱節點 → 應為 WARN 略過，不得拋例外。"""
        vsc.check_claims_vs_measured({"nodes": [_valid_node("a")]})
        assert any(r["check"] == "claims.node" for r in vsc.results), _checks_text(vsc)
        assert "FAIL" not in _levels(vsc), "缺少宣稱節點應降級為 WARN 而非 FAIL"

    def test_closed_range_claim_is_gated_not_warned(self, vsc):
        """封閉範圍（base..tip 皆具體 sha）→ 走可重算的等值 gate。

        這是該函式的核心改進：開口範圍（..HEAD）永遠會漂移，
        結構上不可能通過，因此降級為 WARN。

        錨點注意：宣稱核對找的是**硬編碼**的 `ch30-fix-false-claims`，
        不是 CAPTURED_IN（後者屬閉環規則檢查）。錨點寫錯時
        str.replace/節點注入皆為空操作，測的就是原圖譜 —— 假綠。
        """
        CLAIM_NODE = "ch30-fix-false-claims"  # 與腳本 line 165 一致
        src = open(SCRIPT, encoding="utf-8").read()
        assert CLAIM_NODE in src, "錨點已漂移：腳本不再查找此節點 id"

        mod = _load_module()
        mod.results = []
        mod.run = lambda cmd, *a, **k: ("7", 0)  # 假造實測 = 7 筆
        node = _valid_node(
            CLAIM_NODE,
            discrepancies=[
                {
                    "field": "commit 筆數",
                    "canon_claims": "6 筆 commit",
                    "canon_range": "aaaaaaa..bbbbbbb",
                }
            ],
        )
        mod.check_claims_vs_measured({"nodes": [node]})
        text = _checks_text(mod)
        assert "claims.commit_count" in text, text
        # 宣稱 6 vs 實測 7 → 必須有 FAIL（而非被降級成 WARN 放行）
        assert any(
            r["check"] == "claims.commit_count" and r["level"] == "FAIL"
            for r in mod.results
        ), text


# ── 技能 frontmatter 檢查 ───────────────────────────────────────
class TestSkillFrontmatter:
    def test_reports_results_without_crashing(self, vsc):
        vsc.check_skill_frontmatter()
        assert isinstance(vsc.results, list)

    def test_missing_skills_dir_is_handled(self, vsc, monkeypatch):
        """SKILLS 路徑不存在時不得拋例外（技能未安裝的機器也要能跑）。"""
        monkeypatch.setattr(vsc, "SKILLS", os.path.join(REPO_ROOT, "__no_such_skills__"))
        vsc.check_skill_frontmatter()


# ── 懸空引用 ────────────────────────────────────────────────────
class TestDanglingRefs:
    def test_reports_results_without_crashing(self, vsc):
        vsc.check_dangling_refs()
        assert isinstance(vsc.results, list)


# ── 腳本契約 ────────────────────────────────────────────────────
class TestScriptContract:
    def test_required_fields_are_actually_required(self, vsc):
        """常量非空，且確實是每個節點都必備的那 5 個欄位。"""
        assert set(vsc.REQUIRED_NODE_FIELDS) == {"id", "title", "layer", "status", "artifacts"}

    def test_real_task_graph_is_valid_json(self):
        """腳本的唯一輸入必須可解析，否則整條鏈路無意義。"""
        path = os.path.join(REPO_ROOT, "task-graph.json")
        with open(path, encoding="utf-8") as fh:
            graph = json.load(fh)
        assert isinstance(graph.get("nodes"), list) and graph["nodes"]

    def test_real_task_graph_nodes_all_have_required_fields(self):
        """repo 內真實圖譜不得缺必填欄位（守 regression）。"""
        with open(os.path.join(REPO_ROOT, "task-graph.json"), encoding="utf-8") as fh:
            graph = json.load(fh)
        for node in graph["nodes"]:
            missing = [f for f in ("id", "title", "layer", "status", "artifacts") if f not in node]
            assert not missing, f"節點 {node.get('id')} 缺 {missing}"

    def test_run_helper_returns_tuple_not_raises(self, vsc):
        """run() 遇錯須回 ('', -1) 而非拋例外 —— 主流程靠它續跑。"""
        out, code = vsc.run(["git", "--version"])
        assert isinstance(out, str) and isinstance(code, int)
