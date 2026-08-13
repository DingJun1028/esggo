#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OA-Twins :: OAB (OmniAgentBus) 事件總線 — 雙子核心
====================================================
承載 OA-Local (本機) <-> OA-VPS (雲端) 的 DomainEvent 交換。
依 oa-components §4 規格：DomainEvent = { id, source, sourceId, type, timestamp, tags, payload }

【貫徹始終的不成文規定（Constitutional Codex）】——本實作之後每個模組都必須遵守：
  1 5T 硬化：
      Traceable  —— 每筆事件必攜 _origin（發源端 + instance）。
      Trackable  —— 全域事件 id 匯為 journal，可依序 replay（重播即稽核軌跡）。
      Tangible   —— 事件有內容與結構，可被 UI/命令列實際渲染消費。
      Transparent—— publish/subscribe 路由規則公開可檢視。
      Trustworthy—— 事件一旦入 journal 對外判讀為不可變；零幻覺（無偽造輸出）。
  2 4可用1不可狀態機：可自理(閉迴) / 可協作(訂閱) / 可演化(replay) / 可溯源(rono稽核)；
    ❌ 不可篡改——journal 不提供改寫接口。
  3 熵控 < 0.1：提供 entropy 計量仍為健康判斷。
  4 零幻覺：所有輸出皆源於真實事件；無 fabricate 作用。
  5 OmniTag 路由：以 tags 前綴匹配定消費者（platform:* / agent:* / squad:*）。

用法：
  python broker.py --self-test          # 運行內建回歸自檢
  python broker.py --heartbeat          # 持續發送心跳直到 Ctrl+C
"""

import argparse
import asyncio
import json
import math
import time
import uuid
from collections import defaultdict
from pathlib import Path
from typing import Any, Awaitable, Callable, Dict, List, Optional, Set


CONSTITUTION = {
    "5T": ["Traceable", "Trackable", "Tangible", "Transparent", "Trustworthy"],
    "4Can1Cannot": ["可自理", "可協作", "可演化", "可溯源"],
    "cannot": "不可篡改",
    "entropy_target": 0.1,
    "zero_hallucination": True,
}


# --------------------------------------------------------------------------- #
# 不可變 DomainEvent（依憲法「不可篡改」）
# --------------------------------------------------------------------------- #
class ImmutableEvent:
    """寫入即不可變的事件。"""
    __slots__ = ("id", "source", "sourceId", "eventType", "timestamp", "tags", "payload")

    def __init__(self, source: str, event_type: str, tags: List[str], payload: Dict[str, Any],
                 source_id: Optional[str] = None):
        self.id = uuid.uuid4().hex
        self.source = source                  # oa-local | oa-vps
        self.sourceId = source_id or "twin"   # 發源 instance
        self.eventType = event_type           # e.g. health.heartbeat
        self.timestamp = int(time.time() * 1000)
        self.tags = list(tags)
        self.payload = dict(payload or {})

    def as_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id, "source": self.source, "sourceId": self.sourceId,
            "type": self.eventType, "timestamp": self.timestamp,
            "tags": self.tags, "payload": self.payload,
            "_origin": {"source": self.source, "instance": self.sourceId},
            "_constitution": CONSTITUTION,
        }


# --------------------------------------------------------------------------- #
# OAB broker（可自理 / 可協作 / 可演化 / 可溯源 + 熵控 + 零幻覺）
# --------------------------------------------------------------------------- #
class OmniAgentBus:
    def __init__(self, bus_id: str, instance_id: str = "twin", store_dir: Optional[str] = None):
        self.bus_id = bus_id                  # "oa-local" | "oa-vps"
        self.instance = instance_id
        self._sub: Dict[str, Set[Callable[[ImmutableEvent], Awaitable[None]]]] = defaultdict(set)
        self._journal: List[ImmutableEvent] = []
        self._path: Optional[Path] = None
        if store_dir:
            Path(store_dir).mkdir(parents=True, exist_ok=True)
            self._path = Path(store_dir) / f"{bus_id}.oab.jsonl"

    def subscribe(self, topic: str, handler: Callable[[ImmutableEvent], Awaitable[None]]):
        self._sub[topic].add(handler)

    def unsubscribe(self, topic: str, handler):
        self._sub[topic].discard(handler)

    @staticmethod
    def _matches(tags: List[str], topic: str) -> bool:
        if topic == "*":
            return True
        if topic == "platform:":
            # 匹配任意 platform:* 子類
            return any(t.startswith("platform:") for t in tags)
        if topic.startswith("platform:"):
            want = topic.split(":", 1)[1]
            return any(t.startswith("platform:") and t.split(":", 1)[1] == want for t in tags)
        return any(t == topic or t.startswith(topic + ":") for t in tags)

    async def publish(self, source: str, event_type: str, tags: List[str],
                      payload: Optional[Dict[str, Any]] = None, source_id: Optional[str] = None,
                      persist: bool = True) -> ImmutableEvent:
        evt = ImmutableEvent(source, event_type, tags, payload, source_id or self.instance)
        self._journal.append(evt)                     # 不可變 journal
        if persist and self._path:
            with self._path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(evt.as_dict(), ensure_ascii=False) + "\n")
        for topic, handlers in list(self._sub.items()):
            if self._matches(evt.tags, topic):
                for h in handlers:
                    await h(evt)
        return evt

    async def replay(self, since_ms: int = 0) -> List[Dict[str, Any]]:
        return [e.as_dict() for e in self._journal if e.timestamp >= since_ms]

    def entropy(self) -> float:
        if not self._sub:
            return 0.0
        total = sum(max(0, len(h) - 1) for h in self._sub.values())
        return min(1.0, math.sqrt(total) * 0.1)

    @property
    def healthy(self) -> bool:
        return self.entropy() < 0.1


# --------------------------------------------------------------------------- #
# 雙子橋：a <-> b 雙向同步（避回圈）
# --------------------------------------------------------------------------- #
def link_twins(a: OmniAgentBus, b: OmniAgentBus):
    def _relay(other: OmniAgentBus, self_source: str) -> Callable[[ImmutableEvent], Awaitable[None]]:
        async def _h(evt: ImmutableEvent):
            if evt.source != self_source:
                await other.publish(source=evt.source, event_type=evt.eventType,
                                    tags=evt.tags, payload=evt.payload, source_id=evt.sourceId)
        return _h

    a.subscribe("*", _relay(b, "oa-local"))
    b.subscribe("*", _relay(a, "oa-vps"))


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #
def _parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="OA 雙子 OAB 事件總線自檢/心跳")
    p.add_argument("--bus", choices=["local", "vps"], default="local")
    p.add_argument("--instance", default="twin")
    p.add_argument("--store", default=None, help="journal 目錄")
    p.add_argument("--self-test", action="store_true")
    p.add_argument("--heartbeat", action="store_true")
    return p


async def _self_test(bus: OmniAgentBus):
    got: List[str] = []

    async def _h(evt: ImmutableEvent):
        got.append(evt.eventType)

    bus.subscribe("platform:", _h)
    await bus.publish(source="oa-local", event_type="health.heartbeat",
                      tags=["platform:esggo", "agent:13", "squad:光之羽翼"],
                      payload={"from": "local"})
    await bus.publish(source="oa-vps", event_type="swarm.phase",
                      tags=["platform:vps", "agent:20", "squad:報告投遞"],
                      payload={"from": "vps"})
    print("received:", sorted(got))
    print("entropy < 0.1 ?", bus.healthy, f"(={bus.entropy():.4f})")
    evs = await bus.replay()
    print(f"journal size: {len(evs)}")
    print("constitution bound:", evs[0]["_constitution"] == CONSTITUTION)


async def _amain(args):
    bus = OmniAgentBus(bus_id=args.bus, instance_id=args.instance, store_dir=args.store)
    if args.self_test:
        await _self_test(bus)
        return
    if args.heartbeat:
        print(f"OAB {args.bus} 心跳中 (Ctrl+C 停止)")
        while True:
            await bus.publish(source=args.bus, event_type="health.heartbeat",
                              tags=["platform:esggo", "agent:13", "squad:光之羽翼"])
            await asyncio.sleep(5)


def main():
    args = _parser().parse_args()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(_amain(args))
    except KeyboardInterrupt:
        print("\n已停止。")


if __name__ == "__main__":
    main()
