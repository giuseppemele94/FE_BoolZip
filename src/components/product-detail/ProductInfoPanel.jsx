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
    const productMaterials = Array.isArray(product.materials) ? product.materials : [];
    const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
    const rawCategories =
        product.categories ??
        product.category ??
        product.categorie ??
        product.categoria;

    const productCategories = Array.isArray(rawCategories)
        ? rawCategories
            .map((item) => (typeof item === 'string' ? item : item?.name || item?.label || ''))
            .map((item) => String(item).trim())
            .filter(Boolean)
        : typeof rawCategories === 'string'
            ? rawCategories
                .split(/[,;|]/)
                .map((item) => item.trim())
                .filter(Boolean)
            : [];

    const hasStockValue = Number.isFinite(Number(product.stock));
    const stockLabel = outOfStock
        ? 'Esaurito'
        : hasStockValue
            ? `${Number(product.stock)} disponibili`
            : 'Disponibile';

    return (
        <div className="product-info">
            {/* Titolo prodotto: nessun ID/SKU visibile in pagina dettaglio. */}
            <h1>{product.name}</h1>

            <div className="product-price-row">
                <strong>EUR {formattedPrice}</strong>
                <span className={`stock-pill ${outOfStock ? 'is-out' : 'is-in'}`}>
                    {stockLabel}
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

            {productMaterials.length > 0 && (
                <>
                    <p className="product-tax-note">Materiali</p>
                    <ul className="product-features">
                        {productMaterials.map((material) => (
                            <li key={material}>{material}</li>
                        ))}
                    </ul>
                </>
            )}

            {productSizes.length > 0 && (
                <>
                    <p className="product-tax-note">Size</p>
                    <ul className="product-features">
                        {productSizes.map((size) => (
                            <li key={size}>{size}</li>
                        ))}
                    </ul>
                </>
            )}

            {productCategories.length > 0 && (
                <>
                    <p className="product-tax-note">Categoria</p>
                    <ul className="product-features">
                        {productCategories.map((category) => (
                            <li key={category}>{category}</li>
                        ))}
                    </ul>
                </>
            )}

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
