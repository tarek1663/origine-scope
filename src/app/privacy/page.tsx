export default function PrivacyPolicy() {
  return (
    <main style={{ background: '#0d1117', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', color: 'white', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#C1440E', fontSize: 11, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16 }}>Legal</p>
        <h1 style={{ fontSize: 42, fontFamily: 'Playfair Display', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 48 }}>Last updated: March 2026</p>

        {[
          {
            title: '1. Who we are',
            content: `OrigineTrace is operated by Tarek Saouchi, auto-entrepreneur registered in France under SIRET number 98874970100013. Our website is originetrace.com. Contact: privacy@originetrace.com`
          },
          {
            title: '2. What data we collect',
            content: `We collect the following data when you use our service:
— Your photo (used only for origin estimation, never stored on our servers)
— Your first name and last name (used to generate your origin analysis)
— Your parents' countries of birth (used to refine your origin estimation)
— Your email address if provided (optional, for result delivery)
— Payment information (processed exclusively by Stripe, we never see your card details)`
          },
          {
            title: '3. How we use your data',
            content: `Your data is used solely to generate your personalized origin estimate. Your photo is analyzed in real time and immediately discarded — it is never stored on our servers or shared with third parties. Your name and family origins are used to generate a cultural and historical analysis. Results are stored temporarily for 30 days then permanently deleted.`
          },
          {
            title: '4. Third party services',
            content: `We use the following third party services:
— Stripe (stripe.com) for secure payment processing. Stripe is PCI-DSS compliant and handles all card data.
— Anthropic (anthropic.com) for AI-powered name analysis. Data sent to Anthropic is limited to your last name and family countries only.
— Vercel (vercel.com) for website hosting.`
          },
          {
            title: '5. Your rights (GDPR)',
            content: `As a user in the European Union, you have the right to access, correct, or delete your personal data at any time. You can exercise these rights by contacting us at privacy@originetrace.com. We will respond within 30 days. You also have the right to lodge a complaint with the CNIL (Commission Nationale de l'Informatique et des Libertés) at cnil.fr.`
          },
          {
            title: '6. Cookies',
            content: `OrigineTrace uses only essential cookies necessary for the service to function (session management and payment processing). We do not use advertising or tracking cookies. We do not use Google Analytics or any third party tracking tools.`
          },
          {
            title: '7. Data security',
            content: `All data transmitted between your browser and our servers is encrypted using SSL/TLS. Payments are processed by Stripe in a PCI-DSS compliant environment. We apply industry standard security measures to protect your personal data.`
          },
          {
            title: '8. Contact',
            content: `For any privacy-related questions or requests, contact us at: privacy@originetrace.com`
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
