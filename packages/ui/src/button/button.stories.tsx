import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[#fcfbf7] p-10">
        <div className="flex flex-wrap items-center gap-4">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    children: "Add To Cart",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "View Details",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Learn More",
  },
};

export const ProductDetailAction: Story = {
  args: {
    variant: "outline",
    size: "lg",
    children: "Add To Cart",
  },
};

export const ProductDetailPair: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="lg" variant="outline">
        Add To Cart
      </Button>
      <Button size="lg" variant="outline">
        + Compare
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: "Submitting",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Shop Now",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Delete",
  },
};
