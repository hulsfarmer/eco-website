'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const FeaturedNews = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [quickNews, setQuickNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load real news data from API
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from articles API
        const response = await fetch('/api/articles?limit=4&featured=true');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          // Use real data if available
          const articles = data.articles.map(article => ({
            id: article.id,
            title: article.title,
            excerpt: article.excerpt || article.content?.substring(0, 200) + '...',
            category: article.category,
            categoryColor: getCategoryColor(article.category),
            readTime: `${article.readTime || 5} min read`,
            publishedAt: new Date(article.publishedAt).toISOString().split('T')[0],
            author: article.author || 'EcoLife Team',
            image: article.imageUrl || '/api/placeholder/600/400',
            trending: article.trending || false,
          }));
          setFeaturedArticles(articles);
          
          // Generate quick news from article titles
          const quick = articles.slice(0, 5).map(article => 
            `${getCategoryEmoji(article.category)} ${article.title.substring(0, 60)}...`
          );
          setQuickNews(quick);
        } else {
          // Fallback to curated recent news if no API data
          await loadFallbackNews();
        }
        
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error.message);
        // Load fallback news on error
        await loadFallbackNews();
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  // Fallback news with recent environmental events
  const loadFallbackNews = async () => {
    const fallbackArticles = [
      {
        id: 1,
        title: 'Global Climate Action Accelerates as 2024 Ends',
        excerpt: 'International cooperation on climate change reaches new heights with breakthrough agreements and record renewable energy deployment worldwide.',
        category: 'Policy',
        categoryColor: 'bg-purple-100 text-purple-800',
        readTime: '6 min read',
        publishedAt: new Date().toISOString().split('T')[0], // Today's date
        author: 'Dr. Sarah Chen',
        image: '/api/placeholder/600/400',
        trending: true,
      },
      {
        id: 2,
        title: 'Solar Power Costs Hit New Record Lows',
        excerpt: 'Latest renewable energy auction results show solar photovoltaic costs have dropped to unprecedented levels, making clean energy more accessible.',
        category: 'Technology',
        categoryColor: 'bg-blue-100 text-blue-800',
        readTime: '4 min read',
        publishedAt: new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0], // Yesterday
        author: 'Marcus Rodriguez',
        image: '/api/placeholder/600/400',
        trending: true,
      },
      {
        id: 3,
        title: 'Ocean Conservation Efforts Show Promising Results',
        excerpt: 'Marine protected areas demonstrate significant biodiversity recovery, offering hope for ocean ecosystem restoration efforts globally.',
        category: 'Conservation',
        categoryColor: 'bg-green-100 text-green-800',
        readTime: '5 min read',
        publishedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0], // 2 days ago
        author: 'Dr. Emily Watson',
        image: '/api/placeholder/600/400',
        trending: false,
      },
      {
        id: 4,
        title: 'Green Technology Innovation Drives Economic Growth',
        excerpt: 'Clean technology sector creates millions of jobs globally while driving down emissions, proving environmental action benefits the economy.',
        category: 'Economics',
        categoryColor: 'bg-yellow-100 text-yellow-800',
        readTime: '7 min read',
        publishedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString().split('T')[0], // 3 days ago
        author: 'Alex Thompson',
        image: '/api/placeholder/600/400',
        trending: false,
      },
    ];

    const fallbackQuick = [
      '🌍 Global climate funding reaches $100B milestone',
      '⚡ Renewable energy becomes cheapest power source',
      '🌊 Ocean cleanup technology removes 50K tons plastic',
      '🌱 Reforestation programs plant 1 billion trees',
      '🚗 Electric vehicle adoption accelerates worldwide',
    ];

    setFeaturedArticles(fallbackArticles);
    setQuickNews(fallbackQuick);
  };

  // Helper function to get category colors
  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Policy': 'bg-purple-100 text-purple-800',
      'Conservation': 'bg-green-100 text-green-800',
      'Climate Science': 'bg-blue-100 text-blue-800',
      'Innovation': 'bg-green-100 text-green-800',
      'Economics': 'bg-yellow-100 text-yellow-800',
      'Ocean': 'bg-blue-100 text-blue-800',
      'Energy': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Helper function to get category emojis
  const getCategoryEmoji = (category) => {
    const emojis = {
      'Technology': '⚡',
      'Policy': '🏛️',
      'Conservation': '🌱',
      'Climate Science': '🧊',
      'Innovation': '💡',
      'Economics': '💰',
      'Ocean': '🌊',
      'Energy': '🔋',
    };
    return emojis[category] || '🌍';
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📰 Featured Environmental News
            </h2>
            <p className="text-xl text-gray-600">Loading the latest environmental updates...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            📰 Featured Environmental News
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest breakthroughs, discoveries, and positive changes 
            happening around the world for our environment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Featured Articles */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <article
                  key={article.id}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 ${
                    index === 0 ? 'md:col-span-2' : ''
                  }`}
                >
                  {/* Article Image */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-4xl">
                        {article.category === 'Technology' ? '⚡' :
                         article.category === 'Conservation' ? '🌳' :
                         article.category === 'Ocean' ? '🌊' : '🏛️'}
                      </span>
                    </div>
                    
                    {/* Trending Badge */}
                    {article.trending && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        🔥 Trending
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${article.categoryColor}`}>
                      {article.category}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${
                      index === 0 ? 'text-xl' : 'text-lg'
                    }`}>
                      <Link href={`/news/${article.id}`} className="hover:text-green-600 transition-colors">
                        {article.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>👤 {article.author}</span>
                        <span>📅 {new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <span>⏱️ {article.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* View All News Button */}
            <div className="text-center mt-8">
              <Link
                href="/news"
                className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                📰 View All News
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Sidebar - Quick News & Newsletter */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick News Updates */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                ⚡ Quick Updates
              </h3>
              <div className="space-y-3">
                {quickNews.map((news, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <div className="text-sm text-gray-700 line-clamp-2">
                      {news}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-3">
                📧 Daily Green News
              </h3>
              <p className="text-green-100 text-sm mb-4">
                Get the most important environmental news delivered to your inbox every morning.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button className="w-full px-4 py-2 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                  Subscribe Free
                </button>
              </div>
              <div className="text-xs text-green-200 mt-2">
                📊 Join 500,000+ subscribers
              </div>
            </div>

            {/* Environmental Tip */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                💡 Daily Eco Tip
              </h3>
              <div className="text-blue-800 text-sm">
                <strong>Reduce phantom energy:</strong> Unplug electronics when not in use. 
                Devices in standby mode consume up to 10% of your home's electricity!
              </div>
              <div className="mt-3">
                <Link
                  href="/tips"
                  className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors"
                >
                  More eco tips →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;