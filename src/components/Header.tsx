'use client'

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { ShoppingBagIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from '@/context/DarkModeContext'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { PackageSearch } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLatestCoupon } from '@/hooks/useLatestCoupon'
import { useRouter } from 'next/navigation'

export function Header({ onSearch }: { onSearch?: (query: string) => void }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const filterParam = searchParams.get('filter')
    const router = useRouter()

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
        const searchQuery = e.target.value
        if (onSearch) {
            onSearch(searchQuery)
        }
        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
    }

    const { coupon, isLoading } = useLatestCoupon()
    console.log(coupon)

    return (
        <header className="relative">
            <div className="bg-gray-900 text-white py-2 px-4 text-center text-sm">
                <p>
                    {getPageTitle() && (
                        <span className="font-medium mr-2">{getPageTitle()}:</span>
                    )}
                    {!isLoading && coupon ? (
                        <>
                            Use this Promo Code <strong>&rdquo;{coupon.code}&rdquo;</strong> to get{" "}
                            {coupon.type === "percentage"
                                ? `${coupon.discount}% off`
                                : `₦${coupon.discount} off`}{" "}
                            your purchases.
                            <Link href="/shop" className="underline ml-1">Shop Now</Link>
                        </>
                    ) : (
                        <>
                            Welcome to E.H.R Clothing
                            <Link href="/shop" className="underline ml-1">Shop Now</Link>
                        </>
                    )}
                </p>
            </div>

            <div className={`flex items-center justify-between px-6 py-4 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <Link href="/" className="text-2xl font-bold">E.H.R</Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/shop" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Shop</Link>
                    <Link href="/contact" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Contact</Link>

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

                            <Link href="/tracking" className={`hover:opacity-80 transition-opacity ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Track Order</Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    )
}