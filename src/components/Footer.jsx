import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="container footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <img
                            src="/images/BoolFooter.png"
                            alt="BoolZip"
                            className="footer-logo"
                        />
                        <p>
                            Design metallico, apertura precisa e finiture premium per uso quotidiano o collezione.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Shop</h4>
                        <ul>
                            <li>
                                <Link to="/products">Tutti i prodotti</Link>
                            </li>
                            <li>
                                < a >Ultimi arrivi</a>
                            </li>
                            <li>
                                < a >Più venduti</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Supporto</h4>
                        <ul>
                            <li>
                                <Link to="/contatti">Contatti</Link>
                            </li>
                            <li>
                                <Link to="/spedizioni">Spedizioni</Link>
                            </li>
                            <li>
                                <Link to="/resi">Resi</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Seguici</h4>
                        <ul>
                            <li>
                                <a >
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a >
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a >
                                    TikTok
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} BoolZip. Tutti i diritti riservati.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
