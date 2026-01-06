import type { Meta, StoryObj } from '@storybook/react-vite';
import { About } from './About';
import { ThemeProviderCustom } from '../../../app/ThemeProviderCustom';
import { SnackbarProvider } from 'notistack';

const meta = {
  title: 'Groups/About',
  component: About,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    version: {
      control: 'number',
    },
  },
  decorators: [
    Story => (
      <SnackbarProvider>
        <ThemeProviderCustom>
          <Story />
        </ThemeProviderCustom>
      </SnackbarProvider>
    ),
  ],
} satisfies Meta<typeof About>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: 'About',
    version: '0.0.2',
  },
};
