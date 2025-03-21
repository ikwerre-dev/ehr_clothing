import { useState, useEffect } from 'react';

interface Coupon {
    code: string;
    discount: number;
}

export function useLatestCoupon() {
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLatestCoupon() {
            try {
                const response = await fetch('/api/coupons/latest');
                const data = await response.json();
                setCoupon(data);
            } catch (error) {
                console.error('Failed to fetch latest coupon:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLatestCoupon();
    }, []);

    return { coupon, isLoading };
}