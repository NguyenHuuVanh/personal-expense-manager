import type { Metadata } from 'next';
import '@/styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/shadcn-ui/sonner';
import { AgentationWrapper } from '@/components/agentation-wrapper';
import { ReactQueryProvider } from '@/lib/react-query';

export const metadata: Metadata = {
  title: 'Expense Manager - Quản lý tài chính thông minh',
  description: 'Ứng dụng quản lý chi tiêu và tài chính cá nhân',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-montserrat">
        {/* TanStack Query Provider — bao ngoài để cache shared toàn app */}
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
        <Toaster position="top-right" richColors closeButton />
        <AgentationWrapper />
      </body>
    </html>
  );
}
