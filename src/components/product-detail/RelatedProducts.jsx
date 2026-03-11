import { Link } from 'react-router-dom';

function RelatedProducts({ products }) {
    if (!Array.isArray(products) || products.length === 0) {
        return null;
    }

    const safeProducts = products.filter(
        (item) => item && typeof item === 'object'
    );

    if (safeProducts.length === 0) {
        return null;
    }
    console.log('RELATED PRODUCTS COMPONENT:', safeProducts);
    return (
        <section className="related-section" aria-labelledby="related-title">
            <div className="related-head">
                <p>Suggeriti</p>
                <h2 id="related-title">Prodotti correlati</h2>
            </div>

            <div className="related-grid">
                {safeProducts.map((item, index) => {
                    const cardImage =
                        item.image_url ||
                        item.image ||
                        (Array.isArray(item.images) ? item.images[0] : '');

                    const productKey = item.id || item.slug || index;
                    const productSlug = item.slug || item.id;
                    const numericPrice = Number(item.price);

                    const formattedPrice = Number.isFinite(numericPrice)
                        ? new Intl.NumberFormat('it-IT', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(numericPrice)
                        : '0,00';

                    if (!productSlug) return null;

                    return (
                        <Link
                            key={productKey}
                            to={`/products/${productSlug}`}
                            className="related-card-link"
                        >
                            <article className="related-card">
                                {cardImage ? (
                                    <img src={cardImage} alt={item.name || 'Prodotto'} />
                                ) : (
                                    <div className="related-card__img-placeholder" />
                                )}

                                <div className="related-card__body">
                                    <h3>{item.name || 'Prodotto'}</h3>
                                    <p>€ {formattedPrice}</p>
                                </div>
                            </article>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export default RelatedProducts;