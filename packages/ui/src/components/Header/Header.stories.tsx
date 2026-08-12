import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default'
  },
  render: (args) => (
    <Header {...args}>
      <h1 className='typography-heading-medium text-content-text-default'>Test</h1>
      <nav>Navigation</nav>
    </Header>
  ),
};

export const Quiet: Story = {
  args: {
    variant: 'quiet',
  },
  render: (args) => (
    <Header {...args}>
      <h1>Test</h1>
      <nav>Navigation</nav>
    </Header>
  ),
};