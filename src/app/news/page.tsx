import Layout from '@/components/Layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Environmental News | EcoLife - Latest Green News & Updates',
  description: 'Stay updated with the latest environmental news, climate change updates, and sustainability breakthroughs from around the world.',
  keywords: 'environmental news, climate change news, sustainability news, green technology, renewable energy news',
  openGraph: {
    title: 'Environmental News | EcoLife',
    description: 'Latest environmental news and climate updates',
    url: 'https://ecolife.com/news',
  },
  alternates: {
    canonical: 'https://ecolife.com/news',
  },
};

const NewsPage = () => {
  const categories = [
    { name: 'All News', slug: 'all', active: true },
    { name: 'Climate Change', slug: 'climate', active: false },
    { name: 'Renewable Energy', slug: 'energy', active: false },
    { name: 'Conservation', slug: 'conservation', active: false },
    { name: 'Technology', slug: 'technology', active: false },
    { name: 'Policy', slug: 'policy', active: false },
  ];

  const newsArticles = [
    {
      id: 1,
      title: 'Breakthrough in Carbon Capture Technology Could Transform Climate Fight',
      excerpt: 'New direct air capture system removes CO2 at unprecedented efficiency rates, offering hope for large-scale climate solutions.',
      category: 'Technology',
      categoryColor: 'bg-blue-100 text-blue-800',
      author: 'Dr. Emily Chen',
      publishedAt: '2024-01-15',
      readTime: '6 min read',
      featured: true,
      trending: true,
    },
    {
      id: 2,
      title: 'Global Renewable Energy Capacity Reaches Record High in 2024',
      excerpt: 'Solar and wind installations exceeded all projections, with renewable energy now accounting for 35% of global electricity generation.',
      category: 'Energy',
      categoryColor: 'bg-yellow-100 text-yellow-800',
      author: 'Sarah Johnson',
      publishedAt: '2024-01-14',
      readTime: '4 min read',
      featured: true,
      trending: false,
    },
    {
      id: 3,
      title: 'Amazon Deforestation Drops to Lowest Level in 15 Years',
      excerpt: 'Conservation efforts and policy changes lead to dramatic reduction in rainforest destruction, offering hope for biodiversity.',
      category: 'Conservation',
      categoryColor: 'bg-green-100 text-green-800',
      author: 'Carlos Rodriguez',
      publishedAt: '2024-01-13',
      readTime: '5 min read',
      featured: false,
      trending: true,
    },
    {
      id: 4,
      title: 'EU Approves Ambitious Green Deal 2.0 Climate Package',
      excerpt: 'European Union announces comprehensive legislation targeting net-zero emissions by 2035, five years ahead of schedule.',
      category: 'Policy',
      categoryColor: 'bg-purple-100 text-purple-800',
      author: 'Maria Andersson',
      publishedAt: '2024-01-12',
      readTime: '7 min read',
      featured: false,
      trending: false,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">📰 Environmental News</h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Stay informed with the latest environmental developments, climate science, 
                and sustainability breakthroughs from around the globe.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    category.active
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Articles */}
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {newsArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${article.categoryColor}`}>
                            {article.category}
                          </span>
                          <div className="flex items-center space-x-2">
                            {article.trending && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                                🔥 Trending
                              </span>
                            )}
                            {article.featured && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors cursor-pointer">
                          {article.title}
                        </h2>

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

                {/* Load More */}
                <div className="text-center mt-12">
                  <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                    Load More Articles
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Newsletter */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-3">📧 Daily Newsletter</h3>
                  <p className="text-green-100 text-sm mb-4">
                    Get the most important environmental news in your inbox every morning.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <button className="w-full px-4 py-2 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🔥 Trending Now</h3>
                  <div className="space-y-3">
                    {['Climate Summit 2024', 'Solar Energy Breakthrough', 'Ocean Cleanup Progress', 'Green Investment Surge'].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{topic}</span>
                        <span className="text-green-600 font-semibold">#{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">📊 Today's Impact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800">Articles Published</span>
                      <span className="font-bold text-blue-900">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800">Readers Reached</span>
                      <span className="font-bold text-blue-900">2.4M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800">Actions Inspired</span>
                      <span className="font-bold text-blue-900">15.7K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default NewsPage;