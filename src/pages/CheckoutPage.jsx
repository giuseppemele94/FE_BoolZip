import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

// URL base delle API ordini del backend
const API_BASE_URL = "http://localhost:3000/api/orders";

function CheckoutPage() {
    const bodyLogoClassName = "body--logo-background";
    const termsAcceptanceError = "Devi accettare i termini e condizioni per completare l'ordine.";

    // Recupero dal context:
    // - i prodotti nel carrello
    // - il totale base del carrello
    // - la funzione per svuotarlo dopo ordine concluso
    const {
        cartItems,
        cartTotal,
        clearCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    // Stato del form checkout:
    // contiene i dati cliente e l'eventuale codice sconto inserito
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_lastname: "",
        customer_phone: "",
        customer_email: "",

        shipping_street: "",
        shipping_zip: "",
        shipping_city: "",

        billing_street: "",
        billing_zip: "",
        billing_city: "",

        discount_code: "",
    });

    // Stato dello sconto applicato.
    // Viene aggiornato dopo la verifica del coupon lato backend.
    const [appliedDiscount, setAppliedDiscount] = useState(0);

    // Messaggio legato al coupon:
    // ad esempio "coupon applicato" oppure errore sul coupon
    const [couponMessage, setCouponMessage] = useState("");
    const [couponStatus, setCouponStatus] = useState("idle");

    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    // Stato di caricamento durante la conferma dell'ordine
    const [loading, setLoading] = useState(false);

    // Messaggio di errore generico del checkout
    const [errorMessage, setErrorMessage] = useState("");

    // Messaggio di successo mostrato dopo il checkout completato
    const [successMessage, setSuccessMessage] = useState("");

    //use state per la checkbox indirizzo di fatturazione=spedizione
    const [sameBillingAddress, setSameBillingAddress] = useState(true);

    // Verifico se il carrello è vuoto
    const isCartEmpty = cartItems.length === 0;

    useEffect(() => {
        if (successMessage) {
            document.body.classList.add(bodyLogoClassName);

            return () => {
                document.body.classList.remove(bodyLogoClassName);
            };
        }

        document.body.classList.remove(bodyLogoClassName);

        return () => {
            document.body.classList.remove(bodyLogoClassName);
        };
    }, [successMessage]);

    /*
      Calcolo del totale scontato mostrato nel riepilogo.
      Questo valore è solo una preview lato frontend:
      il calcolo definitivo deve comunque essere confermato dal backend.
    */
    const discountedTotal = useMemo(() => {
        const total = Number(cartTotal) - Number(appliedDiscount || 0);
        return total > 0 ? total.toFixed(2) : "0.00";
    }, [cartTotal, appliedDiscount]);

    // Totale originale del carrello, senza sconto
    const formattedTotal = useMemo(() => {
        return Number(cartTotal).toFixed(2);
    }, [cartTotal]);

    // Spedizione gratuita oltre 70€ (sul totale scontato), altrimenti 3,99€
    const shippingCost = useMemo(() => {
        return Number(discountedTotal) >= 70 ? 0 : 3.99;
    }, [discountedTotal]);

    // Totale finale comprensivo di spedizione
    const finalTotal = useMemo(() => {
        return (Number(discountedTotal) + shippingCost).toFixed(2);
    }, [discountedTotal, shippingCost]);

    //funzione per comporre la stringa dell'indirizzo completo a partire dai singoli campi street, zip e city
    function buildFullAddress(street, zip, city) {
        return [street, zip, city]
            .map((value) => String(value || "").trim())
            .filter(Boolean)
            .join(", ");
    }

    // Funzione generica per aggiornare i campi del form
    function handleChange(e) {
        const { name, value } = e.target;

        if (name === "discount_code") {
            setCouponMessage("");
            setCouponStatus("idle");
            setAppliedDiscount(0);
        }

        setFormData((prev) => {
            const updatedData = {
                ...prev,
                [name]: value,
            };

            if (sameBillingAddress) {
                if (name === "shipping_street") {
                    updatedData.billing_street = value;
                }

                if (name === "shipping_zip") {
                    updatedData.billing_zip = value;
                }

                if (name === "shipping_city") {
                    updatedData.billing_city = value;
                }
            }

            return updatedData;
        });
    }


    function handleIncreaseItem(productId) {
        increaseQuantity(productId);
    }

    function handleDecreaseItem(productId, currentQuantity) {
        if (currentQuantity <= 1) {
            removeFromCart(productId);
            return;
        }

        decreaseQuantity(productId);
    }

    function handleRemoveItem(productId) {
        removeFromCart(productId);
    }

    // Funzione per gestire il cambio dello stato della checkbox "stesso indirizzo di fatturazione"
    function handleSameBillingAddressChange(e) {
        const isChecked = e.target.checked;
        setSameBillingAddress(isChecked);

        setFormData((prev) => ({
            ...prev,
            billing_street: isChecked ? prev.shipping_street : "",
            billing_zip: isChecked ? prev.shipping_zip : "",
            billing_city: isChecked ? prev.shipping_city : "",
        }));
    }
    /*
      Invio del checkout:
      - raccoglie i dati del cliente
      - costruisce il payload
      - invia tutto al backend
      - in caso di successo svuota il carrello
      - mostra il messaggio finale di conferma
    */
    async function handleSubmit(e) {

        // Costruisco le stringhe degli indirizzi completi da mandare al backend, a partire dai singoli campi
        const fullShippingAddress = buildFullAddress(
            formData.shipping_street,
            formData.shipping_zip,
            formData.shipping_city
        );

        const fullBillingAddress = sameBillingAddress
            ? fullShippingAddress
            : buildFullAddress(
                formData.billing_street,
                formData.billing_zip,
                formData.billing_city
            );
        e.preventDefault();

        // Blocco di sicurezza: se il carrello è vuoto non procedo
        if (isCartEmpty) {
            setErrorMessage("Il carrello è vuoto.");
            return;
        }

        if (!hasAcceptedTerms) {
            setErrorMessage(termsAcceptanceError);
            setIsTermsOpen(true);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            setSuccessMessage("");

            // Payload inviato al backend
            const payload = {
                customer_name: formData.customer_name,
                customer_lastname: formData.customer_lastname,
                customer_phone: formData.customer_phone,
                customer_email: formData.customer_email,
                customer_address: fullShippingAddress,
                customer_billing_address: fullBillingAddress,

                // Trasformo i prodotti del carrello nel formato atteso dal backend
                products: cartItems.map((item) => ({
                    id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                })),

                // Se il coupon non è stato inserito mando null
                discount_code: formData.discount_code.trim() || null,

                // Valore dello sconto applicato lato FE
                // Il backend dovrebbe comunque validarlo/ricalcolarlo
                discount_value: appliedDiscount || 0,

                // Session id semplice generata lato frontend
                session_id: `sess_${Date.now()}`,
            };

            // POST al backend per creare l'ordine
            const response = await axios.post(`${API_BASE_URL}/checkout`, payload);

            // Salvo il messaggio di successo da mostrare in pagina
            setSuccessMessage(
                `Il tuo ordine è stato eseguito con successo! ID ordine: ${response.data.id}`
            );

            // Svuoto il carrello dopo la conferma dell'ordine
            clearCart();
        } catch (error) {
            console.error("Errore checkout:", error);

            // Recupero eventuale messaggio di errore dal backend
            const message =
                error.response?.data?.error ||
                "Si è verificato un errore durante il checkout.";

            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    }

    /*
      Se l'ordine è stato completato con successo,
      mostro una schermata finale di conferma al posto del form checkout.
    */
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

    /*
      Se il carrello è vuoto e non c'è un ordine appena completato,
      mostro una schermata vuota con link ai prodotti.
    */
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

    /*
      Funzione che verifica il coupon lato backend.
      Il frontend manda il codice inserito alla route di controllo coupon.
      Se il coupon è valido, salva lo sconto nello stato.
    */
    async function handleApplyCoupon() {
        const code = formData.discount_code.trim();

        // Se il campo è vuoto mostro subito un messaggio
        if (!code) {
            setCouponMessage("Inserisci un codice sconto.");
            setCouponStatus("error");
            setAppliedDiscount(0);
            return;
        }

        try {
            // Chiamata alla route backend per la verifica del coupon
            const response = await axios.post("http://localhost:3000/api/discounts/check", {
                code,
            });

            if (response.data.valid) {
                // Se il coupon è valido salvo il valore dello sconto
                setAppliedDiscount(Number(response.data.discount) || 0);
                setCouponMessage("Coupon applicato con successo.");
                setCouponStatus("success");
                setErrorMessage("");
            } else {
                // Se non è valido, resetto sconto e mostro il messaggio ricevuto
                setAppliedDiscount(0);
                setCouponMessage(response.data.message || "Coupon non valido.");
                setCouponStatus("error");
            }
        } catch (error) {
            console.error(error);

            // In caso di errore backend o di rete
            setAppliedDiscount(0);
            setCouponStatus("error");
            setCouponMessage(
                error.response?.data?.message || "Errore nella verifica del coupon."
            );
        }
    }

    return (
        <section className="checkout-page">
            {/* Header della pagina checkout */}
            <div className="checkout-page__header">
                <h1>Checkout</h1>
                <p>Inserisci i tuoi dati per completare l’ordine.</p>
            </div>

            {/* Banner errore generico del checkout */}
            {errorMessage && (
                <div className="checkout-banner checkout-banner--error">
                    {errorMessage}
                </div>
            )}

            <div className="checkout-page__content">
                {/* Form principale del checkout */}
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
                            <h3 className="checkout-form__section-title">Indirizzo di spedizione</h3>

                            <label htmlFor="shipping_street"></label>
                            <input
                                id="shipping_street"
                                type="text"
                                name="shipping_street"
                                value={formData.shipping_street}
                                onChange={handleChange}
                                required
                                placeholder="Via e numero civico"
                            />
                        </div>

                        <div className="checkout-form__field">
                            <label htmlFor="shipping_zip"></label>
                            <input
                                id="shipping_zip"
                                type="text"
                                name="shipping_zip"
                                value={formData.shipping_zip}
                                onChange={handleChange}
                                required
                                placeholder="CAP"
                            />
                        </div>

                        <div className="checkout-form__field">
                            <label htmlFor="shipping_city"></label>
                            <input
                                id="shipping_city"
                                type="text"
                                name="shipping_city"
                                value={formData.shipping_city}
                                onChange={handleChange}
                                required
                                placeholder="Città"
                            />
                        </div>


                        <div className="checkout-form__field checkout-form__field--full">
                            <label className="checkout-form__checkbox" htmlFor="same_billing_address">
                                <input
                                    id="same_billing_address"
                                    type="checkbox"
                                    checked={sameBillingAddress}
                                    onChange={handleSameBillingAddressChange}
                                />
                                <span>L’indirizzo di fatturazione coincide con quello di spedizione</span>
                            </label>
                        </div>

                        {/*Se la checkbox "stesso indirizzo di fatturazione" è deselezionata, mostro i campi per l'indirizzo di fatturazione*/}
                        {!sameBillingAddress && (
                            <>
                                <div className="checkout-form__field checkout-form__field--full">
                                    <h3 className="checkout-form__section-title">Indirizzo di fatturazione</h3>

                                    <label htmlFor="billing_street"></label>
                                    <input
                                        id="billing_street"
                                        type="text"
                                        name="billing_street"
                                        value={formData.billing_street}
                                        onChange={handleChange}
                                        required={!sameBillingAddress}
                                        placeholder="Via e numero civico"
                                    />
                                </div>

                                <div className="checkout-form__field">
                                    <label htmlFor="billing_zip"> </label>
                                    <input
                                        id="billing_zip"
                                        type="text"
                                        name="billing_zip"
                                        value={formData.billing_zip}
                                        onChange={handleChange}
                                        required={!sameBillingAddress}
                                        placeholder="CAP"
                                    />
                                </div>

                                <div className="checkout-form__field">
                                    <label htmlFor="billing_city"></label>
                                    <input
                                        id="billing_city"
                                        type="text"
                                        name="billing_city"
                                        value={formData.billing_city}
                                        onChange={handleChange}
                                        required={!sameBillingAddress}
                                        placeholder="Città"
                                    />
                                </div>
                            </>
                        )}

                        {/* Campo coupon opzionale */}
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

                                {/* Pulsante che verifica il coupon */}
                                <button
                                    type="button"
                                    className="checkout-form__coupon-btn"
                                    onClick={handleApplyCoupon}
                                >
                                    Applica
                                </button>
                            </div>
                        </div>

                        {/* Messaggio legato al coupon */}
                        {couponMessage && (
                            <p
                                className={`checkout-form__message checkout-form__message--${couponStatus === "error" ? "error" : "success"}`}
                            >
                                {couponMessage}
                            </p>
                        )}

                        <div className="checkout-form__field checkout-form__field--full">
                            <div className="checkout-form__terms-row">
                                <label className="checkout-form__checkbox" htmlFor="accept_terms">
                                    <input
                                        id="accept_terms"
                                        type="checkbox"
                                        checked={hasAcceptedTerms}
                                        onChange={(event) => {
                                            setHasAcceptedTerms(event.target.checked);

                                            if (errorMessage === termsAcceptanceError) {
                                                setErrorMessage("");
                                            }
                                        }}
                                    />
                                    <span>Accetto i</span>
                                </label>

                                <button
                                    type="button"
                                    className="checkout-form__terms-link"
                                    aria-expanded={isTermsOpen}
                                    aria-controls="checkout-terms-panel"
                                    onClick={() => setIsTermsOpen((currentValue) => !currentValue)}
                                >
                                    termini e condizioni
                                </button>
                            </div>

                            {isTermsOpen && (
                                <div id="checkout-terms-panel" className="checkout-form__terms-panel">
                                    <p>
                                        L&apos;ordine viene elaborato solo dopo la verifica dei dati inseriti,
                                        della disponibilita dei prodotti e della conferma del pagamento.
                                    </p>
                                    <p>
                                        Procedendo accetti le condizioni di vendita, i tempi di consegna e il
                                        trattamento dei dati necessario alla gestione dell&apos;ordine.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pulsante finale di conferma ordine */}
                    <button
                        type="submit"
                        className="checkout-form__submit"
                        disabled={loading || !!successMessage}
                    >
                        {loading ? "Invio ordine..." : "Conferma ordine"}
                    </button>
                </form>

                {/* Riepilogo ordine laterale */}
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
                                        <div className="checkout-summary__item-top">
                                            <h3>{item.name}</h3>

                                            <button
                                                type="button"
                                                className="checkout-summary__remove"
                                                onClick={() => handleRemoveItem(item.product_id)}
                                                aria-label={`Rimuovi ${item.name} dal carrello`}
                                            >
                                                Rimuovi
                                            </button>
                                        </div>

                                        <p>Prezzo: € {Number(item.price).toFixed(2)}</p>

                                        <div className="checkout-summary__quantity-controls">
                                            <button
                                                type="button"
                                                className="checkout-summary__qty-btn"
                                                onClick={() => handleDecreaseItem(item.product_id, item.quantity)}
                                                aria-label={`Diminuisci quantità di ${item.name}`}
                                            >
                                                -
                                            </button>

                                            <span className="checkout-summary__qty-value">{item.quantity}</span>

                                            <button
                                                type="button"
                                                className="checkout-summary__qty-btn"
                                                onClick={() => handleIncreaseItem(item.product_id)}
                                                aria-label={`Aumenta quantità di ${item.name}`}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p>
                                            Subtotale: €{" "}
                                            {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Totali finali */}
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

                        <div className={`checkout-summary__row${shippingCost === 0 ? " checkout-summary__row--shipping-free" : ""}`}>
                            <span>Spedizione</span>
                            <span>{shippingCost === 0 ? "Gratuita" : `€ ${shippingCost.toFixed(2)}`}</span>
                        </div>

                        <div className="checkout-summary__total">
                            <span>Totale</span>
                            <strong>€ {finalTotal}</strong>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}

export default CheckoutPage;