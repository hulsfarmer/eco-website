import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { AdSenseAutoAds } from "@/components/GoogleAdSense";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoLife - Your Green Living Guide | Environmental News & Sustainable Tips",
  description: "Discover the latest environmental news, sustainable living tips, and eco-friendly product reviews. Join our community for a greener future.",
  keywords: "environment, sustainability, eco-friendly, green living, climate change, renewable energy, environmental news",
  authors: [{ name: "EcoLife Team" }],
  openGraph: {
    title: "EcoLife - Your Green Living Guide",
    description: "Discover the latest environmental news, sustainable living tips, and eco-friendly product reviews.",
    url: "https://ecolife.com",
    siteName: "EcoLife",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EcoLife - Green Living Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoLife - Your Green Living Guide",
    description: "Discover the latest environmental news, sustainable living tips, and eco-friendly product reviews.",
    images: ["/og-image.jpg"],
    creator: "@ecolife",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        {/* AdSense Auto Ads */}
        <AdSenseAutoAds />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <link rel="canonical" href="https://ecolife.com" />
        
        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "EcoLife",
              "url": "https://ecolife.com",
              "logo": "https://ecolife.com/logo.png",
              "description": "Your trusted source for environmental news, sustainable living tips, and eco-friendly product reviews.",
              "sameAs": [
                "https://twitter.com/ecolife",
                "https://facebook.com/ecolife",
                "https://instagram.com/ecolife"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {children}
        
        {/* Performance monitoring script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Core Web Vitals 모니터링
              function sendToGoogleAnalytics({name, delta, value, id}) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', name, {
                    event_category: 'Web Vitals',
                    event_label: id,
                    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
                    non_interaction: true,
                  });
                }
              }
              
              // Web Vitals 라이브러리가 로드되면 실행
              if (typeof getCLS !== 'undefined') {
                getCLS(sendToGoogleAnalytics);
                getFID(sendToGoogleAnalytics);
                getFCP(sendToGoogleAnalytics);
                getLCP(sendToGoogleAnalytics);
                getTTFB(sendToGoogleAnalytics);
              }
            `
          }}
        />
      </body>
    </html>
  );
}
