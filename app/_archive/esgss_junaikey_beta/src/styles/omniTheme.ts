
/**
 * 🎨 OmniTheme Design Tokens
 * 
 * 遵循「上善若水」與「金生水」意象。
 * 主色: Aqua 青 (#63a6b0)
 * 點綴: 永恆金 (#ffd700)
 */

export const omniTheme = {
    colors: {
        primary: '#63a6b0', // Aqua Cyan
        accent: '#ffd700',  // Eternal Gold
        surface: '#050c14', // Deep Space Black
        text: '#e0e0e0',    // Titanium White
        glass: 'rgba(5, 12, 20, 0.6)',
        border: 'rgba(99, 166, 176, 0.2)',
    },
    animations: {
        smooth: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
        }
    }
};

export default omniTheme;
