import { Link } from "react-router-dom";

function HeroSection() {
    return (
        <section className="hero" aria-labelledby="hero-title">
            <video
                className="hero__video"
                autoPlay
                loop
                muted
                playsInline
                poster="/images/hero-poster.jpg"
            >
                <source src="/public/images/Zippo_BoolShop.mp4" type="video/mp4" />
                Il tuo browser non supporta il video.
            </video>

            <div className="hero__overlay"></div>

            <div className="hero__content">
                <h1 id="hero-title" className="hero__title">
                    <span>Accendini iconici,</span>
                    <span>stile deciso.</span>
                </h1>

                <p className="hero__text">
                    Design metallico, apertura precisa e finiture premium per uso quotidiano o collezione.
                </p>

                <div className="hero__actions">
                    <Link className="hero__btn hero__btn--primary" to="/products">
                        Vai ai prodotti
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;

