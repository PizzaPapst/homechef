import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Rezept speichern',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Abbrechen',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    label: 'Details anzeigen',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'secondary',
    label: 'Deaktiviert',
    disabled: true,
  },

};

export const Wrapping: Story = {
  args: {
    variant: 'secondary',
    label: 'Lorem ipsum dolor sit amet, consectetur',
    disabled: false,
    className: 'w-[250px]'
  }
}

export const Overflow: Story = {
  args: {
    variant: 'secondary',
    label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    disabled: false,
    className: 'w-[250px]'
  }
}

export const OverflowLoading: Story = {
  args: {
    variant: 'secondary',
    label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    disabled: false,
    className: 'w-[250px]',
    isLoading: true
  }
}