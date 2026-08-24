import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'NextTube - Modern Video Sharing & Streaming Platform',
  description: 'NextTube is a modern video sharing platform built with Next.js 15, TypeScript, and Tailwind CSS. Features video playback, category filtering, subscriptions, real-time search, comments, and mobile optimization.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 antialiased min-h-screen transition-colors font-sans selection:bg-red-500 selection:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
