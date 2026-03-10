import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ProductGallery from '../components/product-detail/ProductGallery';
import ProductInfoPanel from '../components/product-detail/ProductInfoPanel';
import RelatedProducts from '../components/product-detail/RelatedProducts';

const API_PRODUCTS_URL = 'http://localhost:3000/api/products';

function getProductImages(product) {
    const galleryImages = Array.isArray(product.images) ? product.images : [];

    if (galleryImages.length > 0) {
        return galleryImages;
    }

    const fallbackImage = product.image_url || product.image;
    return fallbackImage ? [fallbackImage] : [];
}

function getProductMaterials(product) {
    const rawMaterials =
        product.materials ??
        product.material ??
        product.materiali ??
        product.materiale;

    if (Array.isArray(rawMaterials)) {
        return rawMaterials
            .map((item) => (typeof item === 'string' ? item : item?.name || item?.label || ''))
            .map((item) => String(item).trim())
            .filter(Boolean);
    }

    if (typeof rawMaterials === 'string') {
        return rawMaterials
            .split(/[,;|]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

function getProductSizes(product) {
    const rawSizes =
        product.sizes ??
        product.size ??
        product.taglie ??
        product.taglia;

    if (Array.isArray(rawSizes)) {
        return rawSizes
            .map((item) => (typeof item === 'string' ? item : item?.name || item?.label || ''))
            .map((item) => String(item).trim())
            .filter(Boolean);
    }

    if (typeof rawSizes === 'string') {
        return rawSizes
            .split(/[,;|]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

function normalizeProduct(product) {
    if (!product) {
        return null;
    }

    return {
        ...product,
        id: product.id ?? product.slug,
        slug: String(product.slug ?? product.id ?? ''),
        images: getProductImages(product),
        materials: getProductMaterials(product),
        sizes: getProductSizes(product),
        relatedIds: Array.isArray(product.relatedIds) ? product.relatedIds : [],
        features: Array.isArray(product.features) ? product.features : [],
    };
}

function ProductDetailPage({ products = [] }) {
    // 1) Leggo lo slug dalla URL.
    const { slug } = useParams();
    const [apiProduct, setApiProduct] = useState(null);
    const [apiProducts, setApiProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2) Carico il prodotto di dettaglio dal DB e una lista base per i correlati.
    useEffect(() => {
        let isMounted = true;

        const loadProductData = async () => {
            setIsLoading(true);

            const [detailResult, listResult] = await Promise.allSettled([
                axios.get(`${API_PRODUCTS_URL}/${slug}`),
                axios.get(API_PRODUCTS_URL),
            ]);

            if (!isMounted) {
                return;
            }

            const rawList = listResult.status === 'fulfilled' ? listResult.value.data : [];
            const safeList = Array.isArray(rawList) ? rawList : [];

            let detailCandidate = null;
            if (detailResult.status === 'fulfilled') {
                const rawDetail = detailResult.value.data;

                if (Array.isArray(rawDetail)) {
                    detailCandidate = rawDetail[0] || null;
                } else if (rawDetail && typeof rawDetail === 'object') {
                    detailCandidate = rawDetail.product || rawDetail;
                }
            }

            // Fallback: se endpoint dettaglio non risponde come previsto, cerco nella lista API.
            if (!detailCandidate) {
                detailCandidate =
                    safeList.find((item) => String(item?.slug || item?.id) === slug) || null;
            }

            setApiProducts(safeList);
            setApiProduct(detailCandidate);
            setIsLoading(false);
        };

        loadProductData();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    // 3) Unisco mock + API (+ dettaglio singolo) e normalizzo in un formato unico.
    const allProducts = useMemo(() => {
        const mergedProducts = [...products, ...apiProducts, ...(apiProduct ? [apiProduct] : [])];
        const uniqueProducts = new Map();

        mergedProducts.forEach((item) => {
            const key = String(item?.slug ?? item?.id ?? '');

            if (!key || uniqueProducts.has(key)) {
                return;
            }

            uniqueProducts.set(key, normalizeProduct(item));
        });

        return Array.from(uniqueProducts.values()).filter(Boolean);
    }, [products, apiProducts, apiProduct]);

    // 4) Recupero il prodotto corrente usando lo slug URL.
    const normalizedProduct = useMemo(
        () => allProducts.find((item) => item.slug === slug),
        [slug, allProducts]
    );

    const [activeImageByProduct, setActiveImageByProduct] = useState({});
    const [quantityByProduct, setQuantityByProduct] = useState({});

    // 6) Stato di loading: evito "not found" durante la chiamata API.
    if (isLoading && !normalizedProduct) {
        return (
            <section className="product-page product-page--fallback">
                <h1>Caricamento prodotto...</h1>
            </section>
        );
    }

    // 7) Fallback se lo slug non corrisponde a nessun prodotto.
    if (!normalizedProduct) {
        return (
            <section className="product-page product-page--fallback">
                <h1>Prodotto non trovato</h1>
                <p>Il modello richiesto non e presente in questa demo.</p>
                <Link to="/" className="product-back-link">
                    Torna alla home
                </Link>
            </section>
        );
    }

    // 8) Correlati e stato disponibilita.
    const currentProductKey = String(normalizedProduct.slug || normalizedProduct.id);
    const activeImage =
        activeImageByProduct[currentProductKey] || normalizedProduct.images[0] || '';
    const quantity = quantityByProduct[currentProductKey] ?? 1;

    const handleSelectImage = (image) => {
        setActiveImageByProduct((current) => ({
            ...current,
            [currentProductKey]: image,
        }));
    };

    const normalizedApiProducts = apiProducts
        .map(normalizeProduct)
        .filter(Boolean);
    const isBackendProduct = normalizedApiProducts.some(
        (item) => String(item.slug || item.id) === currentProductKey
    );
    const relatedPool = isBackendProduct ? normalizedApiProducts : allProducts;

    const relatedKeys = new Set(
        (normalizedProduct.relatedIds || []).map((item) => String(item))
    );

    let relatedProducts = [];

    if (relatedKeys.size > 0) {
        relatedProducts = relatedPool.filter((item) => {
            const itemId = String(item.id);
            const itemSlug = String(item.slug);
            const itemKey = String(item.slug || item.id);

            return (
                (relatedKeys.has(itemId) || relatedKeys.has(itemSlug)) &&
                itemKey !== currentProductKey
            );
        });
    }

    if (relatedProducts.length === 0) {
        relatedProducts = relatedPool
            .filter((item) => String(item.slug || item.id) !== currentProductKey)
            .slice(0, 4);
    }

    const outOfStock = normalizedProduct.stock === 0;

    const decrement = () => {
        setQuantityByProduct((current) => {
            const currentQuantity = current[currentProductKey] ?? 1;

            return {
                ...current,
                [currentProductKey]: Math.max(1, currentQuantity - 1),
            };
        });
    };

    const increment = () => {
        setQuantityByProduct((current) => {
            const currentQuantity = current[currentProductKey] ?? 1;

            return {
                ...current,
                [currentProductKey]: Math.min(10, currentQuantity + 1),
            };
        });
    };

    // 9) Render pagina dettaglio.
    return (
        <section className="product-page">
            <div className="product-detail">
                <ProductGallery
                    product={normalizedProduct}
                    activeImage={activeImage}
                    onSelectImage={handleSelectImage}
                />

                <ProductInfoPanel
                    product={normalizedProduct}
                    quantity={quantity}
                    onDecrease={decrement}
                    onIncrease={increment}
                    outOfStock={outOfStock}
                />
            </div>

            {/* 10) Sezione correlati separata per tenere il file ordinato. */}
            <RelatedProducts products={relatedProducts} />
        </section>
    );
}

export default ProductDetailPage;