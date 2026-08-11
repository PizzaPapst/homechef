import type { Meta, StoryObj } from '@storybook/react';
import { InputTextarea } from './InputTextarea';

const meta = {
  title: 'Components/InputTextarea',
  component: InputTextarea,
  tags: ['autodocs'],
} satisfies Meta<typeof InputTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Beschreibung',
    placeholder: 'Enter text...',
  },
};
