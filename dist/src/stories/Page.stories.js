"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedIn = exports.LoggedOut = void 0;
const test_1 = require("storybook/test");
const Page_1 = require("./Page");
const meta = {
    title: 'Example/Page',
    component: Page_1.Page,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
};
exports.default = meta;
exports.LoggedOut = {};
// More on component testing: https://storybook.js.org/docs/writing-tests/interaction-testing
exports.LoggedIn = {
    play: async ({ canvasElement }) => {
        const canvas = (0, test_1.within)(canvasElement);
        const loginButton = canvas.getByRole('button', { name: /Log in/i });
        await (0, test_1.expect)(loginButton).toBeInTheDocument();
        await test_1.userEvent.click(loginButton);
        await (0, test_1.expect)(loginButton).not.toBeInTheDocument();
        const logoutButton = canvas.getByRole('button', { name: /Log out/i });
        await (0, test_1.expect)(logoutButton).toBeInTheDocument();
    },
};
//# sourceMappingURL=Page.stories.js.map