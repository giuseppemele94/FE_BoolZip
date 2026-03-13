import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function CartDrawer({ isOpen, onClose }) {
    const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);

    const {
        cartItems,
        cartTotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    function handleOpenClearAlert() {
        setIsClearAlertOpen(true);
    }

    function handleCancelClearAlert() {
        setIsClearAlertOpen(false);
    }

    function handleConfirmClearCart() {
        clearCart();
        setIsClearAlertOpen(false);
    }

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setIsClearAlertOpen(false);
        }
    }, [isOpen]);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <div
                className={`cart-drawer__overlay ${isOpen ? "is-open" : ""}`}
                aria-hidden="true"
                onClick={onClose}
            />

            <aside
                className={`cart-drawer ${isOpen ? "is-open" : ""}`}
                aria-hidden={!isOpen}
                aria-label="Carrello rapido"
            >
                <header className="cart-drawer__header">
                    <div>
                        <p className="cart-drawer__eyebrow">Il tuo ordine</p>
                        <h2>Carrello</h2>
                    </div>

                    <button
                        type="button"
                        className="cart-drawer__close"
                        onClick={onClose}
                        aria-label="Chiudi carrello"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </header>

                {cartItems.length === 0 ? (
                    <div className="cart-drawer__empty">
                        <p>Il carrello è vuoto. Aggiungi un prodotto per iniziare.</p>
                        <Link to="/products" className="cart-drawer__link" onClick={onClose}>
                            Vai ai prodotti
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-drawer__list">
                            {cartItems.map((item) => (
                                <article key={item.product_id} className="cart-drawer-item">
                                    <Link
                                        to={`/products/${item.slug || item.product_id}`}
                                        className="cart-drawer-item__product-link cart-drawer-item__product-link--media"
                                        onClick={onClose}
                                        aria-label={`Apri dettaglio prodotto ${item.name}`}
                                    >
                                        <div className="cart-drawer-item__media">
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className={`cart-drawer-item__img ${item.hover_image_url ? "cart-drawer-item__img--base" : ""}`}
                                            />
                                            {item.hover_image_url && (
                                                <img
                                                    src={item.hover_image_url}
                                                    alt={`${item.name} aperto e acceso`}
                                                    className="cart-drawer-item__img cart-drawer-item__img--hover"
                                                />
                                            )}
                                        </div>
                                    </Link>

                                    <div className="cart-drawer-item__body">
                                        <Link
                                            to={`/products/${item.slug || item.product_id}`}
                                            className="cart-drawer-item__product-link"
                                            onClick={onClose}
                                        >
                                            <h3 className="cart-drawer-item__title">{item.name}</h3>
                                        </Link>
                                        <p className="cart-drawer-item__price">EUR {item.price.toFixed(2)}</p>

                                        <div className="cart-drawer-item__actions">
                                            <div className="cart-drawer-item__qty">
                                                <button
                                                    type="button"
                                                    aria-label="Diminuisci quantita"
                                                    onClick={() => decreaseQuantity(item.product_id)}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    aria-label="Aumenta quantita"
                                                    onClick={() => increaseQuantity(item.product_id)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                className="cart-drawer-item__remove"
                                                onClick={() => removeFromCart(item.product_id)}
                                            >
                                                Rimuovi
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <footer className="cart-drawer__footer">
                            <div className="cart-drawer__totals">
                                <span>{totalItems} articoli</span>
                                <strong>EUR {cartTotal.toFixed(2)}</strong>
                            </div>

                            <div className="cart-drawer__cta-wrap">
                                <Link to="/cart" className="cart-drawer__cta" onClick={onClose}>
                                    Vai al carrello completo
                                </Link>
                                <button
                                    type="button"
                                    className="cart-drawer__ghost"
                                    onClick={handleOpenClearAlert}
                                >
                                    Svuota carrello
                                </button>
                            </div>
                        </footer>
                    </>
                )}
            </aside>

            {isOpen && isClearAlertOpen && (
                <div className="cart-clear-alert" role="dialog" aria-modal="true" aria-labelledby="drawer-clear-alert-title">
                    <button
                        type="button"
                        className="cart-clear-alert__overlay"
                        aria-label="Chiudi conferma"
                        onClick={handleCancelClearAlert}
                    ></button>

                    <div className="cart-clear-alert__card">
                        <p className="cart-clear-alert__eyebrow">Attenzione</p>
                        <h2 id="drawer-clear-alert-title">Vuoi davvero pulire il carrello?</h2>
                        <p>
                            Tutti i prodotti verranno rimossi. Questa azione non può essere annullata.
                        </p>

                        <div className="cart-clear-alert__actions">
                            <button
                                type="button"
                                className="cart-clear-alert__btn cart-clear-alert__btn--ghost"
                                onClick={handleCancelClearAlert}
                            >
                                Annulla
                            </button>

                            <button
                                type="button"
                                className="cart-clear-alert__btn cart-clear-alert__btn--danger"
                                onClick={handleConfirmClearCart}
                            >
                                Conferma
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CartDrawer;
