interface Props {
  onBack: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="terms-section">
      <h2 className="terms-clause-heading">{title}</h2>
      {children}
    </div>
  )
}

function Clause({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="terms-clause">
      <h3 className="terms-clause-title">{n}. {title}</h3>
      {children}
    </div>
  )
}

function Sub({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="terms-sub"><span className="terms-sub-n">{n}</span>{children}</p>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="terms-bullet-list">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  )
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

        {/* Header */}
        <div className="terms-header">
          <p className="terms-entity">WISEVERSE PTE. LTD.</p>
          <h1 className="terms-heading">Terms and Conditions of Service</h1>
          <p className="terms-subtitle">数字视频作品国际辅助认证服务条款</p>
          <div className="terms-meta">
            <span>Version: 1.0</span>
            <span>Effective Date: 1 June 2026</span>
            <span>Issued by: WISEVERSE PTE. LTD.</span>
            <span>UEN: 202429365C</span>
            <span>Email: <a className="terms-email-link" href="mailto:contact@wiseverse.net">contact@wiseverse.net</a></span>
            <span>Website: <a className="terms-email-link" href="https://wiseverse.net" target="_blank" rel="noopener noreferrer">https://wiseverse.net</a></span>
            <span>Governing Law: Singapore</span>
            <span>Dispute Resolution: SIAC Arbitration</span>
          </div>
        </div>

        <div className="terms-body">

          {/* How these terms become binding */}
          <div className="terms-section terms-section-intro">
            <h2 className="terms-clause-heading">HOW THESE TERMS BECOME BINDING</h2>
            <p>These Terms and Conditions of Service ("Terms") form a legally binding agreement between you ("Client") and WISEVERSE PTE. LTD. ("WISEVERSE") under Singapore law and the Electronic Transactions Act 2010 (Singapore).</p>
            <p>A binding agreement is formed at the moment you take any one of the following actions:</p>
            <ol className="terms-alpha-list">
              <li>tick the acceptance checkbox on the payment or order page and complete payment;</li>
              <li>submit an order and complete payment without a checkbox, where these Terms were clearly displayed before payment; or</li>
              <li>submit video files for authentication following payment confirmation.</li>
            </ol>
            <p>No physical contract, wet-ink signature, or countersigned document is required. These Terms, together with your order confirmation email, constitute the entire service agreement between the parties. A timestamped record of your acceptance is retained by WISEVERSE in accordance with applicable law.</p>
            <p>If you do not agree to these Terms, do not proceed with payment or submission.</p>
          </div>

          {/* Clause 1 */}
          <Clause n="1" title="DEFINITIONS">
            <p>In these Terms, the following expressions have the meanings set out below:</p>
            <Sub n="1.1">"Agreement" means these Terms and Conditions of Service together with the order confirmation email issued to you upon payment, which together constitute the entire binding service agreement between the parties.</Sub>
            <Sub n="1.2">"Auxiliary Authentication Services" means the full suite of commercial technical authentication services described in Clause 4, provided by WISEVERSE to the Client in respect of Digital Video Works.</Sub>
            <Sub n="1.3">"Authentication Package" means the complete set of deliverables issued per video work, comprising the Physical Authentication Certificate, On-chain Registration Identifier, Authentication Report, and correspondence verification materials.</Sub>
            <Sub n="1.4">"Client" means the individual or entity that submits an order and completes payment for Auxiliary Authentication Services, also referred to as "you" or "Party A" in these Terms.</Sub>
            <Sub n="1.5">"Correspondence Verification" means the technical consistency-matching service conducted by WISEVERSE confirming the one-to-one relationship among a specified Digital Video Work, its On-chain Registration Identifier, and its Physical Authentication Certificate.</Sub>
            <Sub n="1.6">"Digital Video Works" means the digital video content and associated materials submitted by the Client for authentication under these Terms, in respect of which the Client has obtained the necessary overseas commercial operating authorisation.</Sub>
            <Sub n="1.7">"Electronic Acceptance" means the act of ticking the acceptance checkbox and completing payment on the order page, or such other affirmative act as constitutes acceptance of these Terms under the Electronic Transactions Act 2010 (Singapore).</Sub>
            <Sub n="1.8">"On-chain Registration Identifier" means a unique digital registration record generated on third-party blockchain infrastructure and assigned to a Digital Video Work, used solely for digital identity mapping, information validation, traceability assistance, and anti-counterfeiting verification. For the avoidance of doubt, the On-chain Registration Identifier does not constitute a non-fungible token (NFT), virtual asset, digital payment token, financial instrument, or any form of investment product.</Sub>
            <Sub n="1.9">"Overseas Territories" means all countries and regions outside the mainland of the People's Republic of China.</Sub>
            <Sub n="1.10">"Physical Authentication Certificate" means the physical document exclusively issued by WISEVERSE incorporating an embedded anti-counterfeiting chip, enabling the holder to verify the correspondence among a Digital Video Work, its On-chain Registration Identifier, and the certificate by scanning the chip.</Sub>
            <Sub n="1.11">"Service Fee" means the fee of USD 500.00 per Digital Video Work payable by the Client for the Auxiliary Authentication Services.</Sub>
            <Sub n="1.12">"WISEVERSE" means WISEVERSE PTE. LTD., a commercial technical services entity registered in Singapore, also referred to as "we", "us", or "Party B" in these Terms.</Sub>
          </Clause>

          {/* Clause 2 */}
          <Clause n="2" title="FORMATION OF AGREEMENT">
            <Sub n="2.1">These Terms are offered by WISEVERSE to any person or entity who accesses the order page and seeks to procure Auxiliary Authentication Services.</Sub>
            <Sub n="2.2">A legally binding Agreement is formed between the Client and WISEVERSE upon Electronic Acceptance and confirmed payment, in accordance with the Electronic Transactions Act 2010 (Singapore). No further formality, signature, or countersigned physical document is required.</Sub>
            <Sub n="2.3">WISEVERSE will issue an order confirmation email to the Client's registered email address upon payment confirmation. That email, together with these Terms, constitutes the complete written record of the Agreement. The Client is advised to retain the confirmation email as evidence of the Agreement.</Sub>
            <Sub n="2.4">WISEVERSE records the timestamp, IP address, and T&C version number associated with each Electronic Acceptance. This record is admissible as evidence of contract formation under applicable Singapore law.</Sub>
            <Sub n="2.5">These Terms apply to each individual order placed. Where the Client places multiple orders, a separate Agreement on these Terms is formed in respect of each order.</Sub>
          </Clause>

          {/* Clause 3 */}
          <Clause n="3" title="CLIENT REPRESENTATIONS AND WARRANTIES">
            <p>By proceeding with Electronic Acceptance, the Client irrevocably represents and warrants to WISEVERSE as follows:</p>
            <Sub n="3.1">The Client is a lawfully constituted entity or individual with full legal capacity and authority to enter into this Agreement and to perform all obligations hereunder.</Sub>
            <Sub n="3.2">The Client has lawfully obtained all necessary authorisations, licences, and rights in respect of each Digital Video Work submitted, including without limitation all required overseas commercial operating rights, promotional rights, and display rights. The chain of title is clear and unencumbered.</Sub>
            <Sub n="3.3">There are no undisclosed title disputes, third-party claims, court orders, injunctions, or pending proceedings affecting any submitted Digital Video Work.</Sub>
            <Sub n="3.4">All materials, documents, and information submitted to WISEVERSE are true, accurate, and complete in all material respects. The Client undertakes to notify WISEVERSE promptly upon becoming aware of any inaccuracy or change in submitted information.</Sub>
            <Sub n="3.5">The Client's execution and performance of this Agreement will not violate any applicable law, regulation, binding court order, or validly executed agreement with a third party.</Sub>
            <Sub n="3.6">The Client is not a resident of, or acting on behalf of a person or entity in, any jurisdiction in which the receipt of WISEVERSE's services would be unlawful or require additional regulatory authorisation not obtained by the Client.</Sub>
          </Clause>

          {/* Clause 4 */}
          <Clause n="4" title="SCOPE OF AUXILIARY AUTHENTICATION SERVICES">
            <Sub n="4.1">Subject to payment of the Service Fee and the Client's compliance with these Terms, WISEVERSE will provide the following Auxiliary Authentication Services in respect of each Digital Video Work:</Sub>
            <BulletList items={[
              'Digital content correspondence verification: establishing and recording the unique one-to-one correspondence between the Digital Video Work and its authentication identifiers.',
              'On-chain information registration: recording, validating, and preserving on-chain registration information on compliant third-party blockchain infrastructure (Super AIChain).',
              'Chip authentication certificate production: customising, producing, and issuing the Physical Authentication Certificate with embedded anti-counterfeiting chip.',
              'Scanning verification system: providing an operational chip-scanning verification mechanism enabling real-time verification of the correspondence among the Digital Video Work, its On-chain Registration Identifier, and its Physical Authentication Certificate.',
            ]} />
            <Sub n="4.2">All Auxiliary Authentication Services constitute commercial technical services only. They do not constitute the provision of financial services, legal services, copyright registration services, or any regulated activity under Singapore law or the law of any other jurisdiction.</Sub>
            <Sub n="4.3">WISEVERSE reserves the right to decline any order at its reasonable discretion, including where submitted materials are incomplete, where title to submitted works is unclear, or where acceptance of the order would cause WISEVERSE to breach any applicable law. In such cases, any payment received will be refunded in full.</Sub>
          </Clause>

          {/* Clause 5 */}
          <Clause n="5" title="NATURE AND LIMITATIONS OF AUTHENTICATION RESULTS">
            <Sub n="5.1">The Client expressly acknowledges and agrees that all Auxiliary Authentication Services, authentication results, On-chain Registration Identifiers, Physical Authentication Certificates, and Authentication Reports issued under this Agreement:</Sub>
            <BulletList items={[
              'are commercial auxiliary technical documents only;',
              'do NOT constitute legal proof of copyright ownership or title;',
              'do NOT constitute official copyright registration with any government authority;',
              'do NOT constitute a government filing, notarisation, or legalisation;',
              'do NOT constitute a financial instrument, securities product, investment product, collective investment scheme interest, or virtual asset of any kind;',
              'do NOT constitute a digital payment token as defined under the Payment Services Act 2019 (Singapore); and',
              'carry NO secondary-market trading value, investment value, income right, dividend right, or financial circulation value of any kind.',
            ]} />
            <Sub n="5.2">The On-chain Registration Identifier assigned to each Digital Video Work is a technical verification and record-keeping identifier only. It is not a non-fungible token (NFT), a token of any kind, or an asset capable of being traded, transferred for value, or used as a means of payment.</Sub>
            <Sub n="5.3">Possession of a Physical Authentication Certificate does not transfer, confirm, augment, or affect the legal title or intellectual property rights in the underlying Digital Video Work.</Sub>
            <Sub n="5.4">Authentication results are issued for the purposes of commercial display, anti-counterfeiting verification, content traceability, licensing documentation, and correspondence verification only.</Sub>
          </Clause>

          {/* Clause 6 */}
          <Clause n="6" title="SERVICE FEE, PAYMENT, AND INVOICING">
            <Sub n="6.1">The Service Fee is USD 500.00 per Digital Video Work. All fees are exclusive of any applicable taxes, duties, or levies, which shall be borne solely by the Client.</Sub>
            <Sub n="6.2">The Service Fee is payable in full at the time of order submission. Authentication processing will not commence until payment has been confirmed by WISEVERSE's payment processor.</Sub>
            <Sub n="6.3">Accepted payment methods include card payments via Stripe. WISEVERSE reserves the right to add, remove, or modify accepted payment methods at any time without prior notice.</Sub>
            <Sub n="6.4">Upon confirmation of payment, WISEVERSE will issue a compliant international technical service invoice to the Client's registered email address. The invoice is a commercial services document only and does not constitute a financial instrument, securities transaction voucher, tax receipt, or virtual asset issuance certificate.</Sub>
            <Sub n="6.5">All fees paid are non-refundable once authentication processing has commenced, except where:</Sub>
            <BulletList items={[
              'WISEVERSE declines the order under Clause 4.3; or',
              'WISEVERSE is unable to complete the service due to reasons solely within its control and not caused by the Client\'s act or omission.',
            ]} />
            <Sub n="6.6">Where a refund is due under Clause 6.5, WISEVERSE will process the refund to the original payment method within fourteen (14) business days.</Sub>
            <Sub n="6.7">WISEVERSE is not responsible for fees, charges, or exchange losses imposed by the Client's bank, payment processor, or issuing institution in connection with any payment or refund.</Sub>
          </Clause>

          {/* Clause 7 */}
          <Clause n="7" title="DELIVERABLES AND DELIVERY">
            <Sub n="7.1">The Authentication Package for each Digital Video Work comprises:</Sub>
            <BulletList items={[
              'one (1) Physical Authentication Certificate with embedded anti-counterfeiting chip;',
              'one (1) unique On-chain Registration Identifier; and',
              'complete correspondence verification materials.',
            ]} />
            <Sub n="7.2">Physical Authentication Certificates are dispatched via international courier to the delivery address provided by the Client at the time of order. The Client is responsible for providing a complete and accurate delivery address. WISEVERSE is not liable for delays, losses, interception, or damage caused by third-party courier services.</Sub>
            <Sub n="7.3">Estimated delivery dates stated at the time of order are indicative only. They are subject to: (a) receipt of complete and compliant submission materials from the Client; (b) confirmed payment; and (c) any force majeure event under Clause 11.</Sub>
            <Sub n="7.4">The chip-scan verification capability is provided on an ongoing basis with no expiry date. WISEVERSE will use commercially reasonable efforts to maintain system availability but does not warrant or guarantee uninterrupted availability of third-party blockchain infrastructure.</Sub>
            <Sub n="7.5">Each Physical Authentication Certificate and On-chain Registration Identifier is unique and issued on a one-per-work basis. Requests for replacement of lost or damaged Physical Authentication Certificates are subject to WISEVERSE's prevailing reissuance policy and fees at the time of the request.</Sub>
          </Clause>

          {/* Clause 8 */}
          <Clause n="8" title="INTELLECTUAL PROPERTY">
            <Sub n="8.1">All original copyright, moral rights, and legal ownership of the Digital Video Works remain vested in the original rights holder at all times. This Agreement does not effect, and shall not be construed to effect, any transfer, assignment, or licensing of intellectual property rights in the Digital Video Works to WISEVERSE.</Sub>
            <Sub n="8.2">The Client warrants that it holds or has been granted all intellectual property rights necessary to authorise WISEVERSE to process, fingerprint, and record identifying data from submitted Digital Video Works for the purpose of providing the Auxiliary Authentication Services.</Sub>
            <Sub n="8.3">WISEVERSE does not acquire any intellectual property rights, commercial rights, or proprietary interest in any Digital Video Work by reason of providing Auxiliary Authentication Services.</Sub>
            <Sub n="8.4">The Client acknowledges that the authentication methodology, systems, reports, certificate design, and On-chain Registration Identifier framework used by WISEVERSE are proprietary to WISEVERSE. The Client does not acquire any right, title, or licence in or to any such proprietary materials other than the right to use the Authentication Package in accordance with these Terms.</Sub>
            <Sub n="8.5">Authentication results are technical auxiliary tools only. They do not create, alter, or extinguish any statutory intellectual property right.</Sub>
          </Clause>

          {/* Clause 9 */}
          <Clause n="9" title="COMPLIANCE OBLIGATIONS">
            <Sub n="9.1">The Client agrees that it will not, directly or indirectly, use any authentication result, certificate, On-chain Registration Identifier, or Authentication Report issued under this Agreement for:</Sub>
            <BulletList items={[
              'financial packaging, securitisation, or asset-backed financing of any kind;',
              'NFT issuance, digital token sales, or any form of token financing;',
              'public fundraising, crowdfunding, or unlicensed capital-raising activities;',
              'virtual asset trading, secondary-market promotion, or exchange listing;',
              'characterising the certificate or identifier as an investment product, appreciating asset, income-generating product, or digital currency; or',
              'any other activity that would cause the certificate or identifier to constitute a regulated financial product under the laws of Singapore or any other jurisdiction.',
            ]} />
            <Sub n="9.2">The Client agrees not to direct any financial promotion, investment marketing, or virtual asset marketing activities at the mainland China market using any authentication result issued under this Agreement.</Sub>
            <Sub n="9.3">The Client accepts sole and full responsibility for ensuring that its use of authentication results complies with all applicable laws, regulations, and regulatory guidance in all jurisdictions in which the Client operates or distributes content.</Sub>
            <Sub n="9.4">In the event of a breach of this Clause 9, WISEVERSE reserves the right to immediately suspend all services, revoke any outstanding certificates, and pursue all available remedies.</Sub>
          </Clause>

          {/* Clause 10 */}
          <Clause n="10" title="CONFIDENTIALITY">
            <Sub n="10.1">Each party agrees to maintain strict confidentiality in respect of all non-public information received from the other party in connection with this Agreement, including without limitation: the terms of this Agreement, submitted work materials, authentication data, on-chain archival information, commercial terms, technical methodology, and client identification information.</Sub>
            <Sub n="10.2">Neither party shall disclose, publish, or make available any confidential information to any third party without the prior written consent of the disclosing party, except:</Sub>
            <BulletList items={[
              'to professional advisers bound by equivalent confidentiality obligations;',
              'as required by applicable law, court order, or regulatory direction; or',
              'with respect to WISEVERSE: as necessary to provide the Auxiliary Authentication Services, including disclosure to blockchain infrastructure providers and courier services.',
            ]} />
            <Sub n="10.3">Confidentiality obligations under this Clause 10 shall survive termination or completion of this Agreement for a period of five (5) years.</Sub>
            <Sub n="10.4">Each party shall implement reasonable technical and organisational measures to protect confidential information from unauthorised access, use, or disclosure.</Sub>
          </Clause>

          {/* Clause 11 */}
          <Clause n="11" title="FORCE MAJEURE">
            <Sub n="11.1">Neither party shall be liable to the other for any delay or failure in performance of its obligations under this Agreement to the extent caused by a Force Majeure Event.</Sub>
            <Sub n="11.2">"Force Majeure Event" means any event or circumstance beyond the reasonable control of the affected party that is unforeseeable and unavoidable, including without limitation: acts of war, armed conflict, terrorism, natural disasters, pandemics, governmental orders, sanctions, regulatory prohibitions, cyberattacks, internet outages, or failure of underlying third-party blockchain infrastructure.</Sub>
            <Sub n="11.3">The affected party shall notify the other party in writing as soon as reasonably practicable upon becoming aware of a Force Majeure Event, describing the nature of the event and its expected duration.</Sub>
            <Sub n="11.4">Where a Force Majeure Event persists for more than thirty (30) days, either party may terminate the affected order by written notice, and WISEVERSE will refund any Service Fees paid in respect of undelivered Authentication Packages.</Sub>
          </Clause>

          {/* Clause 12 */}
          <Clause n="12" title="LIMITATION OF LIABILITY">
            <Sub n="12.1">WISEVERSE's liability under this Agreement is limited strictly to the performance of the Auxiliary Authentication Services described in Clause 4. WISEVERSE expressly excludes all liability for:</Sub>
            <BulletList items={[
              'the legal validity, enforceability, or sufficiency of the Client\'s title to submitted works;',
              'the outcome of any copyright dispute, arbitral proceeding, or judicial determination;',
              'the regulatory treatment of authentication results in any jurisdiction;',
              'third parties\' reliance on, or actions taken in connection with, any authentication certificate or identifier; and',
              'any failure, delay, or error attributable to third-party blockchain infrastructure, courier services, or payment processors.',
            ]} />
            <Sub n="12.2">Subject to Clause 12.3, WISEVERSE's aggregate liability to the Client under or in connection with this Agreement (whether in contract, tort, statute, or otherwise) shall not exceed the total Service Fees actually paid by the Client to WISEVERSE in respect of the relevant order.</Sub>
            <Sub n="12.3">Nothing in these Terms excludes or limits WISEVERSE's liability for: (a) death or personal injury caused by WISEVERSE's gross negligence; (b) fraud or fraudulent misrepresentation; or (c) any other liability that cannot be excluded or limited under applicable Singapore law.</Sub>
            <Sub n="12.4">WISEVERSE shall not be liable to the Client for any indirect, consequential, incidental, special, or punitive loss, including without limitation: loss of anticipated profits, loss of revenue, loss of business opportunity, loss of goodwill, or reputational harm, even if WISEVERSE has been advised of the possibility of such losses.</Sub>
            <Sub n="12.5">The Client acknowledges that the Service Fee reflects and is calculated on the basis of the limitations of liability set out in this Clause 12, and that WISEVERSE would not provide the services at the stated fee without these limitations.</Sub>
          </Clause>

          {/* Clause 13 */}
          <Clause n="13" title="TERMINATION AND SUSPENSION">
            <Sub n="13.1">This Agreement comes into force upon Electronic Acceptance and payment confirmation and continues until all deliverables under the relevant order have been dispatched, unless earlier terminated under this Clause 13.</Sub>
            <Sub n="13.2">WISEVERSE may immediately suspend or terminate this Agreement and any in-progress order, without liability to the Client, if:</Sub>
            <BulletList items={[
              'the Client is in material breach of any provision of these Terms, including Clause 3 (Representations), Clause 9 (Compliance), or Clause 10 (Confidentiality);',
              'WISEVERSE is required to do so by applicable law, court order, or regulatory direction;',
              'the Client provides false, misleading, or fraudulent information or materials; or',
              'continuing to provide services would expose WISEVERSE to legal, regulatory, or reputational risk.',
            ]} />
            <Sub n="13.3">On termination for cause under Clause 13.2, WISEVERSE is not obliged to refund any Service Fees paid and may retain and destroy any submitted materials at its reasonable discretion.</Sub>
            <Sub n="13.4">Clauses 5, 7.5, 8, 9, 10, 12, 14, 15, and 16 shall survive termination of this Agreement.</Sub>
          </Clause>

          {/* Clause 14 */}
          <Clause n="14" title="NOTICES">
            <Sub n="14.1">All notices, communications, and demands under this Agreement shall be in writing and delivered by email to the addresses specified in the order confirmation. Notices take effect on confirmed delivery to the recipient's email server.</Sub>
            <Sub n="14.2">The Client is responsible for maintaining a valid and accessible email address. WISEVERSE is not liable for any loss caused by the Client's failure to receive notices due to an inaccurate or inaccessible email address.</Sub>
          </Clause>

          {/* Clause 15 */}
          <Clause n="15" title="GENERAL PROVISIONS">
            <Sub n="15.1"><strong>Entire Agreement.</strong> These Terms, together with the order confirmation email issued to the Client, constitute the entire agreement between the parties with respect to the Auxiliary Authentication Services and supersede all prior representations, communications, and arrangements, whether oral or written.</Sub>
            <Sub n="15.2"><strong>Severability.</strong> If any provision of these Terms is found by a competent authority to be invalid, void, or unenforceable, that provision shall be severed from the remainder of the Terms, which shall continue in full force and effect.</Sub>
            <Sub n="15.3"><strong>No Waiver.</strong> A failure or delay by either party to exercise any right or remedy under these Terms shall not constitute a waiver of that or any other right or remedy.</Sub>
            <Sub n="15.4"><strong>No Assignment.</strong> The Client may not assign, transfer, novate, or sub-contract any of its rights or obligations under this Agreement without WISEVERSE's prior written consent. WISEVERSE may assign this Agreement to any affiliate or successor entity without the Client's consent.</Sub>
            <Sub n="15.5"><strong>Amendments.</strong> WISEVERSE reserves the right to amend these Terms from time to time. The version in effect at the time of order confirmation applies to that order. Material amendments will be notified to existing clients by email with at least fourteen (14) days' advance notice. Continued use of WISEVERSE's services after the effective date of an amendment constitutes acceptance of the amended Terms.</Sub>
            <Sub n="15.6"><strong>Language.</strong> These Terms are issued in English. A Chinese translation may be provided for reference only. In the event of any conflict or inconsistency, the English version prevails.</Sub>
            <Sub n="15.7"><strong>Electronic Contracting.</strong> The parties confirm that this Agreement is validly formed and enforceable as an electronic contract under the Electronic Transactions Act 2010 (Singapore). Neither party shall challenge the validity or enforceability of this Agreement solely on the basis that it was formed electronically.</Sub>
          </Clause>

          {/* Clause 16 */}
          <Clause n="16" title="GOVERNING LAW AND DISPUTE RESOLUTION">
            <Sub n="16.1">These Terms and all matters arising out of or in connection with this Agreement (including non-contractual obligations) are governed by and construed in accordance with the laws of Singapore.</Sub>
            <Sub n="16.2">The parties shall use best efforts to resolve any dispute, controversy, or claim arising out of or in connection with this Agreement, including any question regarding its existence, validity, or termination, by good-faith negotiations within twenty-one (21) days of one party notifying the other in writing.</Sub>
            <Sub n="16.3">If a dispute is not resolved through negotiation under Clause 16.2, it shall be referred to and finally resolved by arbitration administered by the Singapore International Arbitration Centre (SIAC) in accordance with the SIAC Administered Arbitration Rules in force at the date of commencement of arbitration. The following shall apply:</Sub>
            <BulletList items={[
              'Seat of arbitration: Singapore',
              'Language of proceedings: English',
              'Number of arbitrators: one (1), unless the amount in dispute exceeds USD 500,000, in which case three (3)',
              'Any arbitral award shall be final, binding, and enforceable in any court of competent jurisdiction',
            ]} />
            <Sub n="16.4">Nothing in this Clause 16 prevents either party from seeking urgent injunctive, interim, or conservatory relief from any court of competent jurisdiction.</Sub>
          </Clause>

          {/* Regulatory Notice */}
          <div className="terms-section terms-regulatory-notice">
            <h2 className="terms-clause-heading">REGULATORY NOTICE</h2>
            <p className="terms-regulatory-label">IMPORTANT — PLEASE READ</p>
            <p>WISEVERSE PTE. LTD. is a commercial technical services entity registered in Singapore. It is not a holder of, and does not carry on any activity requiring, a licence under the Payment Services Act 2019 (Singapore), the Securities and Futures Act 2001 (Singapore), or the Financial Services and Markets Act 2022 (Singapore).</p>
            <p>None of the services, reports, certificates, or identifiers described in these Terms constitute:</p>
            <BulletList items={[
              'a digital payment token (DPT) or DPT service within the meaning of the Payment Services Act 2019;',
              'a capital markets product, securities, futures contract, or collective investment scheme interest within the meaning of the Securities and Futures Act 2001;',
              'a digital token service within the meaning of the Financial Services and Markets Act 2022; or',
              'any other regulated financial instrument, investment product, or virtual asset under the law of Singapore or any other jurisdiction.',
            ]} />
            <p>Clients are solely responsible for obtaining independent legal and regulatory advice regarding the treatment of WISEVERSE's services in their own jurisdiction.</p>
          </div>

          {/* Client Acceptance */}
          <div className="terms-section terms-acceptance">
            <h2 className="terms-clause-heading">CLIENT ACCEPTANCE</h2>
            <p>By completing payment on the WISEVERSE order page (and ticking the acceptance checkbox where provided), the Client confirms that:</p>
            <BulletList items={[
              'the Client has read and understood these Terms in their entirety;',
              'the Client agrees to be legally bound by these Terms with effect from the date and time of Electronic Acceptance;',
              'the Client has the authority to bind the entity on whose behalf the order is placed; and',
              'these Terms, together with the order confirmation email, constitute the complete and binding service agreement between the Client and WISEVERSE — no physical contract, wet-ink signature, or further formality is required.',
            ]} />
          </div>

          {/* Footer */}
          <p className="terms-doc-footer">— END OF TERMS AND CONDITIONS — VERSION 1.0 — 1 JUNE 2026 —</p>

        </div>
      </div>
    </div>
  )
}
