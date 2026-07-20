import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateTime } from "./DateTime";
import { DateTimeInput } from "./DateTimeInput";
import { DateTimeRange } from "./DateTimeRange";
import { dayjs } from "./utils/date";

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

export const TabsLayout: Story = {
  name: "Separate view (tabs)",
  args: {
    inline: true,
    mode: "datetime",
    layout: "tabs",
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
    format: "YYYY-MM-DD hh:mm:ss A",
  },
};

export const MinMax: Story = {
  args: {
    inline: true,
    mode: "date",
    minDate: dayjs("2024-07-05"),
    maxDate: dayjs("2024-07-25"),
    defaultValue: dayjs("2024-07-15"),
  },
};

export const WeekStartsMonday: Story = {
  args: {
    inline: true,
    mode: "date",
    weekStartsOn: 1,
    defaultValue: dayjs("2024-07-10"),
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

function EdgePopoverDemo() {
  const [value, setValue] = useState<string | null>("2024-07-10 12:00:00");
  return (
    <div
      style={{
        minHeight: 480,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        padding: 16,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <DateTimeInput
        value={value}
        onChange={setValue}
        mode="date"
        placeholder="Near viewport edge"
      />
    </div>
  );
}

export const EdgePopover: StoryObj = {
  parameters: { layout: "fullscreen" },
  render: () => <EdgePopoverDemo />,
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

function DarkThemeDemo() {
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string | null>(null);
  return (
    <div
      data-ctp-theme="dark"
      style={{
        padding: 24,
        background: "#111827",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <DateTime
        inline
        mode="date"
        value={dateValue}
        onChange={setDateValue}
      />
      <DateTimeInput
        mode="time"
        use12Hours
        format="hh:mm:ss A"
        value={inputValue}
        onChange={setInputValue}
        defaultOpen={false}
        placeholder="Dark time popover (click to open)"
      />
    </div>
  );
}

export const DarkTheme: StoryObj = {
  name: "Dark theme (date + time)",
  render: () => <DarkThemeDemo />,
};
