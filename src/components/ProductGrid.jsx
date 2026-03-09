import { Link } from 'react-router-dom';

function ProductGrid({
    products = [],
    eyebrow = 'Catalogo demo',
    title = 'Prodotti disponibili',
    limit,
}) {
    // Passaggio 2: il componente usa solo props, senza conoscere la sorgente dati.
    const visibleProducts = typeof limit === 'number' ? products.slice(0, limit) : products;

    return (
        <section className="catalog" aria-labelledby="catalog-title">
            {/* Passaggio 3: titolo e card sono completamente guidati da props. */}
            <div className="catalog__head">
                <p className="catalog__eyebrow">{eyebrow}</p>
                <h2 id="catalog-title">{title}</h2>
            </div>

            {visibleProducts.length === 0 && <p>Nessun prodotto disponibile.</p>}

            <div className="catalog__grid">
                {visibleProducts.map((product) => (
                    <article key={product.id} className="catalog-card">
                        <img src={product.images[0]} alt={product.name} className="catalog-card__img" />

                        <div className="catalog-card__body">
                            <p className="catalog-card__sku">SKU: {product.sku}</p>
                            <h3>{product.name}</h3>
                            <p className="catalog-card__desc">{product.shortDescription}</p>

                            <div className="catalog-card__bottom">
                                <span>EUR {product.price.toFixed(2)}</span>
                                <Link to={`/products/${product.id}`}>Dettagli</Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ProductGrid;
