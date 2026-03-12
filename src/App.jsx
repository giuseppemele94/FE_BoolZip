import { useEffect, useState } from "react"
import axios from "axios"
import HomePage from "./pages/HomePage"
import DefaultLayout from "./layouts/DefaultLayout"
import NotFoundPage from "./pages/NotFoundPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import ProductsPage from "./pages/ProductsPage"
//importo componente per gestire le rotte
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import CartPage from "./pages/CartPage"

const API_PRODUCTS_URL = "http://localhost:3000/api/products"

function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let isMounted = true

    axios
      .get(API_PRODUCTS_URL)
      .then((res) => {
        if (!isMounted) {
          return
        }

        setProducts(Array.isArray(res.data) ? res.data : [])
      })
      .catch((err) => {
        console.error("Errore nel caricamento prodotti:", err)

        if (isMounted) {
          setProducts([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Rotta padre: viene applicato default layout che conterrà sempre l'header, cioò che cambierà sarà il segnaposto outlet   */}
          <Route element={<DefaultLayout />}>
            {/* Route index: quando l'URL è "/" renderizza HomePage dentro il layout */}
            <Route index element={<HomePage products={products} />} />
            {/* Pagina prodotti: mostra il listato card, non il dettaglio singolo. */}
            <Route path="/products" element={<ProductsPage products={products} />} />
            {/* Passaggio 4: rotta dinamica modello tramite slug. */}
            <Route path="/products/:slug" element={<ProductDetailPage products={products} />} />
             <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </CartProvider>
      </BrowserRouter>
    </>
  )
}

export default App