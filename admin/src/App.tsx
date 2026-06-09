import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/Sidebar'
import DevPanel from './components/DevPanel'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import NfcTagsPage from './pages/NfcTagsPage'
import EmailPreviewPage from './pages/EmailPreviewPage'
import type { NfcTag, Order } from './types'
import { MOCK_ORDERS, MOCK_NFC_TAGS } from './mock/data'

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default function App() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [nfcTags, setNfcTags] = useState<NfcTag[]>(MOCK_NFC_TAGS)

  return (
    <ThemeProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={
          <AdminLayout>
            <OrdersPage orders={orders} />
          </AdminLayout>
        } />
        <Route path="/orders/:id" element={
          <AdminLayout>
            <OrderDetailPage
              orders={orders}
              setOrders={setOrders}
              nfcTags={nfcTags}
              setNfcTags={setNfcTags}
            />
          </AdminLayout>
        } />
        <Route path="/nfc-tags" element={
          <AdminLayout>
            <NfcTagsPage nfcTags={nfcTags} setNfcTags={setNfcTags} />
          </AdminLayout>
        } />
        <Route path="/email-preview" element={
          <AdminLayout>
            <EmailPreviewPage />
          </AdminLayout>
        } />
      </Routes>
      <DevPanel />
    </HashRouter>
    </ThemeProvider>
  )
}
