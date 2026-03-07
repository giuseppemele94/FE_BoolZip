import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";

function DefaultLayout () {

    return (
        <>
        <MainHeader/>
        <main >
            <Outlet/>
        </main>
        </>
    )
}

export default DefaultLayout 