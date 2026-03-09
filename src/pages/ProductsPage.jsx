import ProductList from '../components/ProductList';

function ProductsPage({ products }) {
    return (
        <>
            {/* Passaggio 1: pagina prodotti dedicata con listato card da props. */}
            <ProductList products={products} eyebrow="Catalogo demo" title="Prodotti disponibili" />
        </>
    );
}

export default ProductsPage;
