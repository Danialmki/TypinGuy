import type { Metadata } from 'next';
import { Inter, Nunito, Quicksand, Josefin_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' });

const josefinSans = Josefin_Sans({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-josefin',
});





export const metadata: Metadata = {
  title: 'TypinGuy - Typing Speed Test',
  description: 'Test your typing speed and accuracy with our free typing test.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Delius&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} ${nunito.variable} ${quicksand.variable} ${josefinSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <main className="flex-1">
              {children}
            </main>

          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
