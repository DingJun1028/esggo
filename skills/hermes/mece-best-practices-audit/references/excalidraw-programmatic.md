# Programmatic Excalidraw Generation (companion to the `excalidraw` skill)

The bundled `excalidraw` skill documents hand-written element JSON. For flow /
sequence diagrams with 40+ elements, **generate the elements with a Python
script** that computes coordinates from a data model — it eliminates
off-by-one coordinate and orphan-binding errors. This is how the AI Station
`diagrams/workflow.excalidraw` and `diagrams/sequence.excalidraw` were built.

## Pattern (sequence diagram)

```python
import json
from pathlib import Path

PARTS = [("用戶", 60), ("FastAPI", 250), ("Pipeline", 440), ...]  # (label, x_left)
W = 130
centers = {i: p[1] + W // 2 for i, p in enumerate(PARTS)}

HEADER_Y, LIFE_TOP, LIFE_BOTTOM = 90, 140, 900
els = []

def add_rect(rid, x, y, w, h, fill, text, fs=16):
    els.append({"type":"rectangle","id":rid,"x":x,"y":y,"width":w,"height":h,
        "roundness":{"type":3},"backgroundColor":fill,"fillStyle":"solid",
        "strokeColor":"#1e1e1e","roughness":1,"strokeWidth":2,"opacity":100,
        "boundElements":[{"id":"t_"+rid,"type":"text"}]})
    els.append({"type":"text","id":"t_"+rid,"x":x+5,"y":y+8,"width":w-10,"height":40,
        "text":text,"fontSize":fs,"fontFamily":1,"strokeColor":"#1e1e1e",
        "textAlign":"center","verticalAlign":"middle","containerId":rid,
        "originalText":text,"autoResize":True,"roughness":1,"strokeWidth":2,"opacity":100})

def add_life(pid, x):
    els.append({"type":"line","id":f"life_{pid}","x":x,"y":LIFE_TOP,"width":0,
        "height":LIFE_BOTTOM-LIFE_TOP,"points":[[0,0],[0,LIFE_BOTTOM-LIFE_TOP]],
        "strokeColor":"#868e96","strokeStyle":"dashed","roughness":1,"strokeWidth":1,"opacity":100})

for i,(label,x) in enumerate(PARTS):
    add_rect(f"p{i}",x,HEADER_Y,W,54,"#a5d8ff",label,fs=15)
    add_life(i, centers[i])

# messages: (src, dst, label, y)
MSGS = [(0,1,"POST /webhook/n8n",200),(1,2,"enqueue",255), ...]
for k,(s,d,label,y) in enumerate(MSGS):
    xs, xd = centers[s], centers[d]
    rid = f"m{k}"
    pts = [[0,0],[xd-xs,0]] if s!=d else [[0,0],[50,0],[50,24],[0,24]]
    els.append({"type":"arrow","id":rid,"x":xs,"y":y,"width":abs(xd-xs) if s!=d else 50,
        "height":0 if s!=d else 24,"points":pts,"endArrowhead":"arrow",
        "strokeColor":"#1e1e1e","strokeStyle":"solid","roughness":1,"strokeWidth":2,"opacity":100,
        "boundElements":[{"id":"t_"+rid,"type":"text"}]})
    els.append({"type":"text","id":"t_"+rid,"x":min(xs,xd)+4,"y":y-20,"width":abs(xd-xs) if s!=d else 120,
        "height":20,"text":label,"fontSize":13,"fontFamily":1,"strokeColor":"#343a40",
        "textAlign":"center","verticalAlign":"middle","containerId":rid,
        "originalText":label,"autoResize":True,"roughness":1,"strokeWidth":2,"opacity":100})

doc = {"type":"excalidraw","version":2,"source":"hermes-agent","elements":els,
       "appState":{"viewBackgroundColor":"#ffffff"}}
Path("diagrams/seq.excalidraw").write_text(json.dumps(doc, ensure_ascii=False))
```

## Pitfalls
- **Dashed lifelines** = `type:"line"`, `strokeStyle:"dashed"`, `points:[[0,0],[0,H]]`.
  Arrows float between columns; do NOT bind start/end to the lifeline.
- **Arrow width/height**: horizontal → width=`abs(dst-src)`, height=0. Self-loop →
  height=24, 4-point `[[0,0],[50,0],[50,24],[0,24]]`.
- **Message-label fontSize 13** is fine on dense arrows (the ≥14 rule is for
  standalone annotation text).
- **Always validate** after generation — see validator below. Orphan bindings render
  as blank shapes and are easy to miss by eye.

## Validator (run after every generation)

```python
import json
from pathlib import Path
d = json.loads(Path(path).read_text(encoding="utf-8"))
elems = d["elements"]; ids = {e["id"] for e in elems}
errs = []
for e in elems:
    for be in e.get("boundElements") or []:
        if be["id"] not in ids: errs.append(f"{e['id']}->{be['id']} missing")
    if e.get("containerId") and e["containerId"] not in ids:
        errs.append(f"{e['id']} container missing")
assert not errs, errs
print("OK", len(elems), "elements")
```

## Upload for a shareable link
Use the bundled skill's upload script:
`python <skills>/creative/excalidraw/scripts/upload.py diagrams/seq.excalidraw`
(requires `cryptography`). Returns an excalidraw.com `#json=...` URL.
