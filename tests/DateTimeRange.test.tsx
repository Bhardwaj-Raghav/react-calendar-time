import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateTimeRange } from "../src/DateTimeRange";
import { dayjs } from "../src/utils/date";

describe("DateTimeRange", () => {
  it("selects a start and end date then confirms", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateTimeRange
        inline
        defaultValue={{
          start: dayjs("2024-07-10"),
          end: null,
        }}
        onChange={onChange}
      />
    );

    // With start already set, one click chooses the end date
    const day20 = screen.getByRole("gridcell", {
      name: /July 20, 2024/i,
    });
    await user.click(day20);

    const ok = screen.getByRole("button", { name: /OK/i });
    expect(ok).not.toBeDisabled();
    await user.click(ok);

    expect(onChange).toHaveBeenCalledWith({
      start: "2024-07-10",
      end: "2024-07-20",
    });
  });
});
