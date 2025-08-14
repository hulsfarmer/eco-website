import React from 'react';
import Link from 'next/link';

const FeaturedNews = () => {
  // Sample news data - this would come from your API/CMS in a real app
  const featuredArticles = [
    {
      id: 1,
      title: 'Revolutionary Solar Panel Technology Achieves 40% Efficiency',
      excerpt: 'Scientists at MIT have developed a new type of solar panel that can convert 40% of sunlight into electricity, doubling current efficiency rates.',
      category: 'Technology',
      categoryColor: 'bg-blue-100 text-blue-800',
      readTime: '5 min read',
      publishedAt: '2024-01-15',
      author: 'Dr. Sarah Chen',
      image: '/api/placeholder/600/400',
      trending: true,
    },
    {
      id: 2,
      title: 'Amazon Rainforest Shows Signs of Recovery After Conservation Efforts',
      excerpt: 'New satellite data reveals a 15% decrease in deforestation rates and increased biodiversity in protected areas of the Amazon.',
      category: 'Conservation',
      categoryColor: 'bg-green-100 text-green-800',
      readTime: '7 min read',
      publishedAt: '2024-01-14',
      author: 'Maria Rodriguez',
      image: '/api/placeholder/600/400',
      trending: false,
    },
    {
      id: 3,
      title: 'Ocean Cleanup Project Removes 100,000 Tons of Plastic',
      excerpt: 'The Ocean Cleanup foundation reaches a major milestone, successfully removing plastic waste equivalent to 5 million bottles.',
      category: 'Ocean',
      categoryColor: 'bg-blue-100 text-blue-800',
      readTime: '4 min read',
      publishedAt: '2024-01-13',
      author: 'James Wilson',
      image: '/api/placeholder/600/400',
      trending: true,
    },
    {
      id: 4,
      title: 'European Cities Lead the Way in Carbon Neutrality Goals',
      excerpt: 'Copenhagen, Stockholm, and Amsterdam announce ambitious plans to become carbon neutral by 2025, ahead of EU targets.',
      category: 'Policy',
      categoryColor: 'bg-purple-100 text-purple-800',
      readTime: '6 min read',
      publishedAt: '2024-01-12',
      author: 'Emma Thompson',
      image: '/api/placeholder/600/400',
      trending: false,
    },
  ];

  const quickNews = [
    '🌊 Great Barrier Reef shows unexpected coral growth',
    '⚡ Wind energy now cheaper than coal in 85% of the world',
    '🌱 Vertical farms use 95% less water than traditional farming',
    '🚗 Electric vehicle sales surpass 10 million globally',
    '♻️ New enzyme can break down plastic in hours, not centuries',
  ];

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