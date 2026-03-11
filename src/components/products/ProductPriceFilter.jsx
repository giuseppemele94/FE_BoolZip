function ProductPriceFilter({
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    isOpen,
    onToggle,
}) {
    const hasPriceRange = minPrice !== "" || maxPrice !== "";
    const quickRanges = [
        { id: "under-50", label: "Fino a 50€", min: "", max: "50" },
        { id: "50-100", label: "50€ - 100€", min: "50", max: "100" },
        { id: "over-100", label: "Oltre 100€", min: "100", max: "" },
    ];

    function handleQuickRangeClick(range) {
        const isActiveRange = minPrice === range.min && maxPrice === range.max;

        onMinPriceChange(isActiveRange ? "" : range.min);
        onMaxPriceChange(isActiveRange ? "" : range.max);
    }

    return (
        <div className={`catalog-filters__group ${isOpen ? "is-open" : ""}`}>
            <div className="catalog-filters__group-head">
                <button
                    type="button"
                    className="catalog-filters__accordion-btn"
                    aria-expanded={isOpen}
                    aria-controls="price-filter-panel"
                    onClick={onToggle}
                >
                    <span className="catalog-filters__header-left">
                        <i className="bi bi-cash-stack catalog-filters__section-icon" aria-hidden="true"></i>
                        <span className="catalog-filters__subtitle">Prezzo</span>
                    </span>

                    <span className="catalog-filters__accordion-meta">
                        {hasPriceRange && (
                            <span className="catalog-filters__chip">Intervallo attivo</span>
                        )}
                        <i className="bi bi-chevron-left catalog-filters__chevron" aria-hidden="true"></i>
                    </span>
                </button>

                {hasPriceRange && (
                    <button
                        type="button"
                        className="catalog-filters__clear-btn"
                        aria-label="Azzera intervallo prezzo"
                        onClick={() => {
                            onMinPriceChange("");
                            onMaxPriceChange("");
                        }}
                    >
                        <i className="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                )}
            </div>

            <div id="price-filter-panel" className="catalog-filters__panel">
                <p className="catalog-filters__helper">
                    Imposta il range di prezzo in euro per restringere i risultati.
                </p>

                <div className="catalog-filters__quick-list">
                    {quickRanges.map((range) => {
                        const isActiveRange = minPrice === range.min && maxPrice === range.max;

                        return (
                            <button
                                key={range.id}
                                type="button"
                                className={`catalog-filters__quick-btn ${isActiveRange ? "is-active" : ""}`}
                                onClick={() => handleQuickRangeClick(range)}
                            >
                                {range.label}
                            </button>
                        );
                    })}
                </div>

                <div className="catalog-filters__row">
                    <label className="catalog-filters__field" htmlFor="min-price">
                        <span className="catalog-filters__field-label">Da</span>
                        <input
                            id="min-price"
                            type="number"
                            min="0"
                            className="catalog-filters__input"
                            value={minPrice}
                            onChange={(event) => onMinPriceChange(event.target.value)}
                        />
                    </label>

                    <label className="catalog-filters__field" htmlFor="max-price">
                        <span className="catalog-filters__field-label">A</span>
                        <input
                            id="max-price"
                            type="number"
                            min="0"
                            className="catalog-filters__input"
                            value={maxPrice}
                            onChange={(event) => onMaxPriceChange(event.target.value)}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}

export default ProductPriceFilter;