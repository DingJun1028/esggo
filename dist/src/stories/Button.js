"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
require("./button.css");
/** Primary UI component for user interaction */
const Button = ({ primary = false, size = 'medium', backgroundColor, label, ...props }) => {
    const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
    return ((0, jsx_runtime_1.jsxs)("button", { type: "button", className: ['storybook-button', `storybook-button--${size}`, mode].join(' '), ...props, children: [label, (0, jsx_runtime_1.jsx)("style", { jsx: true, children: `
        button {
          background-color: ${backgroundColor};
        }
      ` })] }));
};
exports.Button = Button;
//# sourceMappingURL=Button.js.map