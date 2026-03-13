import { useEffect } from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
    useEffect(() => {
        document.body.classList.add("body--logo-background");

        return () => {
            document.body.classList.remove("body--logo-background");
        };
    }, []);

    return (
        <div className="product-page product-page--fallback">
            <h2>Pagina non trovata</h2>
            <p className="text-muted my-3">La pagina che hai richiesto non è stata trovata..</p>
            <Link className=" product-back-link" to="/">Torna alla home</Link>
        </div>
    )
}

export default NotFoundPage