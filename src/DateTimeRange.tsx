import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { buildCalendarMonth } from "./calendar";
import { useFocusTrap, useOnEscape } from "./hooks/useA11y";
import { useControllableState } from "./hooks/useControllableState";
import type { DateRangeValue, DateTimeRangeProps } from "./types";
import {
  DATE_FORMAT,
  dayjs,
  formatValue,
  getWeekdayLabels,
  parseValue,
  type Dayjs,
} from "./utils/date";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function DateTimeRange(props: DateTimeRangeProps) {
  const {
    value,
    defaultValue = null,
    onChange,
    format = DATE_FORMAT,
    minDate,
    maxDate,
    disablePastDates = false,
    disableFutureDates = false,
    weekStartsOn = 0,
    locale = "en",
    inline = false,
    className,
    open: openProp,
    defaultOpen = true,
    onOpenChange,
  } = props;

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const parseRange = (
    range: { start: unknown; end: unknown } | null | undefined
  ): { start: Dayjs | null; end: Dayjs | null } => ({
    start: parseValue((range?.start as string) ?? null, format),
    end: parseValue((range?.end as string) ?? null, format),
  });

  const initial = parseRange(value ?? defaultValue);
  const [start, setStart] = useState<Dayjs | null>(initial.start);
  const [end, setEnd] = useState<Dayjs | null>(initial.end);
  const [viewMonth, setViewMonth] = useState<Dayjs>(
    (initial.start ?? dayjs()).startOf("month")
  );

  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: inline ? true : defaultOpen,
    onChange: onOpenChange,
  });

  useEffect(() => {
    if (value) {
      const parsed = parseRange(value);
      setStart(parsed.start);
      setEnd(parsed.end);
      if (parsed.start) {
        setViewMonth(parsed.start.startOf("month"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, format]);

  const close = useCallback(() => {
    if (!inline) {
      setOpen(false);
    }
  }, [inline, setOpen]);

  const emit = useCallback(
    (nextStart: Dayjs | null, nextEnd: Dayjs | null) => {
      const payload: DateRangeValue = {
        start: formatValue(nextStart, format),
        end: formatValue(nextEnd, format),
      };
      onChange?.(payload);
    },
    [format, onChange]
  );

  const confirm = useCallback(() => {
    emit(start, end);
    close();
  }, [close, emit, end, start]);

  const clear = useCallback(() => {
    setStart(null);
    setEnd(null);
    emit(null, null);
    close();
  }, [close, emit]);

  useOnEscape(close, open && !inline);
  useFocusTrap(dialogRef, open && !inline);

  const onDayClick = (day: Dayjs) => {
    if (!start || (start && end)) {
      setStart(day);
      setEnd(null);
      return;
    }
    if (day.isBefore(start, "day")) {
      setStart(day);
      setEnd(null);
      return;
    }
    setEnd(day);
  };

  const weeks = useMemo(
    () =>
      buildCalendarMonth({
        viewMonth,
        rangeStart: start,
        rangeEnd: end,
        minDate,
        maxDate,
        disablePastDates,
        disableFutureDates,
        weekStartsOn,
      }),
    [
      viewMonth,
      start,
      end,
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

  if (!open && !inline) {
    return null;
  }

  const picker = (
    <div
      ref={dialogRef}
      className={cx("ctp-calendar-time-picker", className)}
      role={inline ? undefined : "dialog"}
      aria-modal={inline ? undefined : true}
      aria-labelledby={titleId}
    >
      <div className="ctp-header">
        <span id={titleId} className="ctp-range-title">
          {start ? start.format("MMM D, YYYY") : "Start"}
          {" — "}
          {end ? end.format("MMM D, YYYY") : "End"}
        </span>
      </div>
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
          <span className="ctp-current-month">{viewMonth.format("MMMM YYYY")}</span>
          <button
            type="button"
            className="ctp-next-month"
            aria-label="Next month"
            onClick={() => setViewMonth((m) => m.add(1, "month"))}
          >
            ›
          </button>
        </div>
        <div className="ctp-main-calendar" role="grid" aria-label="Choose date range">
          {weekdayLabels.map((label) => (
            <div key={label} className="ctp-box ctp-box-days" role="columnheader">
              {label}
            </div>
          ))}
          {weeks.map((week) =>
            week.map((dayData) => {
              const disabled = !dayData.isCurrentMonth || dayData.isDisabled;
              return (
                <button
                  key={dayData.date.format("YYYY-MM-DD")}
                  type="button"
                  role="gridcell"
                  aria-label={dayData.date.format("dddd, MMMM D, YYYY")}
                  aria-selected={Boolean(dayData.isRangeStart || dayData.isRangeEnd)}
                  disabled={disabled}
                  className={cx(
                    "ctp-box",
                    "ctp-box-date",
                    !dayData.isCurrentMonth && "not-current-month",
                    dayData.isDisabled && "disabled-date",
                    dayData.isWeekend && "weekend-day",
                    dayData.isInRange && "ctp-in-range",
                    dayData.isRangeStart && "ctp-range-start",
                    dayData.isRangeEnd && "ctp-range-end",
                    (dayData.isRangeStart || dayData.isRangeEnd) && "selected"
                  )}
                  onClick={() => {
                    if (!disabled) {
                      onDayClick(dayData.date);
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
      <div className="ctp-footer">
        <button type="button" className="close-button" onClick={clear}>
          Clear
        </button>
        <button type="button" className="ctp-cancel" onClick={close}>
          Close
        </button>
        <button type="button" onClick={confirm} disabled={!start || !end}>
          OK
        </button>
      </div>
    </div>
  );

  if (inline) {
    return picker;
  }

  return createPortal(
    <div
      className="ctp-calendar-time-picker-absolute-container"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
    >
      {picker}
    </div>,
    document.body
  );
}

export default DateTimeRange;
