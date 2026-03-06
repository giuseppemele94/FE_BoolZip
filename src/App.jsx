import HomePage from "./pages/HomePage"
import DefaultLayout from "./layouts/DefaultLayout"
import NotFoundPage from "./pages/NotFoundPage"
import ProductDetailPage from "./pages/ProductDetailPage"
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
            <Route index element={<HomePage />} />
            {/* Route dinamica: quando l'URL è "/movies/id" renderizza MoviePage dentro il layout */}
            <Route path="/products/1" element = {<ProductDetailPage/>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
