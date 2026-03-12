import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";

function DefaultLayout() {
    const { isCartDrawerOpen, closeCartDrawer } = useCart();

    return (
        <div className="app-shell">
            <MainHeader />
            <main className="app-main">
                <Outlet />
            </main>
            <Footer />

            <CartDrawer
                isOpen={isCartDrawerOpen}
                onClose={closeCartDrawer}
            />
        </div>
    )
}

export default DefaultLayout 