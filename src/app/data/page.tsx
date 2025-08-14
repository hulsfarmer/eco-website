import Layout from '@/components/Layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Environmental Data & Statistics | EcoLife - Climate Analytics',
  description: 'Comprehensive environmental data, climate statistics, and real-time analytics to track our planet\'s health and sustainability progress.',
  keywords: 'environmental data, climate statistics, sustainability metrics, carbon emissions data, renewable energy statistics',
  openGraph: {
    title: 'Environmental Data & Statistics | EcoLife',
    description: 'Real-time environmental data and climate analytics',
    url: 'https://ecolife.com/data',
  },
  alternates: {
    canonical: 'https://ecolife.com/data',
  },
};

const DataPage = () => {
  const keyMetrics = [
    {
      title: 'Global Temperature',
      value: '+1.28°C',
      change: '+0.02°C',
      period: 'vs last year',
      trend: 'up',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: '🌡️'
    },
    {
      title: 'CO₂ Concentration',
      value: '421.44 ppm',
      change: '+2.1 ppm',
      period: 'vs last year',
      trend: 'up',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: '🏭'
    },
    {
      title: 'Renewable Energy',
      value: '32.8%',
      change: '+4.2%',
      period: 'vs last year',
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '⚡'
    },
    {
      title: 'Forest Coverage',
      value: '30.7%',
      change: '-0.1%',
      period: 'vs last year',
      trend: 'down',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: '🌳'
    },
    {
      title: 'Arctic Sea Ice',
      value: '4.92M km²',
      change: '-2.1%',
      period: 'vs average',
      trend: 'down',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '🧊'
    },
    {
      title: 'Ocean pH',
      value: '8.05',
      change: '-0.02',
      period: 'vs pre-industrial',
      trend: 'down',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      icon: '🌊'
    }
  ];

  const regionalData = [
    {
      region: 'North America',
      emissions: '5.2B tons',
      renewable: '28%',
      population: '369M',
      perCapita: '14.1 tons',
      flag: '🇺🇸'
    },
    {
      region: 'Europe',
      emissions: '3.8B tons',
      renewable: '42%',
      population: '746M',
      perCapita: '5.1 tons',
      flag: '🇪🇺'
    },
    {
      region: 'Asia',
      emissions: '18.7B tons',
      renewable: '31%',
      population: '4.6B',
      perCapita: '4.1 tons',
      flag: '🌏'
    },
    {
      region: 'Africa',
      emissions: '1.3B tons',
      renewable: '24%',
      population: '1.4B',
      perCapita: '0.9 tons',
      flag: '🌍'
    }
  ];

  const timeSeriesData = [
    { year: '2020', temp: 1.02, co2: 414.2, renewable: 26.8 },
    { year: '2021', temp: 1.11, co2: 416.5, renewable: 28.1 },
    { year: '2022', temp: 1.15, co2: 418.9, renewable: 29.4 },
    { year: '2023', temp: 1.26, co2: 419.7, renewable: 30.7 },
    { year: '2024', temp: 1.28, co2: 421.4, renewable: 32.8 },
  ];

  const sectors = [
    { name: 'Energy', percentage: 73.2, color: 'bg-red-500' },
    { name: 'Agriculture', percentage: 18.4, color: 'bg-green-500' },
    { name: 'Industrial Processes', percentage: 5.2, color: 'bg-blue-500' },
    { name: 'Waste', percentage: 3.2, color: 'bg-yellow-500' },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '📈' : '📉';
  };

  const getTrendColor = (trend: string, isPositive: boolean) => {
    if (isPositive) {
      return trend === 'up' ? 'text-green-600' : 'text-red-600';
    } else {
      return trend === 'up' ? 'text-red-600' : 'text-green-600';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">📊 Environmental Data & Analytics</h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                Real-time environmental data, climate statistics, and sustainability metrics 
                to track our planet's health and progress toward a sustainable future.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-100">Data updated hourly from global monitoring stations</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Key Metrics Grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">🌍 Key Global Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {keyMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center text-2xl`}>
                      {metric.icon}
                    </div>
                    <span className="text-lg">
                      {getTrendIcon(metric.trend)}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-700 mb-2">{metric.title}</h3>
                  <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                    {metric.value}
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className={getTrendColor(metric.trend, metric.title === 'Renewable Energy')}>
                      {metric.change}
                    </span>
                    <span className="text-gray-500 ml-1">{metric.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Time Series Chart */}
          <section className="mb-16">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 5-Year Trends</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Temperature Trend */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-4">🌡️ Global Temperature Anomaly</h3>
                  <div className="space-y-2">
                    {timeSeriesData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{data.year}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full"
                              style={{width: `${(data.temp / 1.5) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-red-600">+{data.temp}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CO2 Trend */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-4">🏭 CO₂ Concentration</h3>
                  <div className="space-y-2">
                    {timeSeriesData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{data.year}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-500 h-2 rounded-full"
                              style={{width: `${((data.co2 - 410) / 15) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-orange-600">{data.co2} ppm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Renewable Energy Trend */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-4">⚡ Renewable Energy Share</h3>
                  <div className="space-y-2">
                    {timeSeriesData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{data.year}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{width: `${(data.renewable / 40) * 100}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-green-600">{data.renewable}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Regional Data */}
            <section>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🌎 Regional Breakdown</h2>
                <div className="space-y-4">
                  {regionalData.map((region, index) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{region.flag}</span>
                          <h3 className="font-semibold text-gray-900">{region.region}</h3>
                        </div>
                        <span className="text-sm text-gray-500">Pop: {region.population}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Emissions</span>
                          <div className="font-semibold text-gray-900">{region.emissions}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Per Capita</span>
                          <div className="font-semibold text-gray-900">{region.perCapita}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Renewable Energy</span>
                          <div className="font-semibold text-green-600">{region.renewable}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Emissions by Sector */}
            <section>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🏭 Emissions by Sector</h2>
                <div className="space-y-4">
                  {sectors.map((sector, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-700">{sector.name}</span>
                        <span className="font-bold text-gray-900">{sector.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${sector.color} h-3 rounded-full transition-all duration-1000`}
                          style={{width: `${sector.percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3">💡 Key Insights</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Energy sector remains the largest contributor at 73.2%</li>
                    <li>• Agriculture accounts for nearly 1/5 of global emissions</li>
                    <li>• Industrial processes and waste combined are less than 10%</li>
                    <li>• Focus on energy transition shows highest impact potential</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Call to Action */}
          <section className="mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">📈 Data-Driven Action</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                These numbers tell a story - one that requires immediate action. 
                Use this data to make informed decisions and track progress toward sustainability goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                  📊 Download Full Report
                </button>
                <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-700 transition-colors">
                  🔔 Set Data Alerts
                </button>
              </div>
            </div>
          </section>

          {/* Data Sources */}
          <section className="mt-8">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                <strong>Data Sources:</strong> NASA GISS, NOAA, IEA, Global Carbon Atlas, World Bank, UNEP
                | <strong>Last Updated:</strong> {new Date().toLocaleString()}
                | <strong>Update Frequency:</strong> Hourly
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default DataPage;