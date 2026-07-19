import type { Dayjs } from "dayjs";
import type { CSSProperties, ReactNode } from "react";

export type DateTimeMode = "datetime" | "date" | "time";

export type DateTimeValue = Date | string | Dayjs | null;

export interface DateTimeBaseProps {
  /** Controlled value. Accepts Date, dayjs, formatted string, or null. */
  value?: DateTimeValue;
  /** Uncontrolled initial value. */
  defaultValue?: DateTimeValue;
  /** Called when the user confirms a selection (OK) or clears. */
  onChange?: (value: string | null) => void;
  /** dayjs format string. Default: `YYYY-MM-DD HH:mm:ss` */
  format?: string;
  /** Picker mode. Default: `datetime` */
  mode?: DateTimeMode;
  minDate?: DateTimeValue;
  maxDate?: DateTimeValue;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  /** First day of week: 0 = Sunday … 6 = Saturday. Default: 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Use 12-hour clock with AM/PM. Default: false */
  use12Hours?: boolean;
  /** Render inline without overlay. Default: false */
  inline?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Locale code passed to dayjs (e.g. `en`, `fr`). Default: `en` */
  locale?: string;
}

export interface DateTimeProps extends DateTimeBaseProps {
  /** Controlled open state (overlay / popover). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Anchor element for popover positioning (used by DateTimeInput). */
  anchorEl?: HTMLElement | null;
  /** Prefer popover near the trigger instead of a fullscreen overlay. */
  popover?: boolean;
}

export interface DateTimeInputProps extends DateTimeBaseProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  inputClassName?: string;
}

export interface DateRangeValue {
  start: string | null;
  end: string | null;
}

export interface DateTimeRangeProps
  extends Omit<DateTimeBaseProps, "value" | "defaultValue" | "onChange" | "mode"> {
  value?: { start: DateTimeValue; end: DateTimeValue } | null;
  defaultValue?: { start: DateTimeValue; end: DateTimeValue } | null;
  onChange?: (value: DateRangeValue) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

export interface CalendarDay {
  date: Dayjs;
  isCurrentMonth: boolean;
  isCurrentDate: boolean;
  isFuture: boolean;
  isPast: boolean;
  isWeekend: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
}
