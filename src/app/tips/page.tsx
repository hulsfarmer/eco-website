import Layout from '@/components/Layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eco-Friendly Tips | EcoLife - Sustainable Living Guide',
  description: 'Discover practical eco-friendly tips and sustainable living advice to reduce your environmental impact and live greener every day.',
  keywords: 'eco-friendly tips, sustainable living, green lifestyle, environmental tips, sustainability guide',
  openGraph: {
    title: 'Eco-Friendly Tips | EcoLife',
    description: 'Practical sustainable living tips for a greener lifestyle',
    url: 'https://ecolife.com/tips',
  },
  alternates: {
    canonical: 'https://ecolife.com/tips',
  },
};

const TipsPage = () => {
  const tipCategories = [
    { name: 'All Tips', slug: 'all', icon: '🌍', active: true },
    { name: 'Energy Saving', slug: 'energy', icon: '⚡', active: false },
    { name: 'Water Conservation', slug: 'water', icon: '💧', active: false },
    { name: 'Waste Reduction', slug: 'waste', icon: '♻️', active: false },
    { name: 'Transportation', slug: 'transport', icon: '🚲', active: false },
    { name: 'Home & Garden', slug: 'home', icon: '🏡', active: false },
  ];

  const featuredTips = [
    {
      id: 1,
      title: 'Switch to LED Light Bulbs',
      description: 'LED bulbs use 75% less energy and last 25 times longer than incandescent bulbs.',
      category: 'Energy Saving',
      categoryColor: 'bg-yellow-100 text-yellow-800',
      difficulty: 'Easy',
      impact: 'High',
      savings: '$75/year',
      icon: '💡',
      steps: [
        'Replace most frequently used bulbs first',
        'Choose warm white (2700K) for living areas',
        'Look for ENERGY STAR certified bulbs',
        'Dispose of old bulbs properly at recycling centers'
      ]
    },
    {
      id: 2,
      title: 'Start Composting Kitchen Scraps',
      description: 'Reduce household waste by 30% while creating nutrient-rich soil for your garden.',
      category: 'Waste Reduction',
      categoryColor: 'bg-green-100 text-green-800',
      difficulty: 'Medium',
      impact: 'High',
      savings: '$120/year',
      icon: '🥬',
      steps: [
        'Get a compost bin or start a pile in your yard',
        'Add fruit/vegetable scraps, coffee grounds, eggshells',
        'Mix with brown materials like leaves or paper',
        'Turn weekly and keep moist for faster decomposition'
      ]
    },
    {
      id: 3,
      title: 'Install Low-Flow Showerheads',
      description: 'Save up to 2,900 gallons of water per year without sacrificing water pressure.',
      category: 'Water Conservation',
      categoryColor: 'bg-blue-100 text-blue-800',
      difficulty: 'Easy',
      impact: 'Medium',
      savings: '$45/year',
      icon: '🚿',
      steps: [
        'Purchase WaterSense labeled showerhead',
        'Turn off water supply to shower',
        'Remove old showerhead with wrench',
        'Install new one with plumber\'s tape on threads'
      ]
    }
  ];

  const quickTips = [
    { tip: 'Unplug electronics when not in use to prevent phantom energy draw', category: 'Energy', icon: '🔌' },
    { tip: 'Use cold water for washing clothes - 90% of energy goes to heating water', category: 'Energy', icon: '👕' },
    { tip: 'Air dry clothes instead of using the dryer when possible', category: 'Energy', icon: '👔' },
    { tip: 'Take shorter showers - even 2 minutes less saves 150 gallons monthly', category: 'Water', icon: '⏰' },
    { tip: 'Fix leaky faucets immediately - one drop per second wastes 3,000 gallons yearly', category: 'Water', icon: '🔧' },
    { tip: 'Use reusable bags and containers for shopping and storage', category: 'Waste', icon: '🛍️' },
    { tip: 'Buy only what you need to reduce food waste', category: 'Waste', icon: '🛒' },
    { tip: 'Walk, bike, or use public transport for short trips', category: 'Transport', icon: '🚶' },
  ];

  const challenges = [
    {
      title: '30-Day Plastic-Free Challenge',
      description: 'Eliminate single-use plastics from your daily routine',
      participants: '12,547',
      icon: '🚫',
      color: 'bg-red-50 border-red-200'
    },
    {
      title: 'Energy Saving Week',
      description: 'Reduce your home energy consumption by 20%',
      participants: '8,923',
      icon: '⚡',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Zero Waste Weekend',
      description: 'Go two days without throwing anything away',
      participants: '15,432',
      icon: '♻️',
      color: 'bg-green-50 border-green-200'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">💡 Eco-Friendly Tips</h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Practical, actionable advice to help you live more sustainably and 
                reduce your environmental impact one step at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {tipCategories.map((category) => (
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
              {/* Featured Tips */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">⭐ Featured Tips</h2>
                <div className="space-y-6">
                  {featuredTips.map((tip) => (
                    <div key={tip.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{tip.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{tip.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tip.categoryColor}`}>
                              {tip.category}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-4">{tip.description}</p>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Difficulty</div>
                              <div className="font-semibold text-gray-900">{tip.difficulty}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Impact</div>
                              <div className="font-semibold text-green-600">{tip.impact}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Savings</div>
                              <div className="font-semibold text-blue-600">{tip.savings}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900">How to do it:</h4>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                              {tip.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Tips Grid */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">⚡ Quick Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickTips.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="text-gray-700 text-sm">{item.tip}</p>
                          <span className="text-xs text-green-600 font-semibold mt-1 inline-block">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Impact Calculator */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🧮 Impact Calculator</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Calculate your potential environmental and financial savings.
                </p>
                <button className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                  Start Calculator
                </button>
              </div>

              {/* Challenges */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Eco Challenges</h3>
                <div className="space-y-4">
                  {challenges.map((challenge, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${challenge.color}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xl">{challenge.icon}</span>
                        <h4 className="font-semibold text-gray-900 text-sm">{challenge.title}</h4>
                      </div>
                      <p className="text-gray-600 text-xs mb-2">{challenge.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{challenge.participants} participants</span>
                        <button className="text-green-600 font-semibold hover:text-green-700">
                          Join →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">📧 Weekly Eco Tips</h3>
                <p className="text-green-100 text-sm mb-4">
                  Get 3 new actionable eco tips delivered to your inbox every week.
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
              </div>

              {/* Progress Tracker */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4">📈 Your Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-800">Tips Completed</span>
                      <span className="font-semibold">12/50</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '24%'}}></div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <button className="text-blue-600 font-semibold text-sm hover:text-blue-800">
                      View Full Progress →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TipsPage;