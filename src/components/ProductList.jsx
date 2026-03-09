import ProductListCard from './products/ProductListCard';

function ProductList({
    products = [],
    eyebrow = 'Catalogo demo',
    title = 'Prodotti disponibili',
    limit,
}) {
    // Passaggio 1: il listato mostra i prodotti ricevuti via props.
    const visibleProducts = typeof limit === 'number' ? products.slice(0, limit) : products;

    return (
        <section className="catalog" aria-labelledby="catalog-title">
            <div className="catalog__head">
                <p className="catalog__eyebrow">{eyebrow}</p>
                <h2 id="catalog-title">{title}</h2>
            </div>

            {visibleProducts.length === 0 && <p>Nessun prodotto disponibile.</p>}

            <div className="catalog__grid">
                {visibleProducts.map((product) => (
                    <ProductListCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default ProductList;
