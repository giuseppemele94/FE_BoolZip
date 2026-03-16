import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/newsletter";

function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const alreadyClosed = localStorage.getItem("newsletterPopupClosed");
        const alreadySubscribed = localStorage.getItem("newsletterSubscribed");

        if (alreadyClosed || alreadySubscribed) return;

        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("newsletterPopupClosed", "true");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage("Inserisci un'email valida.");
            setIsSuccess(false);
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            await axios.post(API_URL, { email });

            setMessage("Iscrizione avvenuta con successo!");
            setIsSuccess(true);
            localStorage.setItem("newsletterSubscribed", "true");

            setTimeout(() => {
                setIsOpen(false);
            }, 1500);
        } catch (error) {
            console.error(error);

            const backendMessage =
                error.response?.data?.message || "Si è verificato un errore. Riprova.";

            setMessage(backendMessage);
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="newsletter-popup-overlay">
            <div className="newsletter-popup">
                <button
                    type="button"
                    className="newsletter-popup__close"
                    onClick={handleClose}
                    aria-label="Chiudi popup"
                >
                    ×
                </button>

                <p className="newsletter-popup__eyebrow">Benvenuto su BoolZip</p>
                <h2 className="newsletter-popup__title">
                    Iscriviti alla newsletter
                </h2>
                <p className="newsletter-popup__text">
                    Ricevi novità, nuovi arrivi e offerte esclusive direttamente via email.
                </p>

                <form onSubmit={handleSubmit} className="newsletter-popup__form">
                    <input
                        type="email"
                        placeholder="Inserisci la tua email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="newsletter-popup__input"
                    />

                    <button
                        type="submit"
                        className="newsletter-popup__button"
                        disabled={loading}
                    >
                        {loading ? "Invio..." : "Iscriviti"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`newsletter-popup__message ${isSuccess ? "is-success" : "is-error"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default NewsletterPopup;