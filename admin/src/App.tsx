import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LangProvider } from './context/LangContext'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import NfcTagsPage from './pages/NfcTagsPage'
import EmailPreviewPage from './pages/EmailPreviewPage'
import AdminUsersPage from './pages/AdminUsersPage'
import type { NfcTag, Order, AdminUser, EmailTemplate } from './types'
import { MOCK_ORDERS, MOCK_NFC_TAGS, MOCK_ADMIN_USERS, INITIAL_EMAIL_TEMPLATES } from './mock/data'

function AdminLayout({ currentUser, onLogout, onChangePassword, children }: { currentUser: AdminUser | null; onLogout: () => void; onChangePassword: (currentPwd: string, newPwd: string) => string | null; children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar currentUser={currentUser} onLogout={onLogout} onChangePassword={onChangePassword} />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [nfcTags, setNfcTags] = useState<NfcTag[]>(MOCK_NFC_TAGS)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS)
  const [templates, setTemplates] = useState<EmailTemplate[]>(INITIAL_EMAIL_TEMPLATES)

  const isLoggedIn = currentUser !== null

  function handleLogin(username: string) {
    const user = MOCK_ADMIN_USERS.find(u => u.name === username) ?? {
      id: 'unknown',
      name: username,
      permissions: [],
    }
    setCurrentUser(user)
  }

  function handleLogout() { setCurrentUser(null) }

  function handleChangePassword(currentPwd: string, newPwd: string): string | null {
    if (!currentUser) return 'not_logged_in'
    const stored = adminUsers.find(u => u.id === currentUser.id)
    if ((stored?.password ?? 'admin123') !== currentPwd) return 'wrong_current'
    const updated = adminUsers.map(u =>
      u.id === currentUser.id ? { ...u, password: newPwd } : u
    )
    setAdminUsers(updated)
    setCurrentUser(prev => prev ? { ...prev, password: newPwd } : prev)
    return null
  }

  const canEditTemplates = currentUser?.permissions.includes('email_templates') ?? false

  return (
    <LangProvider>
    <ThemeProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? '/orders' : '/login'} replace />} />
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/orders" replace /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/orders" element={
          isLoggedIn ? (
            <AdminLayout currentUser={currentUser} onLogout={handleLogout} onChangePassword={handleChangePassword}>
              <OrdersPage orders={orders} setOrders={setOrders} />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/orders/:id" element={
          isLoggedIn ? (
            <AdminLayout currentUser={currentUser} onLogout={handleLogout} onChangePassword={handleChangePassword}>
              <OrderDetailPage orders={orders} setOrders={setOrders} />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/nfc-tags" element={
          isLoggedIn ? (
            <AdminLayout currentUser={currentUser} onLogout={handleLogout} onChangePassword={handleChangePassword}>
              <NfcTagsPage nfcTags={nfcTags} setNfcTags={setNfcTags} />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/email-preview" element={
          isLoggedIn ? (
            <AdminLayout currentUser={currentUser} onLogout={handleLogout} onChangePassword={handleChangePassword}>
              <EmailPreviewPage
                templates={templates}
                setTemplates={setTemplates}
                canEdit={canEditTemplates}
              />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
        <Route path="/admin-users" element={
          isLoggedIn ? (
            <AdminLayout currentUser={currentUser} onLogout={handleLogout} onChangePassword={handleChangePassword}>
              <AdminUsersPage users={adminUsers} setUsers={setAdminUsers} />
            </AdminLayout>
          ) : <Navigate to="/login" replace />
        } />
      </Routes>
    </HashRouter>
    </ThemeProvider>
    </LangProvider>
  )
}
