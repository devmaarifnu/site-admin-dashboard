import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LP Ma\'arif NU - Admin Portal',
  description: 'Admin Portal untuk mengelola konten website LP Ma\'arif NU',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right" 
          richColors
          toastOptions={{
            style: {
              background: 'white',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
            },
            className: 'toast-custom',
            success: {
              style: {
                background: '#059669',
                color: 'white',
                border: '1px solid #047857',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#059669',
              },
            },
            error: {
              style: {
                background: '#dc2626',
                color: 'white',
                border: '1px solid #b91c1c',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#dc2626',
              },
            },
            info: {
              style: {
                background: '#2563eb',
                color: 'white',
                border: '1px solid #1d4ed8',
              },
            },
            warning: {
              style: {
                background: '#f59e0b',
                color: 'white',
                border: '1px solid #d97706',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
