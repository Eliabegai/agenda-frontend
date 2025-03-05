import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Toaster } from '@/components/ui/sonner';
import { ContextProvider } from '@/components/hooks/PageContext';

config.autoAddCss = false;

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Agenda',
  description: 'Agenda Grupo Save',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ContextProvider>
            <main>{children}</main>
            <Toaster />
          </ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
