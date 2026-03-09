import { Link } from 'react-router-dom';

function ProductListCard({ product }) {
    return (
        <article className="catalog-card">
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
    );
}

export default ProductListCard;
