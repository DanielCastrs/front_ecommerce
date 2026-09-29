import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderDetails } from "../pages/OrderDetails/OrderDetails";
import { Home } from "../pages/Home/Home";
import { Products } from "../pages/Products/Products";
import { ProductDetails } from "../pages/ProductDetails/ProductDetails";
import { Login } from "../pages/Login/Login";
import { Profile } from "../pages/Profile/Profile";
import { Cart } from "../pages/Cart/Cart";
import { Orders } from "../pages/Orders/Orders";
import { Payment } from "../pages/Payment/Payment";

import { MainLayout } from "../layouts/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";
import { AdminProducts } from "../pages/Admin/Products/AdminProducts";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/produtos" element={<Products />} />

          <Route path="/produtos/:id" element={<ProductDetails />} />

          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Profile />} />

            <Route path="/carrinho" element={<Cart />} />

            <Route path="/pedidos" element={<Orders />} />

            <Route path="/pagamento/:orderId" element={<Payment />} />

            <Route path="/pedidos/:orderId" element={<OrderDetails />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/produtos" element={<AdminProducts />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
