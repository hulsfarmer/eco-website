import React from 'react';
import Link from 'next/link';

const TrendingTopics = () => {
  const trendingTopics = [
    {
      id: 1,
      title: 'Climate Change',
      description: 'Latest research and solutions',
      posts: 234,
      growth: '+12%',
      color: 'bg-red-500',
      emoji: '🌡️',
    },
    {
      id: 2,
      title: 'Renewable Energy',
      description: 'Solar, wind, and green tech',
      posts: 189,
      growth: '+8%',
      color: 'bg-yellow-500',
      emoji: '⚡',
    },
    {
      id: 3,
      title: 'Ocean Conservation',
      description: 'Marine life protection efforts',
      posts: 156,
      growth: '+15%',
      color: 'bg-blue-500',
      emoji: '🌊',
    },
    {
      id: 4,
      title: 'Sustainable Living',
      description: 'Eco-friendly lifestyle tips',
      posts: 298,
      growth: '+6%',
      color: 'bg-green-500',
      emoji: '🌱',
    },
    {
      id: 5,
      title: 'Wildlife Protection',
      description: 'Endangered species conservation',
      posts: 142,
      growth: '+18%',
      color: 'bg-orange-500',
      emoji: '🦁',
    },
    {
      id: 6,
      title: 'Recycling & Waste',
      description: 'Zero waste and circular economy',
      posts: 178,
      growth: '+9%',
      color: 'bg-purple-500',
      emoji: '♻️',
    },
  ];

  const popularSearches = [
    'Carbon footprint calculator',
    'Best eco-friendly products 2024',
    'How to reduce plastic waste',
    'Renewable energy for homes',
    'Sustainable fashion brands',
    'Electric vehicle reviews',
    'Organic gardening tips',
    'Climate change solutions',
  ];

  const recentDiscussions = [
    {
      title: 'Should nuclear energy be considered green?',
      replies: 89,
      lastActivity: '2 hours ago',
      category: 'Energy',
    },
    {
      title: 'Best practices for composting in apartments',
      replies: 45,
      lastActivity: '4 hours ago',
      category: 'Lifestyle',
    },
    {
      title: 'Impact of fast fashion on environment',
      replies: 76,
      lastActivity: '6 hours ago',
      category: 'Fashion',
    },
    {
      title: 'Affordable solar panel installation guide',
      replies: 123,
      lastActivity: '8 hours ago',
      category: 'Technology',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🔥 Trending Environmental Topics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what the eco-community is talking about and join the conversation 
            on the most important environmental issues today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Topics Grid */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                📈 Most Discussed Topics
              </h3>
              <Link
                href="/topics"
                className="text-green-600 hover:text-green-700 font-semibold text-sm"
              >
                View All Topics →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${topic.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {topic.emoji}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                          {topic.title}
                        </h4>
                        <p className="text-sm text-gray-500">{topic.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      📝 {topic.posts} posts this week
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-semibold text-sm">
                        {topic.growth}
                      </span>
                      <span className="text-green-500">📈</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="text-green-600 font-semibold text-sm hover:text-green-700 transition-colors">
                      Join Discussion →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Searches */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                🔍 Popular Searches
              </h3>
              <div className="space-y-2">
                {popularSearches.map((search, index) => (
                  <Link
                    key={index}
                    href={`/search?q=${encodeURIComponent(search)}`}
                    className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-2 px-3 rounded-lg hover:bg-green-50"
                  >
                    {index + 1}. {search}
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Discussions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                💬 Recent Discussions
              </h3>
              <div className="space-y-4">
                {recentDiscussions.map((discussion, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
                    <Link
                      href={`/discussions/${index + 1}`}
                      className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                        {discussion.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span>💬 {discussion.replies}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            {discussion.category}
                          </span>
                        </div>
                        <span>{discussion.lastActivity}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/discussions"
                  className="text-green-600 font-semibold text-sm hover:text-green-700 transition-colors"
                >
                  View All Discussions →
                </Link>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">
                👥 Community Impact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-100">Active Members</span>
                  <span className="font-bold">2.4M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-100">Posts This Month</span>
                  <span className="font-bold">45.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-100">CO₂ Saved Together</span>
                  <span className="font-bold">12.8T</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-500">
                <button className="w-full px-4 py-2 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                  🤝 Join Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingTopics;