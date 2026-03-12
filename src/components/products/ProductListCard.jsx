import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_PRODUCTS_URL = 'http://localhost:3000/api/products';
const secondImageCache = new Map();
const secondImageRequestCache = new Map();

function normalizeImage(item) {
    if (typeof item === 'string') {
        return item;
    }

    if (!item || typeof item !== 'object') {
        return '';
    }

    return item.image_url || item.url || item.src || '';
}

function getProductImages(product) {
    const mainImage = normalizeImage(product?.image_url || product?.image);
    const extraImages = Array.isArray(product?.product_images)
        ? product.product_images.map(normalizeImage)
        : Array.isArray(product?.images)
            ? product.images.map(normalizeImage)
            : [];

    return [...new Set([mainImage, ...extraImages].filter(Boolean))];
}

async function fetchSecondDetailImage(productKey) {
    if (!productKey) {
        return '';
    }

    if (secondImageCache.has(productKey)) {
        return secondImageCache.get(productKey) || '';
    }

    if (secondImageRequestCache.has(productKey)) {
        return secondImageRequestCache.get(productKey);
    }

    const request = axios
        .get(`${API_PRODUCTS_URL}/${encodeURIComponent(productKey)}`)
        .then((response) => {
            const images = getProductImages(response.data);
            const secondImage = images[1] || '';
            secondImageCache.set(productKey, secondImage);
            return secondImage;
        })
        .catch(() => {
            secondImageCache.set(productKey, '');
            return '';
        })
        .finally(() => {
            secondImageRequestCache.delete(productKey);
        });

    secondImageRequestCache.set(productKey, request);
    return request;
}

function ProductListCard({ product }) {
    const { id, slug, name, price, image_url, image, images } = product;
    const productSlug = String(slug || id || '');
    const fallbackCardImage = image_url || image || (Array.isArray(images) ? images[0] : '');
    const productImages = getProductImages(product);
    const cardImage = productImages[0] || fallbackCardImage || '';
    const localSecondImage = productImages[1] || '';
    const [hoverImage, setHoverImage] = useState(
        localSecondImage || secondImageCache.get(productSlug) || ''
    );
    const isFetchingRef = useRef(false);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        setHoverImage(localSecondImage || secondImageCache.get(productSlug) || '');
    }, [localSecondImage, productSlug]);

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
    const numericPrice = Number(price);
    const formattedPrice = Number.isFinite(numericPrice)
        ? new Intl.NumberFormat('it-IT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericPrice)
        : '0,00';

    return (
        <article className="catalog-card" onMouseEnter={handleCardHover}>
            <Link
                to={`/products/${productSlug}`}
                className="catalog-card-link"
                onFocus={handleCardHover}
            >
                <div className="catalog-card__media">
                    <img
                        src={cardImage}
                        alt={name}
                        className={`catalog-card__img ${hasHoverImage ? 'catalog-card__img--base' : ''}`}
                    />

                    {hasHoverImage && (
                        <img
                            src={hoverImage}
                            alt={`${name} aperto e acceso`}
                            className="catalog-card__img catalog-card__img--hover"
                        />
                    )}
                </div>

                <div className="catalog-card__body">

                    <h3>{name}</h3>

                    <div className="catalog-card__bottom">
                        <span className="catalog-card__price">€ {formattedPrice}</span>
                    </div>
                </div>
            </Link>

            <button className="catalog-card__cart-btn">
                Aggiungi al carrello
            </button>
        </article>
    );
}

export default ProductListCard;
