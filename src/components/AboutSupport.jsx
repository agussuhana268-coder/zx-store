import { MessageCircle, Headset, Sparkles } from 'lucide-react';

export default function AboutSupport() {
  return (
    <section className="info-grid reveal">
      <div className="info-card">
        <div className="info-card-header">
          <div className="info-icon-badge">
            <Sparkles size={18} />
          </div>
          <h3>Tentang ZetX Company</h3>
        </div>
        <p>
          <strong>ZetX Company</strong> adalah penyedia solusi digital dan tools optimasi dari{' '}
          <strong>MDZZXITERS</strong> yang berfokus pada pengembangan sistem gaming Android modern,
          responsif, dan aman dengan pengalaman antarmuka premium.
        </p>
        <div className="info-pill-row">
          <span className="info-tag">✓ Official Provider</span>
          <span className="info-tag">✓ Verified System</span>
          <span className="info-tag">✓ Lifetime Support</span>
        </div>
      </div>

      <div className="info-card" style={{ transitionDelay: '80ms' }}>
        <div className="info-card-header">
          <div className="info-icon-badge green">
            <Headset size={18} />
          </div>
          <h3>Layanan Support & Konsultasi</h3>
        </div>
        <p>
          Punya pertanyaan seputar kompatibilitas perangkat kamu atau butuh bantuan saat proses instalasi?
          Tim technical support kami siap melayani setiap hari.
        </p>
        <div className="support-links">
          <a
            href="https://whatsapp.com/channel/0029VbCdBftLCoWwxfxAOz25"
            target="_blank"
            rel="noopener noreferrer"
            className="support-btn channel-btn"
          >
            <MessageCircle size={16} />
            <span>Join WhatsApp Channel</span>
          </a>
          <a
            href="https://wa.me/6287833947151?text=Halo%20Admin,%20saya%20ingin%20tanya%20seputar%20Nexus%20Injector%20v2.0"
            target="_blank"
            rel="noopener noreferrer"
            className="support-btn direct-btn"
          >
            <Headset size={16} />
            <span>Chat CS (087833947151)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
