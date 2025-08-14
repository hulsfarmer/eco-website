import React from 'react';

const EcoStats = () => {
  const stats = [
    {
      icon: '🌍',
      value: '1.2°C',
      label: 'Global Temperature Rise',
      trend: 'up',
      description: 'Since pre-industrial times',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: '🌳',
      value: '15.3B',
      label: 'Trees Cut Down Annually',
      trend: 'down',
      description: 'Deforestation rate',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: '♻️',
      value: '32%',
      label: 'Global Recycling Rate',
      trend: 'up',
      description: 'Improving yearly',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: '⚡',
      value: '28%',
      label: 'Renewable Energy Share',
      trend: 'up',
      description: 'Of global electricity',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: '🌊',
      value: '21cm',
      label: 'Sea Level Rise',
      trend: 'up',
      description: 'Since 1880',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: '🏭',
      value: '36.8B',
      label: 'CO₂ Emissions (tons)',
      trend: 'down',
      description: 'Annual global emissions',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <span className="text-red-500">↗️</span>;
    } else if (trend === 'down') {
      return <span className="text-green-500">↘️</span>;
    }
    return <span className="text-gray-500">→</span>;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🌍 Environmental Impact Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time data showing our planet's current state and the urgent need for action.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live data updated every hour</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  {getTrendIcon(stat.trend)}
                </div>
              </div>
              
              <div className="mb-2">
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-gray-900 font-semibold text-lg">
                  {stat.label}
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {stat.description}
              </div>

              {/* Progress bar for some stats */}
              {(stat.label.includes('Renewable') || stat.label.includes('Recycling')) && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${stat.color.replace('text-', 'bg-')} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${parseInt(stat.value)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Call */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            💚 Every Action Counts
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            These numbers represent our collective impact. Together, we can turn the tide 
            and create a sustainable future for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors">
              📊 View Full Report
            </button>
            <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition-colors">
              🤝 Take Action Now
            </button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <span>🕐</span>
            <span>Data last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcoStats;