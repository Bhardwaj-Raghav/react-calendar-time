import { useState } from "react";
import { DateTimeInput } from "react-calendar-time";

export default function HeroDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="hero-stage" id="demo">
      <div className="stage-glow" aria-hidden="true" />
      <div className="stage-panel">
        <h2 className="stage-label">Live date-time input demo</h2>
        <DateTimeInput
          value={value}
          onChange={setValue}
          placeholder="Pick a date & time"
          use12Hours
        />
        <p className="stage-value">
          Selected: <span>{value ?? "null"}</span>
        </p>
      </div>
    </div>
  );
}
