interface Props {
  onBack: () => void
}

export default function TermsScreen({ onBack }: Props) {
  return (
    <div className="result-page terms-page">
      <div className="result-inner terms-inner">
        <button className="terms-back-btn" onClick={onBack} aria-label="Back to order form">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        <h1 className="terms-heading">Terms and Conditions of Service</h1>
        <p className="terms-entity">WISEVERSE PTE. LTD.</p>

        <div className="terms-body">
          <p>The full Terms and Conditions of Service governing your engagement with WISEVERSE PTE. LTD. will be provided here and delivered to your email upon order confirmation.</p>
          <p>By submitting an order and completing payment, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions of Service, which shall constitute the binding service agreement between you and WISEVERSE PTE. LTD. with effect from the date payment is confirmed. No separate physical contract will be issued.</p>
          <p>All services are governed by Singapore law. Disputes shall be resolved under SIAC arbitration.</p>
          <p>If you have any questions prior to placing your order, please contact us at <a className="terms-email-link" href="mailto:contact@wiseverse.net">contact@wiseverse.net</a>.</p>
        </div>
      </div>
    </div>
  )
}
