import { Inter, Sora } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata = {
  metadataBase: new URL('https://gayaseva.com'),
  title: 'Gaya Seva | Trusted Digital Services Marketplace',
  description: 'Discover verified businesses, trusted professionals, skilled workforce and jobs through one intelligent digital marketplace designed for modern communities.',
  keywords: 'digital marketplace, verified businesses, trusted professionals, local workforce, SaaS platform, business discovery, digital services, jobs, hiring platform',
  authors: [{ name: 'Gaya Seva' }],
  icons: { icon: '/gaya_seva_app_icon.png' },
  openGraph: {
    title: 'Gaya Seva | Trusted Digital Services Marketplace',
    description: 'Discover verified businesses, trusted professionals, skilled workforce and jobs through one intelligent digital marketplace designed for modern communities.',
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
    title: 'Gaya Seva | Trusted Digital Services Marketplace',
    description: 'Discover verified businesses, trusted professionals, skilled workforce and jobs through one intelligent digital marketplace designed for modern communities.',
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Gaya Seva",
    "url": "https://gayaseva.com",
    "logo": "https://gayaseva.com/gaya_seva_app_icon.png",
    "image": "https://gayaseva.com/gaya_seva_app_icon.png",
    "description": "Discover verified businesses, trusted professionals, skilled workforce and jobs through one intelligent digital marketplace designed for modern communities.",
    "telephone": "+919117588242",
    "email": "supportgayaseva@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gaya City",
      "addressLocality": "Gaya",
      "addressRegion": "Bihar",
      "postalCode": "823001",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.instagram.com/gayasevabr02?igsh=MTRyMGZxNHdzZ2V1NA%3D%3D&utm_source=qr",
      "https://www.facebook.com/share/197hhkzBL6/?mibextid=wwXIfr"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.className} ${inter.variable} ${sora.variable} bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
