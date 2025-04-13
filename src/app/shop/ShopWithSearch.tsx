'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ShopContent from './ShopContent';

export default function ShopWithSearch() {
  const [data, setData] = useState({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products${searchQuery ? `?search=${searchQuery}` : ''}`),
          fetch('/api/categories'),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const products = await productsRes.json();
        const categories = await categoriesRes.json();

        setData({ products, categories });
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setData({ products: [], categories: [] });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ShopContent 
      initialProducts={data.products} 
      categories={data.categories}
      initialSearch={searchQuery}
    />
  );
}