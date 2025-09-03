'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RealTimeStats from './RealTimeStats';

const EcoHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'News', href: '/news', icon: '📰' },
    { name: 'Tips', href: '/tips', icon: '💡' },
    { name: 'Reviews', href: '/reviews', icon: '⭐' },
    { name: 'Data', href: '/data', icon: '📊' },
    { name: 'About', href: '/about', icon: '🌱' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold hover:text-green-200 transition-colors">
            <span className="text-2xl">🌍</span>
            <span>EcoLife</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                  isActive(item.href)
                    ? 'bg-green-700 text-white'
                    : 'text-green-100 hover:bg-green-700 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search eco topics..."
                className="w-64 px-4 py-2 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                🔍
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center px-3 py-2 border rounded text-green-200 border-green-400 hover:text-white hover:border-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-green-500">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-green-700 text-white'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Stats Banner */}
      <div className="bg-green-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-2 lg:space-y-0">
            {/* Site Statistics */}
            <RealTimeStats />
            
            {/* Environmental Stats */}
            <div className="flex items-center space-x-6 text-sm text-green-100">
              <span>🌡️ Global Temp: +1.2°C</span>
              <span>🌳 Trees Planted: 12,847</span>
              <span>♻️ Plastic Saved: 2.4 tons</span>
              <span>💡 Renewable: 68%</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EcoHeader;