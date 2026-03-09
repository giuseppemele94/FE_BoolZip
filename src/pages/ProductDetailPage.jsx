import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function ProductDetailPage({ products = [] }) {
    // Passaggio 4: leggo l'id dalla URL e recupero il prodotto dalle props.
    const { id } = useParams();
    const product = useMemo(() => products.find((item) => item.id === id), [id, products]);

    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Passaggio 6: quando cambia il prodotto resetto lo stato locale della UI.
    useEffect(() => {
        if (!product) {
            return;
        }

        setActiveImage(product.images[0]);
        setQuantity(1);
    }, [product]);

    if (!product) {
        return (
            <section className="product-page product-page--fallback">
                <h1>Prodotto non trovato</h1>
                <p>Il modello richiesto non e presente in questa demo.</p>
                <Link to="/" className="product-back-link">
                    Torna alla home
                </Link>
            </section>
        );
    }

    // Passaggio 6: costruisco i correlati partendo sempre dalle props ricevute.
    const relatedProducts = products.filter((item) => product.relatedIds.includes(item.id));
    const outOfStock = product.stock === 0;

    const decrement = () => setQuantity((current) => Math.max(1, current - 1));
    const increment = () => setQuantity((current) => Math.min(10, current + 1));

    return (
        <section className="product-page">
            <div className="product-detail">
                <div className="product-gallery">
                    <figure className="product-main-image">
                        <img src={activeImage || product.images[0]} alt={product.name} />
                    </figure>

                    <div className="product-thumbs" aria-label="Miniature prodotto">
                        {product.images.map((img, index) => (
                            <button
                                key={img}
                                type="button"
                                className={`product-thumb ${activeImage === img ? 'is-active' : ''}`}
                                onClick={() => setActiveImage(img)}
                                aria-label={`Mostra immagine ${index + 1}`}
                            >
                                <img src={img} alt={`${product.name} vista ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="product-sku">SKU: {product.sku}</p>

                    <div className="product-price-row">
                        <strong>EUR {product.price.toFixed(2)}</strong>
                        <span className={`stock-pill ${outOfStock ? 'is-out' : 'is-in'}`}>
                            {outOfStock ? 'Esaurito' : `${product.stock} disponibili`}
                        </span>
                    </div>

                    <p className="product-tax-note">
                        Imposte incluse. <a href="#spedizione">Spese di spedizione</a> calcolate al check-out.
                    </p>

                    <div className="qty-wrap">
                        <p>Quantita</p>
                        <div className="qty-box">
                            <button type="button" onClick={decrement} aria-label="Diminuisci quantita">
                                -
                            </button>
                            <span>{quantity}</span>
                            <button type="button" onClick={increment} aria-label="Aumenta quantita">
                                +
                            </button>
                        </div>
                    </div>

                    <button type="button" className="product-cta" disabled={outOfStock}>
                        {outOfStock ? 'Esaurito' : 'Aggiungi al carrello'}
                    </button>

                    <button type="button" className="product-share">
                        <i className="bi bi-share"></i> Condividi
                    </button>

                    <p className="product-description">{product.description}</p>

                    <ul className="product-features">
                        {product.features.map((feature) => (
                            <li key={feature}>{feature}</li>
                        ))}
                    </ul>

                    <details id="spedizione" className="product-shipping" open>
                        <summary>Spedizione</summary>
                        <p>Consegna standard in 2-4 giorni lavorativi. Reso entro 30 giorni.</p>
                    </details>
                </div>
            </div>

            {/* Passaggio 8: sezione correlati utile per passare ai dettagli dei prodotti successivi. */}
            <section className="related-section" aria-labelledby="related-title">
                <div className="related-head">
                    <p>Suggeriti</p>
                    <h2 id="related-title">Prodotti correlati</h2>
                </div>

                <div className="related-grid">
                    {relatedProducts.map((item) => (
                        <article key={item.id} className="related-card">
                            <img src={item.images[0]} alt={item.name} />
                            <div className="related-card__body">
                                <h3>{item.name}</h3>
                                <p>EUR {item.price.toFixed(2)}</p>
                                <Link to={`/products/${item.id}`}>Apri prodotto</Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </section>
    );
}

export default ProductDetailPage;