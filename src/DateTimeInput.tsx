import { useCallback, useMemo, useState } from "react";
import { DateTime } from "./DateTime";
import { useControllableState } from "./hooks/useControllableState";
import type { DateTimeInputProps } from "./types";
import {
  DEFAULT_FORMAT,
  formatValue,
  parseValue,
} from "./utils/date";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function DateTimeInput(props: DateTimeInputProps) {
  const {
    value,
    defaultValue = null,
    onChange,
    format = DEFAULT_FORMAT,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placeholder = "Select date and time",
    id,
    name,
    disabled = false,
    readOnly = true,
    className,
    inputClassName,
    style,
    "aria-labelledby": ariaLabelledBy,
    "aria-label": ariaLabel,
    ...pickerProps
  } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);

  const controlledFormatted =
    value !== undefined
      ? formatValue(parseValue(value, format), format)
      : undefined;

  const defaultFormatted = useMemo(
    () => formatValue(parseValue(defaultValue, format), format),
    // only seed once from defaultValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [internalValue, setInternalValue] = useControllableState<string | null>({
    value: controlledFormatted,
    defaultValue: defaultFormatted,
    onChange,
  });

  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const display = internalValue ?? "";

  const setInputRef = useCallback((node: HTMLInputElement | null) => {
    setAnchorEl(node);
  }, []);

  return (
    <div className={cx("ctp-input-root", className)} style={style}>
      <input
        ref={setInputRef}
        id={id}
        name={name}
        className={cx("ctp-input", inputClassName)}
        value={display}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel ?? placeholder}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
        onKeyDown={(event) => {
          if (disabled) {
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      />
      <DateTime
        {...pickerProps}
        format={format}
        value={internalValue}
        open={open}
        onOpenChange={setOpen}
        popover
        anchorEl={anchorEl}
        onChange={(next) => {
          setInternalValue(next);
        }}
      />
    </div>
  );
}

export default DateTimeInput;
