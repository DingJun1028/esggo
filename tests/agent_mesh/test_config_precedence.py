"""設定優先序與重試計時的回歸測試（Stage 5 TDD：先紅後綠）。

背景：兩處缺陷皆由實測發現，非推論。

缺陷 1（配置檔失效）
    build_run_config 對 test.* 六項採無條件賦值，把 argparse 預設值
    覆蓋到配置檔上。實測：配置檔寫 retry=2 但只給 --config 時實際只跑
    1 次、回報 retry=0；補上 --retry 2 才真的跑 3 次。timeout/
    concurrency/temperature/num_predict 同一模式 → --config 形同虛設。

缺陷 2（重試計時謊報）
    重試迴圈內重設 start，elapsed 只量到最後一次嘗試。實測
    --retry 2 實際 15s 卻回報 2.05s（低報 86%）。

執行：python -m pytest tests/agent_mesh/ -q
"""

import asyncio
import sys
import time
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ollama_model_tool import (  # noqa: E402
    OllamaClient,
    RunConfig,
    Status,
    build_run_config,
    parse_args,
)

CONFIG = """{
  "ollama": { "host": "http://127.0.0.1:59999", "timeout": 3 },
  "test": {
    "prompt": "from-config", "timeout": 180, "concurrency": 4,
    "retry": 2, "temperature": 0.9, "num_predict": 64
  },
  "models": ["cfg-model"]
}"""


@pytest.fixture()
def cfg_file(tmp_path: Path) -> str:
    p = tmp_path / "cfg.json"
    p.write_text(CONFIG, encoding="utf-8")
    return str(p)


# ---------------------------------------------------------------------------
# 缺陷 1：配置檔優先序
# ---------------------------------------------------------------------------

def test_config_survives_when_no_cli_override(cfg_file: str) -> None:
    """只給 --config 時，test.* 必須沿用配置檔值。"""
    cfg = build_run_config(parse_args(["--config", cfg_file]))

    assert cfg.test.timeout == 180
    assert cfg.test.concurrency == 4
    assert cfg.test.retry == 2
    assert cfg.test.temperature == pytest.approx(0.9)
    assert cfg.test.num_predict == 64
    assert cfg.test.prompt == "from-config"


def test_cli_still_overrides_config(cfg_file: str) -> None:
    """明確下在命令列的旗標仍須勝過配置檔。"""
    cfg = build_run_config(
        parse_args(["--config", cfg_file, "--timeout", "5", "--retry", "0"])
    )

    assert cfg.test.timeout == 5
    assert cfg.test.retry == 0
    # 未覆蓋者仍取配置檔
    assert cfg.test.concurrency == 4


def test_no_config_no_flags_keeps_dataclass_defaults() -> None:
    """兩者皆缺 → 沿用 dataclass 預設值（零行為變更）。"""
    cfg = build_run_config(parse_args([]))
    d = RunConfig().test

    assert cfg.test.timeout == d.timeout
    assert cfg.test.concurrency == d.concurrency
    assert cfg.test.retry == d.retry
    assert cfg.test.temperature == pytest.approx(d.temperature)
    assert cfg.test.num_predict == d.num_predict
    assert cfg.test.prompt == d.prompt


def test_models_from_config_kept(cfg_file: str) -> None:
    """模型清單同理：配置檔指定時不應被預設值清空。"""
    assert build_run_config(parse_args(["--config", cfg_file])).models == ["cfg-model"]


# ---------------------------------------------------------------------------
# 缺陷 2：重試計時必須橫跨全部嘗試
# ---------------------------------------------------------------------------

def test_elapsed_spans_all_retry_attempts() -> None:
    """重試全部失敗時，elapsed_seconds 必須涵蓋每一次嘗試的耗時。

    以假客戶端讓每次嘗試耗時 0.3s：retry=1 → 2 次嘗試，elapsed 至少
    0.6s。缺陷版本只回報最後一次（≈0.3s），故此斷言會先紅。
    """
    async def fake_request(method, path, payload, **kw):
        await asyncio.sleep(0.3)
        raise RuntimeError("boom")

    client = OllamaClient.__new__(OllamaClient)
    client._request = fake_request  # type: ignore[attr-defined]

    started = time.monotonic()
    result = asyncio.run(
        client.test_model("m", "p", timeout=30, retry=1,
                          temperature=0.0, num_predict=8)
    )
    wall = time.monotonic() - started

    assert result.status is Status.ERROR
    # 必須涵蓋 2 次嘗試（每次 0.3s）
    assert result.elapsed_seconds >= 0.6, (
        f"elapsed={result.elapsed_seconds}s 未涵蓋全部嘗試（真實 wall={wall:.2f}s）"
    )
    # 且不得誇大：真實時間含 2s 退避，故上界寬鬆
    assert result.elapsed_seconds <= wall + 0.5
    # 回報的重試次數須為設定值
    assert result.retry == 1


FMT_CONFIG = """{
  "ollama": { "host": "http://127.0.0.1:59999", "timeout": 3 },
  "output": { "format": "table" },
  "models": ["cfg-model"]
}"""


@pytest.fixture()
def fmt_cfg_file(tmp_path: Path) -> str:
    p = tmp_path / "fmt.json"
    p.write_text(FMT_CONFIG, encoding="utf-8")
    return str(p)


def test_output_format_from_config_kept(fmt_cfg_file: str) -> None:
    """配置檔的 output.format 不得被無條件的 AUTO 覆蓋。

    缺陷：cfg.output.format = AUTO 為無條件賦值，使配置檔指定的格式失效。
    AUTO 僅在有輸出路徑時有意義（ResultWriter 只在 self.config.path 為真
    時解析副檔名），故無路徑時應沿用配置檔。
    """
    from ollama_model_tool import OutputFormat

    cfg = build_run_config(parse_args(["--config", fmt_cfg_file]))
    assert cfg.output.format is OutputFormat.TABLE


def test_output_path_still_triggers_extension_detection(fmt_cfg_file: str) -> None:
    """使用者明確給了輸出路徑時，仍須啟用副檔名自動判斷。"""
    from ollama_model_tool import OutputFormat

    cfg = build_run_config(
        parse_args(["--config", fmt_cfg_file, "--output", "out.csv"])
    )
    assert cfg.output.path == "out.csv"
    assert cfg.output.format is OutputFormat.AUTO


def test_illegal_cli_values_are_revalidated() -> None:
    """CLI 覆寫後必須重新跑 dataclass 驗證。

    setattr 不會觸發 __post_init__，故非法值會直達執行期：
    concurrency=0 使 Semaphore(0) 永久阻塞、retry=-1 使 range(1-1) 一次都
    不嘗試、timeout=0 使推論立即逾時。此為既有缺陷（原本的直接賦值同樣
    繞過），由獨立 code review 指出。
    """
    d = RunConfig().test
    cfg = build_run_config(
        parse_args(["--concurrency", "0", "--retry", "-1", "--timeout", "0"])
    )

    assert cfg.test.concurrency == 1      # 非 0（否則 Semaphore 永久阻塞）
    assert cfg.test.retry == 0            # 非 -1（否則一次都不嘗試）
    assert cfg.test.timeout == d.timeout  # 非 0（否則立即逾時）
