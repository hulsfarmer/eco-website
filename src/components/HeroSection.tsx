import React from 'react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-800 text-green-100 mb-4">
                🌍 Building a Sustainable Future
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Guide to
              <span className="block text-green-300">Green Living</span>
            </h1>
            
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Discover the latest environmental news, sustainable living tips, and eco-friendly 
              product reviews. Join over 2 million readers building a greener tomorrow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/news"
                className="inline-flex items-center px-8 py-4 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors shadow-lg"
              >
                📰 Latest News
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link
                href="/tips"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition-colors"
              >
                💡 Eco Tips
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="text-2xl font-bold text-green-300">2.4M+</div>
                <div className="text-sm text-green-100">Monthly Readers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-300">15K+</div>
                <div className="text-sm text-green-100">Articles Published</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-300">89%</div>
                <div className="text-sm text-green-100">Reader Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Environmental Stats */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-center">🌍 Real-time Impact</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌡️</span>
                    <span className="font-medium">Global Temperature</span>
                  </div>
                  <span className="text-red-300 font-bold">+1.2°C</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌳</span>
                    <span className="font-medium">Trees Planted Today</span>
                  </div>
                  <span className="text-green-300 font-bold">24,892</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">♻️</span>
                    <span className="font-medium">Plastic Recycled</span>
                  </div>
                  <span className="text-blue-300 font-bold">5.7 tons</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">⚡</span>
                    <span className="font-medium">Renewable Energy</span>
                  </div>
                  <span className="text-yellow-300 font-bold">72%</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-sm text-green-100 mb-2">Updated every minute</div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-200">Live Data</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="hidden lg:block absolute -top-4 -left-4 bg-emerald-500 text-white p-3 rounded-xl shadow-lg animate-bounce">
              <div className="text-sm font-semibold">🎯 Carbon Neutral</div>
            </div>
            
            <div className="hidden lg:block absolute -bottom-4 -right-4 bg-teal-500 text-white p-3 rounded-xl shadow-lg animate-pulse">
              <div className="text-sm font-semibold">🔄 100% Renewable</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="relative">
        <svg
          className="w-full h-12 fill-gray-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;