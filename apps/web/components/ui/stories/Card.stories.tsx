import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardContent, CardTitle } from '../Card';
import React from 'react';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader title="Sustainability Report" subtitle="Environmental" />
      <CardContent>
        <p className="text-sm text-slate-500">
          This is a sample liquid glass card used for the ESG GO platform.
        </p>
      </CardContent>
    </Card>
  ),
};

export const HoverableAndGlow: Story = {
  render: (args) => (
    <Card {...args} hover glow className="w-[350px]">
      <CardHeader title="Important Metric" />
      <CardContent>
        <div className="text-3xl font-black text-berkeley-blue">85.4%</div>
        <p className="text-sm text-slate-500 mt-2">
          Significant improvement over last quarter.
        </p>
      </CardContent>
    </Card>
  ),
};
