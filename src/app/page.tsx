import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import FeaturedNews from '@/components/FeaturedNews';
import EcoStats from '@/components/EcoStats';
import TrendingTopics from '@/components/TrendingTopics';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EcoLife - Your Green Living Guide | Environmental News & Sustainable Tips',
  description: 'Discover the latest environmental news, sustainable living tips, and eco-friendly product reviews. Join millions in building a greener future with EcoLife.',
  keywords: 'environment, sustainability, green living, eco-friendly, climate change, renewable energy',
  authors: [{ name: 'EcoLife Team' }],
  creator: 'EcoLife',
  publisher: 'EcoLife',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'EcoLife - Your Green Living Guide',
    description: 'Discover sustainable living tips and environmental news for a greener future.',
    url: 'https://ecolife.com',
    siteName: 'EcoLife',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EcoLife - Green Living Guide',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoLife - Your Green Living Guide',
    description: 'Discover sustainable living tips and environmental news for a greener future.',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://ecolife.com',
  },
};

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Environmental Statistics */}
      <EcoStats />
      
      {/* Featured News */}
      <FeaturedNews />
      
      {/* Trending Topics */}
      <TrendingTopics />
    </Layout>
  );
}
