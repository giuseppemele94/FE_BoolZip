import { Link } from "react-router-dom";


function MainHeader() {
    return (
        <nav className="navbar custom-navbar">
            <div className="container-fluid justify-content-center">
                <Link to="/" className="text-decoration-none">
                    <img
                        src="/images/logoBoolZip.png"
                        alt="BoolZip"
                        className="header-logo"
                    />
                </Link>
            </div>
        </nav>
    );
}

export default MainHeader;