import { useMemo } from "react";
import ProductList from "./ProductList";

const BEST_SELLER_SCORE_FIELDS = [
    "soldCount",
    "sales",
    "sold",
    "unitsSold",
    "totalSold",
    "ordersCount",
    "popularity",
];

const BEST_SELLER_FLAG_FIELDS = [
    "isBestSeller",
    "is_best_seller",
    "bestSeller",
    "best_seller",
    "topSeller",
    "top_seller",
];

function getBestSellerScore(product) {
    for (const field of BEST_SELLER_SCORE_FIELDS) {
        const parsedValue = Number(product?.[field]);

        if (Number.isFinite(parsedValue)) {
            return parsedValue;
        }
    }

    return null;
}

function isBestSeller(product) {
    return BEST_SELLER_FLAG_FIELDS.some((field) => Boolean(product?.[field]));
}

function BestSellerSection({ products = [], limit = 4 }) {
    const safeLimit = Number.isFinite(limit) ? Math.max(0, limit) : 4;

    const bestSellerProducts = useMemo(() => {
        const safeProducts = Array.isArray(products) ? products : [];
        const flaggedProducts = safeProducts.filter((item) => isBestSeller(item));

        if (flaggedProducts.length > 0) {
            return flaggedProducts.slice(0, safeLimit);
        }

        const rankedProducts = safeProducts
            .map((item) => ({
                product: item,
                score: getBestSellerScore(item),
            }))
            .filter((item) => item.score !== null)
            .sort((a, b) => b.score - a.score)
            .map((item) => item.product);

        if (rankedProducts.length > 0) {
            return rankedProducts.slice(0, safeLimit);
        }

        return safeProducts.slice(0, safeLimit);
    }, [products, safeLimit]);

    return (
        <ProductList
            products={bestSellerProducts}
            eyebrow="Selezione"
            title="Prodotti più venduti"
            limit={safeLimit}
        />
    );
}

export default BestSellerSection;
