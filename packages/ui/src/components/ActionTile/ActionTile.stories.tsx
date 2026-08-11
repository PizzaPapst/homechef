import type { Meta, StoryObj } from '@storybook/react';
import { ActionTile } from './ActionTile';

const meta = {
  title: 'Components/ActionTile',
  component: ActionTile,
  tags: ['autodocs'],
} satisfies Meta<typeof ActionTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <span>+</span>,
    label: 'Neues Rezept',
  },
};
