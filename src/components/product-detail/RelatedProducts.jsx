import { Link } from 'react-router-dom';

function RelatedProducts({ products }) {
    // Se non ho correlati, non mostro la sezione.
    if (!Array.isArray(products) || products.length === 0) {
        return null;
    }

    return (
        <section className="related-section" aria-labelledby="related-title">
            <div className="related-head">
                <p>Suggeriti</p>
                <h2 id="related-title">Prodotti correlati</h2>
            </div>

            <div className="related-grid">
                {products.map((item) => (
                    // Link sempre su slug, con fallback su id.
                    <Link
                        key={item.id}
                        to={`/products/${item.slug || item.id}`}
                        className="related-card-link"
                    >
                        <article className="related-card">
                            <img src={item.images[0]} alt={item.name} />

                            <div className="related-card__body">
                                <h3>{item.name}</h3>
                                <p>
                                    EUR {new Intl.NumberFormat('it-IT', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(Number(item.price) || 0)}
                                </p>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default RelatedProducts;
