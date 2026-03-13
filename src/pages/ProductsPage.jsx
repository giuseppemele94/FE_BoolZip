import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductList from "../components/ProductList";

const API_PRODUCTS_URL = "http://localhost:3000/api/products";

function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search")?.trim() || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("price_min") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("price_max") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
    const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get("material") || "");
    const [selectedSize, setSelectedSize] = useState(searchParams.get("size") || "");

    useEffect(() => {
        setSearchTerm(searchParams.get("search")?.trim() || "");
        setMinPrice(searchParams.get("price_min") || "");
        setMaxPrice(searchParams.get("price_max") || "");
        setSelectedCategory(searchParams.get("category") || "");
        setSelectedMaterial(searchParams.get("material") || "");
        setSelectedSize(searchParams.get("size") || "");
    }, [searchParams]);

    function updateUrlParams({
        nextSearch = searchTerm,
        nextMinPrice = minPrice,
        nextMaxPrice = maxPrice,
        nextCategory = selectedCategory,
        nextMaterial = selectedMaterial,
        nextSize = selectedSize,
    }) {
        const nextSearchParams = new URLSearchParams();

        if (nextSearch.trim()) {
            nextSearchParams.set("search", nextSearch.trim());
        }

        if (nextMinPrice !== "") {
            nextSearchParams.set("price_min", nextMinPrice);
        }

        if (nextMaxPrice !== "") {
            nextSearchParams.set("price_max", nextMaxPrice);
        }

        if (nextCategory !== "") {
            nextSearchParams.set("category", nextCategory);
        }

        if (nextMaterial !== "") {
            nextSearchParams.set("material", nextMaterial);
        }

        if (nextSize !== "") {
            nextSearchParams.set("size", nextSize);
        }

        setSearchParams(nextSearchParams, { replace: true });
    }

    function handleSearchChange(value) {
        setSearchTerm(value);
        updateUrlParams({ nextSearch: value });
    }

    function handleMinPriceChange(value) {
        setMinPrice(value);
        updateUrlParams({ nextMinPrice: value });
    }

    function handleMaxPriceChange(value) {
        setMaxPrice(value);
        updateUrlParams({ nextMaxPrice: value });
    }

    function handleCategoryChange(value) {
        setSelectedCategory(value);
        updateUrlParams({ nextCategory: value });
    }

    function handleMaterialChange(value) {
        setSelectedMaterial(value);
        updateUrlParams({ nextMaterial: value });
    }

    function handleSizeChange(value) {
        setSelectedSize(value);
        updateUrlParams({ nextSize: value });
    }

    useEffect(() => {
        const params = {};

        if (searchTerm.trim() !== "") {
            params.search = searchTerm.trim();
        }

        if (minPrice !== "") {
            params.price_min = minPrice;
        }

        if (maxPrice !== "") {
            params.price_max = maxPrice;
        }

        if (selectedCategory !== "") {
            params.category = selectedCategory;
        }

        if (selectedMaterial !== "") {
            params.material = selectedMaterial;
        }

        if (selectedSize !== "") {
            params.size = selectedSize;
        }

        console.log("params inviati:", params);

        axios
            .get(API_PRODUCTS_URL, { params })
            .then((res) => {
                setProducts(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error("Errore nel caricamento prodotti filtrati:", err);
                setProducts([]);
            });
    }, [searchTerm, minPrice, maxPrice, selectedCategory, selectedMaterial, selectedSize]);

    return (
        <ProductList
            products={products}
            eyebrow="Catalogo"
            title="Accendini"
            description="Gli accendini Zippo sono resistenti, ricaricabili e costruiti per durare tutta la vita. Trova l'accendino perfetto per te!"
            showFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedMaterial={selectedMaterial}
            onMaterialChange={handleMaterialChange}
            selectedSize={selectedSize}
            onSizeChange={handleSizeChange}
        />
    );
}

export default ProductsPage;