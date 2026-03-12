import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const API_BASE_URL = "http://localhost:3000/api/orders";

function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();

    const [formData, setFormData] = useState({
        customer_name: "",
        customer_lastname: "",
        customer_phone: "",
        customer_email: "",
        customer_address: "",
        customer_billing_address: "",
        discount_code: "",
    });

    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const isCartEmpty = cartItems.length === 0;

    /*Totale scontato* */
    const discountedTotal = useMemo(() => {
        const total = Number(cartTotal) - Number(appliedDiscount || 0);
        return total > 0 ? total.toFixed(2) : "0.00";
    }, [cartTotal, appliedDiscount]);

    const formattedTotal = useMemo(() => {
        return Number(cartTotal).toFixed(2);
    }, [cartTotal]);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (isCartEmpty) {
            setErrorMessage("Il carrello è vuoto.");
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            setSuccessMessage("");

            const payload = {
                customer_name: formData.customer_name,
                customer_lastname: formData.customer_lastname,
                customer_phone: formData.customer_phone,
                customer_email: formData.customer_email,
                customer_address: formData.customer_address,
                customer_billing_address: formData.customer_billing_address,
                products: cartItems.map((item) => ({
                    id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                discount_code: formData.discount_code.trim() || null,
                discount_value: appliedDiscount || 0,
                session_id: `sess_${Date.now()}`,
            };

            const response = await axios.post(`${API_BASE_URL}/checkout`, payload);

            setSuccessMessage(
                `Il tuo ordine è stato eseguito con successo! ID ordine: ${response.data.id}`
            );

            clearCart();
        } catch (error) {
            console.error("Errore checkout:", error);

            const message =
                error.response?.data?.error ||
                "Si è verificato un errore durante il checkout.";

            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    }

    if (successMessage) {
        return (
            <section className="checkout-page checkout-page--success">
                <div className="checkout-success-card">
                    <h1>Ordine completato</h1>
                    <p>{successMessage}</p>

                    <div className="checkout-success-card__actions">
                        <Link to="/products" className="checkout-back-link">
                            Continua lo shopping
                        </Link>

                        <Link to="/" className="checkout-home-link">
                            Torna alla home
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    if (isCartEmpty) {
        return (
            <section className="checkout-page checkout-page--empty">
                <h1>Checkout</h1>
                <p>Il tuo carrello è vuoto.</p>

                <Link to="/products" className="checkout-back-link">
                    Vai ai prodotti
                </Link>
            </section>
        );
    }


    //Funzione per applicare il coupon e calcolare lo sconto
    async function handleApplyCoupon() {
        const code = formData.discount_code.trim();

        if (!code) {
            setCouponMessage("Inserisci un codice sconto.");
            setAppliedDiscount(0);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/discounts/check", {
                code,
            });

            if (response.data.valid) {
                setAppliedDiscount(Number(response.data.discount) || 0);
                setCouponMessage("Coupon applicato con successo.");
                setErrorMessage("");
            } else {
                setAppliedDiscount(0);
                setCouponMessage(response.data.message || "Coupon non valido.");
            }
        } catch (error) {
            console.error(error);
            setAppliedDiscount(0);
            setCouponMessage(
                error.response?.data?.message || "Errore nella verifica del coupon."
            );
        }
    }

    return (
        <section className="checkout-page">
            <div className="checkout-page__header">
                <h1>Checkout</h1>
                <p>Inserisci i tuoi dati per completare l’ordine.</p>
            </div>


            {errorMessage && (
                <div className="checkout-banner checkout-banner--error">
                    {errorMessage}
                </div>
            )}

            <div className="checkout-page__content">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="checkout-form__grid">
                        <div className="checkout-form__field">
                            <label htmlFor="customer_name">Nome</label>
                            <input
                                id="customer_name"
                                type="text"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="checkout-form__field">
                            <label htmlFor="customer_lastname">Cognome</label>
                            <input
                                id="customer_lastname"
                                type="text"
                                name="customer_lastname"
                                value={formData.customer_lastname}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="checkout-form__field">
                            <label htmlFor="customer_phone">Telefono</label>
                            <input
                                id="customer_phone"
                                type="text"
                                name="customer_phone"
                                value={formData.customer_phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="checkout-form__field">
                            <label htmlFor="customer_email">Email</label>
                            <input
                                id="customer_email"
                                type="email"
                                name="customer_email"
                                value={formData.customer_email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="checkout-form__field checkout-form__field--full">
                            <label htmlFor="customer_address">Indirizzo di spedizione</label>
                            <input
                                id="customer_address"
                                type="text"
                                name="customer_address"
                                value={formData.customer_address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="checkout-form__field checkout-form__field--full">
                            <label htmlFor="customer_billing_address">
                                Indirizzo di fatturazione
                            </label>
                            <input
                                id="customer_billing_address"
                                type="text"
                                name="customer_billing_address"
                                value={formData.customer_billing_address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="checkout-form__field checkout-form__field--full">
                            <label htmlFor="discount_code">Codice sconto (opzionale)</label>
                            <div className="checkout-form__coupon-row">
                                <input
                                    id="discount_code"
                                    type="text"
                                    name="discount_code"
                                    value={formData.discount_code}
                                    onChange={handleChange}
                                    placeholder="Inserisci il coupon"
                                />

                                <button
                                    type="button"
                                    className="checkout-form__coupon-btn"
                                    onClick={handleApplyCoupon}
                                >
                                    Applica
                                </button>
                            </div>
                        </div>

                        {couponMessage && (
                            <p className="checkout-form__message checkout-form__message--success">
                                {couponMessage}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="checkout-form__submit"
                        disabled={loading || !!successMessage}
                    >
                        {loading ? "Invio ordine..." : "Conferma ordine"}
                    </button>
                </form>

                <aside className="checkout-summary">
                    <h2>Riepilogo ordine</h2>

                    {!successMessage && (
                        <div className="checkout-summary__list">
                            {cartItems.map((item) => (
                                <article key={item.product_id} className="checkout-summary__item">
                                    <div className="checkout-summary__item-image">
                                        <img src={item.image_url} alt={item.name} />
                                    </div>

                                    <div className="checkout-summary__item-info">
                                        <h3>{item.name}</h3>
                                        <p>Quantità: {item.quantity}</p>
                                        <p>Prezzo: € {Number(item.price).toFixed(2)}</p>
                                        <p>
                                            Subtotale: €{" "}
                                            {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="checkout-summary__totals">
                        <div className="checkout-summary__row">
                            <span>Subtotale</span>
                            <span>€ {formattedTotal}</span>
                        </div>

                        {appliedDiscount > 0 && (
                            <div className="checkout-summary__row checkout-summary__row--discount">
                                <span>Sconto applicato</span>
                                <span>- € {Number(appliedDiscount).toFixed(2)}</span>
                            </div>
                        )}

                        <div className="checkout-summary__total">
                            <span>Totale</span>
                            <strong>€ {discountedTotal}</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}

export default CheckoutPage;