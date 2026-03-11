import { useEffect, useMemo, useState } from "react";
import ProductListCard from "./products/ProductListCard";
import ProductPriceFilter from "./products/ProductPriceFilter";
import ProductSearchBar from "./products/ProductSearchBar";

function toNumberOrNull(value) {
    // Valori vuoti non devono attivare filtri numerici.
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === "string" && value.trim() === "") {
        return null;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

function formatRangeNumber(value) {
    return new Intl.NumberFormat("it-IT", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: false,
    }).format(value);
}

function toInputPrice(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(Number(value.toFixed(2)));
}

function ProductList({ products, eyebrow, title, description, limit, showFilters = false }) {
    // Difesa base: se products non e un array uso lista vuota.
    const safeProducts = Array.isArray(products) ? products : [];
    // Se arriva un limit, mostro solo i primi N elementi.
    const visibleProducts = Number.isFinite(limit)
        ? safeProducts.slice(0, Math.max(0, limit))
        : safeProducts;

    // Stato dei campi filtro/ricerca.
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    // Gestisce apertura/chiusura del pannello filtri laterale.
    const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
    // Normalizzo la ricerca per confronto case-insensitive.
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const hasPriceFilter = minPrice !== "" || maxPrice !== "";

    const filterOptions = useMemo(() => {
        // Estraggo opzioni uniche direttamente dai prodotti ricevuti dal DB.
        // Set rimuove i duplicati e sort rende stabile l'ordine nelle select.
        const materials = [...new Set(visibleProducts.map((item) => item?.material).filter(Boolean))].sort();
        const sizes = [...new Set(visibleProducts.map((item) => item?.size).filter(Boolean))].sort();
        const categories = [...new Set(visibleProducts.map((item) => item?.category).filter(Boolean))].sort();

        return {
            materials,
            sizes,
            categories,
        };
    }, [visibleProducts]);

    const quickPriceRanges = useMemo(() => {
        // Creo scorciatoie prezzo usando il range reale disponibile in catalogo.
        const numericPrices = visibleProducts
            .map((item) => toNumberOrNull(item?.price))
            .filter((value) => value !== null);

        if (numericPrices.length === 0) {
            return [];
        }

        const min = Math.min(...numericPrices);
        const max = Math.max(...numericPrices);

        if (min === max) {
            return [
                {
                    id: "fixed",
                    label: `${formatRangeNumber(min)}`,
                    min,
                    max,
                },
            ];
        }

        const span = max - min;
        const lowCap = Number((min + span * 0.35).toFixed(2));
        const highFloor = Number((min + span * 0.65).toFixed(2));

        return [
            {
                id: "budget",
                label: `${formatRangeNumber(min)}-${formatRangeNumber(lowCap)}`,
                min,
                max: lowCap,
            },
            {
                id: "middle",
                label: `${formatRangeNumber(lowCap)}-${formatRangeNumber(highFloor)}`,
                min: lowCap,
                max: highFloor,
            },
            {
                id: "premium",
                label: `${formatRangeNumber(highFloor)}-${formatRangeNumber(max)}`,
                min: highFloor,
                max,
            },
        ];
    }, [visibleProducts]);

    useEffect(() => {
        // Se il DB cambia, resetto solo le selezioni non piu valide.
        if (selectedMaterial && !filterOptions.materials.includes(selectedMaterial)) {
            setSelectedMaterial("");
        }

        if (selectedSize && !filterOptions.sizes.includes(selectedSize)) {
            setSelectedSize("");
        }

        if (selectedCategory && !filterOptions.categories.includes(selectedCategory)) {
            setSelectedCategory("");
        }
    }, [filterOptions, selectedCategory, selectedMaterial, selectedSize]);

    // Verifico se almeno un filtro per caratteristiche e attivo.
    const hasAttributeFilter =
        (filterOptions.materials.length > 0 && selectedMaterial !== "") ||
        (filterOptions.sizes.length > 0 && selectedSize !== "") ||
        (filterOptions.categories.length > 0 && selectedCategory !== "");
    // Flag unico usato per capire quando filtrare davvero la lista.
    const hasActiveFilters = normalizedSearch.length > 0 || hasPriceFilter || hasAttributeFilter;

    const filteredProducts = useMemo(() => {
        // Se non ci sono filtri attivi, restituisco direttamente tutti i prodotti visibili.
        if (!showFilters || !hasActiveFilters) {
            return visibleProducts;
        }

        // Gestisco anche il caso in cui l'utente inserisca prima il massimo e poi il minimo.
        const parsedMin = toNumberOrNull(minPrice);
        const parsedMax = toNumberOrNull(maxPrice);
        const minBound = parsedMin !== null && parsedMax !== null ? Math.min(parsedMin, parsedMax) : parsedMin;
        const maxBound = parsedMin !== null && parsedMax !== null ? Math.max(parsedMin, parsedMax) : parsedMax;

        // Tutti i filtri lavorano insieme in AND.
        return visibleProducts.filter((product) => {
            const productName = String(product?.name || "").toLowerCase();
            const productPrice = toNumberOrNull(product?.price);

            // Ogni condizione e opzionale: se il filtro e vuoto passa automaticamente.
            const matchesName = normalizedSearch.length === 0 || productName.includes(normalizedSearch);
            const matchesMin = minBound === null || (productPrice !== null && productPrice >= minBound);
            const matchesMax = maxBound === null || (productPrice !== null && productPrice <= maxBound);
            const matchesMaterial =
                filterOptions.materials.length === 0 || selectedMaterial === "" || product?.material === selectedMaterial;
            const matchesSize = filterOptions.sizes.length === 0 || selectedSize === "" || product?.size === selectedSize;
            const matchesCategory =
                filterOptions.categories.length === 0 || selectedCategory === "" || product?.category === selectedCategory;

            return matchesName && matchesMin && matchesMax && matchesMaterial && matchesSize && matchesCategory;
        });
    }, [
        hasActiveFilters,
        maxPrice,
        minPrice,
        normalizedSearch,
        selectedCategory,
        selectedMaterial,
        selectedSize,
        showFilters,
        filterOptions.categories.length,
        filterOptions.materials.length,
        filterOptions.sizes.length,
        visibleProducts,
    ]);

    // Se non ci sono filtri attivi mostro sempre l'elenco completo.
    const productsToRender = showFilters && hasActiveFilters ? filteredProducts : visibleProducts;

    // Ripristina la pagina allo stato iniziale dei filtri.
    function resetFilters() {
        setSearchTerm("");
        setMinPrice("");
        setMaxPrice("");
        setSelectedMaterial("");
        setSelectedSize("");
        setSelectedCategory("");
    }

    function applyQuickPriceRange(nextMin, nextMax) {
        // Collego i bottoni range ai campi prezzo controllati.
        setMinPrice(toInputPrice(nextMin));
        setMaxPrice(toInputPrice(nextMax));
    }

    return (
        <section className="catalog">
            <div className="catalog__head">
                <div className="catalog__head-main">
                    <p className="catalog__eyebrow">{eyebrow}</p>
                    <h2 id="catalog-title">{title}</h2>
                    {description && <p className="catalog__description">{description}</p>}
                </div>

                {showFilters && (
                    <div className="catalog__search-wrap">
                        {/* Ricerca spostata sul lato opposto per accesso rapido. */}
                        <ProductSearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            totalCount={visibleProducts.length}
                            visibleCount={filteredProducts.length}
                        />
                    </div>
                )}
            </div>

            {showFilters ? (
                // Layout con sidebar filtri + griglia prodotti.
                <div className={`catalog__layout ${isFiltersPanelOpen ? "is-filters-open" : ""}`}>
                    <div
                        id="catalog-filters-panel"
                        className="catalog__filters-panel"
                        aria-hidden={!isFiltersPanelOpen}
                    >
                        {/* Sidebar filtri: resta montata e viene mostrata con animazione CSS. */}
                        <ProductPriceFilter
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            selectedMaterial={selectedMaterial}
                            selectedSize={selectedSize}
                            selectedCategory={selectedCategory}
                            materialOptions={filterOptions.materials}
                            sizeOptions={filterOptions.sizes}
                            categoryOptions={filterOptions.categories}
                            onMinPriceChange={setMinPrice}
                            onMaxPriceChange={setMaxPrice}
                            quickPriceRanges={quickPriceRanges}
                            onQuickPriceRange={applyQuickPriceRange}
                            onMaterialChange={setSelectedMaterial}
                            onSizeChange={setSelectedSize}
                            onCategoryChange={setSelectedCategory}
                            onReset={resetFilters}
                        />
                    </div>

                    <div className="catalog__content">
                        {/* Pulsante con icona che apre/chiude dinamicamente il pannello filtri. */}
                        <button
                            type="button"
                            className={`catalog__filters-toggle ${isFiltersPanelOpen ? "is-open" : ""}`}
                            onClick={() => setIsFiltersPanelOpen((currentValue) => !currentValue)}
                            aria-controls="catalog-filters-panel"
                            aria-expanded={isFiltersPanelOpen}
                        >
                            <i className={`bi ${isFiltersPanelOpen ? "bi-x-lg" : "bi-sliders2"}`} aria-hidden="true"></i>
                            <span>{isFiltersPanelOpen ? "Chiudi filtri" : "Apri filtri"}</span>
                        </button>

                        {productsToRender.length === 0 ? (
                            // Messaggio mostrato solo quando i filtri non trovano risultati.
                            <p className="catalog__empty">Nessun prodotto trovato con i filtri selezionati.</p>
                        ) : (
                            <div className="catalog__grid">
                                {productsToRender.map((product) => (
                                    <ProductListCard key={product.slug || product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // Versione compatta del componente senza area filtri (es. homepage).
                <div className="catalog__grid">
                    {productsToRender.map((product) => (
                        <ProductListCard key={product.slug || product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default ProductList;
