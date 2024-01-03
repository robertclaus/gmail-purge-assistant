import './globals.css';

import Nav from './nav';
import { Suspense } from 'react';
import Footer from './footer';

export const metadata = {
  title: 'Email Purge Assistant',
  description:
    'A tool for finding emails to purge from your email to save space.',
    openGraph: {
      title: 'Email Purge Assistant',
      description: 'A tool for finding emails to purge from your email to save space.',
      images: ['/icon.ico'],
    },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <Suspense>
          <Nav />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
