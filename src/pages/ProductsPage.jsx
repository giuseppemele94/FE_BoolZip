import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../components/ProductList";

const API_PRODUCTS_URL = "http://localhost:3000/api/products";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

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
            onSearchChange={setSearchTerm}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedMaterial={selectedMaterial}
            onMaterialChange={setSelectedMaterial}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
        />
    );
}

export default ProductsPage;