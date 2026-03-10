import ProductList from "../components/ProductList";

function ProductsPage({ products = [] }) {
    return (
        <ProductList
            products={products}
            eyebrow="Catalogo demo"
            title="Prodotti disponibili"
        />
    );
}

export default ProductsPage;
