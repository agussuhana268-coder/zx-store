import { MessageCircle, Headset, CheckCircle } from 'lucide-react';

export default function AboutSupport() {
  return (
    <section className="about-support-section reveal">
      <div className="about-support-grid">
        <div className="info-box-card">
          <h3 className="info-box-title">Tentang ZetX Company</h3>
          <p className="info-box-paragraph">
            <strong>ZetX Company</strong> adalah unit pengembang tools optimasi digital dari <strong>MDZZXITERS</strong> yang
            berdedikasi menyediakan solusi sistem gaming Android modern, aman, dan berdaya guna tinggi tanpa modifikasi sistem yang merusak.
          </p>
          <div className="info-trust-list">
            <span className="trust-pill"><CheckCircle size={13} /> Pengembang Resmi MDZZXITERS</span>
            <span className="trust-pill"><CheckCircle size={13} /> Kompatibel ANDROID 11 - 16+ (NEW VERSION)</span>
            <span className="trust-pill"><CheckCircle size={13} /> Panduan Lengkap Termasuk</span>
          </div>
        </div>

        <div className="info-box-card" style={{ transitionDelay: '60ms' }}>
          <h3 className="info-box-title">Pusat Bantuan & Komunitas</h3>
          <p className="info-box-paragraph">
            Perlu konsultasi seputar spesifikasi ponsel kamu sebelum membeli, atau butuh bantuan saat proses pemasangan? Tim kami siap melayani.
          </p>
          <div className="contact-actions-row">
            <a
              href="https://whatsapp.com/channel/0029VbCdBftLCoWwxfxAOz25"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact-outline"
            >
              <MessageCircle size={15} />
              <span>Saluran WhatsApp</span>
            </a>
            <a
              href="https://wa.me/6287833947151?text=Halo%20Admin,%20saya%20ingin%20tanya%20seputar%20Nexus%20Injector%20v2.0"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact-solid"
            >
              <Headset size={15} />
              <span>Customer Service Langsung</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
