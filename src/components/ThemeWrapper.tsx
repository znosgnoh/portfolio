'use client';

import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from '@/styles';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
