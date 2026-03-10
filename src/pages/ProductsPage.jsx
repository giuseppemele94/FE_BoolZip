import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../components/ProductList";

function ProductsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/products")
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <ProductList
            products={products}
            eyebrow="Catalogo demo"
            title="Prodotti disponibili"
        />
    );
}

export default ProductsPage;
