import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import Footer from "../components/Footer";

function DefaultLayout () {

    return (
        <>
        <MainHeader/>
        <main >
            <Outlet/>
        </main>
        <Footer/>
        </>
    )
}

export default DefaultLayout 