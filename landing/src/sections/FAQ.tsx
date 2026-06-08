import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'

function ChevronIcon() {
  return (
    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const [ref, inView] = useInView(0.05)
  const { t } = useLang()

  const faqs = [
    { q: t.faq1_q, a: t.faq1_a },
    { q: t.faq2_q, a: t.faq2_a },
    { q: t.faq3_q, a: t.faq3_a },
    { q: t.faq4_q, a: t.faq4_a },
    { q: t.faq5_q, a: t.faq5_a },
    { q: t.faq6_q, a: t.faq6_a },
  ]

  const toggle = (i: number) => setOpen(prev => prev === i ? null : i)

  return (
    <section
      id="faq"
      style={{ background: 'var(--bg-2)' }}
      aria-labelledby="faq-heading"
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`section reveal${inView ? ' in-view' : ''}`}
      >
        <div className="sec-eyebrow">{t.faq_eyebrow}</div>
        <h2 className="sec-heading" id="faq-heading">{t.faq_heading}</h2>
        <p className="sec-sub">{t.faq_sub}</p>

        <div className="faq-list" role="list">
          {faqs.map((f, i) => (
            <div
              key={i}
              className={`faq-item${open === i ? ' open' : ''}`}
              role="listitem"
            >
              <button
                className="faq-question"
                onClick={() => toggle(i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                {f.q}
                <ChevronIcon />
              </button>
              <div className="faq-answer-wrap" id={`faq-answer-${i}`} role="region">
                <div className="faq-answer">
                  <div className="faq-answer-inner">{f.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
