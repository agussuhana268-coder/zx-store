import { ArrowRight, ShieldCheck, Cpu, Smartphone, Zap } from 'lucide-react';

export default function Hero({ onSelectNexus }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navElement = document.querySelector('.secondary-nav-wrapper');
      const navHeight = navElement ? navElement.offsetHeight : 60;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight - 16;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="hero-section reveal">
      {/* Clean Release Badge */}
      <div className="hero-version-pill">
        <span className="pill-status-dot"></span>
        <span className="pill-title">Nexus Injector v2.0</span>
        <span className="pill-divider">|</span>
        <span className="pill-tag">Support ANDROID 11 - 16+ (NEW VERSION)</span>
      </div>

      <h1 className="hero-headline">
        Optimasi Performa Gaming Android <br className="hero-break" />
        <span className="hero-headline-highlight">Tingkat Sistem Terstruktur</span>
      </h1>

      <p className="hero-lead">
        Didukung <strong>Nexus Engine</strong> yang memproses dan menerapkan konfigurasi secara
        terkontrol ke lingkungan game tanpa mengubah sistem secara permanen. Dirancang untuk stabilitas,
        respon sentuhan instan, dan akurasi tinggi.
      </p>

      <div className="hero-action-buttons">
        <button
          type="button"
          className="btn-hero-primary"
          onClick={onSelectNexus}
        >
          <span>Beli Lisensi Rp60.000</span>
          <ArrowRight size={16} />
        </button>

        <button
          type="button"
          className="btn-hero-secondary"
          onClick={() => scrollToSection('nexus-info')}
        >
          <span>Pelajari Sistem & Arsitektur</span>
        </button>
      </div>

      {/* Professional Specification Grid */}
      <div className="hero-specs-grid">
        <div className="hero-spec-item">
          <div className="spec-icon-box">
            <Smartphone size={18} />
          </div>
          <div className="spec-text">
            <span className="spec-label">Kompatibilitas</span>
            <strong className="spec-val">ANDROID 11 - 16+ (NEW VERSION)</strong>
          </div>
        </div>

        <div className="hero-spec-item">
          <div className="spec-icon-box">
            <ShieldCheck size={18} />
          </div>
          <div className="spec-text">
            <span className="spec-label">Keamanan Sistem</span>
            <strong className="spec-val">Non-Permanent / Non-Root</strong>
          </div>
        </div>

        <div className="hero-spec-item">
          <div className="spec-icon-box">
            <Cpu size={18} />
          </div>
          <div className="spec-text">
            <span className="spec-label">Modul Optimasi</span>
            <strong className="spec-val">16 Fitur Terintegrasi</strong>
          </div>
        </div>

        <div className="hero-spec-item">
          <div className="spec-icon-box">
            <Zap size={18} />
          </div>
          <div className="spec-text">
            <span className="spec-label">Harga & Lisensi</span>
            <strong className="spec-val">Rp60.000 (Permanen/Lifetime)</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
