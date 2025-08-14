import React from 'react';
import Link from 'next/link';

const EcoFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Content': [
      { name: 'Environmental News', href: '/news' },
      { name: 'Eco Tips', href: '/tips' },
      { name: 'Product Reviews', href: '/reviews' },
      { name: 'Green Data', href: '/data' },
    ],
    'Resources': [
      { name: 'Climate Change Guide', href: '/guides/climate' },
      { name: 'Sustainable Living', href: '/guides/sustainable' },
      { name: 'Renewable Energy', href: '/guides/energy' },
      { name: 'Eco Calculator', href: '/tools/calculator' },
    ],
    'Community': [
      { name: 'Newsletter', href: '/newsletter' },
      { name: 'Blog', href: '/blog' },
      { name: 'Events', href: '/events' },
      { name: 'Contact', href: '/contact' },
    ],
    'Legal': [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'About Us', href: '/about' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'YouTube', href: '#', icon: '📺' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 text-xl font-bold text-green-400 mb-4">
              <span className="text-2xl">🌍</span>
              <span>EcoLife</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted source for environmental news, sustainable living tips, 
              and eco-friendly product reviews. Building a greener future together.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-green-400 transition-colors text-xl"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="text-green-400 font-semibold text-sm uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-green-400 font-semibold text-lg mb-2">
                🌱 Stay Updated with EcoLife
              </h3>
              <p className="text-gray-400 text-sm">
                Get the latest environmental news and sustainable living tips delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700"
              />
              <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Environmental Impact Stats */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-green-400 text-2xl font-bold">2.4M+</div>
              <div className="text-gray-400 text-sm">Articles Read</div>
            </div>
            <div>
              <div className="text-green-400 text-2xl font-bold">156K</div>
              <div className="text-gray-400 text-sm">Trees Planted</div>
            </div>
            <div>
              <div className="text-green-400 text-2xl font-bold">89%</div>
              <div className="text-gray-400 text-sm">User Satisfaction</div>
            </div>
            <div>
              <div className="text-green-400 text-2xl font-bold">45</div>
              <div className="text-gray-400 text-sm">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} EcoLife. All rights reserved. 
              <span className="ml-2">🌍 Carbon Neutral Website</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Powered by Renewable Energy
              </span>
              <span>|</span>
              <span>Made with 💚 for the Planet</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EcoFooter;