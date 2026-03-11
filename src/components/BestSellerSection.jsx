import { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "./ProductList";

function BestSellerSection() {
    const [bestSellerProducts, setBestSellerProducts] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/products/top")
            .then((res) => {
                setBestSellerProducts(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <ProductList
            products={bestSellerProducts}
            eyebrow="Selezione"
            title="Prodotti più venduti"
        />
    );
}

export default BestSellerSection;