import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";

function HomePage({ products }) {
    return (
        <>
            <HeroSection />
            {/* Passaggio 3: in home passo i prodotti via props al componente card. */}
            <ProductGrid
                products={products}
                eyebrow="Selezione"
                title="Prodotti in evidenza"
                limit={3}
            />
        </>
    )
}

export default HomePage