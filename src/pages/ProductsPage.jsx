import ProductGrid from '../components/ProductGrid';

function ProductsPage({ products }) {
    return (
        <>
            {/* Passaggio 1: pagina prodotti dedicata con listato card da props. */}
            <ProductGrid products={products} eyebrow="Catalogo demo" title="Prodotti disponibili" />
        </>
    );
}

export default ProductsPage;
