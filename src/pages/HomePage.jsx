import HeroSection from "../components/HeroSection";
import BestSellerSection from "../components/BestSellerSection";
import LatestArrivalsSection from "../components/LatestArrivalsSection";

function HomePage({ products }) {
    return (
        <>
            <HeroSection />
            <LatestArrivalsSection limit={3} />
            <BestSellerSection products={products} limit={4} />
        </>
    )
}

export default HomePage