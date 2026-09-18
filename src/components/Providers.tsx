"use client";

import {
  ThemeProvider,
  DataThemeProvider,
  ToastProvider,
  IconProvider,
  LayoutProvider,
} from "@once-ui-system/core";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <ThemeProvider>
        <DataThemeProvider>
          <ToastProvider>
            <IconProvider>{children}</IconProvider>
          </ToastProvider>
        </DataThemeProvider>
      </ThemeProvider>
    </LayoutProvider>
  );
}
