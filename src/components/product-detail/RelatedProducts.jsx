import { Link } from 'react-router-dom';

function RelatedProducts({ products }) {
    return (
        <section className="related-section" aria-labelledby="related-title">
            <div className="related-head">
                <p>Suggeriti</p>
                <h2 id="related-title">Prodotti correlati</h2>
            </div>

            <div className="related-grid">
                {products.map((item) => (
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
    );
}

export default RelatedProducts;
