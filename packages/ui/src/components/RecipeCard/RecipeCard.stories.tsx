import type { Meta, StoryObj } from '@storybook/react';
import { RecipeCard } from './RecipeCard';

const meta = {
  title: 'Components/RecipeCard',
  component: RecipeCard,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'large'],
    },
  },
} satisfies Meta<typeof RecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: 'small',
    title: 'Cremiges Hähnchen Curry mit Reis',
    prepTime: 25,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    title: 'Hausgemachte Margherita Pizza mit frischem Basilikum',
    prepTime: 40,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop',
    badges: [
      { id: '1', label: 'Vegetarisch' },
      { id: '2', label: 'Italienisch' },
    ],
  },
};