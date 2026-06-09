import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import type { NfcTag } from '../types'

interface Props {
  nfcTags: NfcTag[]
  setNfcTags: React.Dispatch<React.SetStateAction<NfcTag[]>>
}

function formatDatetime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function NfcTagsPage({ nfcTags, setNfcTags }: Props) {
  const [csvInput, setCsvInput] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)

  const available = nfcTags.filter(t => t.status === 'available').length
  const assigned = nfcTags.filter(t => t.status === 'assigned').length

  function handleImport() {
    setImportError(null)
    setImportSuccess(null)
    const lines = csvInput.trim().split('\n').filter(l => l.trim())
    if (lines.length === 0) {
      setImportError('Enter at least one line')
      return
    }

    const newTags: NfcTag[] = []
    for (const [i, line] of lines.entries()) {
      const parts = line.split(',').map(p => p.trim())
      if (parts.length < 3) {
        setImportError(`Row ${i + 1}: invalid format — expected 3 columns: Sequence,TagID,EncryptionKey`)
        return
      }
      const [sequenceNumber, tagId, encryptionKey] = parts
      if (nfcTags.some(t => t.sequenceNumber === sequenceNumber)) {
        setImportError(`Row ${i + 1}: sequence ${sequenceNumber} already exists`)
        return
      }
      newTags.push({
        id: `nfc-${Date.now()}-${i}`,
        sequenceNumber,
        tagId,
        encryptionKey,
        status: 'available',
      })
    }

    setNfcTags(prev => [...prev, ...newTags])
    setImportSuccess(`Successfully imported ${newTags.length} NFC chip(s)`)
    setCsvInput('')
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">NFC Tags</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="stat-chip">Available <span className="count">{available}</span></span>
          <span className="stat-chip">Assigned <span className="count">{assigned}</span></span>
          <span className="stat-chip">Total <span className="count">{nfcTags.length}</span></span>
        </div>
      </div>

      <div className="import-area">
        <div className="import-title">Import NFC Chips</div>
        <div className="import-hint">Format: Sequence,TagID,EncryptionKey — one per line, from supplier file</div>

        {importError && (
          <div style={{
            padding: '8px 12px',
            borderRadius: 6,
            background: 'var(--error-10)',
            border: '1px solid var(--error-32)',
            color: 'var(--error)',
            fontSize: 14,
            marginBottom: 10,
          }}>
            {importError}
          </div>
        )}

        {importSuccess && (
          <div className="notice notice-success">{importSuccess}</div>
        )}

        <textarea
          className="import-textarea"
          value={csvInput}
          onChange={e => setCsvInput(e.target.value)}
          placeholder={'NFC-SEQ-007,E0:04:01:AA:BB:CC:DD:07,2B7E151628AED2A6ABF7158809CF4F3C\nNFC-SEQ-008,E0:04:01:AA:BB:CC:DD:08,6C3EE5A4D72F1B39082C47E60F8A91D5'}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handleImport}
          disabled={!csvInput.trim()}
        >
          Import
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sequence</th>
              <th>Tag ID</th>
              <th>Status</th>
              <th>Assigned Cert</th>
              <th>Assigned At</th>
            </tr>
          </thead>
          <tbody>
            {nfcTags.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">No NFC chips on record</div>
                </td>
              </tr>
            ) : (
              nfcTags.map(tag => (
                <tr key={tag.id} style={{ cursor: 'default' }}>
                  <td>
                    <span className="td-ref">{tag.sequenceNumber}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--text-60)' }}>
                      {tag.tagId}
                    </span>
                  </td>
                  <td>
                    <StatusBadge
                      status={tag.status}
                      label={tag.status === 'available' ? 'Available' : 'Assigned'}
                    />
                  </td>
                  <td>
                    {tag.assignedToCertNumber
                      ? <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--gold)' }}>{tag.assignedToCertNumber}</span>
                      : <span style={{ color: 'var(--text-28)', fontSize: 14 }}>—</span>
                    }
                  </td>
                  <td className="td-date">
                    {tag.assignedAt ? formatDatetime(tag.assignedAt) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
