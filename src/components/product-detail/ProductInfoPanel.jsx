function ProductInfoPanel({
    product,
    quantity,
    onDecrease,
    onIncrease,
    outOfStock,
}) {
    // Prezzo in formato italiano: 64,00
    const numericPrice = Number(product.price);
    const formattedPrice = Number.isFinite(numericPrice)
        ? new Intl.NumberFormat('it-IT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericPrice)
        : '0,00';

    const productFeatures = Array.isArray(product.features) ? product.features : [];

    return (
        <div className="product-info">
            {/* Titolo e riferimenti prodotto */}
            <h1>{product.name}</h1>
            <p className="product-sku">SKU: {product.sku}</p>

            <div className="product-price-row">
                <strong>EUR {formattedPrice}</strong>
                <span className={`stock-pill ${outOfStock ? 'is-out' : 'is-in'}`}>
                    {outOfStock ? 'Esaurito' : `${product.stock} disponibili`}
                </span>
            </div>

            <p className="product-tax-note">
                Imposte incluse. <a href="#spedizione">Spese di spedizione</a> calcolate al check-out.
            </p>

            <div className="qty-wrap">
                <p>Quantita</p>
                <div className="qty-box">
                    <button type="button" onClick={onDecrease} aria-label="Diminuisci quantita">
                        -
                    </button>
                    <span>{quantity}</span>
                    <button type="button" onClick={onIncrease} aria-label="Aumenta quantita">
                        +
                    </button>
                </div>
            </div>

            <button type="button" className="product-cta" disabled={outOfStock}>
                {outOfStock ? 'Esaurito' : 'Aggiungi al carrello'}
            </button>

            <button type="button" className="product-share">
                <i className="bi bi-share"></i> Condividi
            </button>

            {/* Contenuti editoriali */}
            <p className="product-description">{product.description}</p>

            <ul className="product-features">
                {productFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                ))}
            </ul>

            <details id="spedizione" className="product-shipping" open>
                <summary>Spedizione</summary>
                <p>Consegna standard in 2-4 giorni lavorativi. Reso entro 30 giorni.</p>
            </details>
        </div>
    );
}

export default ProductInfoPanel;
