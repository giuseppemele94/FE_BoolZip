import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

function MainHeader() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
            <div className="site-header__inner">
                <Link to="/" className="site-header__brand">
                    <img
                        src="/images/logoBoolZip.png"
                        alt="BoolZip"
                        className="header-logo"
                    />
                </Link>

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

                <div className="site-header__actions">
                    <Link to="/cart" className="site-header__icon-btn" aria-label="Carrello">
                        <i className="bi bi-cart4"></i>
                    </Link>

                    <Link
                        to="/login"
                        className="site-header__login site-header__login--desktop"
                        aria-label="Login"
                    >
                        <i className="bi bi-person"></i>
                    </Link>

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