"use client";

import { useCatalogo } from "@/contexts/catalog-context"; 

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProductCard from "@/components/components-loja/ProductCard";

import styles from "@/style/slide.module.css";

export default function ProductSlider({
    items,
    title,
    maxPerView = 3,
}) {

    const { products, isReady } = useCatalogo();

    const allItems = products ?? [];
    const list = Array.isArray(items) && items.length > 0 ? items : allItems;
    const max = Math.min(maxPerView, list.length || 1);

    if (!isReady || list.length === 0) {
        return null;
    }

    return (
        <section className={`w-full ${styles.sliderRoot}`}>
            {title ? (
                <header className={styles.sliderHeader}>
                    <h2 className="text-2xl font-semibold text-black">
                        {title}
                    </h2>
                </header>
            ) : null}

            <Swiper
                modules={[Navigation, Pagination, A11y, Keyboard]}
                spaceBetween={53}
                slidesPerView={1}
                navigation
                keyboard={{ enabled: true }}
                grabCursor
                breakpoints={{
                    640: { slidesPerView: Math.min(2, max) },
                    1024: { slidesPerView: Math.min(3, max) },
                }}
            >
                {list.map((produto) => (
                    <SwiperSlide key={produto.id} className="h-auto">
                        <ProductCard produto={produto} noMaxWidth />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
