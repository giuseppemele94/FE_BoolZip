function ProductSearchBar({ value, onChange, quickSuggestions = [], totalCount, visibleCount }) {
    const normalizedValue = value.trim().toLowerCase();

    return (
        <div className="catalog-controls">
            <label htmlFor="catalog-search" className="catalog-controls__label">
                Cerca prodotto
            </label>

            <input
                id="catalog-search"
                type="search"
                className="catalog-controls__input"
                placeholder="Cerca per nome..."
                name="catalog-search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                aria-autocomplete="none"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />

            {quickSuggestions.length > 0 && (
                <div className="catalog-controls__quick-list" aria-label="Ricerche rapide">
                    {quickSuggestions.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            className={`catalog-controls__quick-btn ${normalizedValue === item.value ? "is-active" : ""}`}
                            onClick={() => onChange(item.value)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Feedback immediato su quanti prodotti restano visibili. */}
            <p className="catalog-controls__meta">
                Mostrati {visibleCount} di {totalCount} prodotti
            </p>
        </div>
    );
}

export default ProductSearchBar;
