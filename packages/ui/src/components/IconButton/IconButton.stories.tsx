import type { Meta, StoryObj } from '@storybook/react';
import { ArrowLeft, Trash2, Heart, Plus, MoreVertical } from 'lucide-react';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'tertiary-inverted', 'tertiary-destructive', 'primary-subtle'],
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    icon: <Plus size={16} />,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    icon: <ArrowLeft size={16} />,
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    icon: <MoreVertical size={16} />,
  },
};

export const TertiaryInverted: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    variant: 'tertiary-inverted',
    icon: <Heart size={16} />,
  },
};

export const TertiaryDestructive: Story = {
  args: {
    variant: 'tertiary-destructive',
    icon: <Trash2 size={16} />,
  },
};

export const PrimarySubtle: Story = {
  args: {
    variant: 'primary-subtle',
    icon: <Plus size={16} />,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'secondary',
    icon: <ArrowLeft size={16} />,
    disabled: true,
  },
};

export const AllVariants: Story = {
  args: {
    icon: <ArrowLeft size={16} />,
  },
  render: () => (
    <div className="flex items-center gap-16 p-16 bg-scooty-gray-50 rounded-16">
      <IconButton variant="primary" icon={<Plus size={16} />} />
      <IconButton variant="secondary" icon={<ArrowLeft size={16} />} />
      <IconButton variant="tertiary" icon={<MoreVertical size={16} />} />
      <div className="bg-scooty-gray-800 p-8 rounded-full">
        <IconButton variant="tertiary-inverted" icon={<Heart size={16} />} />
      </div>
      <IconButton variant="tertiary-destructive" icon={<Trash2 size={16} />} />
      <IconButton variant="primary-subtle" icon={<Plus size={16} />} />
    </div>
  ),
};

