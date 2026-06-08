import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'

export default function HowItWorks() {
  const [ref, inView] = useInView(0.05)
  const { t } = useLang()

  const steps = [
    { n: '01', title: t.step1_title, desc: t.step1_desc, tags: [] as string[] },
    { n: '02', title: t.step2_title, desc: t.step2_desc, tags: [] as string[] },
    { n: '03', title: t.step3_title, desc: t.step3_desc, tags: [] as string[] },
    { n: '04', title: t.step4_title, desc: t.step4_desc, tags: [t.tag_cert, t.tag_onchain, t.tag_materials] },
  ]

  return (
    <section
      id="how-it-works"
      style={{ background: 'var(--bg-2)' }}
      aria-labelledby="how-heading"
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`section reveal${inView ? ' in-view' : ''}`}
      >
        <div className="sec-eyebrow">{t.how_eyebrow}</div>
        <h2 className="sec-heading" id="how-heading">{t.how_heading}</h2>
        <p className="sec-sub">{t.how_sub}</p>

        <div className="steps-list">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`step-item reveal${inView ? ' in-view' : ''} reveal-delay-${i + 1}`}
            >
              <div className="step-num-wrap">
                <div className="step-num" aria-hidden="true">{i + 1}</div>
                <div className="step-line" aria-hidden="true" />
              </div>
              <div className="step-content">
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {s.tags.length > 0 && (
                  <div className="step-tags" role="list">
                    {s.tags.map(tag => (
                      <span key={tag} className="step-tag" role="listitem">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="step-bg-num" aria-hidden="true">{s.n}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
