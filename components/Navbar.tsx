'use client';

import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="text-2xl font-bold text-primary-600">
              🚀 LevelUp
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600 transition">
              الرئيسية
            </a>
            <a href="#products" className="text-gray-700 hover:text-primary-600 transition">
              المنتجات
            </a>
            <a href="#about" className="text-gray-700 hover:text-primary-600 transition">
              من نحن
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 transition">
              تواصل معنا
            </a>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <a
                href="#home"
                className="text-gray-700 hover:text-primary-600 transition py-2"
              >
                الرئيسية
              </a>
              <a
                href="#products"
                className="text-gray-700 hover:text-primary-600 transition py-2"
              >
                المنتجات
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-primary-600 transition py-2"
              >
                من نحن
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-primary-600 transition py-2"
              >
                تواصل معنا
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

