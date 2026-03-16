import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function MainHeader() {
    // Stato che serve per capire se la pagina è stata scrollata,
    // così possiamo aggiungere una classe diversa all'header.
    const [scrolled, setScrolled] = useState(false);
    const [flyItems, setFlyItems] = useState([]);
    const [isCartPulseActive, setIsCartPulseActive] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const cartButtonRef = useRef(null);
    const { wishlistCount } = useWishlist();

    // Recupero dal context il numero totale di prodotti nel carrello.
    const { cartCount, toggleCartDrawer } = useCart();

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

    useEffect(() => {
        const handleProductAdded = (event) => {
            const cartRect = cartButtonRef.current?.getBoundingClientRect();

            if (!cartRect) {
                return;
            }

            const sourceRect = event.detail?.sourceRect;
            const startX = sourceRect ? sourceRect.left + sourceRect.width / 2 : window.innerWidth / 2;
            const startY = sourceRect ? sourceRect.top + sourceRect.height / 2 : window.innerHeight / 2;
            const endX = cartRect.left + cartRect.width / 2;
            const endY = cartRect.top + cartRect.height / 2;
            const itemId = Date.now() + Math.random();

            setFlyItems((prev) => [
                ...prev,
                {
                    id: itemId,
                    image: event.detail?.image_url || "/images/logoBoolZip.png",
                    startX,
                    startY,
                    deltaX: endX - startX,
                    deltaY: endY - startY,
                },
            ]);

            setIsCartPulseActive(true);

            window.setTimeout(() => {
                setFlyItems((prev) => prev.filter((item) => item.id !== itemId));
            }, 700);

            window.setTimeout(() => {
                setIsCartPulseActive(false);
            }, 550);
        };

        window.addEventListener("cart:product-added", handleProductAdded);

        return () => {
            window.removeEventListener("cart:product-added", handleProductAdded);
        };
    }, []);

    const handleOpenCart = () => {
        toggleCartDrawer();
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        // Aggiungo una classe dinamica se l'utente ha scrollato la pagina.
        <>
            <div className="site-shipping-bar" role="status" aria-live="polite">
                Spedizione gratuita per ordini superiori a € 69,99
            </div>

            <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
                <div className="site-header__inner">

                    {/* Logo del sito cliccabile che riporta alla homepage */}
                    <Link to="/" className="site-header__brand" onClick={closeMobileMenu}>
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
                        <button
                            type="button"
                            ref={cartButtonRef}
                            onClick={handleOpenCart}
                            className={`site-header__icon-btn site-header__cart-btn ${isCartPulseActive ? "is-pulse" : ""}`}
                            aria-label="Carrello"
                        >
                            <i className="bi bi-cart2"></i>

                            {/* Mostro il badge solo se nel carrello c'è almeno un prodotto */}
                            {cartCount > 0 && (
                                <span className="site-header__cart-count">{cartCount}</span>
                            )}
                        </button>


                        {/* Pulsante wishlist */}
                        <Link
                            to="/wishlist"
                            className="site-header__icon-btn site-header__wishlist-btn"
                            aria-label="Preferiti"
                        >
                            <i className="bi bi-suit-heart"></i>

                            {wishlistCount > 0 && (
                                <span className="site-header__cart-count">{wishlistCount}</span>
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
                            aria-label={isMobileMenuOpen ? "Chiudi menu" : "Apri menu"}
                            aria-expanded={isMobileMenuOpen}
                            onClick={toggleMobileMenu}
                        >
                            <i className={`bi ${isMobileMenuOpen ? "bi-x-lg" : "bi-list"}`}></i>
                        </button>
                    </div>
                </div>
                <div className={`mobile-menu ${isMobileMenuOpen ? "is-open" : ""}`}>
                    <NavLink to="/" className="mobile-menu__link" onClick={closeMobileMenu}>
                        Home
                    </NavLink>
                    <NavLink to="/products" className="mobile-menu__link" onClick={closeMobileMenu}>
                        Prodotti
                    </NavLink>
                    <NavLink to="/storia" className="mobile-menu__link" onClick={closeMobileMenu}>
                        Storia
                    </NavLink>
                    <NavLink to="/login" className="mobile-menu__link" onClick={closeMobileMenu}>
                        Login
                    </NavLink>
                </div>
            </header>

            <div className="cart-fly-layer" aria-hidden="true">
                {flyItems.map((item) => (
                    <img
                        key={item.id}
                        src={item.image}
                        alt=""
                        className="cart-fly-item"
                        style={{
                            left: `${item.startX}px`,
                            top: `${item.startY}px`,
                            "--fly-x": `${item.deltaX}px`,
                            "--fly-y": `${item.deltaY}px`,
                        }}
                    />
                ))}
            </div>
        </>
    );
}

export default MainHeader;