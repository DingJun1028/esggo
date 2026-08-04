import subprocess, os, sys, datetime

STAGING = r"C:\Project\esggo-learning-center\esggo-hub-staging"
LOG = os.path.join(STAGING, "install.log")

def log(msg):
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.datetime.now().isoformat()}] {msg}\n")

try:
    log("=== run_install.py started (cron local executor) ===")
    os.chdir(STAGING)
    cmd = ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File",
           os.path.join(STAGING, "install.ps1")]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write("STDOUT:\n" + r.stdout + "\n")
        f.write("STDERR:\n" + r.stderr + "\n")
        f.write("EXITCODE=" + str(r.returncode) + "\n")
    log("=== run_install.py finished, exit=" + str(r.returncode) + " ===")
except Exception as e:
    log("EXCEPTION: " + repr(e))
    sys.exit(1)
