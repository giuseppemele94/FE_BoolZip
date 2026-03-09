function ProductGallery({ product, activeImage, onSelectImage }) {
    return (
        <div className="product-gallery">
            <figure className="product-main-image">
                <img src={activeImage || product.images[0]} alt={product.name} />
            </figure>

            <div className="product-thumbs" aria-label="Miniature prodotto">
                {product.images.map((img, index) => (
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
