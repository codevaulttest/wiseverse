import { useState } from 'react'
import { Pencil } from 'lucide-react'
import type { AdminUser, Permission } from '../types'
import { useLang } from '../context/LangContext'
import type { TransKey } from '../i18n'

interface Props {
  users: AdminUser[]
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>
}

const ALL_PERMISSIONS: Permission[] = [
  'nfc_manage',
  'admin_manage',
  'email_templates',
  'edit_order',
  'change_order_status',
]

const PERM_KEY: Record<Permission, TransKey> = {
  nfc_manage: 'perms.nfc',
  admin_manage: 'perms.admin',
  email_templates: 'perms.email',
  edit_order: 'perms.editOrder',
  change_order_status: 'perms.changeStatus',
}

const MAX_VISIBLE = 5

function PermissionSummary({
  perms,
  allPerms,
  t,
}: {
  perms: Permission[]
  allPerms: Permission[]
  t: (key: TransKey) => string
}) {
  const active = allPerms.filter(p => perms.includes(p))
  if (active.length === 0) {
    return <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>—</span>
  }
  const visible = active.slice(0, MAX_VISIBLE)
  const overflow = active.length - MAX_VISIBLE
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      {visible.map(perm => (
        <span key={perm} className="status-badge completed" style={{ fontSize: 12, padding: '2px 8px' }}>
          {t(PERM_KEY[perm])}
        </span>
      ))}
      {overflow > 0 && (
        <span className="status-badge assigned" style={{ fontSize: 12, padding: '2px 8px' }}>
          +{overflow}
        </span>
      )}
    </div>
  )
}

export default function AdminUsersPage({ users, setUsers }: Props) {
  const { t } = useLang()
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editPermissions, setEditPermissions] = useState<Set<Permission>>(new Set())
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  function openEdit(user: AdminUser) {
    setEditingUser(user)
    setEditPermissions(new Set(user.permissions))
  }

  function togglePermission(perm: Permission) {
    setEditPermissions(prev => {
      const next = new Set(prev)
      next.has(perm) ? next.delete(perm) : next.add(perm)
      return next
    })
  }

  function savePermissions() {
    if (!editingUser) return
    setUsers(prev => prev.map(u =>
      u.id === editingUser.id
        ? { ...u, permissions: [...editPermissions] }
        : u
    ))
    setEditingUser(null)
    showToast(t('perms.updated', { name: editingUser.name }))
  }

  function cancelEdit() {
    setEditingUser(null)
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{t('perms.title')}</h1>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t('perms.col.name')}</th>
              <th>{t('perms.col.permissions')}</th>
              <th>{t('perms.col.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="td-name">{user.name}</div>
                </td>
                <td>
                  <PermissionSummary perms={user.permissions} allPerms={ALL_PERMISSIONS} t={t} />
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <button className="btn btn-primary btn-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} onClick={() => openEdit(user)}>
                    <Pencil size={12} />
                    {t('perms.editBtn')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="modal-backdrop" onClick={cancelEdit}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{t('perms.editTitle', { name: editingUser.name })}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {ALL_PERMISSIONS.map(perm => (
                <label
                  key={perm}
                  className="modal-radio-row"
                  onClick={() => togglePermission(perm)}
                  style={{ cursor: 'pointer', alignItems: 'center' }}
                >
                  <input
                    type="checkbox"
                    checked={editPermissions.has(perm)}
                    onChange={() => togglePermission(perm)}
                    style={{ accentColor: 'var(--gold)', width: 16, height: 16 }}
                  />
                  <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>
                    {t(PERM_KEY[perm])}
                  </div>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>{t('common.cancel')}</button>
              <button className="btn btn-primary btn-sm" onClick={savePermissions}>{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  )
}
