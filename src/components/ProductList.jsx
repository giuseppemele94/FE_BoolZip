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

    const productsToRender = useMemo(() => {
        return visibleProducts;
    }, [visibleProducts]);

    const hasActiveFilters =
        searchTerm !== "" ||
        minPrice !== "" ||
        maxPrice !== "" ||
        selectedMaterial !== "" ||
        selectedSize !== "" ||
        selectedCategory !== "";

    function resetFilters() {
        onSearchChange("");
        onMinPriceChange("");
        onMaxPriceChange("");

        onSizeChange(""); 
        onCategoryChange("");
        onMaterialChange("");
    }

    return (
        <section className="catalog">
            <div className="catalog__head">
                {eyebrow && <p className="catalog__eyebrow">{eyebrow}</p>}
                {title && <h2 id="catalog-title">{title}</h2>}
                {description && <p className="catalog__description">{description}</p>}
            </div>

            {showFilters && (
                <div className="catalog__filters">
                    <ProductSearchBar
                        value={searchTerm}
                        onChange={onSearchChange}
                        totalCount={visibleProducts.length}
                        visibleCount={productsToRender.length}
                    />

                    <ProductPriceFilter
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onMinPriceChange={onMinPriceChange}
                        onMaxPriceChange={onMaxPriceChange}
                    />

                    <div className="catalog__filter-group">
                        <label htmlFor="category-filter">Categoria</label>
                        <select
                            id="category-filter"
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                        >
                            <option value="">Tutte</option>
                            {categoryOptions.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {materialOptions.length > 0 && (
                        <div className="catalog__filter-group">
                            <label htmlFor="material-filter">Materiale</label>
                            <select
                                id="material-filter"
                                value={selectedMaterial}
                                onChange={(e) => onMaterialChange(e.target.value)}
                            >
                                <option value="">Tutti</option>
                                {materialOptions.map((material) => (
                                    <option key={material.id} value={material.id}>
                                        {material.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {sizeOptions.length > 0 && (
                        <div className="catalog__filter-group">
                            <label htmlFor="size-filter">Taglia</label>
                            <select
                                id="size-filter"
                                value={selectedSize}
                                onChange={(e) => onSizeChange(e.target.value)}
                            >
                                <option value="">Tutte</option>
                                {sizeOptions.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="catalog__reset-btn"
                            onClick={resetFilters}
                        >
                            Reset filtri
                        </button>
                    )}
                </div>
            )}

            {productsToRender.length > 0 ? (
                <div className="catalog__grid">
                    {productsToRender.map((product) => (
                        <ProductListCard key={product.slug || product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="catalog__empty">
                    Nessun prodotto trovato con i filtri selezionati.
                </p>
            )}
        </section>
    );
}

export default ProductList;