export default function LegalNotice() {
  return (
    <main style={{ background: '#0d1117', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', color: 'white', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#C1440E', fontSize: 11, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 16 }}>Legal</p>
        <h1 style={{ fontSize: 42, fontFamily: 'Playfair Display', marginBottom: 8 }}>Legal Notice</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 48 }}>Mentions légales — obligatoires en France</p>

        {[
          {
            title: 'Publisher',
            content: `Name: Tarek Saouchi\nStatus: Auto-entrepreneur\nSIRET: 98874970100013\nCountry: France\nEmail: legal@originetrace.com`
          },
          {
            title: 'Website',
            content: `Website: originetrace.com\nHosting: Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, USA`
          },
          {
            title: 'Intellectual property',
            content: `All content on this website is protected by French and international intellectual property law. Any reproduction without authorization is prohibited.`
          },
          {
            title: 'Dispute resolution',
            content: `In case of dispute, you may use the EU online dispute resolution platform at: ec.europa.eu/consumers/odr`
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
