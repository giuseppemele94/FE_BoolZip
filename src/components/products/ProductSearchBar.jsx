function ProductSearchBar({ value, onChange, totalCount, visibleCount }) {
    return (
        <div className="catalog-controls">
            <div className="catalog-controls__header">
                <div>
                    <p className="catalog-controls__eyebrow">Ricerca rapida</p>
                    <label htmlFor="catalog-search" className="catalog-controls__label">
                        Cerca il tuo Zippo
                    </label>
                </div>

                <span className="catalog-controls__badge">{visibleCount}</span>
            </div>

            <div className="catalog-controls__field">
                <i className="bi bi-search catalog-controls__field-icon" aria-hidden="true"></i>
                <input
                    id="catalog-search"
                    type="search"
                    className="catalog-controls__input"
                    placeholder="Cerca per nome o finitura..."
                    name="catalog-search"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    aria-autocomplete="none"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                />
            </div>

            <p className="catalog-controls__meta">
                Mostrati {visibleCount} di {totalCount} prodotti
            </p>
        </div>
    );
}

export default ProductSearchBar;
