'use client';

import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, Heart, Sun, Moon, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const { theme, toggleTheme, currency, setCurrency, cartCount, wishlist } = useApp();

  const currencies = [
    { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي' },
    { code: 'USD', symbol: '$', name: 'دولار أمريكي' },
    { code: 'EUR', symbol: '€', name: 'يورو' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <div className="relative w-12 h-12">
              <Image
                src="/logo.png"
                alt="Level Up Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition">
              الرئيسية
            </Link>
            <Link href="/#products" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition">
              المنتجات
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition">
              تواصل معنا
            </Link>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {currency}
                </span>
              </button>
              {showCurrencyMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 animate-scale-in">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code as any);
                        setShowCurrencyMenu(false);
                      }}
                      className={`w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                        currency === curr.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {curr.symbol} {curr.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Search */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition relative">
              <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/#products"
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                المنتجات
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                تواصل معنا
              </Link>
              <div className="flex items-center gap-4 pt-4 border-t dark:border-gray-700">
                <button onClick={toggleTheme} className="p-2">
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <Link href="/wishlist" className="p-2 relative">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link href="/cart" className="p-2 relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-accent-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
