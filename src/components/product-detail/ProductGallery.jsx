import { useEffect, useState } from 'react';

function ProductGallery({ product, activeImage, onSelectImage }) {
    // 1) Preparo lista immagini e immagine principale.
    const images = Array.isArray(product.images) ? product.images : [];
    const mainImage = activeImage || images[0] || '';
    const currentIndex = Math.max(0, images.indexOf(mainImage));
    const canSlide = images.length > 1;

    // 2) Stato fullscreen (aperto/chiuso).
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    // 3) Stato lente e posizione puntatore nel fullscreen.
    const [isLensActive, setIsLensActive] = useState(false);
    const [lensPosition, setLensPosition] = useState({ x: 50, y: 50 });
    const LENS_ZOOM_SCALE = 3.1;

    // 4) Apro fullscreen al click sulla foto principale.
    const openFullscreen = () => {
        if (!mainImage) {
            return;
        }

        setIsFullscreenOpen(true);
    };

    // 5) Chiudo fullscreen e resetto la lente.
    const closeFullscreen = (event) => {
        if (event) {
            event.stopPropagation();
        }

        setIsLensActive(false);
        setIsFullscreenOpen(false);
    };

    // 6) Toggle lente (bottone o click immagine fullscreen).
    const toggleLens = (event) => {
        if (event) {
            event.stopPropagation();
        }

        setIsLensActive((current) => !current);
    };

    // 7) Aggiorno posizione lente in percentuale.
    const handleLensMove = (event) => {
        if (!isLensActive) {
            return;
        }

        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;

        setLensPosition({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
        });
    };

    // 8) Accessibilita: Enter/Spazio aprono fullscreen.
    const handleMainImageKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFullscreen();
        }
    };

    // 9) Evito che i click dei controlli chiudano il modal.
    const stopEventPropagation = (event) => {
        event.stopPropagation();
    };

    // 10) Vai all'immagine precedente.
    const showPreviousImage = () => {
        if (!canSlide) {
            return;
        }

        const previousIndex = (currentIndex - 1 + images.length) % images.length;
        onSelectImage(images[previousIndex]);
    };

    // 11) Vai all'immagine successiva.
    const showNextImage = () => {
        if (!canSlide) {
            return;
        }

        const nextIndex = (currentIndex + 1) % images.length;
        onSelectImage(images[nextIndex]);
    };

    // 12) In fullscreen: blocco scroll e abilito shortcut tastiera.
    useEffect(() => {
        if (!isFullscreenOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event) => {
            // Chiusura rapida modal.
            if (event.key === 'Escape') {
                setIsFullscreenOpen(false);
                setIsLensActive(false);
            }

            // Navigazione da tastiera nel carosello.
            if (canSlide && event.key === 'ArrowLeft') {
                showPreviousImage();
            }

            if (canSlide && event.key === 'ArrowRight') {
                showNextImage();
            }

            // Toggle lente da tastiera.
            if (event.key.toLowerCase() === 'z') {
                setIsLensActive((current) => !current);
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
            {/* 13) Immagine principale cliccabile per aprire fullscreen. */}
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
                        {/* Freccia precedente sulla foto principale. */}
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

                        {/* Freccia successiva sulla foto principale. */}
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

            {/* 14) Miniature per cambiare rapidamente immagine. */}
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

            {/* 15) Overlay fullscreen con X, frecce e lente. */}
            {isFullscreenOpen && (
                <div
                    className="product-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Immagine ingrandita di ${product.name}`}
                    onClick={closeFullscreen}
                >
                    <div className="product-lightbox__backdrop" />

                    {/* Contenuto modal: blocco click per evitare chiusure involontarie. */}
                    <div className="product-lightbox__content" onClick={stopEventPropagation}>
                        {/* Pulsante chiusura fullscreen. */}
                        <button
                            type="button"
                            className="product-lightbox__close"
                            onClick={closeFullscreen}
                            aria-label="Chiudi schermo intero"
                        >
                            ×
                        </button>

                        {/* Pulsante attiva/disattiva lente. */}
                        <button
                            type="button"
                            className={`product-lightbox__lens-toggle ${isLensActive ? 'is-active' : ''}`}
                            onClick={toggleLens}
                            aria-label={isLensActive ? 'Disattiva lente' : 'Attiva lente'}
                        >
                            Lente
                        </button>

                        {canSlide && (
                            <>
                                {/* Freccia precedente in fullscreen. */}
                                <button
                                    type="button"
                                    className="product-lightbox__nav product-lightbox__nav--prev"
                                    onClick={showPreviousImage}
                                    aria-label="Immagine precedente"
                                >
                                    <span aria-hidden="true">&lt;</span>
                                </button>

                                {/* Freccia successiva in fullscreen. */}
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

                        {/* Wrapper immagine fullscreen: click toggle lente, mouse move aggiorna posizione. */}
                        <div
                            className={`product-lightbox__image-wrap ${isLensActive ? 'is-lens-active' : ''}`}
                            onClick={toggleLens}
                            onMouseMove={handleLensMove}
                            onMouseLeave={() => setLensPosition({ x: 50, y: 50 })}
                        >
                            <img
                                src={mainImage}
                                alt={`${product.name} a schermo intero`}
                                className={`product-lightbox__img ${isLensActive ? 'is-lens-active' : ''}`}
                            />

                            {isLensActive && (
                                <span
                                    className="product-lightbox__lens"
                                    style={{
                                        left: `${lensPosition.x}%`,
                                        top: `${lensPosition.y}%`,
                                        backgroundImage: `url(${mainImage})`,
                                        backgroundPosition: `${lensPosition.x}% ${lensPosition.y}%`,
                                        backgroundSize: `${LENS_ZOOM_SCALE * 100}%`,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductGallery;
