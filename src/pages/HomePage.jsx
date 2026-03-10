import HeroSection from "../components/HeroSection";
import BestSellerSection from "../components/BestSellerSection";

function HomePage({ products }) {
    return (
        <>
            <HeroSection />
            <BestSellerSection products={products} limit={4} />
        </>
    )
}

export default HomePage