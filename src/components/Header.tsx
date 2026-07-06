"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Search, Menu, X, Car } from 'lucide-react';

interface Category {
  name: string;
  slug: string;
}

interface HeaderProps {
  categories?: Category[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const fallbackLinks = [
    { name: 'Elektrikli Araçlar', slug: 'elektrikli-araclar' },
    { name: 'Temiz Enerji', slug: 'temiz-enerji' },
    { name: 'Girişimcilik & SaaS', slug: 'girisimcilik-saas' },
    { name: 'Trend Teknolojiler', slug: 'trend-teknolojiler' },
  ];

  const navLinks = categories && categories.length > 0 ? categories : fallbackLinks;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-10">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Leaf className="h-6 w-6" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">
                  enerjic<span className="text-emerald-500">.com</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                href="/elektrikli-araclar"
                className="text-xs font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 px-3.5 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-1.5 border border-emerald-100/50 shadow-sm shrink-0"
              >
                <Car className="h-4 w-4 text-emerald-600 animate-pulse" />
                <span>EV Kataloğu</span>
                <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded-full scale-90 tracking-normal leading-none">1.3K+</span>
              </Link>
              <Link
                href="/yazilim-guncellemeleri"
                className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-1.5 border border-blue-100/50 shadow-sm shrink-0"
              >
                <svg className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>
                <span>OTA Güncellemeleri</span>
              </Link>

              {navLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={`/kategori/${link.slug}`}
                  className="text-sm font-semibold text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 hover:bg-opacity-50 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search bar & Mobile Menu button */}
          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Arama yap..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-60 bg-gray-50 border border-gray-200 text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-800"
              />
              <button
                type="submit"
                className="absolute right-3 top-2 text-gray-400 hover:text-emerald-600"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

          {/* Hamburger button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-gray-50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-4 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Arama yap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-3 text-gray-400 hover:text-emerald-600"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
          <nav className="flex flex-col space-y-2">
            <Link
              href="/elektrikli-araclar"
              onClick={() => setIsOpen(false)}
              className="text-base font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between border border-emerald-100/50 shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-emerald-600 animate-pulse" />
                <span>EV Kataloğu</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full tracking-normal leading-none">1.3K+ Araç</span>
            </Link>
            <Link
              href="/yazilim-guncellemeleri"
              onClick={() => setIsOpen(false)}
              className="text-base font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 border border-blue-100/50 shadow-sm"
            >
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>
              <span>OTA Güncellemeleri</span>
            </Link>

            {navLinks.map((link) => (
              <Link
                key={link.slug}
                href={`/kategori/${link.slug}`}
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 px-4 py-2.5 rounded-xl transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
