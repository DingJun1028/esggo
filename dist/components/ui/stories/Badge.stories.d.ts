import type { StoryObj } from '@storybook/react';
import { Badge } from '../Badge';
declare const meta: {
    title: string;
    component: typeof Badge;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        variant: {
            control: string;
            options: string[];
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Verified: Story;
export declare const Draft: Story;
export declare const Warning: Story;
export declare const ErrorState: Story;
export declare const Info: Story;
export declare const Gold: Story;
//# sourceMappingURL=Badge.stories.d.ts.map