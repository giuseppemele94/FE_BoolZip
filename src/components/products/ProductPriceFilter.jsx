function ProductPriceFilter({
    minPrice,
    maxPrice,
    selectedMaterial,
    selectedSize,
    selectedCategory,
    materialOptions = [],
    sizeOptions = [],
    categoryOptions = [],
    quickPriceRanges = [],
    onMinPriceChange,
    onMaxPriceChange,
    onQuickPriceRange,
    onMaterialChange,
    onSizeChange,
    onCategoryChange,
    onReset,
}) {
    // Mostro solo i filtri che hanno valori reali nel database.
    const hasMaterialFilter = materialOptions.length > 0;
    const hasSizeFilter = sizeOptions.length > 0;
    const hasCategoryFilter = categoryOptions.length > 0;
    const hasQuickPriceRanges = quickPriceRanges.length > 0;

    function parseActiveValue(value) {
        if (value === "") {
            return null;
        }

        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    function isQuickRangeActive(range) {
        const currentMin = parseActiveValue(minPrice);
        const currentMax = parseActiveValue(maxPrice);
        const hasSameMin = range.min === null ? currentMin === null : currentMin !== null && Math.abs(currentMin - range.min) < 0.01;
        const hasSameMax = range.max === null ? currentMax === null : currentMax !== null && Math.abs(currentMax - range.max) < 0.01;

        return hasSameMin && hasSameMax;
    }

    return (
        <aside className="catalog-filters" aria-label="Filtri prodotto">
            <h3 className="catalog-filters__title">Filtra</h3>

            {hasMaterialFilter && (
                <div className="catalog-filters__group">
                    <p className="catalog-filters__subtitle">Materiale</p>

                    <select
                        className="catalog-filters__input catalog-filters__select"
                        value={selectedMaterial}
                        onChange={(event) => onMaterialChange(event.target.value)}
                    >
                        <option value="">Tutti i materiali</option>
                        {materialOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {hasSizeFilter && (
                <div className="catalog-filters__group">
                    <p className="catalog-filters__subtitle">Size</p>

                    <select
                        className="catalog-filters__input catalog-filters__select"
                        value={selectedSize}
                        onChange={(event) => onSizeChange(event.target.value)}
                    >
                        <option value="">Tutte le size</option>
                        {sizeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {hasCategoryFilter && (
                <div className="catalog-filters__group">
                    <p className="catalog-filters__subtitle">Categoria</p>

                    <select
                        className="catalog-filters__input catalog-filters__select"
                        value={selectedCategory}
                        onChange={(event) => onCategoryChange(event.target.value)}
                    >
                        <option value="">Tutte le categorie</option>
                        {categoryOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="catalog-filters__group">
                <p className="catalog-filters__subtitle">Prezzo</p>

                {hasQuickPriceRanges && (
                    <div className="catalog-filters__quick-list">
                        {quickPriceRanges.map((range) => (
                            <button
                                key={range.id}
                                type="button"
                                className={`catalog-filters__quick-btn ${isQuickRangeActive(range) ? "is-active" : ""}`}
                                onClick={() => onQuickPriceRange(range.min, range.max)}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="catalog-filters__row">
                    {/* Input controllati: ogni modifica aggiorna subito lo stato nel parent. */}
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="catalog-filters__input"
                        placeholder="Da"
                        value={minPrice}
                        onChange={(event) => onMinPriceChange(event.target.value)}
                    />

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="catalog-filters__input"
                        placeholder="A"
                        value={maxPrice}
                        onChange={(event) => onMaxPriceChange(event.target.value)}
                    />
                </div>
            </div>

            {/* Reset unico per ricerca + prezzo + caratteristiche. */}
            <button type="button" className="catalog-filters__reset" onClick={onReset}>
                Pulisci filtri
            </button>
        </aside>
    );
}

export default ProductPriceFilter;
