function ProductGallery({ product, activeImage, onSelectImage }) {
    // Mantengo sempre un'immagine principale valida.
    const images = Array.isArray(product.images) ? product.images : [];
    const mainImage = activeImage || images[0] || '';

    return (
        <div className="product-gallery">
            <figure className="product-main-image">
                <img src={mainImage} alt={product.name} />
            </figure>

            <div className="product-thumbs" aria-label="Miniature prodotto">
                {images.map((img, index) => (
                    <button
                        key={img}
                        type="button"
                        className={`product-thumb ${activeImage === img ? 'is-active' : ''}`}
                        onClick={() => onSelectImage(img)}
                        aria-label={`Mostra immagine ${index + 1}`}
                    >
                        <img src={img} alt={`${product.name} vista ${index + 1}`} />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ProductGallery;
