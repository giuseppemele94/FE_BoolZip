import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext();

function normalizeWishlistProduct(product) {
    if (!product) return null;

    return {
        id: product.id ?? product.slug,
        slug: String(product.slug ?? product.id ?? ""),
        name: product.name ?? "",
        price: product.price ?? 0,
        image_url:
            product.image_url ||
            product.image ||
            (Array.isArray(product.images) ? product.images[0] : "") ||
            "",
    };
}

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const storedItems = localStorage.getItem("wishlistItems");
        return storedItems ? JSON.parse(storedItems) : [];
    });

    useEffect(() => {
        localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const toggleWishlist = (product) => {
        const normalizedProduct = normalizeWishlistProduct(product);
        if (!normalizedProduct) return;

        setWishlistItems((prev) => {
            const exists = prev.some(
                (item) => String(item.id) === String(normalizedProduct.id)
            );

            if (exists) {
                return prev.filter(
                    (item) => String(item.id) !== String(normalizedProduct.id)
                );
            }

            return [...prev, normalizedProduct];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems((prev) =>
            prev.filter((item) => String(item.id) !== String(productId))
        );
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(
            (item) => String(item.id) === String(productId)
        );
    };
    const clearWishlist = () => {
        setWishlistItems([]);
    };
    const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                wishlistCount,
                toggleWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}