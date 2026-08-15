import type { Meta, StoryObj } from '@storybook/react';
import { Plus, Sparkles, ChefHat, CalendarPlus } from 'lucide-react';
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
    icon: <Plus size={24} />,
    label: 'Neues Rezept',
  },
};

export const AIScraper: Story = {
  args: {
    icon: <Sparkles size={24} />,
    label: 'KI-Import',
  },
};

export const PlanWeek: Story = {
  args: {
    icon: <CalendarPlus size={24} />,
    label: 'Wochenplaner',
  },
};

export const Disabled: Story = {
  args: {
    icon: <ChefHat size={24} />,
    label: 'Gesperrt',
    disabled: true,
  },
};

export const GridExample: Story = {
  args: {
    label: 'Rezept',
  },
  render: () => (
    <div className="grid grid-cols-3 gap-12 max-w-sm">
      <ActionTile icon={<Plus size={24} />} label="Rezept" />
      <ActionTile icon={<Sparkles size={24} />} label="KI Import" />
      <ActionTile icon={<CalendarPlus size={24} />} label="Planen" />
    </div>
  ),
};

