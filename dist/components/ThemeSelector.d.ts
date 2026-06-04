import { type ThemeId } from '../lib/theme-config';
interface ThemeSelectorProps {
    collapsed?: boolean;
    currentTheme?: ThemeId;
    onSelect?: (id: ThemeId) => void;
}
export default function ThemeSelector({ collapsed, currentTheme, onSelect }: ThemeSelectorProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=ThemeSelector.d.ts.map