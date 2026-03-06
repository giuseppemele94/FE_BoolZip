import { Link } from "react-router-dom";

function HeroSection() {
    return (
        <section className="hero" aria-labelledby="hero-title">
            {/* Step 1: messaggio principale */}
            <div className="hero__content">
                <p className="hero__tag">BoolZip 2026</p>
                <h1 id="hero-title" className="hero__title">Accendini iconici, stile deciso.</h1>
                <p className="hero__text">
                    Design metallico, apertura precisa e finiture premium per uso quotidiano o collezione.
                </p>

                {/* Step 2: azioni principali */}
                <div className="hero__actions">
                    <Link className="hero__btn hero__btn--primary" to="/products/1">
                        Vai al prodotto
                    </Link>
                    <a className="hero__btn hero__btn--outline" href="#collezione">
                        Guarda collezione
                    </a>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
