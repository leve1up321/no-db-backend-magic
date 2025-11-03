'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Heart, Globe, Home } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currency, setCurrency, cartCount, wishlist } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currencies = [
    { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي' },
    { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي' },
    { code: 'KWD', symbol: 'د.ك', name: 'دينار كويتي' },
    { code: 'QAR', symbol: 'ر.ق', name: 'ريال قطري' },
    { code: 'BHD', symbol: 'د.ب', name: 'دينار بحريني' },
    { code: 'OMR', symbol: 'ر.ع', name: 'ريال عماني' },
    { code: 'JOD', symbol: 'د.أ', name: 'دينار أردني' },
    { code: 'EGP', symbol: 'ج.م', name: 'جنيه مصري' },
    { code: 'LBP', symbol: 'ل.ل', name: 'ليرة لبنانية' },
    { code: 'SYP', symbol: 'ل.س', name: 'ليرة سورية' },
    { code: 'IQD', symbol: 'ع.د', name: 'دينار عراقي' },
    { code: 'TND', symbol: 'د.ت', name: 'دينار تونسي' },
    { code: 'MAD', symbol: 'د.م', name: 'درهم مغربي' },
    { code: 'DZD', symbol: 'د.ج', name: 'دينار جزائري' },
    { code: 'USD', symbol: '$', name: 'دولار أمريكي' },
    { code: 'EUR', symbol: '€', name: 'يورو' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
      isScrolled 
        ? 'bg-dark-400/95 backdrop-blur-lg shadow-lg border-b border-primary-300/10' 
        : 'bg-transparent'
    }`}>
      <div className="container-mobile">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/logo.png"
                alt="Level Up Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="mr-2 sm:mr-3 text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-300 to-accent-600 bg-clip-text text-transparent hidden sm:inline">
              Level Up
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-primary-300 transition-colors duration-200 font-semibold text-sm lg:text-base"
            >
              الرئيسية
            </Link>
            <Link 
              href="/#products" 
              className="text-gray-300 hover:text-primary-300 transition-colors duration-200 font-semibold text-sm lg:text-base"
            >
              المنتجات
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-300 hover:text-primary-300 transition-colors duration-200 font-semibold text-sm lg:text-base"
            >
              تواصل معنا
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector - Hidden on small mobile */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-primary-300/10 rounded-xl transition-colors touch-manipulation"
                aria-label="تغيير العملة"
              >
                <Globe className="w-5 h-5 text-primary-300" />
                <span className="text-sm font-semibold text-gray-300 hidden lg:inline">
                  {currencies.find(c => c.code === currency)?.symbol}
                </span>
              </button>
              
              {showCurrencyMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowCurrencyMenu(false)}
                  />
                  <div className="absolute left-0 mt-2 w-48 bg-dark-300/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-primary-300/20 overflow-hidden z-50 animate-scale-in">
                    <div className="max-h-80 overflow-y-auto">
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            setCurrency(curr.code as any);
                            setShowCurrencyMenu(false);
                          }}
                          className={`w-full text-right px-4 py-3 transition-colors touch-manipulation ${
                            currency === curr.code
                              ? 'bg-primary-300/20 text-primary-300 font-bold'
                              : 'text-gray-300 hover:bg-primary-300/10 hover:text-primary-300'
                          }`}
                        >
                          <span className="block text-sm">{curr.name}</span>
                          <span className="block text-xs text-gray-500 mt-0.5">{curr.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 sm:p-2.5 hover:bg-primary-300/10 rounded-xl transition-colors touch-manipulation"
              aria-label="قائمة الأمنيات"
            >
              <Heart className="w-5 h-5 text-primary-300" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-dark-400">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 sm:p-2.5 hover:bg-primary-300/10 rounded-xl transition-colors touch-manipulation"
              aria-label="سلة التسوق"
            >
              <ShoppingCart className="w-5 h-5 text-primary-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-300 to-primary-400 text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-dark-400">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-primary-300/10 rounded-xl transition-colors touch-manipulation"
              aria-label="فتح القائمة"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-primary-300" />
              ) : (
                <Menu className="w-6 h-6 text-primary-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-down border-t border-primary-300/10 safe-bottom">
            <div className="py-4 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-primary-300/10 hover:text-primary-300 rounded-xl transition-colors font-semibold touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                الرئيسية
              </Link>
              <Link
                href="/#products"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-primary-300/10 hover:text-primary-300 rounded-xl transition-colors font-semibold touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                المنتجات
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-primary-300/10 hover:text-primary-300 rounded-xl transition-colors font-semibold touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                تواصل معنا
              </Link>
              
              {/* Currency selector for mobile */}
              <div className="sm:hidden px-4 py-2">
                <p className="text-xs text-gray-500 mb-2 font-semibold">العملة</p>
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-dark-300 text-gray-300 px-4 py-3 rounded-xl border border-primary-300/20 focus:border-primary-300/50 focus:outline-none font-semibold touch-manipulation"
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
