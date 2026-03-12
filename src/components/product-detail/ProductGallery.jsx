import { useEffect, useState } from 'react';

function ProductGallery({ product, activeImage, onSelectImage }) {
    // 1) Preparo la lista immagini e seleziono quella principale valida.
    const images = Array.isArray(product.images) ? product.images : [];
    const mainImage = activeImage || images[0] || '';
    const currentIndex = Math.max(0, images.indexOf(mainImage));
    const canSlide = images.length > 1;

    // 2) Stato fullscreen per apertura/chiusura della vista ingrandita.
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

    // 3) Apro il fullscreen al click sulla foto principale.
    const openFullscreen = () => {
        if (!mainImage) {
            return;
        }

        setIsFullscreenOpen(true);
    };

    // 4) Chiudo il fullscreen (overlay, bottone X o click immagine ingrandita).
    const closeFullscreen = (event) => {
        if (event) {
            event.stopPropagation();
        }

        setIsFullscreenOpen(false);
    };

    // 5) Accessibilita: Enter/Spazio aprono il fullscreen da tastiera.
    const handleMainImageKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFullscreen();
        }
    };

    // 6) Utility per impedire che i click sui controlli chiudano il modal.
    const stopEventPropagation = (event) => {
        event.stopPropagation();
    };

    // 7) Navigazione carosello indietro.
    const showPreviousImage = () => {
        if (!canSlide) {
            return;
        }

        const previousIndex = (currentIndex - 1 + images.length) % images.length;
        onSelectImage(images[previousIndex]);
    };

    // 8) Navigazione carosello avanti.
    const showNextImage = () => {
        if (!canSlide) {
            return;
        }

        const nextIndex = (currentIndex + 1) % images.length;
        onSelectImage(images[nextIndex]);
    };

    // 9) Quando il fullscreen e aperto: blocco scroll pagina e abilito shortcut tastiera.
    useEffect(() => {
        if (!isFullscreenOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsFullscreenOpen(false);
            }

            if (canSlide && event.key === 'ArrowLeft') {
                showPreviousImage();
            }

            if (canSlide && event.key === 'ArrowRight') {
                showNextImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreenOpen, canSlide, currentIndex, images]);

    return (
        <div className="product-gallery">
            {/* 10) Immagine principale cliccabile per aprire il fullscreen. */}
            <figure
                className="product-main-image"
                role="button"
                tabIndex={0}
                onClick={openFullscreen}
                onKeyDown={handleMainImageKeyDown}
                aria-label="Apri immagine a schermo intero"
            >
                <img src={mainImage} alt={product.name} />

                <span className="product-main-image__zoom-hint">Clicca per fullscreen</span>

                {canSlide && (
                    <>
                        <button
                            type="button"
                            className="product-main-image__nav product-main-image__nav--prev"
                            onMouseDown={stopEventPropagation}
                            onClick={(event) => {
                                stopEventPropagation(event);
                                showPreviousImage();
                            }}
                            aria-label="Mostra immagine precedente"
                        >
                            <span className="product-main-image__nav-icon" aria-hidden="true">&lt;</span>
                        </button>

                        <button
                            type="button"
                            className="product-main-image__nav product-main-image__nav--next"
                            onMouseDown={stopEventPropagation}
                            onClick={(event) => {
                                stopEventPropagation(event);
                                showNextImage();
                            }}
                            aria-label="Mostra immagine successiva"
                        >
                            <span className="product-main-image__nav-icon" aria-hidden="true">&gt;</span>
                        </button>
                    </>
                )}
            </figure>

            {/* 11) Miniature per cambiare rapidamente immagine nel dettaglio. */}
            <div className="product-thumbs" aria-label="Miniature prodotto">
                {images.map((img, index) => (
                    <button
                        key={img}
                        type="button"
                        className={`product-thumb ${mainImage === img ? 'is-active' : ''}`}
                        onClick={() => onSelectImage(img)}
                        aria-label={`Mostra immagine ${index + 1}`}
                    >
                        <img src={img} alt={`${product.name} vista ${index + 1}`} />
                    </button>
                ))}
            </div>

            {/* 12) Overlay fullscreen con chiusura su sfondo, X e click sull'immagine. */}
            {isFullscreenOpen && (
                <div
                    className="product-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Immagine ingrandita di ${product.name}`}
                    onClick={closeFullscreen}
                >
                    <div className="product-lightbox__backdrop" />

                    <div className="product-lightbox__content" onClick={stopEventPropagation}>
                        <button
                            type="button"
                            className="product-lightbox__close"
                            onClick={closeFullscreen}
                            aria-label="Chiudi schermo intero"
                        >
                            ×
                        </button>

                        {canSlide && (
                            <>
                                <button
                                    type="button"
                                    className="product-lightbox__nav product-lightbox__nav--prev"
                                    onClick={showPreviousImage}
                                    aria-label="Immagine precedente"
                                >
                                    <span aria-hidden="true">&lt;</span>
                                </button>

                                <button
                                    type="button"
                                    className="product-lightbox__nav product-lightbox__nav--next"
                                    onClick={showNextImage}
                                    aria-label="Immagine successiva"
                                >
                                    <span aria-hidden="true">&gt;</span>
                                </button>
                            </>
                        )}

                        <img
                            src={mainImage}
                            alt={`${product.name} a schermo intero`}
                            className="product-lightbox__img"
                            onClick={closeFullscreen}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductGallery;
