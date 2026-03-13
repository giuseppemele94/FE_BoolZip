import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
    const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);

    // Recupero dal context tutti i dati e le funzioni utili del carrello.
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

    // Se il carrello è vuoto, mostro uno stato empty.
    if (cartItems.length === 0) {
        return (
            <section className="cart-page cart-page--empty">
                <h1>Il tuo carrello è vuoto</h1>
                <p>Non hai ancora aggiunto prodotti.</p>

                <Link to="/products" className="cart-page__back-link">
                    Vai ai prodotti
                </Link>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <div className="cart-page__header">
                <div>
                    <p className="cart-page__eyebrow">Rivedi il tuo ordine</p>
                    <h1>Il tuo carrello</h1>
                </div>

                <button
                    type="button"
                    className="cart-page__clear-btn"
                    onClick={handleOpenClearAlert}
                >
                    Pulisci carrello
                </button>
            </div>

            <div className="cart-page__content">
                <div className="cart-page__list">
                    {cartItems.map((item) => (
                        <article key={item.product_id} className="cart-item">
                            {/* Immagine prodotto */}
                            <Link
                                to={`/products/${item.slug || item.product_id}`}
                                className="cart-item__product-link cart-item__product-link--media"
                                aria-label={`Apri dettaglio prodotto ${item.name}`}
                            >
                                <div className="cart-item__media">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className={`cart-item__img ${item.hover_image_url ? "cart-item__img--base" : ""}`}
                                    />
                                    {item.hover_image_url && (
                                        <img
                                            src={item.hover_image_url}
                                            alt={`${item.name} aperto e acceso`}
                                            className="cart-item__img cart-item__img--hover"
                                        />
                                    )}
                                </div>
                            </Link>

                            {/* Info prodotto */}
                            <div className="cart-item__info">
                                <Link
                                    to={`/products/${item.slug || item.product_id}`}
                                    className="cart-item__product-link"
                                >
                                    <h2 className="cart-item__title">{item.name}</h2>
                                </Link>
                                <p className="cart-item__price">
                                    € {item.price.toFixed(2)}
                                </p>

                                <div className="cart-item__quantity">
                                    <button
                                        type="button"
                                        onClick={() => decreaseQuantity(item.product_id)}
                                        aria-label="Diminuisci quantità"
                                    >
                                        -
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        type="button"
                                        onClick={() => increaseQuantity(item.product_id)}
                                        aria-label="Aumenta quantità"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="cart-item__subtotal-row">
                                    <p className="cart-item__subtotal-label">Subtotale</p>
                                    <p className="cart-item__subtotal">
                                        € {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="cart-item__remove"
                                    onClick={() => removeFromCart(item.product_id)}
                                >
                                    Rimuovi
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Riepilogo ordine */}
                <aside className="cart-summary">
                    <h2>Riepilogo</h2>
                    <p className="cart-summary__hint">Consegna standard in 2-4 giorni lavorativi.</p>

                    <div className="cart-summary__row">
                        <span>Totale</span>
                        <strong>€ {cartTotal.toFixed(2)}</strong>
                    </div>

                    <Link to="/checkout" className="cart-summary__checkout">
                        Procedi al checkout
                    </Link>
                </aside>
            </div>

            {isClearAlertOpen && (
                <div className="cart-clear-alert" role="dialog" aria-modal="true" aria-labelledby="cart-clear-alert-title">
                    <button
                        type="button"
                        className="cart-clear-alert__overlay"
                        aria-label="Chiudi conferma"
                        onClick={handleCancelClearAlert}
                    ></button>

                    <div className="cart-clear-alert__card">
                        <p className="cart-clear-alert__eyebrow">Attenzione</p>
                        <h2 id="cart-clear-alert-title">Vuoi davvero pulire il carrello?</h2>
                        <p>
                            Tutti i prodotti verranno rimossi. Questa azione non puo essere annullata.
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
        </section>
    );
}

export default CartPage;