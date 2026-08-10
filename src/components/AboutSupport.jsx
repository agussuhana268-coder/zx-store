import { MessageCircle, Headset } from 'lucide-react';

export default function AboutSupport() {
  return (
    <section className="info-grid">
      <div className="info-card">
        <h3>Tentang ZetX Company</h3>
        <p>
          ZetX Company adalah Perusahaan digital product dari MdzzXiters yang berfokus pada produk
          dan tools digital dengan pengalaman yang sederhana, modern, dan premium.
        </p>
      </div>

      <div className="info-card">
        <h3>Butuh bantuan?</h3>
        <p>Tim support kami siap membantu.</p>
        <div className="support-links">
          <a
            href="https://whatsapp.com/channel/0029VbCdBftLCoWwxfxAOz25"
            target="_blank"
            rel="noopener noreferrer"
            className="support-btn"
          >
            <MessageCircle size={15} />
            <span>WhatsApp Channel</span>
          </a>
          <a
            href="https://wa.me/6287833947151"
            target="_blank"
            rel="noopener noreferrer"
            className="support-btn"
          >
            <Headset size={15} />
            <span>Customer Service</span>
          </a>
        </div>
      </div>
    </section>
  );
}
