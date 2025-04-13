'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useDarkMode } from '@/context/DarkModeContext';
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Product } from '@/types/product';
import { useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface ShopContentProps {
  initialProducts: (Product & {
    images: string[];
    category: {
      name: string;
    };
  })[];
  initialSearch: string;
  categories: Category[];
}

export default function ShopContent({ initialSearch, initialProducts, categories }: ShopContentProps) {
  const { isDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState(initialSearch || ''); // Initialize with initialSearch
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery && activeCategory === 'all') {
        setProducts(initialProducts);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory && activeCategory !== 'all') {
          params.append('category', activeCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        console.log(`/api/products?${params.toString()}`);

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts(initialProducts); // Fallback to initial products on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchQuery, initialProducts]);

  // Handle body scroll lock
  useEffect(() => {
    if (isFilterOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen, isSearchOpen]);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shop</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <FunnelIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.name}
                price={product.price}
                image={product.images[0]}
                rating={4.5}
                reviewCount={0}
              />
            ))}
          </div>
        )}
      </main>

      {/* Filter Menu */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsFilterOpen(false)}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 p-6 transition-transform duration-300 z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-2xl shadow-xl ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filter by Category</h2>
          <button onClick={() => setIsFilterOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <button
            key="all"
            onClick={() => {
              setActiveCategory('all');
              setIsFilterOpen(false);
            }}
            className={`w-full py-3 px-4 rounded-lg transition-colors ${activeCategory === 'all' ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : (isDarkMode ? 'border-gray-700 border' : 'border-gray-200 border')}`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setIsFilterOpen(false);
              }}
              className={`w-full py-3 px-4 rounded-lg transition-colors ${activeCategory === category.id ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : (isDarkMode ? 'border-gray-700 border' : 'border-gray-200 border')}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Menu */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSearchOpen(false)}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 p-6 transition-transform duration-300 z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-2xl shadow-xl ${isSearchOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Search Products</h2>
          <button onClick={() => setIsSearchOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="relative">
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white placeholder:text-gray-400' : 'bg-gray-100 text-black placeholder:text-gray-500'}`}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}