import { Link } from 'react-router-dom';

function ProductListCard({ product }) {
    const { id, slug, name, price, image_url, image, images } = product;
    const productSlug = slug || id;
    const cardImage = image_url || image || (Array.isArray(images) ? images[0] : '');
    const numericPrice = Number(price);
    const formattedPrice = Number.isFinite(numericPrice)
        ? new Intl.NumberFormat('it-IT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericPrice)
        : '0,00';

    return (
        <article className="catalog-card">
            <Link to={`/products/${productSlug}`} className="catalog-card-link">
                <img
                    src={cardImage}
                    alt={name}
                    className="catalog-card__img"
                />

                <div className="catalog-card__body">

                    <h3>{name}</h3>

                    <div className="catalog-card__bottom">
                        <span className="catalog-card__price">€ {formattedPrice}</span>
                    </div>
                </div>
            </Link>

            <button className="catalog-card__cart-btn">
                Aggiungi al carrello
            </button>
        </article>
    );
}

export default ProductListCard;
