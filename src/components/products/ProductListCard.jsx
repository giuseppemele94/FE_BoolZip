import { Link } from 'react-router-dom';

function ProductListCard({ product }) {
    const { slug, name, description, price, image_url } = product
    return (
        <article className="catalog-card">
            <Link to={`/products/${slug}`} className="catalog-card-link">
                <img
                    src={`${image_url}`}
                    alt={name}
                    className="catalog-card__img"
                />

                <div className="catalog-card__body">

                    <h3>{name}</h3>
                    <p className="catalog-card__desc">{description}</p>

                    <div className="catalog-card__bottom">
                        <span>EUR {price}</span>
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
