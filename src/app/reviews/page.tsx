import Layout from '@/components/Layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eco Product Reviews | EcoLife - Sustainable Product Guide',
  description: 'Honest reviews of eco-friendly products, sustainable brands, and green alternatives to help you make environmentally conscious choices.',
  keywords: 'eco product reviews, sustainable products, green products, eco-friendly brands, environmental product guide',
  openGraph: {
    title: 'Eco Product Reviews | EcoLife',
    description: 'Trusted reviews of eco-friendly and sustainable products',
    url: 'https://ecolife.com/reviews',
  },
  alternates: {
    canonical: 'https://ecolife.com/reviews',
  },
};

const ReviewsPage = () => {
  const categories = [
    { name: 'All Products', slug: 'all', icon: '🌿', active: true },
    { name: 'Home & Garden', slug: 'home', icon: '🏡', active: false },
    { name: 'Personal Care', slug: 'personal', icon: '🧴', active: false },
    { name: 'Fashion', slug: 'fashion', icon: '👔', active: false },
    { name: 'Energy & Tech', slug: 'tech', icon: '⚡', active: false },
    { name: 'Food & Drinks', slug: 'food', icon: '🥗', active: false },
  ];

  const featuredReviews = [
    {
      id: 1,
      name: 'EcoFlow River 2 Pro Portable Power Station',
      brand: 'EcoFlow',
      category: 'Energy & Tech',
      categoryColor: 'bg-blue-100 text-blue-800',
      rating: 4.8,
      price: '$769',
      pros: ['Fast charging', 'Long battery life', 'Multiple output options', 'Solar panel compatible'],
      cons: ['Heavy weight', 'Price point'],
      summary: 'Excellent portable power solution for outdoor enthusiasts and emergency preparedness.',
      image: '🔋',
      sustainability: 95,
      value: 85,
      performance: 92,
      reviewCount: 847,
      featured: true
    },
    {
      id: 2,
      name: 'Bamboo Fiber Dinner Set',
      brand: 'GreenWare',
      category: 'Home & Garden',
      categoryColor: 'bg-green-100 text-green-800',
      rating: 4.6,
      price: '$89',
      pros: ['100% biodegradable', 'Dishwasher safe', 'Lightweight', 'Beautiful design'],
      cons: ['Not microwave safe', 'Limited color options'],
      summary: 'Stylish and sustainable alternative to plastic dinnerware for eco-conscious households.',
      image: '🍽️',
      sustainability: 98,
      value: 92,
      performance: 88,
      reviewCount: 1203,
      featured: true
    },
    {
      id: 3,
      name: 'Organic Cotton Bed Sheets',
      brand: 'PureSleep',
      category: 'Home & Garden',
      categoryColor: 'bg-green-100 text-green-800',
      rating: 4.7,
      price: '$159',
      pros: ['GOTS certified organic', 'Incredibly soft', 'Temperature regulating', 'Durable'],
      cons: ['Higher price point', 'Limited patterns'],
      summary: 'Premium organic cotton sheets that deliver comfort while supporting sustainable farming.',
      image: '🛏️',
      sustainability: 96,
      value: 78,
      performance: 94,
      reviewCount: 592,
      featured: false
    }
  ];

  const quickReviews = [
    { name: 'Reusable Food Wraps', rating: 4.5, price: '$24', sustainability: 94, image: '🍯' },
    { name: 'Solar Garden Lights', rating: 4.3, price: '$45', sustainability: 89, image: '💡' },
    { name: 'Biodegradable Phone Case', rating: 4.2, price: '$29', sustainability: 92, image: '📱' },
    { name: 'Organic Skincare Set', rating: 4.6, price: '$78', sustainability: 96, image: '🧴' },
    { name: 'Bamboo Toothbrush Pack', rating: 4.4, price: '$16', sustainability: 98, image: '🪥' },
    { name: 'Eco-Friendly Cleaning Kit', rating: 4.5, price: '$52', sustainability: 93, image: '🧽' },
  ];

  const topBrands = [
    { name: 'Patagonia', rating: 4.8, category: 'Fashion', sustainability: 96, products: 127 },
    { name: 'Seventh Generation', rating: 4.6, category: 'Home Care', sustainability: 94, products: 89 },
    { name: 'Dr. Bronner\'s', rating: 4.7, category: 'Personal Care', sustainability: 97, products: 45 },
    { name: 'Goal Zero', rating: 4.5, category: 'Energy', sustainability: 91, products: 67 },
  ];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">⭐</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">⭐</span>}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">⭐ Eco Product Reviews</h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Honest, detailed reviews of eco-friendly products to help you make 
                sustainable choices without compromising on quality or performance.
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
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full font-semibold transition-colors ${
                    category.active
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Reviews */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Featured Reviews</h2>
                <div className="space-y-6">
                  {featuredReviews.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Product Image */}
                        <div className="md:col-span-1">
                          <div className="w-full h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-4xl">
                            {product.image}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="md:col-span-3">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                              <p className="text-gray-600">by {product.brand}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">{product.price}</div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.categoryColor}`}>
                                {product.category}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            {renderStars(product.rating)}
                            <span className="text-sm text-gray-500 ml-2">({product.reviewCount} reviews)</span>
                          </div>

                          <p className="text-gray-700 mb-4">{product.summary}</p>

                          {/* Rating Bars */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Sustainability</span>
                                <span className="font-semibold">{product.sustainability}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{width: `${product.sustainability}%`}}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Value</span>
                                <span className="font-semibold">{product.value}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{width: `${product.value}%`}}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Performance</span>
                                <span className="font-semibold">{product.performance}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{width: `${product.performance}%`}}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Pros and Cons */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-green-700 mb-2">✅ Pros</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {product.pros.map((pro, index) => (
                                  <li key={index}>• {pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-red-700 mb-2">❌ Cons</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {product.cons.map((con, index) => (
                                  <li key={index}>• {con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Reviews Grid */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ Quick Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickReviews.map((product, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{product.image}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            {renderStars(product.rating)}
                            <span className="font-bold text-green-600">{product.price}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-2">Sustainability:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-green-500 h-1 rounded-full"
                                style={{width: `${product.sustainability}%`}}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 ml-2">{product.sustainability}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Top Sustainable Brands */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Top Sustainable Brands</h3>
                <div className="space-y-4">
                  {topBrands.map((brand, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{brand.name}</h4>
                        {renderStars(brand.rating)}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{brand.category}</span>
                        <span>{brand.products} products</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 mr-2">Sustainability:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-green-500 h-1 rounded-full"
                            style={{width: `${brand.sustainability}%`}}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 ml-2">{brand.sustainability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Guidelines */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4">📝 Our Review Process</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start space-x-2">
                    <span>🔬</span>
                    <span>Independent testing and analysis</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>🌱</span>
                    <span>Sustainability impact assessment</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>💰</span>
                    <span>Value for money evaluation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span>👥</span>
                    <span>Real user feedback collection</span>
                  </div>
                </div>
              </div>

              {/* Request Review */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">🔍 Request a Review</h3>
                <p className="text-green-100 text-sm mb-4">
                  Want us to review a specific eco-friendly product? Let us know!
                </p>
                <button className="w-full px-4 py-2 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                  Submit Request
                </button>
              </div>

              {/* Newsletter */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📧 Review Alerts</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get notified when we review products in your favorite categories.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewsPage;