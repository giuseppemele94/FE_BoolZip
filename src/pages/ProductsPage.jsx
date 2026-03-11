import ProductList from "../components/ProductList";

function ProductsPage({ products = [] }) {
    return (
        <ProductList
            products={products}
            eyebrow="Catalogo"
            title="Accendini"
            description="Gli accendini Zippo sono resistenti, ricaricabili e costruiti per durare tutta la vita. Trova l'accendino perfetto per te!"
            showFilters
        />
    );
}

export default ProductsPage;
