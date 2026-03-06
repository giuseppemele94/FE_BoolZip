import { Link } from "react-router-dom";

function NotFoundPage() {

    return (
        <div className="h-100 d-flex flex-column align-items-center justify-content-center">
            <h2>Page Not Found</h2>
            <p className="text-muted my-3">Sorry, but the page you are looking for does not exist.</p>
            <Link className="btn btn-primary" to="/">Back to home</Link>
        </div>
    )
}

export default NotFoundPage