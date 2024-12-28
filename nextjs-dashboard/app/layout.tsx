import '@/app/components/ui/global.css';
import { inter } from '@/app/components/ui/fonts';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth/auth';

export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

export default RootLayout;
