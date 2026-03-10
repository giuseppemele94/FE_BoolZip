import { Link } from 'react-router-dom';

function ProductListCard({ product }) {
    const { slug, name, description, price, image, image_url } = product
    const cardImage = image_url || image;
    const numericPrice = Number(price);
    const formattedPrice = Number.isFinite(numericPrice)
        ? new Intl.NumberFormat('it-IT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericPrice)
        : '0,00';

    return (
        <article className="catalog-card">
            <Link to={`/products/${slug}`} className="catalog-card-link">
                <img
                    src={cardImage}
                    alt={name}
                    className="catalog-card__img"
                />

                <div className="catalog-card__body">

                    <h3>{name}</h3>
                    <p className="catalog-card__desc">{description}</p>

                    <div className="catalog-card__bottom">
                        <span>EUR {formattedPrice}</span>
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
