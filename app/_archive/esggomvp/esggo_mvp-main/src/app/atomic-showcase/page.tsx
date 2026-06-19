export default function AtomicShowcase() {
  const htmlContent = `
<!DOCTYPE html>
<html class="dark" lang="zh-Hant">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Atomic Style Guide: Night Glow</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
  body { background-color: #000000; color: #ffffff; font-family: 'Inter', sans-serif; }
  .neon-glow-text { text-shadow: 0 0 8px rgba(255, 255, 255, 0.5); }
  .neon-primary-glow { box-shadow: 0 0 15px rgba(0, 255, 255, 0.3); }
  .neon-primary-border { border: 2px solid #00ffff; box-shadow: 0 0 10px rgba(0, 255, 255, 0.4); }
  .neon-primary-border:hover { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); background-color: rgba(0, 255, 255, 0.05); }
  .void-glass { background-color: rgba(0, 0, 0, 0.8); backdrop-filter: blur(24px); border: 1px solid rgba(0, 255, 255, 0.3); }
  .neon-line-input { background: transparent; border: none; border-bottom: 2px solid rgba(0, 255, 255, 0.3); transition: all 0.3s ease; }
  .neon-line-input:focus { outline: none; border-bottom-color: #00ffff; box-shadow: 0 4px 10px -4px rgba(0, 255, 255, 0.6); }
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; color: #00ffff; text-shadow: 0 0 10px rgba(0, 255, 255, 0.8); }
  .accent-glow { color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
</style>
</head>
<body class="font-display">
<div class="flex h-screen overflow-hidden bg-black">
<aside class="w-72 border-r border-cyan-500/20 bg-black flex flex-col">
  <div class="p-8">
    <div class="flex items-center gap-3 mb-10">
      <div class="w-10 h-10 rounded bg-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.3)] flex items-center justify-center">
        <span style="color:#000;font-weight:bold">cyclone</span>
      </div>
      <div>
        <h1 class="text-white text-lg font-black tracking-tighter">InfoOne</h1>
        <p class="text-cyan-500 text-[10px] uppercase tracking-[0.2em] font-bold">Style Guide</p>
      </div>
    </div>
    <nav class="space-y-1">
      <a class="flex items-center gap-3 px-4 py-3 rounded bg-cyan-500/10 border-l-4 border-cyan-500 text-white" href="#">
        <span class="material-symbols-outlined">dashboard</span>
        <span class="text-sm font-medium">Overview</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/5 transition-all" href="#">
        <span class="material-symbols-outlined">palette</span>
        <span class="text-sm font-medium">Colors</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/5 transition-all" href="#">
        <span class="material-symbols-outlined">smart_button</span>
        <span class="text-sm font-medium">Buttons</span>
      </a>
    </nav>
  </div>
</aside>
<main class="flex-1 overflow-y-auto p-12">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-6xl font-black text-white mb-6">Atomic Style Guide: Night Glow</h2>
    <p class="text-slate-400 text-xl">Absolute Black environment with Electric Cyan neon primary.</p>
  </div>
</main>
</div>
</body>
</html>
  `;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
