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
  title: 'Gaya Seva - Premium Local Services in Gaya, Gayaji & Bihar',
  description: 'Find the best local shops, restaurants, repair services, hotels, and daily laborers in Gaya, Gayaji, Bodh Gaya, and all areas across the Gaya district, Bihar. Explore the most trusted local digital directory.',
  keywords: 'Gaya, Gayaji, Bihar, Gaya district, Gaya local services, Bodh Gaya services, Gaya shops, Gaya restaurants, repair services Gaya, hotels in Gaya, daily wage workers Gaya, local workforce Bihar, Gaya Seva, Gaya city portal, Gaya marketplace, famous places in Gaya, malls in Gaya, waterparks in Gaya, Gaya tourist places',
  authors: [{ name: 'Gaya Seva' }],
  icons: { icon: '/gaya_seva_app_icon.png' },
  openGraph: {
    title: 'Gaya Seva - Premium Local Services in Gaya, Bihar',
    description: 'Find the best local shops, restaurants, repair services, hotels, and daily laborers in Gaya, Gayaji, Bodh Gaya, and all areas across the Gaya district.',
    url: 'https://gayaseva.com',
    siteName: 'Gaya Seva',
    images: [
      {
        url: '/gaya_seva_app_icon.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaya Seva - Premium Local Services in Gaya, Bihar',
    description: 'Find the best local shops, restaurants, repair services, and hotels in Gaya district.',
    images: ['/gaya_seva_app_icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://gayaseva.com',
  },
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
          <main className="min-h-screen">
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
