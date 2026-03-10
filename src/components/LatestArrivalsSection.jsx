import { useMemo } from "react";
import ProductList from "./ProductList";
import { mockProducts } from "../data/mockProducts";

function getNumericId(product) {
    const parsedId = Number(product?.id);
    return Number.isFinite(parsedId) ? parsedId : null;
}

function LatestArrivalsSection({ limit = 3 }) {
    const safeLimit = Number.isFinite(limit) ? Math.max(0, limit) : 3;

    const latestProducts = useMemo(() => {
        const safeProducts = Array.isArray(mockProducts) ? [...mockProducts] : [];

        return safeProducts
            .sort((a, b) => {
                const aId = getNumericId(a);
                const bId = getNumericId(b);

                if (aId !== null && bId !== null) {
                    return bId - aId;
                }

                if (aId !== null) {
                    return -1;
                }

                if (bId !== null) {
                    return 1;
                }

                return 0;
            })
            .slice(0, safeLimit);
    }, [safeLimit]);

    return (
        <ProductList
            products={latestProducts}
            eyebrow="Novita"
            title="Ultimi arrivi"
            limit={safeLimit}
        />
    );
}

export default LatestArrivalsSection;