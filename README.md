[![npm](https://img.shields.io/npm/v/react-calendar-time.svg)](https://www.npmjs.com/package/react-calendar-time)
[![CI](https://github.com/Bhardwaj-Raghav/react-calendar-time/actions/workflows/ci.yml/badge.svg)](https://github.com/Bhardwaj-Raghav/react-calendar-time/actions/workflows/ci.yml)

# react-calendar-time

Accessible React date and time picker with TypeScript types, controlled/uncontrolled APIs, and CSS variable theming.

## Install

```bash
npm install react-calendar-time
```

```bash
yarn add react-calendar-time
```

Peer dependencies: `react` and `react-dom` (≥ 17).

## Screenshots

| Date | Time |
|------|------|
| ![Date picker](examples/date.png) | ![Time picker](examples/time.png) |

| Range | Input |
|-------|-------|
| ![Date range picker](examples/range.png) | ![DateTime input](examples/input.png) |

## Quick start

```tsx
import { useState } from "react";
import DateTime, { DateTimeInput } from "react-calendar-time";
import "react-calendar-time/style.css";

function App() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <>
      <DateTimeInput value={value} onChange={setValue} />
      <DateTime inline value={value} onChange={setValue} />
    </>
  );
}
```

## Components

| Export | Description |
|--------|-------------|
| `DateTime` | Overlay or inline picker |
| `DateTime.Input` / `DateTimeInput` | Read-only input that opens a popover picker |
| `DateTime.Range` / `DateTimeRange` | Date range selection |

## Props

### Shared (`DateTime` / `DateTimeInput`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| string \| Dayjs \| null` | — | Controlled value |
| `defaultValue` | same | — | Uncontrolled initial value |
| `onChange` | `(value: string \| null) => void` | — | Fired on OK / Clear |
| `format` | `string` | `YYYY-MM-DD HH:mm:ss` | dayjs format |
| `mode` | `"datetime" \| "date" \| "time"` | `"datetime"` | Picker mode |
| `layout` | `"combined" \| "tabs"` | `"combined"` | When `mode="datetime"`: show both panels, or Date/Time tabs. Hidden for date-only / time-only |
| `minDate` / `maxDate` | date-like | — | Inclusive bounds |
| `disablePastDates` | `boolean` | `false` | Disable days before today |
| `disableFutureDates` | `boolean` | `false` | Disable days after today |
| `weekStartsOn` | `0–6` | `0` | First day of week (0 = Sunday) |
| `use12Hours` | `boolean` | `false` | 12-hour clock with AM/PM |
| `locale` | `string` | `"en"` | dayjs locale (import locale first) |
| `labels` | `DateTimeLabels` | English defaults | Override chrome strings |
| `theme` | `"light" \| "dark"` | — | Force theme (useful for portaled popovers) |
| `inline` | `boolean` | `false` | Render without overlay |
| `className` | `string` | — | Root class |

### Overlay control

| Prop | Type | Description |
|------|------|-------------|
| `open` / `defaultOpen` | `boolean` | Controlled / uncontrolled open state |
| `onOpenChange` | `(open: boolean) => void` | Open state changes |
| `popover` | `boolean` | Position near `anchorEl` instead of fullscreen |
| `anchorEl` | `HTMLElement \| null` | Anchor for popover |

`DateTimeInput` always uses popover mode. The popover uses `position: fixed`, flips above the input when needed, repositions on scroll/resize, and closes on outside click or Escape.

### `DateTimeInput` extras

`placeholder`, `id`, `name`, `disabled`, `readOnly`, `aria-label`, `aria-labelledby`, `inputClassName`

### `DateTimeRange`

`onChange` receives `{ start: string | null; end: string | null }`. Supports keyboard grid navigation, hover range preview, and the same `locale` / `weekStartsOn` / `labels` props.

### Labels

```tsx
<DateTime
  inline
  labels={{ ok: "Confirm", clear: "Wipe", close: "Dismiss", date: "Jour" }}
/>
```

### Layout

By default (`layout="combined"`), datetime mode shows the calendar and time controls together — no Date/Time badges. Use `layout="tabs"` for the classic switcher. When `mode` is `"date"` or `"time"`, the badges are never shown.

```tsx
{/* Default: both panels */}
<DateTime inline mode="datetime" onChange={setValue} />

{/* Classic tabs */}
<DateTime inline mode="datetime" layout="tabs" onChange={setValue} />

{/* Date only — no badges */}
<DateTime inline mode="date" onChange={setValue} />
```

## 12-hour clock

`use12Hours` only changes the time UI. Pair it with a 12-hour `format` so the input/value match what users see:

```tsx
<DateTimeInput
  use12Hours
  format="YYYY-MM-DD hh:mm:ss A"
  value={value}
  onChange={setValue}
/>
```

## Theming

Override CSS variables (light defaults shown):

```css
:root {
  --ctp-primary: #7cb342;
  --ctp-primary-dark: #558b2f;
  --ctp-surface: #ffffff;
  --ctp-fg: #1f2937;
  --ctp-border: #e5e7eb;
  --ctp-focus: #7cb342;
  --ctp-danger: #dc2626;
  --ctp-z-index: 1000;
}
```

### Dark theme

Wrap the picker (or a parent) with `data-ctp-theme="dark"`:

```tsx
<div data-ctp-theme="dark">
  <DateTime inline mode="time" onChange={setValue} />
  <DateTimeInput mode="time" onChange={setValue} />
</div>
```

Inline pickers inherit theme from the wrapper. Portaled popovers/overlays copy `data-ctp-theme` from the input’s ancestors (or accept an explicit `theme="dark"` prop) so time and datetime popovers stay dark too.

Focusable controls use `:focus-visible` rings via `--ctp-focus`. Open animation respects `prefers-reduced-motion`.

## Locales

Locales are applied per instance (no global dayjs locale mutation). Import the dayjs locale module before use:

```tsx
import "dayjs/locale/fr";
import { DateTime } from "react-calendar-time";

<DateTime locale="fr" weekStartsOn={1} inline onChange={console.log} />
```

## Development

```bash
npm install
npm test             # unit tests (Vitest)
npm run test:watch   # watch mode
npm run dev          # interactive playground (localhost:5173)
npm run website      # Astro landing (SSG) at localhost:5174
npm run storybook    # Storybook (localhost:6006)
npm run build
npm run website:build  # Astro static build → site-dist/
npm run screenshots    # refresh examples/*.png for the README
```

Set `SITE_URL` when building for production if your domain differs from the default:

```bash
# PowerShell
$env:SITE_URL="https://your-domain.com"; npm run website:build
```

Astro reads `SITE_URL` in [`website/astro.config.mjs`](website/astro.config.mjs) for canonical URLs and the sitemap.

## License

MIT
