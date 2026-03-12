import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_PRODUCTS_URL = 'http://localhost:3000/api/products';
const relatedSecondImageCache = new Map();
const relatedSecondImageRequestCache = new Map();

// 1) Normalizzo il formato immagine per gestire stringhe e oggetti API.
function normalizeImage(item) {
    if (typeof item === 'string') {
        return item;
    }

    if (!item || typeof item !== 'object') {
        return '';
    }

    return item.image_url || item.url || item.src || '';
}

// 2) Compongo la galleria completa con immagine principale + extra immagini.
function getProductImages(product) {
    const mainImage = normalizeImage(product?.image_url || product?.image);
    const extraImages = Array.isArray(product?.product_images)
        ? product.product_images.map(normalizeImage)
        : Array.isArray(product?.images)
            ? product.images.map(normalizeImage)
            : [];

    return [...new Set([mainImage, ...extraImages].filter(Boolean))];
}

// 3) Recupero e cache della seconda immagine dal dettaglio prodotto.
async function fetchSecondDetailImage(productKey) {
    if (!productKey) {
        return '';
    }

    if (relatedSecondImageCache.has(productKey)) {
        return relatedSecondImageCache.get(productKey) || '';
    }

    if (relatedSecondImageRequestCache.has(productKey)) {
        return relatedSecondImageRequestCache.get(productKey);
    }

    const request = axios
        .get(`${API_PRODUCTS_URL}/${encodeURIComponent(productKey)}`)
        .then((response) => {
            const images = getProductImages(response.data);
            const secondImage = images[1] || '';
            relatedSecondImageCache.set(productKey, secondImage);
            return secondImage;
        })
        .catch(() => {
            relatedSecondImageCache.set(productKey, '');
            return '';
        })
        .finally(() => {
            relatedSecondImageRequestCache.delete(productKey);
        });

    relatedSecondImageRequestCache.set(productKey, request);
    return request;
}

// 4) Card singola correlata con swap hover verso la seconda foto.
function RelatedProductCard({ item, index }) {
    const productSlug = String(item.slug || item.id || '');

    if (!productSlug) {
        return null;
    }

    const productImages = getProductImages(item);
    const fallbackCardImage = item.image_url || item.image || (Array.isArray(item.images) ? item.images[0] : '');
    const cardImage = productImages[0] || fallbackCardImage || '';
    const localSecondImage = productImages[1] || '';
    const [hoverImage, setHoverImage] = useState(
        localSecondImage || relatedSecondImageCache.get(productSlug) || ''
    );
    const isFetchingRef = useRef(false);
    const isMountedRef = useRef(true);

    // 5) Flag mount/unmount per evitare update di stato dopo smontaggio.
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        setHoverImage(localSecondImage || relatedSecondImageCache.get(productSlug) || '');
    }, [localSecondImage, productSlug]);

    // 6) Al primo hover/focus, se manca la seconda foto la carico dal dettaglio.
    const handleCardHover = async () => {
        if (hoverImage || !productSlug || isFetchingRef.current) {
            return;
        }

        isFetchingRef.current = true;

        const fetchedSecondImage = await fetchSecondDetailImage(productSlug);

        if (isMountedRef.current && fetchedSecondImage) {
            setHoverImage(fetchedSecondImage);
        }

        isFetchingRef.current = false;
    };

    const hasHoverImage = Boolean(hoverImage);
    const productKey = item.id || item.slug || index;
    const numericPrice = Number(item.price);
    const formattedPrice = Number.isFinite(numericPrice)
        ? new Intl.NumberFormat('it-IT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericPrice)
        : '0,00';

    return (
        <Link
            key={productKey}
            to={`/products/${productSlug}`}
            className="related-card-link"
            onMouseEnter={handleCardHover}
            onFocus={handleCardHover}
        >
            <article className="related-card">
                {cardImage ? (
                    <div className="related-card__media">
                        <img
                            src={cardImage}
                            alt={item.name || 'Prodotto'}
                            className={`related-card__img ${hasHoverImage ? 'related-card__img--base' : ''}`}
                        />

                        {hasHoverImage && (
                            <img
                                src={hoverImage}
                                alt={`${item.name || 'Prodotto'} aperto e acceso`}
                                className="related-card__img related-card__img--hover"
                            />
                        )}
                    </div>
                ) : (
                    <div className="related-card__img-placeholder" />
                )}

                <div className="related-card__body">
                    <h3>{item.name || 'Prodotto'}</h3>
                    <p>€ {formattedPrice}</p>
                </div>
            </article>
        </Link>
    );
}

// 7) Render sezione correlati e mappa delle card con comportamento hover uniforme.
function RelatedProducts({ products }) {
    if (!Array.isArray(products) || products.length === 0) {
        return null;
    }

    const safeProducts = products.filter(
        (item) => item && typeof item === 'object'
    );

    if (safeProducts.length === 0) {
        return null;
    }

    return (
        <section className="related-section" aria-labelledby="related-title">
            <div className="related-head">
                <p>Suggeriti</p>
                <h2 id="related-title">Prodotti correlati</h2>
            </div>

            <div className="related-grid">
                {safeProducts.map((item, index) => (
                    <RelatedProductCard
                        key={item.id || item.slug || index}
                        item={item}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
}

export default RelatedProducts;