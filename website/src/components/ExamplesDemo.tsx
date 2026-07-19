import { useState } from "react";
import DateTime, { DateTimeRange } from "react-calendar-time";

export default function ExamplesDemo() {
  const [value, setValue] = useState<string | null>(null);
  const [range, setRange] = useState<{
    start: string | null;
    end: string | null;
  }>({
    start: null,
    end: null,
  });

  return (
    <div className="showcase-grid">
      <div className="showcase-block">
        <h3>Inline date picker</h3>
        <DateTime
          inline
          mode="date"
          value={value}
          onChange={setValue}
          disablePastDates
        />
      </div>
      <div className="showcase-block">
        <h3>Date range picker</h3>
        <DateTimeRange inline value={range} onChange={setRange} />
        <p className="stage-value range-value">
          {range.start ?? "—"} → {range.end ?? "—"}
        </p>
      </div>
    </div>
  );
}
