import type { Meta, StoryObj } from "@storybook/react";
import { Badge, Card, CardTitle, Progress } from "../index";

const meta: Meta = { title: "AURUM/Card" };
export default meta;
type Story = StoryObj;

export const ProgramCard: Story = {
  render: () => (
    <Card>
      <Badge>20 semanas · 120 h</Badge>
      <CardTitle>Ciberseguridad Defensiva: Operar como SOC</CardTitle>
      <p className="text-[var(--aurum-muted)]">Tríada CIA, telemetría y logs, mini-SOC con herramientas abiertas.</p>
      <Progress value={35} label="Avance del programa" />
    </Card>
  )
};
