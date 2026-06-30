import type React from "react"
import type { Metadata } from "next"
import type { Viewport } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { LegalFooter } from "@/components/legal-footer"
import { siteContent } from "@/lib/site-content"

export const metadata: Metadata = {
  title: {
    default: `${siteContent.brand.name} | ${siteContent.brand.tagline}`,
    template: `%s | ${siteContent.brand.shortName}`
  },
  description: siteContent.brand.description,
  keywords: ["airline", "travel", "flights", "booking", "dynamic destinations", siteContent.brand.shortName],
  authors: [{ name: siteContent.brand.name }],
  creator: siteContent.brand.name,
  publisher: siteContent.brand.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://example.com"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteContent.brand.name,
    description: siteContent.brand.description,
    url: "https://example.com",
    siteName: siteContent.brand.name,
    locale: "ar_QA",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 180,
        height: 180,
        alt: siteContent.brand.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.brand.name,
    description: siteContent.brand.description,
    images: ["/icon.svg"],
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
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/icon.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Airline",
    "name": siteContent.brand.name,
    "description": siteContent.brand.description,
    "url": "https://example.com",
    "areaServed": {
      "@type": "Country",
      "name": "Qatar"
    },
    "priceRange": "$$",
    "availableLanguage": ["ar", "en"],
    "telephone": siteContent.brand.phone,
    "email": siteContent.brand.email,
    "serviceType": "Flight Booking"
  }

  return (
    <html lang="ar">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <LegalFooter />
        <Toaster />
      </body>
    </html>
  )
}
