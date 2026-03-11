import { useMemo, useState } from "react";
import ProductListCard from "./products/ProductListCard";
import ProductSearchBar from "./products/ProductSearchBar";
import ProductPriceFilter from "./products/ProductPriceFilter";

function ProductList({
    products,
    eyebrow,
    title,
    description,
    limit,
    showFilters = false,
    searchTerm = "",
    onSearchChange = () => { },
    minPrice = "",
    maxPrice = "",
    onMinPriceChange = () => { },
    onMaxPriceChange = () => { },
    selectedCategory = "",
    onCategoryChange = () => { },
    onMaterialChange = () => { },
    selectedMaterial = "",
    selectedSize = "",
    onSizeChange = () => { },
}) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [openFilterSections, setOpenFilterSections] = useState({
        price: true,
        category: true,
        material: false,
        size: false,
    });

    const visibleProducts = useMemo(() => {
        const safeProducts = Array.isArray(products) ? [...products] : [];

        if (typeof limit === "number" && limit > 0) {
            return safeProducts.slice(0, limit);
        }

        return safeProducts;
    }, [products, limit]);

    const categoryOptions = [
        { id: "1", label: "Classic" },
        { id: "2", label: "Electric" },
    ];

    const materialOptions = [
        { id: "1", label: "Brass" },
        { id: "2", label: "Chrome" },
        { id: "3", label: "Matte Black Steel" },
        { id: "4", label: "Copper" },
        { id: "5", label: "Titanium" },
        { id: "6", label: "Gold Plated" },
    ];

    const sizeOptions = [
        { id: "1", label: "Slim" },
        { id: "2", label: "Standard" },
    ];

    const productsToRender = useMemo(() => visibleProducts, [visibleProducts]);

    const hasActiveFilters =
        searchTerm !== "" ||
        minPrice !== "" ||
        maxPrice !== "" ||
        selectedMaterial !== "" ||
        selectedSize !== "" ||
        selectedCategory !== "";

    const activeFiltersCount = [
        minPrice,
        maxPrice,
        selectedCategory,
        selectedMaterial,
        selectedSize,
    ].filter((value) => value !== "").length;

    const hasActiveSearch = searchTerm.trim() !== "";

    function resetFilters() {
        onSearchChange("");
        onMinPriceChange("");
        onMaxPriceChange("");
        onSizeChange("");
        onCategoryChange("");
        onMaterialChange("");
    }

    function toggleFilterSection(sectionName) {
        setOpenFilterSections((currentSections) => ({
            ...currentSections,
            [sectionName]: !currentSections[sectionName],
        }));
    }

    function renderSelectFilterGroup({
        sectionName,
        label,
        inputId,
        iconClass,
        value,
        onChange,
        options,
        emptyLabel,
    }) {
        const isOpen = openFilterSections[sectionName];
        const activeOption = options.find((option) => option.id === value);

        return (
            <div className={`catalog-filters__group ${isOpen ? "is-open" : ""}`}>
                <div className="catalog-filters__group-head">
                    <button
                        type="button"
                        className="catalog-filters__accordion-btn"
                        aria-expanded={isOpen}
                        aria-controls={`${sectionName}-filter-panel`}
                        onClick={() => toggleFilterSection(sectionName)}
                    >
                        <span className="catalog-filters__header-left">
                            <i className={`bi ${iconClass} catalog-filters__section-icon`} aria-hidden="true"></i>
                            <span className="catalog-filters__subtitle">{label}</span>
                        </span>

                        <span className="catalog-filters__accordion-meta">
                            {activeOption && (
                                <span className="catalog-filters__chip">{activeOption.label}</span>
                            )}
                            <i className="bi bi-chevron-left catalog-filters__chevron" aria-hidden="true"></i>
                        </span>
                    </button>

                    {value !== "" && (
                        <button
                            type="button"
                            className="catalog-filters__clear-btn"
                            aria-label={`Azzera filtro ${label.toLowerCase()}`}
                            onClick={() => onChange("")}
                        >
                            <i className="bi bi-x-lg" aria-hidden="true"></i>
                        </button>
                    )}
                </div>

                <div id={`${sectionName}-filter-panel`} className="catalog-filters__panel">
                    <label className="catalog-filters__field" htmlFor={inputId}>
                        <span className="catalog-filters__field-label">Seleziona un'opzione</span>
                        <select
                            id={inputId}
                            className="catalog-filters__input catalog-filters__select"
                            value={value}
                            onChange={(event) => onChange(event.target.value)}
                        >
                            <option value="">{emptyLabel}</option>
                            {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        );
    }

    const catalogGrid = productsToRender.length > 0 ? (
        <div className="catalog__grid">
            {productsToRender.map((product) => (
                <ProductListCard key={product.slug || product.id} product={product} />
            ))}
        </div>
    ) : (
        <p className="catalog__empty">
            Nessun prodotto trovato con i filtri selezionati.
        </p>
    );

    return (
        <section className="catalog">
            <div className="catalog__head">
                <div className="catalog__head-main">
                    {eyebrow && <p className="catalog__eyebrow">{eyebrow}</p>}
                    {title && <h2 id="catalog-title">{title}</h2>}
                    {description && <p className="catalog__description">{description}</p>}
                </div>

                {showFilters && (
                    <div className="catalog__search-wrap">
                        <button
                            type="button"
                            className={`catalog__search-toggle ${isSearchOpen ? "is-open" : ""}`}
                            aria-expanded={isSearchOpen}
                            aria-controls="catalog-search-panel"
                            onClick={() => setIsSearchOpen((currentValue) => !currentValue)}
                        >
                            <span className="catalog__toggle-copy">
                                <i className="bi bi-search" aria-hidden="true"></i>
                                <span>{isSearchOpen ? "Chiudi ricerca" : "Apri ricerca"}</span>
                            </span>

                            {hasActiveSearch && <span className="catalog__toggle-count">1</span>}
                        </button>

                        <div
                            id="catalog-search-panel"
                            className={`catalog__search-panel ${isSearchOpen ? "is-open" : ""}`}
                        >
                            <ProductSearchBar
                                value={searchTerm}
                                onChange={onSearchChange}
                                totalCount={visibleProducts.length}
                                visibleCount={productsToRender.length}
                            />
                        </div>
                    </div>
                )}
            </div>

            {showFilters ? (
                <div className={`catalog__layout ${isFiltersOpen ? "is-filters-open" : ""}`}>
                    <aside id="catalog-filters-panel" className="catalog__filters-panel">
                        <div className="catalog-filters">
                            <div className="catalog-filters__top">
                                <div>
                                    <p className="catalog-filters__eyebrow">Filtra</p>
                                    <h3 className="catalog-filters__title">Affina la selezione</h3>
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        className="catalog-filters__reset"
                                        onClick={resetFilters}
                                    >
                                        Reset filtri
                                    </button>
                                )}
                            </div>

                            <ProductPriceFilter
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                onMinPriceChange={onMinPriceChange}
                                onMaxPriceChange={onMaxPriceChange}
                                isOpen={openFilterSections.price}
                                onToggle={() => toggleFilterSection("price")}
                            />

                            {renderSelectFilterGroup({
                                sectionName: "category",
                                label: "Categoria",
                                inputId: "category-filter",
                                iconClass: "bi-grid",
                                value: selectedCategory,
                                onChange: onCategoryChange,
                                options: categoryOptions,
                                emptyLabel: "Tutte",
                            })}

                            {materialOptions.length > 0 && renderSelectFilterGroup({
                                sectionName: "material",
                                label: "Materiale",
                                inputId: "material-filter",
                                iconClass: "bi-layers",
                                value: selectedMaterial,
                                onChange: onMaterialChange,
                                options: materialOptions,
                                emptyLabel: "Tutti",
                            })}

                            {sizeOptions.length > 0 && renderSelectFilterGroup({
                                sectionName: "size",
                                label: "Taglia",
                                inputId: "size-filter",
                                iconClass: "bi-aspect-ratio",
                                value: selectedSize,
                                onChange: onSizeChange,
                                options: sizeOptions,
                                emptyLabel: "Tutte",
                            })}
                        </div>
                    </aside>

                    <div className="catalog__content">
                        <div className="catalog__toolbar">
                            <button
                                type="button"
                                className={`catalog__filters-toggle ${isFiltersOpen ? "is-open" : ""}`}
                                aria-expanded={isFiltersOpen}
                                aria-controls="catalog-filters-panel"
                                onClick={() => setIsFiltersOpen((currentValue) => !currentValue)}
                            >
                                <span className="catalog__toggle-copy">
                                    <i className="bi bi-sliders" aria-hidden="true"></i>
                                    <span>{isFiltersOpen ? "Chiudi filtri" : "Apri filtri"}</span>
                                </span>

                                {activeFiltersCount > 0 && (
                                    <span className="catalog__toggle-count">{activeFiltersCount}</span>
                                )}
                            </button>

                            <p className="catalog__results-meta">
                                {productsToRender.length} prodotti visibili
                            </p>
                        </div>

                        {catalogGrid}
                    </div>
                </div>
            ) : (
                catalogGrid
            )}
        </section>
    );
}

export default ProductList;