import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function WishlistPage() {
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const { addToCart } = useCart();

    return (
        <section className="wishlist-page">
            <div className="container">
                <div className="wishlist-page__head">
                    <p className="catalog__eyebrow">Preferiti</p>
                    <h1 className="wishlist-page__title">La tua wishlist</h1>
                    <p className="wishlist-page__description">
                        Salva i tuoi BoolZip preferiti e ritrovali subito quando vuoi.
                    </p>

                    {wishlistItems.length > 0 && (
                        <button
                            type="button"
                            className="wishlist-page__clear-btn"
                            onClick={() => setShowClearConfirm(true)}
                        >
                            Svuota wishlist
                        </button>
                    )}
                </div>

                {showClearConfirm && (
                    <div className="wishlist-confirm-overlay">
                        <div className="wishlist-confirm-modal">
                            <h3>Svuotare la wishlist?</h3>
                            <p>Questa azione rimuoverà tutti i prodotti salvati.</p>

                            <div className="wishlist-confirm-actions">
                                <button
                                    type="button"
                                    className="wishlist-confirm-btn wishlist-confirm-btn--secondary"
                                    onClick={() => setShowClearConfirm(false)}
                                >
                                    Annulla
                                </button>

                                <button
                                    type="button"
                                    className="wishlist-confirm-btn wishlist-confirm-btn--danger"
                                    onClick={() => {
                                        clearWishlist();
                                        setShowClearConfirm(false);
                                    }}
                                >
                                    Svuota
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {wishlistItems.length === 0 ? (
                    <div className="wishlist-empty">
                        <h2>Nessun preferito salvato</h2>
                        <p>
                            Aggiungi i prodotti che ti piacciono cliccando sul cuore.
                        </p>
                        <Link to="/products" className="wishlist-empty__cta">
                            Vai al catalogo
                        </Link>
                    </div>
                ) : (
                    <div className="catalog__grid">
                        {wishlistItems.map((product) => {
                            const numericPrice = Number(product.price);
                            const formattedPrice = Number.isFinite(numericPrice)
                                ? new Intl.NumberFormat("it-IT", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(numericPrice)
                                : "0,00";

                            return (
                                <article className="catalog-card" key={product.id}>
                                    <button
                                        type="button"
                                        className="catalog-card__wishlist-btn is-active"
                                        onClick={() => removeFromWishlist(product.id)}
                                        aria-label="Rimuovi dai preferiti"
                                    >
                                        <i className="bi bi-heart-fill"></i>
                                    </button>

                                    <Link
                                        to={`/products/${product.slug}`}
                                        className="catalog-card-link"
                                    >
                                        <div className="catalog-card__media">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="catalog-card__img"
                                            />
                                        </div>

                                        <div className="catalog-card__body">
                                            <h3>{product.name}</h3>
                                            <div className="catalog-card__bottom">
                                                <span className="catalog-card__price">
                                                    € {formattedPrice}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <button
                                        type="button"
                                        className="catalog-card__cart-btn"
                                        onClick={() => addToCart(product, 1)}
                                    >
                                        Aggiungi al carrello
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default WishlistPage;