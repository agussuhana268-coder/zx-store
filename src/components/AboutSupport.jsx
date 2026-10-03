import { MessageCircle, Headset, CheckCircle } from 'lucide-react';

export default function AboutSupport() {
  return (
    <section id="support" className="about-support-section reveal">
      <div className="section-head">
        <span className="section-pretitle">PUSAT BANTUAN RESMI</span>
        <h2 className="section-main-title">Layanan Dukungan Pelanggan</h2>
        <p className="section-subtext">
          Tim Customer Service ZetXiters siap mendampingi Anda dari proses pemilihan produk hingga aktivasi selesai.
        </p>
      </div>

      <div className="about-support-grid">
        <div className="info-box-card">
          <h3 className="info-box-title">Komitmen Layanan ZetXiters</h3>
          <p className="info-box-paragraph">
            Kami mengutamakan kepuasan pengguna dengan menyediakan informasi transparan, respon cepat,
            serta panduan teknis yang jelas untuk setiap produk yang Anda dapatkan di ZetXiters Official Store.
          </p>
          <div className="info-trust-list">
            <span className="trust-pill"><CheckCircle size={13} /> Dikelola langsung oleh tim MDZZXITERS</span>
            <span className="trust-pill"><CheckCircle size={13} /> Panduan instalasi step-by-step disertakan</span>
            <span className="trust-pill"><CheckCircle size={13} /> Konsultasi gratis sebelum memesan</span>
          </div>
        </div>

        <div className="info-box-card" style={{ transitionDelay: '60ms' }}>
          <h3 className="info-box-title">Hubungi Tim ZetXiters</h3>
          <p className="info-box-paragraph">
            Pilih saluran resmi di bawah ini untuk bergabung dengan komunitas kami atau berbicara langsung dengan admin:
          </p>
          <div className="contact-actions-row">
            <a
              href="https://whatsapp.com/channel/0029VbCdBftLCoWwxfxAOz25"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact-outline"
            >
              <MessageCircle size={15} />
              <span>Saluran Resmi WhatsApp</span>
            </a>
            <a
              href="https://wa.me/6287833947151?text=Halo%20Admin%20ZetXiters,%20saya%20ingin%20konsultasi%20layanan"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact-solid"
            >
              <Headset size={15} />
              <span>Chat CS (087833947151)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
