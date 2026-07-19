import { useEffect, useState } from "react";
import DateTime, { DateTimeInput, DateTimeRange } from "react-datetime-picker-component";

const INSTALL = "npm install react-datetime-picker-component";

const FEATURES = [
  {
    title: "Typed by default",
    body: "First-class TypeScript exports, ESM/CJS builds, and a clean peer-dep story for React 17+.",
  },
  {
    title: "Keyboard-first",
    body: "Dialog semantics, focus trap, Escape to dismiss, and arrow-key calendar navigation.",
  },
  {
    title: "Yours to theme",
    body: "Ship one CSS file and restyle with variables — primary, surface, danger, radius.",
  },
];

export default function App() {
  const [value, setValue] = useState<string | null>(null);
  const [range, setRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`site ${ready ? "is-ready" : ""}`}>
      <div className="site-bg" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">react-datetime-picker-component</span>
        </a>
        <nav className="topnav">
          <a href="#demo">Demo</a>
          <a href="#api">API</a>
          <a
            href="https://github.com/Bhardwaj-Raghav/react-datetime-picker-component"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">v1.0 · React date &amp; time</p>
            <h1 className="hero-brand">react-datetime-picker-component</h1>
            <p className="hero-lead">
              An accessible, typed picker you can drop into any React app —
              date, time, or both.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" onClick={copyInstall}>
                {copied ? "Copied" : "Copy install"}
              </button>
              <a className="btn btn-ghost" href="#demo">
                Try the demo
              </a>
            </div>
            <pre className="install-line" tabIndex={0}>
              <code>{INSTALL}</code>
            </pre>
          </div>

          <div className="hero-stage" id="demo">
            <div className="stage-glow" aria-hidden="true" />
            <div className="stage-panel">
              <p className="stage-label">Live input</p>
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
        </section>

        <section className="features" aria-label="Highlights">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className="feature"
              style={{ animationDelay: `${0.12 + index * 0.08}s` }}
            >
              <h2>{feature.title}</h2>
              <p>{feature.body}</p>
            </article>
          ))}
        </section>

        <section className="showcase" id="api">
          <div className="showcase-head">
            <h2>Modes that match the job</h2>
            <p>Inline calendar, time lists, and range selection — same theme tokens throughout.</p>
          </div>

          <div className="showcase-grid">
            <div className="showcase-block">
              <h3>Inline date</h3>
              <DateTime
                inline
                mode="date"
                value={value}
                onChange={setValue}
                disablePastDates
              />
            </div>
            <div className="showcase-block">
              <h3>Date range</h3>
              <DateTimeRange inline value={range} onChange={setRange} />
              <p className="stage-value range-value">
                {range.start ?? "—"} → {range.end ?? "—"}
              </p>
            </div>
          </div>
        </section>

        <section className="snippet">
          <h2>Minimal usage</h2>
          <pre>
            <code>{`import { useState } from "react";
import DateTime, { DateTimeInput } from "react-datetime-picker-component";
import "react-datetime-picker-component/style.css";

function App() {
  const [value, setValue] = useState(null);
  return <DateTimeInput value={value} onChange={setValue} />;
}`}</code>
          </pre>
        </section>
      </main>

      <footer className="footer">
        <p>
          MIT ·{" "}
          <a
            href="https://www.npmjs.com/package/react-datetime-picker-component"
            target="_blank"
            rel="noreferrer"
          >
            npm
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/Bhardwaj-Raghav/react-datetime-picker-component"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
