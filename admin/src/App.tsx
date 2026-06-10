import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import NfcTagsPage from './pages/NfcTagsPage'
import EmailPreviewPage from './pages/EmailPreviewPage'
import AdminUsersPage from './pages/AdminUsersPage'
import type { NfcTag, Order, AdminUser } from './types'
import { MOCK_ORDERS, MOCK_NFC_TAGS, MOCK_ADMIN_USERS } from './mock/data'

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
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS)

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
              <OrdersPage orders={orders} setOrders={setOrders} />
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
        <Route path="/email-preview" element={
          isLoggedIn ? (
            <AdminLayout onLogout={handleLogout}>
              <EmailPreviewPage />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/admin-users" element={
          isLoggedIn ? (
            <AdminLayout onLogout={handleLogout}>
              <AdminUsersPage users={adminUsers} setUsers={setAdminUsers} />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
      </Routes>
    </HashRouter>
    </ThemeProvider>
  )
}
