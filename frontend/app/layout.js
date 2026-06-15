import { Inter, Sora } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata = {
  title: 'Gaya Connect - Your Digital Gateway to Local Services',
  description: 'Find the best local shops, restaurants, repair services, hotels and more in Gaya. Book services online with Gaya Connect.',
  keywords: 'Gaya local services, Gaya shops, Gaya restaurants, repair services Gaya, hotels in Gaya',
  authors: [{ name: 'Gaya Connect' }],
  icons: { icon: '/favicon.ico' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable} ${sora.variable}`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </AuthProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
