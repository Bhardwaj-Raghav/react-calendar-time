import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { buildCalendarMonth } from "./calendar";
import {
  useFocusTrap,
  useOnEscape,
  usePopoverPosition,
} from "./hooks/useA11y";
import { useControllableState } from "./hooks/useControllableState";
import type { DateTimeProps } from "./types";
import {
  DEFAULT_FORMAT,
  HOURS_12,
  HOURS_24,
  MINUTES,
  dayjs,
  formatValue,
  getWeekdayLabels,
  parseValue,
  to12Hour,
  to24Hour,
  type Dayjs,
} from "./utils/date";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function DateTime(props: DateTimeProps) {
  const {
    value,
    defaultValue,
    onChange,
    format = DEFAULT_FORMAT,
    mode = "datetime",
    minDate,
    maxDate,
    disablePastDates = false,
    disableFutureDates = false,
    weekStartsOn = 0,
    use12Hours = false,
    inline = false,
    className,
    style,
    locale = "en",
    open: openProp,
    defaultOpen = true,
    onOpenChange,
    anchorEl,
    popover = false,
  } = props;

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const initial = parseValue(value ?? defaultValue ?? dayjs(), format) ?? dayjs();

  const [draft, setDraft] = useState<Dayjs>(initial);
  const [viewMonth, setViewMonth] = useState<Dayjs>(initial.startOf("month"));
  const [tab, setTab] = useState<"date" | "time">(
    mode === "time" ? "time" : "date"
  );
  const [showHours, setShowHours] = useState(false);
  const [showMinutes, setShowMinutes] = useState(false);
  const [showSeconds, setShowSeconds] = useState(false);
  const [showAmPm, setShowAmPm] = useState(false);
  const [focusedDay, setFocusedDay] = useState<Dayjs>(initial);

  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: inline ? true : defaultOpen,
    onChange: onOpenChange,
  });

  useEffect(() => {
    const parsed = parseValue(value ?? null, format);
    if (parsed) {
      setDraft(parsed);
      setViewMonth(parsed.startOf("month"));
      setFocusedDay(parsed);
    }
  }, [value, format]);

  useEffect(() => {
    setTab(mode === "time" ? "time" : "date");
  }, [mode]);

  const close = useCallback(() => {
    if (!inline) {
      setOpen(false);
    }
  }, [inline, setOpen]);

  const confirm = useCallback(() => {
    onChange?.(formatValue(draft, format));
    close();
  }, [close, draft, format, onChange]);

  const clearAndClose = useCallback(() => {
    onChange?.(null);
    close();
  }, [close, onChange]);

  useOnEscape(close, open && !inline);
  useFocusTrap(dialogRef, open && !inline);

  const position = usePopoverPosition(anchorEl, open && !inline, popover);

  const weeks = useMemo(
    () =>
      buildCalendarMonth({
        viewMonth,
        selected: draft,
        minDate,
        maxDate,
        disablePastDates,
        disableFutureDates,
        weekStartsOn,
      }),
    [
      viewMonth,
      draft,
      minDate,
      maxDate,
      disablePastDates,
      disableFutureDates,
      weekStartsOn,
    ]
  );

  const weekdayLabels = useMemo(
    () => getWeekdayLabels(locale, weekStartsOn),
    [locale, weekStartsOn]
  );

  const selectDay = useCallback(
    (day: Dayjs) => {
      setDraft((prev) =>
        prev
          .year(day.year())
          .month(day.month())
          .date(day.date())
      );
      setFocusedDay(day);
    },
    []
  );

  const setHour = useCallback(
    (hourValue: number) => {
      setDraft((prev) => prev.hour(hourValue));
    },
    []
  );

  const setMinute = useCallback((minute: number) => {
    setDraft((prev) => prev.minute(minute));
  }, []);

  const setSecond = useCallback((second: number) => {
    setDraft((prev) => prev.second(second));
  }, []);

  const onGridKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    let next = focusedDay;
    switch (event.key) {
      case "ArrowLeft":
        next = focusedDay.subtract(1, "day");
        break;
      case "ArrowRight":
        next = focusedDay.add(1, "day");
        break;
      case "ArrowUp":
        next = focusedDay.subtract(7, "day");
        break;
      case "ArrowDown":
        next = focusedDay.add(7, "day");
        break;
      case "Home":
        next = focusedDay.startOf("week");
        break;
      case "End":
        next = focusedDay.endOf("week");
        break;
      case "PageUp":
        next = focusedDay.subtract(1, "month");
        setViewMonth(next.startOf("month"));
        break;
      case "PageDown":
        next = focusedDay.add(1, "month");
        setViewMonth(next.startOf("month"));
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const cell = weeks
          .flat()
          .find((d) => d.date.isSame(focusedDay, "day"));
        if (cell && !cell.isDisabled && cell.isCurrentMonth) {
          selectDay(cell.date);
        }
        return;
      }
      default:
        return;
    }
    event.preventDefault();
    setFocusedDay(next);
    if (!next.isSame(viewMonth, "month")) {
      setViewMonth(next.startOf("month"));
    }
  };

  const hour24 = draft.hour();
  const { hour: hour12, isAm } = to12Hour(hour24);
  const hourOptions = use12Hours ? HOURS_12 : HOURS_24;
  const displayHour = use12Hours ? padDisplay(hour12) : padDisplay(hour24);

  const onBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      close();
    }
  };

  if (!open && !inline) {
    return null;
  }

  const pickerStyle =
    popover && !inline
      ? {
          ...style,
          position: "absolute" as const,
          top: position?.top ?? 80,
          left: position?.left ?? 16,
        }
      : style;

  const picker = (
    <div
      ref={dialogRef}
      className={cx("ctp-calendar-time-picker", className)}
      style={pickerStyle}
      role={inline ? undefined : "dialog"}
      aria-modal={inline ? undefined : true}
      aria-labelledby={titleId}
    >
      <div className="ctp-header">
        <div className="ctp-button-container" role="tablist" aria-label="Picker mode">
          {mode !== "time" && (
            <button
              type="button"
              role="tab"
              aria-selected={tab === "date"}
              className={cx("ctp-date", tab === "date" && "ctp-active")}
              onClick={() => setTab("date")}
            >
              Date
            </button>
          )}
          {mode !== "date" && (
            <button
              type="button"
              role="tab"
              aria-selected={tab === "time"}
              className={cx("ctp-time", tab === "time" && "ctp-active")}
              onClick={() => setTab("time")}
            >
              Time
            </button>
          )}
        </div>
      </div>

      {tab === "date" && mode !== "time" ? (
        <div className="ctp-body ctp-body-calendar-date">
          <div className="ctp-month-year">
            <button
              type="button"
              className="ctp-prev-month"
              aria-label="Previous month"
              onClick={() => setViewMonth((m) => m.subtract(1, "month"))}
            >
              ‹
            </button>
            <span className="ctp-current-month" id={titleId}>
              {viewMonth.format("MMMM YYYY")}
            </span>
            <button
              type="button"
              className="ctp-next-month"
              aria-label="Next month"
              onClick={() => setViewMonth((m) => m.add(1, "month"))}
            >
              ›
            </button>
          </div>
          <div
            className="ctp-main-calendar"
            role="grid"
            aria-label="Choose date"
            tabIndex={0}
            onKeyDown={onGridKeyDown}
          >
            {weekdayLabels.map((label) => (
              <div key={label} className="ctp-box ctp-box-days" role="columnheader">
                {label}
              </div>
            ))}
            {weeks.map((week) =>
              week.map((dayData) => {
                const selected = dayData.isSelected;
                const focused = dayData.date.isSame(focusedDay, "day");
                const disabled =
                  !dayData.isCurrentMonth || dayData.isDisabled;
                return (
                  <button
                    key={dayData.date.format("YYYY-MM-DD")}
                    type="button"
                    role="gridcell"
                    tabIndex={focused ? 0 : -1}
                    aria-selected={selected}
                    aria-disabled={disabled}
                    disabled={disabled}
                    aria-label={dayData.date.format("dddd, MMMM D, YYYY")}
                    className={cx(
                      "ctp-box",
                      "ctp-box-date",
                      !dayData.isCurrentMonth && "not-current-month",
                      selected && "selected",
                      dayData.isDisabled && "disabled-date",
                      dayData.isWeekend && "weekend-day",
                      dayData.isCurrentDate && "ctp-today",
                      dayData.isInRange && "ctp-in-range",
                      dayData.isRangeStart && "ctp-range-start",
                      dayData.isRangeEnd && "ctp-range-end"
                    )}
                    onClick={() => {
                      if (!disabled) {
                        selectDay(dayData.date);
                      }
                    }}
                  >
                    {dayData.date.format("D")}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="ctp-body ctp-body-calendar-time">
          <div className="ctp-main-time">
            <div className="ctp-main-time-header">
              <div className="ctp-box">Hr</div>
              <div className="ctp-box">Min</div>
              <div className="ctp-box">Sec</div>
              {use12Hours && <div className="ctp-box">AM/PM</div>}
            </div>
            <div
              className="ctp-main-time-body"
              style={
                use12Hours
                  ? { gridTemplateColumns: "repeat(4, 30px)", width: "160px" }
                  : undefined
              }
            >
              <TimeColumn
                label="hours"
                open={showHours}
                onToggle={() => setShowHours((v) => !v)}
                display={displayHour}
                options={hourOptions}
                onSelect={(opt) => {
                  if (use12Hours) {
                    setHour(to24Hour(Number(opt), isAm));
                  } else {
                    setHour(Number(opt));
                  }
                  setShowHours(false);
                }}
              />
              <TimeColumn
                label="minutes"
                open={showMinutes}
                onToggle={() => setShowMinutes((v) => !v)}
                display={padDisplay(draft.minute())}
                options={MINUTES}
                onSelect={(opt) => {
                  setMinute(Number(opt));
                  setShowMinutes(false);
                }}
              />
              <TimeColumn
                label="seconds"
                open={showSeconds}
                onToggle={() => setShowSeconds((v) => !v)}
                display={padDisplay(draft.second())}
                options={MINUTES}
                onSelect={(opt) => {
                  setSecond(Number(opt));
                  setShowSeconds(false);
                }}
              />
              {use12Hours && (
                <TimeColumn
                  label="am-pm"
                  open={showAmPm}
                  onToggle={() => setShowAmPm((v) => !v)}
                  display={isAm ? "AM" : "PM"}
                  options={["AM", "PM"]}
                  onSelect={(opt) => {
                    setHour(to24Hour(hour12, opt === "AM"));
                    setShowAmPm(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="ctp-footer">
        <button type="button" className="close-button" onClick={clearAndClose}>
          Clear
        </button>
        <button type="button" className="ctp-cancel" onClick={close}>
          Close
        </button>
        <button type="button" onClick={confirm}>
          OK
        </button>
      </div>
    </div>
  );

  if (inline) {
    return picker;
  }

  if (popover) {
    return createPortal(picker, document.body);
  }

  return createPortal(
    <div
      className="ctp-calendar-time-picker-absolute-container"
      onClick={onBackdropClick}
    >
      {picker}
    </div>,
    document.body
  );
}

function padDisplay(n: number): string {
  return String(n).padStart(2, "0");
}

function TimeColumn(props: {
  label: string;
  open: boolean;
  onToggle: () => void;
  display: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  const listId = useId();
  return (
    <div
      className={cx("ctp-box", "ctp-box-time", !props.open && "not-opened")}
    >
      <button
        type="button"
        className={`ctp-${props.label === "am-pm" ? "am-pm" : props.label.slice(0, -1)} ctp-initial-time`}
        aria-haspopup="listbox"
        aria-expanded={props.open}
        aria-controls={listId}
        aria-label={`Select ${props.label}`}
        onClick={props.onToggle}
      >
        {props.display}
      </button>
      <div
        id={listId}
        role="listbox"
        aria-label={props.label}
        className={cx(
          `ctp-overflow-${props.label}`,
          !props.open && "not-visible"
        )}
      >
        {props.options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="option"
            aria-selected={opt === props.display}
            className={`ctp-${props.label === "am-pm" ? "am-pm" : props.label.slice(0, -1)}`}
            onClick={() => props.onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DateTime;
