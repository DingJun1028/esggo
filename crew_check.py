import re, json, sys

path = "C:/Users/dingj/esggo/oa-team-crewai/crew.jsonc"
raw = open(path, encoding="utf-8").read()

# Strip // line comments (naive but fine for this file shape)
lines = []
for ln in raw.splitlines():
    # strip from '//' to end of line
    idx = ln.find('//')
    if idx != -1:
        ln = ln[:idx]
    lines.append(ln)
cleaned = "\n".join(lines)

try:
    d = json.loads(cleaned)
except Exception as e:
    print("JSON_PARSE_ERROR:", e)
    sys.exit(1)

print("AGENTS:", len(d.get("agents", [])))
print("TASKS:", len(d.get("tasks", [])))
print("TASK_NAMES:", [t.get("name") for t in d.get("tasks", [])])
print("PROCESS:", d.get("process"), "VERBOSE:", d.get("verbose"))
