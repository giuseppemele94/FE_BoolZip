import { useState } from "react";

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
    onQuickPriceRange = () => { },
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
    const hasPriceSelection = minPrice !== "" || maxPrice !== "";
    // Stato locale dell'accordion: ogni sezione puo essere aperta o chiusa in modo indipendente.
    const [openSections, setOpenSections] = useState({
        material: false,
        size: false,
        category: false,
        price: false,
    });

    function toggleSection(sectionKey) {
        // Toggle semplice della sezione cliccata.
        setOpenSections((currentSections) => ({
            ...currentSections,
            [sectionKey]: !currentSections[sectionKey],
        }));
    }

    function parseActiveValue(value) {
        // Converte i valori input in numero, lasciando null se il campo e vuoto.
        if (value === "") {
            return null;
        }

        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    function isQuickRangeActive(range) {
        // Serve per evidenziare il bottone range attualmente applicato.
        const currentMin = parseActiveValue(minPrice);
        const currentMax = parseActiveValue(maxPrice);
        const hasSameMin = range.min === null ? currentMin === null : currentMin !== null && Math.abs(currentMin - range.min) < 0.01;
        const hasSameMax = range.max === null ? currentMax === null : currentMax !== null && Math.abs(currentMax - range.max) < 0.01;

        return hasSameMin && hasSameMax;
    }

    function handleQuickRangeClick(range) {
        // Se il range e gia attivo, un secondo click lo azzera.
        if (isQuickRangeActive(range)) {
            onQuickPriceRange(null, null);
            return;
        }

        onQuickPriceRange(range.min, range.max);
    }

    return (
        <aside className="catalog-filters" aria-label="Filtri prodotto">
            <h3 className="catalog-filters__title">Filtra</h3>

            {hasMaterialFilter && (
                <div className={`catalog-filters__group ${openSections.material ? "is-open" : ""}`}>
                    <div className="catalog-filters__group-head">
                        {/* Header sezione: apre/chiude la tendina materiale. */}
                        <button
                            type="button"
                            className="catalog-filters__accordion-btn"
                            aria-expanded={openSections.material}
                            aria-controls="filters-material-panel"
                            onClick={() => toggleSection("material")}
                        >
                            <span className="catalog-filters__header-left">
                                <i className="bi bi-box-seam catalog-filters__section-icon" aria-hidden="true"></i>
                                <span className="catalog-filters__subtitle">Materiale</span>
                            </span>
                            <i className="bi bi-caret-left-fill catalog-filters__chevron" aria-hidden="true"></i>
                        </button>

                        {selectedMaterial !== "" && (
                            // Pulsante rapido che resetta solo il filtro materiale.
                            <button
                                type="button"
                                className="catalog-filters__clear-btn"
                                aria-label="Pulisci filtro materiale"
                                onClick={() => onMaterialChange("")}
                            >
                                <i className="bi bi-x-circle" aria-hidden="true"></i>
                            </button>
                        )}
                    </div>

                    <div id="filters-material-panel" className="catalog-filters__panel">
                        {/* Contenuto della tendina materiale. */}
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
                </div>
            )}

            {hasSizeFilter && (
                <div className={`catalog-filters__group ${openSections.size ? "is-open" : ""}`}>
                    <div className="catalog-filters__group-head">
                        {/* Header sezione: apre/chiude la tendina size. */}
                        <button
                            type="button"
                            className="catalog-filters__accordion-btn"
                            aria-expanded={openSections.size}
                            aria-controls="filters-size-panel"
                            onClick={() => toggleSection("size")}
                        >
                            <span className="catalog-filters__header-left">
                                <i className="bi bi-aspect-ratio catalog-filters__section-icon" aria-hidden="true"></i>
                                <span className="catalog-filters__subtitle">Size</span>
                            </span>
                            <i className="bi bi-caret-left-fill catalog-filters__chevron" aria-hidden="true"></i>
                        </button>

                        {selectedSize !== "" && (
                            // Pulsante rapido che resetta solo il filtro size.
                            <button
                                type="button"
                                className="catalog-filters__clear-btn"
                                aria-label="Pulisci filtro size"
                                onClick={() => onSizeChange("")}
                            >
                                <i className="bi bi-x-circle" aria-hidden="true"></i>
                            </button>
                        )}
                    </div>

                    <div id="filters-size-panel" className="catalog-filters__panel">
                        {/* Contenuto della tendina size. */}
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
                </div>
            )}

            {hasCategoryFilter && (
                <div className={`catalog-filters__group ${openSections.category ? "is-open" : ""}`}>
                    <div className="catalog-filters__group-head">
                        {/* Header sezione: apre/chiude la tendina categoria. */}
                        <button
                            type="button"
                            className="catalog-filters__accordion-btn"
                            aria-expanded={openSections.category}
                            aria-controls="filters-category-panel"
                            onClick={() => toggleSection("category")}
                        >
                            <span className="catalog-filters__header-left">
                                <i className="bi bi-tags catalog-filters__section-icon" aria-hidden="true"></i>
                                <span className="catalog-filters__subtitle">Categoria</span>
                            </span>
                            <i className="bi bi-caret-left-fill catalog-filters__chevron" aria-hidden="true"></i>
                        </button>

                        {selectedCategory !== "" && (
                            // Pulsante rapido che resetta solo il filtro categoria.
                            <button
                                type="button"
                                className="catalog-filters__clear-btn"
                                aria-label="Pulisci filtro categoria"
                                onClick={() => onCategoryChange("")}
                            >
                                <i className="bi bi-x-circle" aria-hidden="true"></i>
                            </button>
                        )}
                    </div>

                    <div id="filters-category-panel" className="catalog-filters__panel">
                        {/* Contenuto della tendina categoria. */}
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
                </div>
            )}

            <div className={`catalog-filters__group ${openSections.price ? "is-open" : ""}`}>
                <div className="catalog-filters__group-head">
                    {/* Header sezione: apre/chiude la tendina prezzo. */}
                    <button
                        type="button"
                        className="catalog-filters__accordion-btn"
                        aria-expanded={openSections.price}
                        aria-controls="filters-price-panel"
                        onClick={() => toggleSection("price")}
                    >
                        <span className="catalog-filters__header-left">
                            <i className="bi bi-cash-stack catalog-filters__section-icon" aria-hidden="true"></i>
                            <span className="catalog-filters__subtitle">Prezzo</span>
                        </span>
                        <i className="bi bi-caret-left-fill catalog-filters__chevron" aria-hidden="true"></i>
                    </button>

                    {hasPriceSelection && (
                        // Reset rapido del solo range prezzo.
                        <button
                            type="button"
                            className="catalog-filters__clear-btn"
                            aria-label="Pulisci filtro prezzo"
                            onClick={() => onQuickPriceRange(null, null)}
                        >
                            <i className="bi bi-x-circle" aria-hidden="true"></i>
                        </button>
                    )}
                </div>

                <div id="filters-price-panel" className="catalog-filters__panel">
                    {hasQuickPriceRanges && (
                        // Shortcut prezzo in stile toggle: click di nuovo = pulizia filtro.
                        <div className="catalog-filters__quick-list">
                            {quickPriceRanges.map((range) => (
                                <button
                                    key={range.id}
                                    type="button"
                                    className={`catalog-filters__quick-btn ${isQuickRangeActive(range) ? "is-active" : ""}`}
                                    onClick={() => handleQuickRangeClick(range)}
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
            </div>

            {/* Reset unico per ricerca + prezzo + caratteristiche. */}
            <button type="button" className="catalog-filters__reset" onClick={onReset}>
                Pulisci filtri
            </button>
        </aside>
    );
}

export default ProductPriceFilter;
