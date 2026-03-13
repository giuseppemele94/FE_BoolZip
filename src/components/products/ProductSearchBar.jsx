function ProductSearchBar({
    value,
    onChange,
    totalCount = 0,
    visibleCount = 0,
    onSubmit,
    submitLabel = "Vai",
    variant = "default",
    showStats = true,
    inputId = "catalog-search",
    eyebrow = "Ricerca rapida",
    title = "Cerca il tuo Zippo",
    placeholder = "Cerca per nome o finitura...",
}) {
    const isCompact = variant === "compact";

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit?.(value);
    }

    return (
        <form
            className={`catalog-controls ${isCompact ? "catalog-controls--compact" : ""}`}
            onSubmit={handleSubmit}
        >
            <div className="catalog-controls__header">
                <div>
                    <p className="catalog-controls__eyebrow">{eyebrow}</p>
                    <label htmlFor={inputId} className="catalog-controls__label">
                        {title}
                    </label>
                </div>

                {showStats && <span className="catalog-controls__badge">{visibleCount}</span>}
            </div>

            <div className={`catalog-controls__field ${onSubmit ? "catalog-controls__field--action" : ""}`}>
                <i className="bi bi-search catalog-controls__field-icon" aria-hidden="true"></i>
                <input
                    id={inputId}
                    type="search"
                    className="catalog-controls__input"
                    placeholder={placeholder}
                    name="catalog-search"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    aria-autocomplete="none"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                />

                {onSubmit && (
                    <button type="submit" className="catalog-controls__submit">
                        {submitLabel}
                    </button>
                )}
            </div>

            {showStats && (
                <p className="catalog-controls__meta">
                    Mostrati {visibleCount} di {totalCount} prodotti
                </p>
            )}
        </form>
    );
}

export default ProductSearchBar;
