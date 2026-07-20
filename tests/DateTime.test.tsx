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
    const focused = within(grid).getByRole("gridcell", {
      name: /July 11, 2024/i,
    });
    expect(focused).toHaveAttribute("tabindex", "0");
  });

  it("Home/End honor weekStartsOn", async () => {
    const user = userEvent.setup();
    render(
      <DateTime
        inline
        defaultValue={dayjs("2024-07-10 12:00:00")}
        mode="date"
        weekStartsOn={1}
      />
    );
    const grid = screen.getByRole("grid");
    grid.focus();
    await user.keyboard("{Home}");
    // July 10 2024 is Wednesday; week starting Monday => July 8
    expect(
      within(grid).getByRole("gridcell", { name: /July 8, 2024/i })
    ).toHaveAttribute("tabindex", "0");

    await user.keyboard("{End}");
    expect(
      within(grid).getByRole("gridcell", { name: /July 14, 2024/i })
    ).toHaveAttribute("tabindex", "0");
  });

  it("confirms 12-hour AM/PM selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateTime
        inline
        defaultValue={dayjs("2024-07-10 09:30:00")}
        onChange={onChange}
        mode="time"
        use12Hours
        format="YYYY-MM-DD hh:mm:ss A"
      />
    );

    await user.click(screen.getByRole("button", { name: /Select am-pm/i }));
    await user.click(screen.getByRole("option", { name: "PM" }));
    await user.click(screen.getByRole("button", { name: /OK/i }));

    expect(onChange.mock.calls[0]![0]).toMatch(/PM$/i);
    expect(onChange.mock.calls[0]![0]).toContain("09:30:00");
  });

  it("uses custom labels", () => {
    render(
      <DateTime
        inline
        mode="date"
        defaultValue={dayjs("2024-07-10")}
        labels={{ ok: "Confirm", clear: "Wipe", close: "Dismiss" }}
      />
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Wipe" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("shows date and time together by default without mode tabs", () => {
    render(
      <DateTime
        inline
        mode="datetime"
        defaultValue={dayjs("2024-07-10 12:00:00")}
      />
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Select hours/i })).toBeInTheDocument();
  });

  it("shows Date/Time tabs when layout is tabs", () => {
    render(
      <DateTime
        inline
        mode="datetime"
        layout="tabs"
        defaultValue={dayjs("2024-07-10 12:00:00")}
      />
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Date/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Time/i })).toBeInTheDocument();
  });

  it("hides mode tabs for date-only and time-only", () => {
    const { rerender } = render(
      <DateTime inline mode="date" defaultValue={dayjs("2024-07-10")} />
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();

    rerender(
      <DateTime inline mode="time" defaultValue={dayjs("2024-07-10 12:00:00")} />
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
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

  it("closes popover on outside click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <div>
        <button type="button">Outside</button>
        <DateTimeInput
          defaultOpen
          onOpenChange={onOpenChange}
          value="2024-07-10 12:00:00"
          mode="date"
        />
      </div>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
