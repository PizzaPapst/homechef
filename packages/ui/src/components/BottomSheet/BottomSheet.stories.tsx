import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BottomSheet } from './BottomSheet';
import { Button } from '../Button/Button';
import { ActionTile } from '../ActionTile/ActionTile';
import { Plus, Sparkles, Camera } from 'lucide-react';

const meta = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    children: null,
  },
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <div className="p-16 min-h-[300px]">
        <Button label="Open BottomSheet" onClick={() => setOpen(true)} />
        <BottomSheet isOpen={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-16">
            <h3 className="typography-heading-small-emph text-content-text-default">Rezept erstellen</h3>
            <p className="typography-body-small text-content-text-additional">
              Wähle eine Option, wie du dein neues Rezept hinzufügen möchtest:
            </p>
            <div className="grid grid-cols-3 gap-12">
              <ActionTile icon={<Plus size={24} />} label="Manuell" onClick={() => setOpen(false)} />
              <ActionTile icon={<Sparkles size={24} />} label="KI Import" onClick={() => setOpen(false)} />
              <ActionTile icon={<Camera size={24} />} label="Scan" onClick={() => setOpen(false)} />
            </div>
          </div>
        </BottomSheet>
      </div>
    );
  },
};
