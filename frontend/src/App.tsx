import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { ShopPage } from '@/pages/ShopPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { AccountPage } from '@/pages/AccountPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/urunler" element={<ShopPage />} />
        <Route path="/urun/:slug" element={<ProductDetailPage />} />
        <Route path="/sepet" element={<CartPage />} />
        <Route path="/odeme" element={<CheckoutPage />} />
        <Route path="/siparis-onay/:orderNumber" element={<OrderConfirmationPage />} />
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/kayit" element={<RegisterPage />} />
        <Route
          path="/hesabim"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
