import ProductListCard from "./products/ProductListCard";

function ProductList({ products, eyebrow, title, limit }) {
    const safeProducts = Array.isArray(products) ? products : [];
    const visibleProducts = Number.isFinite(limit)
        ? safeProducts.slice(0, Math.max(0, limit))
        : safeProducts;

    return (
        <section className="catalog">
            <div className="catalog__head">
                <p className="catalog__eyebrow">{eyebrow}</p>
                <h2 id="catalog-title">{title}</h2>
            </div>

            <div className="catalog__grid">
                {visibleProducts.map((product) => (
                    <ProductListCard key={product.slug || product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default ProductList;
