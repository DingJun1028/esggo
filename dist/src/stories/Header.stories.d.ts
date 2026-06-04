import type { StoryObj } from '@storybook/nextjs-vite';
declare const meta: Meta<({ user, onLogin, onLogout, onCreateAccount }: import("./Header").HeaderProps) => import("react").JSX.Element>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const LoggedIn: Story;
export declare const LoggedOut: Story;
//# sourceMappingURL=Header.stories.d.ts.map