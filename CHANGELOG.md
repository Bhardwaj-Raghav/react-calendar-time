# Changelog

## 1.0.0

Breaking rewrite of the library for production use.

### Packaging
- Ship compiled ESM + CJS + TypeScript declarations via `tsup`
- Publish only `dist/` with a proper `exports` map
- Move `react` / `react-dom` to peer dependencies
- Replace Moment with `dayjs`
- Ship plain CSS (`react-calendar-time/style.css`) — consumers no longer need Sass
- Package renamed from `react-datetime-picker-component` to `react-calendar-time`

### API
- Replace `onClick` with `onChange`
- Add controlled / uncontrolled `value` and `open`
- Replace `onlyDate` / `onlyTime` with `mode: "datetime" | "date" | "time"`
- Replace `notFixedPosition` with `inline`
- Rename `disableFuturedate` / `disablePastdate` → `disableFutureDates` / `disablePastDates`
- Add `minDate`, `maxDate`, `format`, `className`, `weekStartsOn`, `use12Hours`, `locale`
- Add `DateTime.Input` / `DateTimeInput` with popover positioning
- Add `DateTime.Range` / `DateTimeRange` for range selection

### Correctness
- Fix last day of month not selectable
- Fix selection highlight matching day-of-month only
- Fix past/future disable ignoring year
- Remove self-updating `useEffect` on the selected value
- Parse/format dates with dayjs (no unreliable `new Date(string)`)
- Remove duplicate DOM ids, debug `console.log`s, and unstable keys

### Accessibility
- Dialog semantics, Escape / backdrop dismiss, focus trap
- Calendar grid with arrow-key navigation
- Accessible names on controls and day cells

### Tooling
- Vitest + Testing Library
- ESLint + Prettier
- GitHub Actions CI
- Storybook + Vite playground
