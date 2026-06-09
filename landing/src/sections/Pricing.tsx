import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'
import type { ResultState } from '../screens/ResultScreen'

interface Props {
  onResult: (r: ResultState) => void
  onShowTerms: () => void
}

interface FormValues {
  company: string
  name: string
  address: string
  email: string
  country: string
  video: File | null
}

interface FormErrors {
  company?: string
  name?: string
  address?: string
  email?: string
  country?: string
  video?: string
}

const countries = [
  'Hong Kong SAR',
  'Singapore',
  'United Kingdom',
  'United States',
  'Australia',
  'Japan',
  'South Korea',
  'Other',
]

function CheckIcon() {
  return (
    <svg className="inclusion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

export default function Pricing({ onResult, onShowTerms }: Props) {
  const [ref, inView] = useInView(0.05)
  const { t } = useLang()
  const [values, setValues] = useState<FormValues>({
    company: '', name: '', address: '', email: '', country: '', video: null,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = (v: FormValues): FormErrors => {
    const e: FormErrors = {}
    if (!v.company.trim()) e.company = t.err_required
    if (!v.name.trim()) e.name = t.err_required
    if (!v.address.trim()) e.address = t.err_required
    if (!v.email.trim()) {
      e.email = t.err_required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      e.email = t.err_email
    }
    if (!v.country) e.country = t.err_country
    if (!v.video) {
      e.video = t.err_video_required
    } else {
      const allowed = ['video/mp4', 'video/quicktime', 'video/webm']
      if (!allowed.includes(v.video.type)) e.video = t.err_video_type
      else if (v.video.size > 500 * 1024 * 1024) e.video = t.err_video_size
    }
    return e
  }

  const set = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setValues(v => ({ ...v, [field]: e.target.value }))
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validate({ ...values, [field]: e.target.value })[field] }))
    }
  }

  const blur = (field: keyof FormValues) => () => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(prev => ({ ...prev, [field]: validate(values)[field] }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ company: true, name: true, address: true, email: true, country: true, video: true })
    if (Object.keys(errs).length > 0) return
    onResult('payment-success')
  }

  const inclusions = [t.inc1, t.inc2, t.inc3, t.inc4]

  return (
    <section id="pricing" style={{ background: 'var(--bg)' }} aria-labelledby="pricing-heading">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`section reveal${inView ? ' in-view' : ''}`}
      >
        <div className="sec-eyebrow">{t.pricing_eyebrow}</div>
        <h2 className="sec-heading" id="pricing-heading">{t.pricing_heading}</h2>
        <p className="sec-sub">{t.pricing_sub}</p>

        <div className="pricing-grid">
          <div className="price-card">
            <div className="sec-eyebrow" style={{ marginBottom: 0 }}>{t.price_label}</div>
            <div className="price-amount-row">
              <span className="price-currency">USD</span>
              <span className="price-number">500</span>
            </div>
            <p className="price-unit">{t.price_unit}</p>

            <p className="inclusions-label">{t.inc_label}</p>
            {inclusions.map((item, i) => (
              <div key={i} className="inclusion-item">
                <CheckIcon />
                <span className="inclusion-text">{item}</span>
              </div>
            ))}

            <p className="price-note">{t.price_note}</p>
          </div>

          <div className="order-card">
            <h3 className="order-title">{t.order_title}</h3>
            <p className="order-sub">{t.order_sub}</p>

            <form onSubmit={submit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="f-company">{t.label_company} *</label>
                <input
                  id="f-company"
                  className={`form-input${errors.company && touched.company ? ' error' : ''}`}
                  type="text"
                  placeholder={t.ph_company}
                  value={values.company}
                  onChange={set('company')}
                  onBlur={blur('company')}
                  autoComplete="organization"
                />
                {errors.company && touched.company && <p className="form-error">{errors.company}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="f-name">{t.label_name} *</label>
                <input
                  id="f-name"
                  className={`form-input${errors.name && touched.name ? ' error' : ''}`}
                  type="text"
                  placeholder={t.ph_name}
                  value={values.name}
                  onChange={set('name')}
                  onBlur={blur('name')}
                  autoComplete="name"
                />
                {errors.name && touched.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="f-address">{t.label_address} *</label>
                <input
                  id="f-address"
                  className={`form-input${errors.address && touched.address ? ' error' : ''}`}
                  type="text"
                  placeholder={t.ph_address}
                  value={values.address}
                  onChange={set('address')}
                  onBlur={blur('address')}
                  autoComplete="street-address"
                />
                {errors.address && touched.address && <p className="form-error">{errors.address}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="f-email">{t.label_email} *</label>
                <input
                  id="f-email"
                  className={`form-input${errors.email && touched.email ? ' error' : ''}`}
                  type="email"
                  placeholder={t.ph_email}
                  value={values.email}
                  onChange={set('email')}
                  onBlur={blur('email')}
                  autoComplete="email"
                />
                {errors.email && touched.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="f-country">{t.label_country} *</label>
                <select
                  id="f-country"
                  className={`form-select${errors.country && touched.country ? ' error' : ''}`}
                  value={values.country}
                  onChange={set('country')}
                  onBlur={blur('country')}
                >
                  <option value="" disabled>{t.ph_country}</option>
                  {countries.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.country && touched.country && <p className="form-error">{errors.country}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="f-video">{t.label_video} *</label>
                <label
                  htmlFor="f-video"
                  className={`file-drop${errors.video && touched.video ? ' error' : ''}${values.video ? ' has-file' : ''}`}
                >
                  <svg className="file-drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="file-drop-label">
                    {values.video ? values.video.name : t.ph_video}
                  </span>
                  {values.video && (
                    <span className="file-drop-size">
                      {(values.video.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  )}
                  <input
                    id="f-video"
                    type="file"
                    accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0] ?? null
                      setValues(v => ({ ...v, video: file }))
                      setTouched(t => ({ ...t, video: true }))
                      setErrors(prev => ({
                        ...prev,
                        video: file
                          ? (['video/mp4','video/quicktime','video/webm'].includes(file.type)
                              ? (file.size > 500*1024*1024 ? t.err_video_size : undefined)
                              : t.err_video_type)
                          : t.err_video_required,
                      }))
                    }}
                  />
                </label>
                {errors.video && touched.video && <p className="form-error">{errors.video}</p>}
              </div>

              <div className="order-summary" aria-live="polite">
                <div className="summary-row">
                  <span>{t.summary_unit}</span><span>USD 500.00</span>
                </div>
                <div className="summary-total">
                  <span>{t.summary_total}</span>
                  <span>USD 500.00</span>
                </div>
              </div>

              <p className="order-terms-notice">
                {t.terms_notice_pre}
                <button type="button" className="terms-link" onClick={onShowTerms}>
                  {t.terms_notice_link}
                </button>
                {t.terms_notice_post}
              </p>

              <button type="submit" className="submit-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                {t.btn_submit}
              </button>
            </form>

            <div className="secure-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span>{t.secure_note}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
