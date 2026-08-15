import type { Meta, StoryObj } from '@storybook/react';
import { InputText } from './InputText';

const meta = {
  title: 'Components/InputText',
  component: InputText,
  tags: ['autodocs'],
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Url eintippen',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Rezept URL',
    placeholder: 'https://example.com/rezept',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Rezept URL',
    placeholder: 'https://example.com/rezept',
    value: 'invalid-url',
    error: 'Bitte gib eine gültige URL ein',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Gesperrtes Feld',
    value: 'https://example.com',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Nur Lesezugriff',
    value: 'https://example.com',
    readOnly: true,
  },
};
