# Remotion as the optional render engine (Windows)

Remotion is a Node app, NOT Docker — `cd remotion && npm install`, then invoke
`npx remotion render`. Wire it as a `RENDER_ENGINE=remotion` switch; the ffmpeg
engine stays the default.

## Gotcha 1 — missing native binding on Windows

After `npm install`, `npx remotion render` aborts with:

    Error: Cannot find module '@rspack/binding-win32-x64-msvc'

Remotion 4.x ships an optional native binding that `npm install` sometimes
skips. Fix:

    cd remotion
    npm install @rspack/binding-win32-x64-msvc

(Install the exact platform binary package; a plain `npm install` may not pull
the optional native dep on Windows.)

## Gotcha 2 — one-time Chrome download

First `npx remotion render src/index.tsx MyVideo out/test.mp4` downloads
"Chrome Headless Shell" (~113 MB) automatically. Expect a long first run; it is
cached afterwards.

## Gotcha 3 — `<Img>` cannot load absolute `file://` paths

Chrome refuses local resources:

    Not allowed to load local resource: file:///.../scene_01.png
    Could not load image with source file:///...

Fix: Remotion's `staticFile()` resolves from `remotion/public/`. The Python
adapter must **copy** each scene PNG into `remotion/public/scenes/` and pass the
relative path; the React component wraps it with `staticFile(...)`:

```tsx
import { Img, staticFile } from "remotion";
// ...
<Img src={staticFile(image)} ... />   // image prop = "scenes/scene_01.png"
```

```python
# python adapter (render_remotion.py)
public_scenes = remotion_dir / "public" / "scenes"
public_scenes.mkdir(parents=True, exist_ok=True)
for s in project.scenes:
    src_img = Path(s.image_path)
    shutil.copyfile(src_img, public_scenes / src_img.name)
    scenes.append({"image": f"scenes/{src_img.name}", ...})
```

## Verification

`npx remotion render src/index.tsx MyVideo out/test.mp4` should print
`+ out/test.mp4 <size>` and exit 0. Confirm the output with
`ffprobe -v error -show_entries stream=codec_type,width,height -of csv=p=0 out/test.mp4`.
