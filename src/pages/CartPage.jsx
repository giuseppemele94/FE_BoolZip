import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
    // Recupero dal context tutti i dati e le funzioni utili del carrello.
    const {
        cartItems,
        cartTotal,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

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
                <h1>Il tuo carrello</h1>

                <button
                    type="button"
                    className="cart-page__clear-btn"
                    onClick={clearCart}
                >
                    Svuota carrello
                </button>
            </div>

            <div className="cart-page__content">
                <div className="cart-page__list">
                    {cartItems.map((item) => (
                        <article key={item.product_id} className="cart-item">
                            {/* Immagine prodotto */}
                            <div className="cart-item__media">
                                <img src={item.image_url} alt={item.name} />
                            </div>

                            {/* Info prodotto */}
                            <div className="cart-item__info">
                                <h2>{item.name}</h2>
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

                                <p className="cart-item__subtotal">
                                    Subtotale: € {(item.price * item.quantity).toFixed(2)}
                                </p>

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

                    <div className="cart-summary__row">
                        <span>Totale</span>
                        <strong>€ {cartTotal.toFixed(2)}</strong>
                    </div>

                    <button type="button" className="cart-summary__checkout">
                        Procedi al checkout
                    </button>
                </aside>
            </div>
        </section>
    );
}

export default CartPage;