"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
require("./button.css");
/** Primary UI component for user interaction */
const Button = ({ primary = false, size = 'medium', backgroundColor, label, ...props }) => {
    const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
    return (<button type="button" className={['storybook-button', `storybook-button--${size}`, mode].join(' ')} {...props}>
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>);
};
exports.Button = Button;
//# sourceMappingURL=Button.js.map