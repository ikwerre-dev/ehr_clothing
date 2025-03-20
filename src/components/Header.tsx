'use client'

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { ShoppingBagIcon, EnvelopeIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from '@/context/DarkModeContext'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { HeadsetIcon, PackageSearch } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'

export function Header({ onSearch }: { onSearch?: (query: string) => void }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const filterParam = searchParams.get('filter')

    const getPageTitle = () => {
        if (pathname === '/shop') {
            switch (filterParam) {
                case 'on-sale':
                    return 'On Sale'
                case 'new-arrivals':
                    return 'New Arrivals'
                default:
                    return 'Shop'
            }
        }
        return ''
    }

    const { isDarkMode } = useDarkMode()
    const { totalItems } = useCart()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onSearch) {
            onSearch(e.target.value)
        }
    }

    return (
        <header className="relative">
            <div className="bg-gray-900 text-white py-2 px-4 text-center text-sm">
                <p>
                    {getPageTitle() && (
                        <span className="font-medium mr-2">{getPageTitle()}:</span>
                    )}
                    Use this Promo Code <strong>"RILEY111"</strong> to get 10% off your purchases.
                    <Link href="/shop" className="underline ml-1"> Shop Now</Link>
                </p>
            </div>

            <div className={`flex items-center justify-between px-6 py-4 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <Link href="/" className="text-2xl font-bold">E.H.R</Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/shop" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Shop</Link>
                    <Link
                        href="/shop?filter=on-sale"
                        className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                        On Sale
                    </Link>
                    <Link
                        href="/shop?filter=new-arrivals"
                        className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                        New Arrivals
                    </Link>
                    <Link
                        href="/tracking"
                        className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                        Track Order
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <input
                            type="search"
                            placeholder="Search for products..."
                            onChange={handleSearch}
                            className={`pl-10 pr-4 py-2 rounded-full ${isDarkMode
                                ? 'bg-[#111] text-white placeholder:text-gray-400'
                                : 'bg-gray-100 text-gray-900 placeholder:text-gray-500'
                                }`}
                        />
                        <MagnifyingGlassIcon className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>

                    <ThemeToggle />
                    <Link href="/tracking" className="cursor-pointer">
                        <PackageSearch className="w-6 h-6" />
                    </Link>

                    <Link href="/cart" className="relative">
                        <ShoppingBagIcon className="w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden"
                    >
                        {isMenuOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className={`md:hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-t ${isDarkMode ? 'border-[#111]' : 'border-gray-100'}`}>
                    <div className="px-6 py-4">
                        <div className="relative mb-4">
                            <input
                                type="search"
                                placeholder="Search for products..."
                                className={`w-full pl-10 pr-4 py-2 rounded-full ${isDarkMode ? 'bg-[#000] text-white placeholder:text-gray-400' : 'bg-gray-100 text-gray-900 placeholder:text-gray-500'
                                    }`}
                            />
                            <MagnifyingGlassIcon className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <nav className="flex flex-col gap-4">
                        <Link href="/contact" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Contact Us</Link>
                        <Link href="/shop" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Shop</Link>
                            <Link
                                href="/shop?filter=on-sale"
                                className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                            >
                                On Sale
                            </Link>
                            <Link
                                href="/shop?filter=new-arrivals"
                                className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                            >
                                New Arrivals
                            </Link>
                            <Link href="/tracking" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Track Order</Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}