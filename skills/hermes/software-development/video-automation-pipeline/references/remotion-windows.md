# Remotion on Windows — setup & runtime pitfalls

Exact errors hit while adding Remotion as an optional render layer
(`RENDER_ENGINE=remotion`) on Windows x64 + Node 24. Capture these so the next
session doesn't re-debug them.

## 1. `npm install remotion@^4.0.0` → ETARGET
Error:
```
npm error code ETARGET
npm error No matching version found for typescript@5.4.0
```
Cause: `package.json` pinned `typescript: 5.4.0` (exact, nonexistent).
Fix: use `^5.4.0` (or a real version like `5.4.5`).

## 2. `npx remotion render` → MODULE_NOT_FOUND @rspack/binding-win32-x64-msvc
Error:
```
Error: Cannot find module '@rspack/binding-win32-x64-msvc'
Require stack:
 - ...\remotion\node_modules\@rspack\binding\binding.js
```
Cause: Remotion 4.x pulls a platform-specific native binding that npm's
optional-deps step sometimes skips (network/peer hiccup).
Fix:
```bash
cd remotion && npm install @rspack/binding-win32-x64-msvc
```
Keep it as `^2.1.5` in `package.json` so macOS/Linux pick their *own* platform
binding — do NOT pin the exact `win32-x64-msvc` build, or cross-platform installs
break.

## 3. Chrome Headless Shell auto-download
First `npx remotion render` downloads ~113 MB Chrome Headless Shell
(`Downloading Chrome Headless Shell ... Got Headless Shell`). Subsequent renders
reuse it. Budget time on first run; it is not an error.

## 4. `<Img src="file://...">` → "Not allowed to load local resource"
Browser-console errors during render:
```
Not allowed to load local resource: file:///.../scene_01.png
Could not load image with source file:///.../scene_01.png, retrying again in 2000ms
Error: Error loading image with src: file:///.../scene_01.png
```
Root cause: Remotion/Chrome refuses absolute `file://` URLs inside `<Img>`.
Fix (adapter pattern used in `src/render_remotion.py`):
- Copy each scene PNG into `remotion/public/scenes/`.
- Pass the relative path `scenes/<name>.png` as the prop.
- In the component wrap with `staticFile()`:
  ```tsx
  import { staticFile } from "remotion";
  // ...
  <Img src={staticFile(image)} />
  ```

## 5. Dependabot critical alerts (RCE + arbitrary file write)
Remotion `< 4.0.x` had critical RCE / arbitrary-file-write advisories. Mitigation
that *clears* (not dismisses) the alert:
- Pin `remotion` AND `@remotion/cli` to an EXACT patched version (e.g. `4.0.499`,
  the latest at time of writing) instead of `^4.0.0`. A caret range makes GitHub's
  static scan unable to confirm the resolved version is safe, leaving the alert
  stuck on `fixed`/`open`.
- `npm install` → `package-lock.json` locks `4.0.499`; `npm audit` → 0 vulns.
- Verify: `grep` the lock for `"version": "4.0.499"`; `npm ls remotion @remotion/cli`
  shows all `@remotion/*` deduped at the same version.
- Commit + push → GitHub re-scans and the alert resolves. Do NOT dismiss the alert;
  upgrade for real.

## render_remotion.py adapter skeleton (condensed)
```python
public_scenes = remotion_dir / "public" / "scenes"
public_scenes.mkdir(parents=True, exist_ok=True)
for s in project.scenes:
    src = Path(s.image_path)
    shutil.copyfile(src, public_scenes / src.name)
    scenes.append({
        "index": s.index,
        "image": f"scenes/{src.name}",   # relative -> staticFile()
        "captions": s.captions,
        "duration": dur,
        "startInFrames": int(t * fps),
    })
# invoke:
# npx remotion render src/index.tsx MyVideo <out> \
#   --props <remotion_dir>/props.json --fps 30 [--width 1920 --height 1080 | --width 1080 --height 1920]
```
