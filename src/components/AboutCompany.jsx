import { ShieldCheck, Target, Headphones } from 'lucide-react';

export default function AboutCompany() {
  return (
    <section id="about-company" className="about-company-section reveal">
      <div className="section-head">
        <span className="section-pretitle">PROFIL PERUSAHAAN</span>
        <h2 className="section-main-title">Mengenal ZetXiters Company</h2>
        <p className="section-subtext">
          Penyedia terpercaya tools optimasi dan konfigurasi sistem gaming Android & iOS di bawah naungan MDZZXITERS.
        </p>
      </div>

      <div className="company-profile-card">
        <p className="company-statement">
          ZetXiters Company hadir untuk menjawab kebutuhan para mobile gamer yang menginginkan performa maksimal
          tanpa mengorbankan integritas sistem ponsel mereka. Kami mengembangkan konfigurasi cerdas yang
          menyeimbangkan touch sampling rate, stabilitas frame pacing, dan alokasi memori secara terukur.
        </p>

        <div className="company-pillars-grid">
          <div className="pillar-item">
            <div className="pillar-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="pillar-info">
              <h3 className="pillar-title">Keamanan Sistem Terjamin</h3>
              <p className="pillar-desc">
                Metode injeksi terstruktur tanpa root dan tanpa perubahan permanen pada file partisi OS perangkat Anda.
              </p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <Target size={20} />
            </div>
            <div className="pillar-info">
              <h3 className="pillar-title">Presisi & Terkalibrasi</h3>
              <p className="pillar-desc">
                Setiap profil konfigurasi telah melewati pengujian stabilitas guna menghadirkan respon sentuhan yang konsisten.
              </p>
            </div>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon">
              <Headphones size={20} />
            </div>
            <div className="pillar-info">
              <h3 className="pillar-title">Dukungan Purna Jual Resmi</h3>
              <p className="pillar-desc">
                Didampingi panduan lengkap step-by-step dan layanan konsultasi teknis langsung dengan tim ZetXiters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
