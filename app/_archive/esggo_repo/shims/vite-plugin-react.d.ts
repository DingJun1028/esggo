declare module '@vitejs/plugin-react' {
  import type { Plugin } from 'vite';
  interface Options {
    // minimal options needed for type checking
    include?: RegExp | string[];
    exclude?: RegExp | string[];
    jsxRuntime?: 'automatic' | 'classic';
  }
  export function viteReact(options?: Options): Plugin;
  const plugin: Plugin;
  export default plugin;
}
