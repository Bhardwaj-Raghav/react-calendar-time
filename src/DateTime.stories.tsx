import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateTime } from "./DateTime";
import { DateTimeInput } from "./DateTimeInput";
import { DateTimeRange } from "./DateTimeRange";

const meta: Meta<typeof DateTime> = {
  title: "DateTime",
  component: DateTime,
};

export default meta;
type Story = StoryObj<typeof DateTime>;

export const Inline: Story = {
  args: {
    inline: true,
    mode: "datetime",
  },
};

export const DateOnly: Story = {
  args: {
    inline: true,
    mode: "date",
  },
};

export const Time12Hour: Story = {
  args: {
    inline: true,
    mode: "time",
    use12Hours: true,
  },
};

function InputDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div style={{ minHeight: 420 }}>
      <DateTimeInput value={value} onChange={setValue} use12Hours />
      <p style={{ marginTop: 12 }}>{value ?? "null"}</p>
    </div>
  );
}

export const WithInput: StoryObj = {
  render: () => <InputDemo />,
};

function RangeDemo() {
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  return (
    <div>
      <DateTimeRange inline value={range} onChange={setRange} />
      <p style={{ marginTop: 12 }}>
        {range.start ?? "—"} → {range.end ?? "—"}
      </p>
    </div>
  );
}

export const Range: StoryObj = {
  render: () => <RangeDemo />,
};

export const FrenchLocale: Story = {
  args: {
    inline: true,
    locale: "fr",
    weekStartsOn: 1,
  },
  loaders: [
    async () => {
      await import("dayjs/locale/fr");
      return {};
    },
  ],
};
