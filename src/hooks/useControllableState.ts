import { useCallback, useState } from "react";

export function useControllableState<T>(options: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T | ((prev: T) => T)) => void] {
  const { value, defaultValue, onChange } = options;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? (value as T) : uncontrolled;

  const setState = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      if (!isControlled) {
        setUncontrolled(resolved);
      }
      onChange?.(resolved);
    },
    [isControlled, onChange, state]
  );

  return [state, setState];
}
