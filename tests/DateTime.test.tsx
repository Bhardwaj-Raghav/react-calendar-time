import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateTime } from "../src/DateTime";
import { DateTimeInput } from "../src/DateTimeInput";
import { dayjs } from "../src/utils/date";

describe("DateTime", () => {
  it("calls onChange with formatted value on OK", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateTime
        inline
        defaultValue={dayjs("2024-07-15 10:00:00")}
        onChange={onChange}
        mode="date"
      />
    );

    await user.click(screen.getByRole("button", { name: /OK/i }));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0]![0]).toMatch(/^2024-07-15/);
  });

  it("selects a day and highlights by full date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateTime
        inline
        defaultValue={dayjs("2024-07-10 12:00:00")}
        onChange={onChange}
        mode="date"
      />
    );

    const day15 = screen.getByRole("gridcell", {
      name: /July 15, 2024/i,
    });
    await user.click(day15);
    expect(day15).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("button", { name: /OK/i }));
    expect(onChange.mock.calls[0]![0]).toContain("2024-07-15");
  });

  it("closes without clearing when Close is pressed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <DateTime
        open
        onOpenChange={onOpenChange}
        defaultValue={dayjs("2024-07-10 12:00:00")}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /^Close$/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clears value when Clear is pressed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateTime
        inline
        defaultValue={dayjs("2024-07-10 12:00:00")}
        onChange={onChange}
      />
    );
    await user.click(screen.getByRole("button", { name: /Clear/i }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("supports keyboard navigation on the grid", async () => {
    const user = userEvent.setup();
    render(
      <DateTime
        inline
        defaultValue={dayjs("2024-07-10 12:00:00")}
        mode="date"
      />
    );
    const grid = screen.getByRole("grid");
    grid.focus();
    await user.keyboard("{ArrowRight}");
    const focused = within(grid).getByRole("gridcell", { name: /July 11, 2024/i });
    expect(focused).toHaveAttribute("tabindex", "0");
  });
});

describe("DateTimeInput", () => {
  it("opens popover and updates controlled value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateTimeInput
        value="2024-07-10 12:00:00"
        onChange={onChange}
        mode="date"
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("2024-07-10 12:00:00");
    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
  });
});
