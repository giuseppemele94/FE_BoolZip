import HomePage from "./pages/HomePage"
import DefaultLayout from "./layouts/DefaultLayout"
import NotFoundPage from "./pages/NotFoundPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import ProductsPage from "./pages/ProductsPage"
import { mockProducts } from "./data/mockProducts"
//importo componente per gestire le rotte
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Rotta padre: viene applicato default layout che conterrà sempre l'header, cioò che cambierà sarà il segnaposto outlet   */}
          <Route element={<DefaultLayout />}>
            {/* Route index: quando l'URL è "/" renderizza HomePage dentro il layout */}
            <Route index element={<HomePage products={mockProducts} />} />
            {/* Pagina prodotti: mostra il listato card, non il dettaglio singolo. */}
            <Route path="/products" element={<ProductsPage products={mockProducts} />} />
            {/* Passaggio 4: rotta dinamica modello, pronta per id prodotto da backend. */}
            <Route path="/products/:id" element={<ProductDetailPage products={mockProducts} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
