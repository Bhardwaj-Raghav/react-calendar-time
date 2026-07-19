import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import DateTime, {
  DateTimeInput,
  DateTimeRange,
} from "../src/index";
import "../src/styles/datepicker.scss";
import "./playground.css";

function App() {
  const [value, setValue] = useState<string | null>(null);
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [open, setOpen] = useState(false);

  return (
    <main className="playground">
      <h1>react-calendar-time</h1>
      <p className="subtitle">Local playground for the v1 API</p>

      <section>
        <h2>Input (popover)</h2>
        <DateTimeInput
          value={value}
          onChange={setValue}
          placeholder="Pick a date & time"
          use12Hours
        />
        <p className="value">Value: {value ?? "null"}</p>
      </section>

      <section>
        <h2>Inline datetime</h2>
        <DateTime
          inline
          value={value}
          onChange={setValue}
          disablePastDates
        />
      </section>

      <section>
        <h2>Modal overlay</h2>
        <button type="button" onClick={() => setOpen(true)}>
          Open picker
        </button>
        <DateTime
          open={open}
          onOpenChange={setOpen}
          value={value}
          onChange={setValue}
          mode="datetime"
        />
      </section>

      <section>
        <h2>Date range</h2>
        <DateTimeRange
          inline
          value={range}
          onChange={setRange}
        />
        <p className="value">
          Range: {range.start ?? "—"} → {range.end ?? "—"}
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
