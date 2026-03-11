function ProductPriceFilter({
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
}) {
    return (
        <div className="catalog__price-filter">
            <div className="catalog__filter-group">
                <label htmlFor="min-price">Prezzo minimo</label>
                <input
                    id="min-price"
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => onMinPriceChange(e.target.value)}
                    placeholder="Min"
                />
            </div>

            <div className="catalog__filter-group">
                <label htmlFor="max-price">Prezzo massimo</label>
                <input
                    id="max-price"
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => onMaxPriceChange(e.target.value)}
                    placeholder="Max"
                />
            </div>
        </div>
    );
}

export default ProductPriceFilter;