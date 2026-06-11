import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import type { NfcTag } from '../types'
import { useLang } from '../context/LangContext'

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
  const { t } = useLang()
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
      setImportError(t('nfc.importErrEmpty'))
      return
    }

    const newTags: NfcTag[] = []
    let skipped = 0
    for (const [i, line] of lines.entries()) {
      const parts = line.split(',').map(p => p.trim())
      if (parts.length < 3) {
        setImportError(t('nfc.importErrFormat', { row: i + 1 }))
        return
      }
      const [sequenceNumber, tagId, encryptionKey] = parts
      if (nfcTags.some(existing => existing.sequenceNumber === sequenceNumber)) {
        skipped++
        continue
      }
      newTags.push({
        id: `nfc-${Date.now()}-${i}`,
        sequenceNumber,
        tagId,
        encryptionKey,
        status: 'available',
      })
    }

    if (newTags.length > 0) {
      setNfcTags(prev => [...prev, ...newTags])
    }

    if (newTags.length === 0) {
      setImportSuccess(t('nfc.importAllDuplicates', { skipped }))
    } else if (skipped > 0) {
      setImportSuccess(t('nfc.importResult', { n: newTags.length, skipped }))
    } else {
      setImportSuccess(t('nfc.importSuccess', { n: newTags.length }))
    }
    setCsvInput('')
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{t('nfc.title')}</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="stat-chip">{t('nfc.available')} <span className="count">{available}</span></span>
          <span className="stat-chip">{t('nfc.assigned')} <span className="count">{assigned}</span></span>
          <span className="stat-chip">{t('nfc.total')} <span className="count">{nfcTags.length}</span></span>
        </div>
      </div>

      <div className="import-area">
        <div className="import-title">{t('nfc.importTitle')}</div>
        <div className="import-hint">{t('nfc.importHint')}</div>

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
          {t('nfc.importBtn')}
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t('nfc.col.sequence')}</th>
              <th>{t('nfc.col.tagId')}</th>
              <th>{t('nfc.col.status')}</th>
              <th>{t('nfc.col.assignedCert')}</th>
              <th>{t('nfc.col.assignedAt')}</th>
            </tr>
          </thead>
          <tbody>
            {nfcTags.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">{t('nfc.empty')}</div>
                </td>
              </tr>
            ) : (
              nfcTags.map(tag => (
                <tr key={tag.id} style={{ cursor: 'default' }}>
                  <td>
                    <span className="td-ref">{tag.sequenceNumber}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--text-50)' }}>
                      {tag.tagId}
                    </span>
                  </td>
                  <td>
                    <StatusBadge
                      status={tag.status}
                      label={tag.status === 'available' ? t('nfc.available') : t('nfc.assigned')}
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
