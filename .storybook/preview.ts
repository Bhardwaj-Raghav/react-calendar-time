import React from "react";
import type { Preview } from "@storybook/react-vite";
import "../src/styles/datepicker.scss";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "CTP color theme",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as string;
      return React.createElement(
        "div",
        {
          "data-ctp-theme": theme === "dark" ? "dark" : undefined,
          style:
            theme === "dark"
              ? { padding: 24, background: "#111827", borderRadius: 12 }
              : undefined,
        },
        React.createElement(Story)
      );
    },
  ],
};

export default preview;
