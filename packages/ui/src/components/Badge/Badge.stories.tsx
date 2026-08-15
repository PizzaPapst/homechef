import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'brand', 'glass', 'secondary'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Kategorie',
    variant: 'default',
  },
};

export const Glass: Story = {
  args: {
    label: 'Vegetarisch',
    variant: 'glass',
  },
};

export const Brand: Story = {
  args: {
    label: 'High Protein',
    variant: 'brand',
  },
};
