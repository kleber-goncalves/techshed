"use client"

import { useEffect, useRef } from "react"

export function useInfiniteTrigger({ enabled, onLoadMore, rootMargin = "300px" }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!enabled || !ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) onLoadMore();
            },
            { root: null, rootMargin, threshold: 0 },
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [enabled, onLoadMore, rootMargin]);

    return ref;
}