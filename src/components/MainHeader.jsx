import { Link } from "react-router-dom";

function MainHeader() {

    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid justify-content-center">
                <Link className="navbar-brand" to="/">BoolZip</Link>
            </div>
        </nav>
    )
}

export default MainHeader; 