import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGallery from '../components/product-detail/ProductGallery';
import ProductInfoPanel from '../components/product-detail/ProductInfoPanel';
import RelatedProducts from '../components/product-detail/RelatedProducts';

function ProductDetailPage({ products = [] }) {
    // Passaggio 4: leggo l'id dalla URL e recupero il prodotto dalle props.
    const { id } = useParams();
    const product = useMemo(() => products.find((item) => item.id === id), [id, products]);

    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Passaggio 6: quando cambia il prodotto resetto lo stato locale della UI.
    useEffect(() => {
        if (!product) {
            return;
        }

        setActiveImage(product.images[0]);
        setQuantity(1);
    }, [product]);

    if (!product) {
        return (
            <section className="product-page product-page--fallback">
                <h1>Prodotto non trovato</h1>
                <p>Il modello richiesto non e presente in questa demo.</p>
                <Link to="/" className="product-back-link">
                    Torna alla home
                </Link>
            </section>
        );
    }

    // Passaggio 6: costruisco i correlati partendo sempre dalle props ricevute.
    const relatedProducts = products.filter((item) => product.relatedIds.includes(item.id));
    const outOfStock = product.stock === 0;

    const decrement = () => setQuantity((current) => Math.max(1, current - 1));
    const increment = () => setQuantity((current) => Math.min(10, current + 1));

    return (
        <section className="product-page">
            <div className="product-detail">
                <ProductGallery
                    product={product}
                    activeImage={activeImage}
                    onSelectImage={setActiveImage}
                />

                <ProductInfoPanel
                    product={product}
                    quantity={quantity}
                    onDecrease={decrement}
                    onIncrease={increment}
                    outOfStock={outOfStock}
                />
            </div>

            {/* Passaggio 7: correlati estratti in componente dedicato. */}
            <RelatedProducts products={relatedProducts} />
        </section>
    );
}

export default ProductDetailPage;