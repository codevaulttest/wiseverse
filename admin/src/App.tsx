import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import NfcTagsPage from './pages/NfcTagsPage'
import type { NfcTag, Order } from './types'
import { MOCK_ORDERS, MOCK_NFC_TAGS } from './mock/data'

function AdminLayout({ onLogout, children }: { onLogout: () => void; children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar onLogout={onLogout} />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [nfcTags, setNfcTags] = useState<NfcTag[]>(MOCK_NFC_TAGS)

  function handleLogin() { setIsLoggedIn(true) }
  function handleLogout() { setIsLoggedIn(false) }

  return (
    <ThemeProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? '/orders' : '/login'} replace />} />
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/orders" replace /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/orders" element={
          isLoggedIn ? (
            <AdminLayout onLogout={handleLogout}>
              <OrdersPage orders={orders} />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/orders/:id" element={
          isLoggedIn ? (
            <AdminLayout onLogout={handleLogout}>
              <OrderDetailPage orders={orders} setOrders={setOrders} />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/nfc-tags" element={
          isLoggedIn ? (
            <AdminLayout onLogout={handleLogout}>
              <NfcTagsPage nfcTags={nfcTags} setNfcTags={setNfcTags} />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
      </Routes>
    </HashRouter>
    </ThemeProvider>
  )
}
