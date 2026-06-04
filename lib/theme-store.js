"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
exports.useThemeStore = (0, zustand_1.create)()((0, middleware_1.persist)((set) => ({
    mode: 'system',
    flavor: 'berkeley',
    sidebarTheme: 'dark',
    setMode: (mode) => set({ mode }),
    setFlavor: (flavor) => set({ flavor }),
    setSidebarTheme: (sidebarTheme) => set({ sidebarTheme }),
}), { name: 'esggo-theme-config' }));
//# sourceMappingURL=theme-store.js.map