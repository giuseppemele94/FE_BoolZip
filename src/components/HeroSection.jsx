import { Link } from "react-router-dom";

function HeroSection() {
    return (
        <section className="hero" aria-labelledby="hero-title">
            <div className="hero__content">
                
                <h1 id="hero-title" className="hero__title">
                    <span>Accendini iconici,</span>
                    <span>stile deciso.</span>
                </h1>
                <p className="hero__text">
                    Design metallico, apertura precisa e finiture premium per uso quotidiano o collezione.
                </p>

                <div className="hero__actions">
                    <Link className="hero__btn hero__btn--primary" to="/products/1">
                        Vai al prodotto
                    </Link>
                    {/*<a className="hero__btn hero__btn--outline" href="#collezione">
                        Guarda collezione
                    </a>*/}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
