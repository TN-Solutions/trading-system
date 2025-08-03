'use client';
import React from 'react';
import { AuthProvider } from '../auth/auth-provider';
import { ActiveThemeProvider } from '../active-theme';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ActiveThemeProvider>
    </>
  );
}
