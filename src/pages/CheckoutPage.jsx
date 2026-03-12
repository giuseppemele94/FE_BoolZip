import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const API_BASE_URL = "http://localhost:3000/api/orders";

function CheckoutPage() {
  const navigate = useNavigate();

  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_lastname: "",
    customer_phone: "",
    customer_email: "",
    customer_address: "",
    customer_billing_address: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isCartEmpty = cartItems.length === 0;

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
        discount_code: null,
        discount_value: 0,
        session_id: `sess_${Date.now()}`,
      };

      const response = await axios.post(`${API_BASE_URL}/checkout`, payload);

      clearCart();

      setSuccessMessage(
        `Ordine creato con successo! ID ordine: ${response.data.id}`
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);
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

  return (
    <section className="checkout-page">
      <div className="checkout-page__header">
        <h1>Checkout</h1>
        <p>Inserisci i tuoi dati per completare l’ordine.</p>
      </div>

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
          </div>

          {errorMessage && (
            <p className="checkout-form__message checkout-form__message--error">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="checkout-form__message checkout-form__message--success">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="checkout-form__submit"
            disabled={loading}
          >
            {loading ? "Invio ordine..." : "Conferma ordine"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Riepilogo ordine</h2>

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

          <div className="checkout-summary__total">
            <span>Totale</span>
            <strong>€ {formattedTotal}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;