/**
 * 🎨 paletteGenerator: Automatic 5T Color Derivation
 * --------------------------------------------------
 * Generates harmonious themes from a single base color.
 */

interface DerivedPalette {
    primary: string;
    secondary: string;
    glow: string;
    background: string;
    surface: string;
    aura: string;
}

/**
 * Converts HEX to HSL for easier manipulation
 */
function hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

/**
 * Converts HSL back to HEX
 */
function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generates a full 5T palette variant
 */
export function generateAutoPalette(baseColor: string, isNight: boolean = true): DerivedPalette {
    const [h, s, l] = hexToHsl(baseColor);

    if (isNight) {
        return {
            primary: baseColor,
            secondary: hslToHex((h + 40) % 360, s, Math.max(l, 50)), // Analogous highlight
            glow: `rgba(${parseInt(baseColor.slice(1, 3), 16)}, ${parseInt(baseColor.slice(3, 5), 16)}, ${parseInt(baseColor.slice(5, 7), 16)}, 0.4)`,
            background: hslToHex(h, Math.min(s, 20), 5), // Deep dark matching background
            surface: 'rgba(255, 255, 255, 0.05)',
            aura: `radial-gradient(circle at 50% 50%, ${baseColor}22 0%, transparent 70%)`
        };
    } else {
        // "Daylight" High Contrast Variant
        return {
            primary: baseColor,
            secondary: hslToHex((h + 180) % 360, s, 40), // Complementary
            glow: `rgba(${parseInt(baseColor.slice(1, 3), 16)}, ${parseInt(baseColor.slice(3, 5), 16)}, ${parseInt(baseColor.slice(5, 7), 16)}, 0.2)`,
            background: hslToHex(h, 10, 95), // Pearl/Sand background
            surface: 'rgba(0, 0, 0, 0.05)',
            aura: `radial-gradient(circle at 50% 50%, ${baseColor}11 0%, transparent 80%)`
        };
    }
}
