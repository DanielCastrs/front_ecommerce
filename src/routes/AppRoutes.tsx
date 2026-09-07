import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from '../pages/Home/Home';
import { MainLayout } from '../layouts/MainLayout';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route
            path="/produtos"
            element={<h1>Produtos</h1>}
          />

          <Route
            path="/login"
            element={<h1>Login</h1>}
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