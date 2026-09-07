import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { Home } from '../pages/Home/Home';
import { Products } from '../pages/Products/Products';
import { ProductDetails } from '../pages/ProductDetails/ProductDetails';
import { MainLayout } from '../layouts/MainLayout';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route
            path="/produtos"
            element={<Products />}
          />

          <Route
            path="/produtos/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/carrinho"
            element={<h1>Carrinho</h1>}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}