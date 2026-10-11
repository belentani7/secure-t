import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "AURUM/Button",
  component: Button,
  args: { children: "Descargar .ics" }
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Solid: Story = {};
export const Ghost: Story = { args: { variant: "ghost", children: "Ver semana 1" } };
export const Azure: Story = { args: { variant: "azure", children: "Preguntar a AURUM" } };
export const Disabled: Story = { args: { disabled: true, children: "Sin material suficiente" } };
export const Small: Story = { args: { size: "sm", children: "Marcar semana hecha" } };
