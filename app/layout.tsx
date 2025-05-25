import Navbar from '@/components/navbar';
import './globals.css';
import Footer from '@/components/footer';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' className='scroll-smooth dark'>
        <body className={`antialiased`}>
          <div className='grid grid-rows-[auto_1fr_auto] mx-auto p-x w-full max-w-6xl min-h-[100dvh]'>
            <Navbar />
            <main>
              {children}
              <Toaster />
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
