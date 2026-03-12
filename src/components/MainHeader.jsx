import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function MainHeader() {
    // Stato che serve per capire se la pagina è stata scrollata,
    // così possiamo aggiungere una classe diversa all'header.
    const [scrolled, setScrolled] = useState(false);

    // Recupero dal context il numero totale di prodotti nel carrello.
    const { cartCount } = useCart();

    useEffect(() => {
        // Funzione che controlla la posizione dello scroll verticale.
        const handleScroll = () => {
            // Se scendo oltre 20px, attivo lo stato "scrolled".
            setScrolled(window.scrollY > 20);
        };

        // Aggiungo il listener allo scroll della finestra.
        window.addEventListener("scroll", handleScroll);

        // Cleanup: rimuovo il listener quando il componente viene smontato.
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        // Aggiungo una classe dinamica se l'utente ha scrollato la pagina.
        <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
            <div className="site-header__inner">

                {/* Logo del sito cliccabile che riporta alla homepage */}
                <Link to="/" className="site-header__brand">
                    <img
                        src="/images/logoBoolZip.png"
                        alt="BoolZip"
                        className="header-logo"
                    />
                </Link>

                {/* Menu di navigazione principale desktop */}
                <nav className="site-header__nav">
                    <NavLink to="/" className="site-header__link">
                        Home
                    </NavLink>
                    <NavLink to="/products" className="site-header__link">
                        Prodotti
                    </NavLink>
                    <NavLink to="/storia" className="site-header__link">
                        Storia
                    </NavLink>
                </nav>

                {/* Area azioni a destra: carrello, login, menu mobile */}
                <div className="site-header__actions">

                    {/* Pulsante/link del carrello */}
                    <Link
                        to="/cart"
                        className="site-header__icon-btn site-header__cart-btn"
                        aria-label="Carrello"
                    >
                        <i className="bi bi-cart4"></i>

                        {/* Mostro il badge solo se nel carrello c'è almeno un prodotto */}
                        {cartCount > 0 && (
                            <span className="site-header__cart-count">{cartCount}</span>
                        )}
                    </Link>

                    {/* Pulsante login visibile nella versione desktop */}
                    <Link
                        to="/login"
                        className="site-header__login site-header__login--desktop"
                        aria-label="Login"
                    >
                        <i className="bi bi-person"></i>
                    </Link>

                    {/* Bottone hamburger per il menu mobile */}
                    <button
                        type="button"
                        className="site-header__menu-toggle"
                        aria-label="Apri menu"
                    >
                        <i className="bi bi-list"></i>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default MainHeader;