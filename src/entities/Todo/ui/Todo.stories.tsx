import type { Meta, StoryObj } from '@storybook/react-vite';

import { Todo } from './Todo';

const meta = {
  component: Todo,
} satisfies Meta<typeof Todo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};