export default function TermsOfService() {
  return (
    <main style={{ background: '#0d1117', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', color: 'white', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#C1440E', fontSize: 11, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16 }}>Legal</p>
        <h1 style={{ fontSize: 42, fontFamily: 'Playfair Display', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 48 }}>Last updated: March 2026</p>

        {[
          {
            title: '1. Service description',
            content: `OrigineTrace is an entertainment service that provides estimated geographic origin profiles based on name analysis, family history, and AI algorithms. OrigineTrace is NOT a DNA test and does NOT provide scientifically validated genetic results. All results are estimates provided for entertainment and cultural exploration purposes only.`
          },
          {
            title: '2. Operator information',
            content: `OrigineTrace is operated by Tarek Saouchi, auto-entrepreneur registered in France. SIRET: 98874970100013. Contact: legal@originetrace.com`
          },
          {
            title: '3. Payment terms',
            content: `Access to full origin results requires a one-time payment of $4.90 USD. This payment is processed securely by Stripe. All sales are final once results have been revealed. No refunds will be issued after the results page has been unlocked. If you experience a technical issue preventing access to your results, contact us at legal@originetrace.com within 7 days of purchase.`
          },
          {
            title: '4. Disclaimer',
            content: `OrigineTrace results are algorithmic estimates based on name etymology, surname databases, and family origin data. Results are provided for entertainment purposes only and should not be used for medical, genealogical, legal, or scientific purposes. OrigineTrace makes no guarantee of accuracy and accepts no liability for decisions made based on our results.`
          },
          {
            title: '5. Intellectual property',
            content: `All content on originetrace.com including design, text, graphics, and algorithms is the exclusive property of Tarek Saouchi. Reproduction, distribution, or commercial use of any content without written permission is strictly prohibited.`
          },
          {
            title: '6. Limitation of liability',
            content: `To the maximum extent permitted by applicable law, OrigineTrace shall not be liable for any indirect, incidental, or consequential damages arising from use of the service. Our total liability shall not exceed the amount paid for the service ($4.90).`
          },
          {
            title: '7. Governing law',
            content: `These terms are governed by French law. Any dispute shall be subject to the exclusive jurisdiction of the courts of France. As a consumer in the EU, you may also benefit from the mandatory provisions of the law of your country of residence.`
          },
          {
            title: '8. Contact',
            content: `For any questions regarding these terms, contact us at: legal@originetrace.com`
          }
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, color: '#C1440E', marginBottom: 12, fontWeight: 600 }}>{section.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-line' }}>{section.content}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
