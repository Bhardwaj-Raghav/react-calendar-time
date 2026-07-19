import { useEffect, useRef, useState } from "react";

const INSTALL = "npm install react-calendar-time";

export default function CopyInstall() {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResetTimer = () => {
    if (resetTimerRef.current !== null) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearResetTimer();
    };
  }, []);

  const copyInstall = async () => {
    clearResetTimer();

    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      resetTimerRef.current = setTimeout(() => {
        resetTimerRef.current = null;
        setCopied(false);
      }, 1800);
    } catch {
      clearResetTimer();
      setCopied(false);
    }
  };

  return (
    <>
      <div className="hero-actions">
        <button type="button" className="btn btn-primary" onClick={copyInstall}>
          {copied ? "Copied" : "Copy install"}
        </button>
        <a className="btn btn-ghost" href="#demo">
          Try the live demo
        </a>
      </div>
      <pre className="install-line" tabIndex={0}>
        <code>{INSTALL}</code>
      </pre>
    </>
  );
}
