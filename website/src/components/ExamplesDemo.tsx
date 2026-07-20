import { useState } from "react";
import DateTime, { DateTimeInput, DateTimeRange } from "react-calendar-time";
import "dayjs/locale/fr";

export default function ExamplesDemo() {
  const [dateOnly, setDateOnly] = useState<string | null>(null);
  const [timeOnly, setTimeOnly] = useState<string | null>(null);
  const [combined, setCombined] = useState<string | null>(null);
  const [tabsValue, setTabsValue] = useState<string | null>(null);
  const [dateTimeInput, setDateTimeInput] = useState<string | null>(null);
  const [localeValue, setLocaleValue] = useState<string | null>(null);
  const [darkDate, setDarkDate] = useState<string | null>(null);
  const [darkInput, setDarkInput] = useState<string | null>(null);
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
        <h3>Date only</h3>
        <DateTime
          inline
          mode="date"
          value={dateOnly}
          onChange={setDateOnly}
          disablePastDates
        />
        <p className="stage-value">Selected: {dateOnly ?? "null"}</p>
      </div>

      <div className="showcase-block">
        <h3>Time only</h3>
        <DateTime
          inline
          mode="time"
          value={timeOnly}
          onChange={setTimeOnly}
          format="HH:mm:ss"
        />
        <p className="stage-value">Selected: {timeOnly ?? "null"}</p>
      </div>

      <div className="showcase-block">
        <h3>Combined date &amp; time</h3>
        <DateTime
          inline
          mode="datetime"
          layout="combined"
          value={combined}
          onChange={setCombined}
        />
        <p className="stage-value">Selected: {combined ?? "null"}</p>
      </div>

      <div className="showcase-block">
        <h3>Separate view (tabs)</h3>
        <DateTime
          inline
          mode="datetime"
          layout="tabs"
          value={tabsValue}
          onChange={setTabsValue}
        />
        <p className="stage-value">Selected: {tabsValue ?? "null"}</p>
      </div>

      <div className="showcase-block">
        <h3>Input · 12-hour</h3>
        <DateTimeInput
          mode="datetime"
          use12Hours
          format="YYYY-MM-DD hh:mm:ss A"
          value={dateTimeInput}
          onChange={setDateTimeInput}
          placeholder="Pick a date & time"
        />
        <p className="stage-value">Selected: {dateTimeInput ?? "null"}</p>
      </div>

      <div className="showcase-block">
        <h3>Date range</h3>
        <DateTimeRange inline value={range} onChange={setRange} />
        <p className="stage-value range-value">
          {range.start ?? "—"} → {range.end ?? "—"}
        </p>
      </div>

      <div className="showcase-block">
        <h3>French locale · week starts Monday</h3>
        <DateTime
          inline
          mode="date"
          locale="fr"
          weekStartsOn={1}
          value={localeValue}
          onChange={setLocaleValue}
        />
        <p className="stage-value">Selected: {localeValue ?? "null"}</p>
      </div>

      <div className="showcase-block showcase-block--dark" data-ctp-theme="dark">
        <h3>Dark theme · date &amp; time popover</h3>
        <DateTime
          inline
          mode="date"
          value={darkDate}
          onChange={setDarkDate}
        />
        <DateTimeInput
          mode="time"
          use12Hours
          format="hh:mm:ss A"
          value={darkInput}
          onChange={setDarkInput}
          defaultOpen={false}
          placeholder="Pick a time (opens on click)"
        />
        <p className="stage-value">
          Date: {darkDate ?? "null"} · Time: {darkInput ?? "null"}
        </p>
      </div>
    </div>
  );
}
