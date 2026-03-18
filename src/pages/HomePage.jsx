import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import BestSellerSection from "../components/BestSellerSection";
import LatestArrivalsSection from "../components/LatestArrivalsSection";
import ProductSearchBar from "../components/products/ProductSearchBar";

function HomePage({ products }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    function handleSearchSubmit(value) {
        const trimmedValue = value.trim();

        navigate(trimmedValue ? `/products?search=${encodeURIComponent(trimmedValue)}` : "/products");
    }

    return (
        <>
            <HeroSection />
            <section className="home-search-shell" aria-labelledby="home-search-title">
                <div className="home-search-shell__copy">
                    <p>Catalogo Zippo</p>
                    <h2 id="home-search-title">Cerca il modello giusto per te</h2>
                </div>

                <ProductSearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    totalCount={Array.isArray(products) ? products.length : 0}
                    visibleCount={Array.isArray(products) ? products.length : 0}
                    onSubmit={handleSearchSubmit}
                    submitLabel="Cerca"
                    variant="compact"
                    showStats={false}
                    inputId="home-catalog-search"
                    eyebrow="Ricerca rapida"
                    title="Trova il tuo Zippo"
                    placeholder="Cerca per nome"
                />
            </section>
            <LatestArrivalsSection products={products} limit={3} />
            <BestSellerSection products={products} limit={4} />
        </>
    )
}

export default HomePage