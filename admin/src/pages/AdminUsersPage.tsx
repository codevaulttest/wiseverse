import { useState } from 'react'
import type { AdminUser, Permission } from '../types'

interface Props {
  users: AdminUser[]
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>
}

const PERMISSION_LABELS: Record<Permission, string> = {
  nfc_manage: 'NFC Tags',
  admin_manage: 'Admin Management',
  email_templates: 'Email Templates',
  edit_order: 'Edit Order',
  change_order_status: 'Change Order Status',
}

const ALL_PERMISSIONS: Permission[] = [
  'nfc_manage',
  'admin_manage',
  'email_templates',
  'edit_order',
  'change_order_status',
]

export default function AdminUsersPage({ users, setUsers }: Props) {
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
    showToast(`Permissions updated for ${editingUser.email}`)
  }

  function cancelEdit() {
    setEditingUser(null)
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Permissions</h1>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="td-name">{user.name}</div>
                </td>
                <td>
                  <div style={{ fontSize: 14, color: 'var(--text)' }}>{user.email}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {ALL_PERMISSIONS.map(perm => (
                      <span
                        key={perm}
                        className={`status-badge ${user.permissions.includes(perm) ? 'completed' : 'assigned'}`}
                        style={{ fontSize: 12, padding: '2px 8px' }}
                      >
                        {PERMISSION_LABELS[perm]}
                      </span>
                    ))}
                  </div>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <button className="btn btn-primary btn-xs" onClick={() => openEdit(user)}>
                    Edit Permissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Edit permissions modal ── */}
      {editingUser && (
        <div className="modal-backdrop" onClick={cancelEdit}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Edit Permissions — {editingUser.email}</div>
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
                    {PERMISSION_LABELS[perm]}
                  </div>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={savePermissions}>Save</button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  )
}