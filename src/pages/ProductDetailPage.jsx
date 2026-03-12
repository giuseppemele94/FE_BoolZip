import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ProductGallery from '../components/product-detail/ProductGallery';
import ProductInfoPanel from '../components/product-detail/ProductInfoPanel';
import RelatedProducts from '../components/product-detail/RelatedProducts';
import { useCart } from '../context/CartContext';

const API_PRODUCTS_URL = 'http://localhost:3000/api/products';

function getProductImages(product) {
    const mainImage = product?.image_url || product?.image || '';

    const extraImages = Array.isArray(product?.product_images)
        ? product.product_images
            .map((item) =>
                typeof item === 'string'
                    ? item
                    : item?.image_url || item?.url || ''
            )
            .filter(Boolean)
        : [];

    const allImages = [mainImage, ...extraImages].filter(Boolean);

    return [...new Set(allImages)];
}

function getProductMaterials(product) {
    const rawMaterials =
        product.materials ??
        product.material ??
        product.materiali ??
        product.materiale;

    if (Array.isArray(rawMaterials)) {
        return rawMaterials
            .map((item) =>
                typeof item === 'string'
                    ? item
                    : item?.name || item?.label || ''
            )
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
            .map((item) =>
                typeof item === 'string'
                    ? item
                    : item?.name || item?.label || ''
            )
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
        relatedProducts: Array.isArray(product.related_products)
            ? product.related_products
                .filter((item) => item && typeof item === 'object')
                .map((item) => ({
                    ...item,
                    id: item.id ?? item.slug,
                    slug: String(item.slug ?? item.id ?? ''),
                }))
            : [],
        features: Array.isArray(product.features) ? product.features : [],
    };
}

function ProductDetailPage() {
    const { slug } = useParams();

    // Recupero dal context la funzione per aggiungere al carrello.
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImageByProduct, setActiveImageByProduct] = useState({});
    const [quantityByProduct, setQuantityByProduct] = useState({});

    useEffect(() => {
        let isMounted = true;

        const loadProduct = async () => {
            try {
                setIsLoading(true);

                const response = await axios.get(`${API_PRODUCTS_URL}/${slug}`);

                if (!isMounted) return;

                const normalized = normalizeProduct(response.data);
                setProduct(normalized);
            } catch (error) {
                console.error('Errore nel caricamento del prodotto:', error);

                if (!isMounted) return;
                setProduct(null);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProduct();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    if (isLoading) {
        return (
            <section className="product-page product-page--fallback">
                <h1>Caricamento prodotto...</h1>
            </section>
        );
    }

    if (!product) {
        return (
            <section className="product-page product-page--fallback">
                <h1>Prodotto non trovato</h1>
                <p>Il prodotto richiesto non è presente nel database.</p>
                <Link to="/" className="product-back-link">
                    Torna alla home
                </Link>
            </section>
        );
    }

    const currentProductKey = String(product.slug || product.id);
    const activeImage =
        activeImageByProduct[currentProductKey] || product.images[0] || '';
    const quantity = quantityByProduct[currentProductKey] ?? 1;

    const handleSelectImage = (image) => {
        setActiveImageByProduct((current) => ({
            ...current,
            [currentProductKey]: image,
        }));
    };

    const relatedProducts = Array.isArray(product.relatedProducts)
        ? product.relatedProducts.filter(
            (item) =>
                item &&
                typeof item === 'object' &&
                String(item.slug || item.id) !== currentProductKey
        )
        : [];

    const outOfStock = product.stock === 0;

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

    // Aggiunge il prodotto al carrello con la quantità selezionata.
    const handleAddToCart = (event) => {
        const sourceRect = event?.currentTarget?.getBoundingClientRect?.() || null;
        const hoverImage = Array.isArray(product.images) ? product.images[1] || "" : "";

        addToCart(product, quantity, {
            sourceRect,
            hoverImage,
        });
    };

    return (
        <section className="product-page">
            <div className="product-detail">
                <ProductGallery
                    product={product}
                    activeImage={activeImage}
                    onSelectImage={handleSelectImage}
                />

                <ProductInfoPanel
                    product={product}
                    quantity={quantity}
                    onDecrease={decrement}
                    onIncrease={increment}
                    outOfStock={outOfStock}
                    onAddToCart={handleAddToCart}
                />
            </div>

            <RelatedProducts products={relatedProducts} />
        </section>
    );
}

export default ProductDetailPage;