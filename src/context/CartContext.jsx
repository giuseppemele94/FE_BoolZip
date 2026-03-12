/**CREO IL CONTEXT DEL CARRELLO
 * SALVA I PRODOTTI IN LOCAL STORAGE
 * METTE A DISPOSIZIONE FUNZIONI PER AGGIUNGERE, RIMUOVERE, AGGIORNARE QUANTITÀ
 * CALCOLA IL NUMERO TOTALE DI ARTICOLI E IL TOTALE ECONOMICO DEL CARRELLO
 * ESPONE TUTTO TRAMITE UN PROVIDER E UN CUSTOM HOOK PER USARLO NEI COMPONENTI
 *  
 *
 */


import { createContext, useContext, useEffect, useMemo, useState } from "react";

function normalizeImage(item) {
  if (typeof item === "string") {
    return item;
  }

  if (!item || typeof item !== "object") {
    return "";
  }

  return item.image_url || item.url || item.src || "";
}

function getProductImages(product) {
  const mainImage = normalizeImage(product?.image_url || product?.image);
  const extraImages = Array.isArray(product?.product_images)
    ? product.product_images.map(normalizeImage)
    : Array.isArray(product?.images)
      ? product.images.map(normalizeImage)
      : [];

  return [...new Set([mainImage, ...extraImages].filter(Boolean))];
}

// Creo il context del carrello.
// Servirà per condividere i dati del carrello in tutta l'app senza passare props a catena.
const CartContext = createContext();

export function CartProvider({ children }) {
  // Stato principale del carrello.
  // Alla prima apertura provo a leggere eventuali prodotti già salvati in localStorage.
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("boolzip_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Stato del pannello carrello laterale.
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Ogni volta che cartItems cambia, salvo il nuovo carrello in localStorage.
  // In questo modo il carrello resta anche dopo il refresh della pagina.
  useEffect(() => {
    localStorage.setItem("boolzip_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Funzione per aggiungere un prodotto al carrello.
  // Se il prodotto esiste già, aumento la quantità.
  // Se non esiste, lo aggiungo come nuovo elemento.
  function addToCart(product, quantityToAdd = 1, options = {}) {
    // Converto la quantità in numero per sicurezza.
    const parsedQuantity = Number(quantityToAdd) || 1;
    const productImages = getProductImages(product);
    const mainProductImage = productImages[0] || "";
    const secondaryProductImage = options.hoverImage || productImages[1] || "";

    setCartItems((prev) => {
      // Controllo se il prodotto è già presente nel carrello.
      const existingProduct = prev.find(
        (item) => item.product_id === product.id
      );

      // Se il prodotto esiste già, aggiorno solo la quantità.
      if (existingProduct) {
        return prev.map((item) =>
          item.product_id === product.id
            ? {
              ...item,
              quantity: item.quantity + parsedQuantity,
              image_url: item.image_url || mainProductImage,
              hover_image_url: item.hover_image_url || secondaryProductImage,
            }
            : item
        );
      }

      // Se il prodotto non esiste ancora, lo aggiungo al carrello.
      return [
        ...prev,
        {
          // Salvo l'id del prodotto con nome product_id
          // così è più chiaro nel contesto carrello/ordine.
          product_id: product.id,

          // Salvo anche lo slug, utile per eventuali link futuri.
          slug: product.slug,

          // Nome del prodotto.
          name: product.name,

          // Prezzo convertito in numero.
          price: Number(product.price),

          // Immagine del prodotto:
          // prima provo image_url,
          // altrimenti provo la prima immagine dell'array images,
          // altrimenti stringa vuota.
          image_url: mainProductImage,

          // Seconda immagine usata per l'effetto hover (accendino aperto/acceso).
          hover_image_url: secondaryProductImage,

          // Quantità iniziale da aggiungere.
          quantity: parsedQuantity,
        },
      ];
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cart:product-added", {
          detail: {
            name: product.name,
            image_url: mainProductImage,
            sourceRect: options.sourceRect || null,
          },
        })
      );

      // Apro il drawer dopo la breve animazione di "volo" verso il carrello.
      const isCartPage = window.location.pathname === "/cart";
      if (!isCartPage) {
        window.setTimeout(() => {
          setIsCartDrawerOpen(true);
        }, 420);
      }
    }
  }

  // Rimuove completamente un prodotto dal carrello.
  function removeFromCart(productId) {
    setCartItems((prev) =>
      prev.filter((item) => item.product_id !== productId)
    );
  }

  // Aumenta di 1 la quantità di un prodotto già presente nel carrello.
  function increaseQuantity(productId) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  // Diminuisce di 1 la quantità di un prodotto.
  // Se la quantità scende a 0, il prodotto viene eliminato dal carrello.
  function decreaseQuantity(productId) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // Imposta manualmente una quantità specifica.
  // Se la quantità è minore o uguale a 0, rimuovo il prodotto.
  function updateQuantity(productId, newQuantity) {
    const quantity = Number(newQuantity);

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  // Svuota completamente il carrello.
  function clearCart() {
    setCartItems([]);
  }

  function openCartDrawer() {
    setIsCartDrawerOpen(true);
  }

  function closeCartDrawer() {
    setIsCartDrawerOpen(false);
  }

  function toggleCartDrawer() {
    setIsCartDrawerOpen((prev) => !prev);
  }

  // Calcolo il numero totale di articoli nel carrello.
  // Non conta i prodotti distinti, ma la somma di tutte le quantità.
  // useMemo evita di ricalcolarlo inutilmente a ogni render.
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Calcolo il totale economico del carrello.
  // Anche questo viene ricalcolato solo quando cambia cartItems.
  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // Oggetto che contiene tutto ciò che voglio rendere disponibile
  // ai componenti che useranno il context del carrello.
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    isCartDrawerOpen,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
  };

  // Rendo disponibile il context a tutti i componenti figli.
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook per usare il carrello in modo più comodo.
// Così nei componenti basta scrivere useCart().
export function useCart() {
  return useContext(CartContext);
}