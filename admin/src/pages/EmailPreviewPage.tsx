import { useState } from 'react'

const MOCK_VARS = {
  CLIENT_NAME: 'Zhang Wei',
  COMPANY_NAME: 'Futureworks Media Ltd.',
  CERT_REF: 'WV-2026-001',
  NUM_WORKS: '3',
  ORDER_TOTAL: '1,500.00',
  SUBMISSION_DATE: '12 May 2026',
  DELIVERY_DATE: '26 May 2026',
  WORKS_LIST: '  1. The Last Migration — Director\'s Cut\n  2. Echoes of the Pearl River\n  3. Neon Solstice',
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

const TEMPLATE_1_BODY = `Dear {{CLIENT_NAME}},

Thank you for your order and for submitting your video work(s) for authentication.
We confirm that payment has been received and your file(s) have been successfully
uploaded. Please refer to your invoice as attached. Your certification is now
in progress.

Please retain this email as your official service confirmation. The reference
number above should be quoted in all future correspondence regarding this order.

────────────────────────────────────────────────────────────────────────────────
ORDER SUMMARY
────────────────────────────────────────────────────────────────────────────────

  Service Reference:        {{CERT_REF}}
  Client / Entity:          {{COMPANY_NAME}}
  Submission Date:          {{SUBMISSION_DATE}}
  Number of Works:          {{NUM_WORKS}}
  Total Paid:               USD {{ORDER_TOTAL}}
  Estimated Delivery:       {{DELIVERY_DATE}}

  Works submitted for certification:
{{WORKS_LIST}}

────────────────────────────────────────────────────────────────────────────────
WHAT HAPPENS NEXT
────────────────────────────────────────────────────────────────────────────────

  Step 1 — Authentication processing
  Our team will establish correspondence mapping, complete on-chain registration,
  produce the physical chip certificate(s), and compile the authentication report(s).

  Step 2 — Delivery
  Your complete authentication package will be dispatched by the estimated
  delivery date above. Physical certificates are sent via international courier
  to your registered address.

  For any queries regarding your order, please contact us at:
  contact@wiseverse.net — quoting your reference number {{CERT_REF}}.

© 2026  WISEVERSE PTE. LTD.  |  UEN: 202429365C`

const TEMPLATE_2_BODY = `Dear {{CLIENT_NAME}},

Thank you for your order and for submitting your video work(s) for authentication.
We confirm that payment has been received and your file(s) have been successfully
uploaded. Please refer to your invoice as attached. Your certification is now
in progress.

Please retain this email as your official service confirmation. The reference
number above should be quoted in all future correspondence regarding this order.

────────────────────────────────────────────────────────────────────────────────
ORDER SUMMARY
────────────────────────────────────────────────────────────────────────────────

  Service Reference:        {{CERT_REF}}
  Client / Entity:          {{COMPANY_NAME}}
  Submission Date:          {{SUBMISSION_DATE}}
  Number of Works:          {{NUM_WORKS}}
  Total Paid:               USD {{ORDER_TOTAL}}
  Estimated Delivery:       {{DELIVERY_DATE}}

  Works submitted for certification:
{{WORKS_LIST}}

────────────────────────────────────────────────────────────────────────────────
WHAT HAPPENS NEXT
────────────────────────────────────────────────────────────────────────────────

  Step 1 — Authentication processing
  Our team will establish correspondence mapping, complete on-chain registration,
  produce the physical chip certificate(s), and compile the authentication report(s).

  Step 2 — Delivery
  Your complete authentication package will be dispatched by the estimated
  delivery date above. Physical certificates are sent via international courier
  to your registered address. Digital deliverables (on-chain identifier,
  authentication report, verification materials) are sent to this email address.

  For any queries regarding your order, please contact us at:
  contact@wiseverse.net — quoting your reference number {{CERT_REF}}.

© 2026  WISEVERSE PTE. LTD.  |  UEN: 202429365C`

const TEMPLATES = [
  {
    id: 1,
    label: 'Template 1 — Physical delivery only',
    subject: '[{{CERT_REF}}] Your Authentication Service is Confirmed — WISEVERSE PTE. LTD.',
    body: TEMPLATE_1_BODY,
    desc: 'Trigger: payment confirmed + video received. Physical certificate dispatched by courier only.',
  },
  {
    id: 2,
    label: 'Template 2 — Physical + digital delivery',
    subject: '[{{CERT_REF}}] Your Authentication Service is Confirmed — WISEVERSE PTE. LTD.',
    body: TEMPLATE_2_BODY,
    desc: 'Same as Template 1, but Step 2 adds: digital deliverables (on-chain ID, auth report, verification materials) sent to client email.',
  },
]

export default function EmailPreviewPage() {
  const [active, setActive] = useState(1)

  const tpl = TEMPLATES.find(t => t.id === active)!
  const filledSubject = fillTemplate(tpl.subject, MOCK_VARS)
  const filledBody = fillTemplate(tpl.body, MOCK_VARS)

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Email Templates</h1>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-60)', marginBottom: 20 }}>
        Preview with mock data filled in. Merge variables are substituted automatically at send time.
      </p>

      <div className="email-tabs">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            className={`email-tab ${active === t.id ? 'active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-28)', marginBottom: 14 }}>{tpl.desc}</p>

      <div className="email-preview-wrap">
        <div className="email-subject">{filledSubject}</div>
        <div className="email-meta">
          From: no-reply@wiseverse.net &nbsp;·&nbsp; To: {MOCK_VARS.CLIENT_NAME} &lt;client@example.com&gt;
        </div>
        <div className="email-body">{filledBody}</div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="detail-card-title" style={{ marginBottom: 10, fontSize: 11 }}>MERGE VARIABLES</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Mock value</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(MOCK_VARS).map(([key, val]) => (
                <tr key={key} style={{ cursor: 'default' }}>
                  <td><code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--gold)' }}>{`{{${key}}}`}</code></td>
                  <td style={{ fontSize: 12, color: 'var(--text)' }}>{val.includes('\n') ? '(multi-line)' : val}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-28)' }}>Order data</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
