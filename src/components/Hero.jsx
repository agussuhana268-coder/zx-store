import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Cpu } from 'lucide-react';

export default function Hero({ onSelectNexus }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navElement = document.querySelector('.secondary-nav-wrapper');
      const navHeight = navElement ? navElement.offsetHeight : 64;
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
      <div className="hero-glow-effect"></div>

      <div className="hero-badge">
        <Sparkles size={13} className="hero-badge-icon" />
        <span>OFFICIAL RELEASE • NEXUS INJECTOR v2.0</span>
      </div>

      <h1 className="hero-title">
        Performa Gaming Android <br className="hero-break" />
        <span className="hero-gradient-text">Lebih Presisi & Stabil</span>
      </h1>

      <p className="hero-description">
        Diperkuat <strong>Nexus Engine</strong> yang memproses dan menginjeksi konfigurasi secara
        terstruktur ke environment perangkat & game tanpa modifikasi sistem permanen.
      </p>

      {/* Hero Interactive Quick Stats */}
      <div className="hero-stats-row">
        <div className="hero-stat-card">
          <div className="stat-icon-wrap">
            <Zap size={16} />
          </div>
          <div className="stat-content">
            <span className="stat-value">Anti Delay</span>
            <span className="stat-label">Ultra Low Latency</span>
          </div>
        </div>

        <div className="hero-stat-card">
          <div className="stat-icon-wrap">
            <Cpu size={16} />
          </div>
          <div className="stat-content">
            <span className="stat-value">N-CORE AI</span>
            <span className="stat-label">Kernel Matrix</span>
          </div>
        </div>

        <div className="hero-stat-card">
          <div className="stat-icon-wrap">
            <Layers size={16} />
          </div>
          <div className="stat-content">
            <span className="stat-value">16 Modul</span>
            <span className="stat-label">Resolusi & Aim Pro</span>
          </div>
        </div>

        <div className="hero-stat-card highlight">
          <div className="stat-icon-wrap">
            <ShieldCheck size={16} />
          </div>
          <div className="stat-content">
            <span className="stat-value">Rp60.000</span>
            <span className="stat-label">Permanen / Lifetime</span>
          </div>
        </div>
      </div>

      {/* Hero Action Buttons */}
      <div className="hero-cta-group">
        <button
          type="button"
          className="hero-btn-primary"
          onClick={onSelectNexus}
        >
          <span>Order Nexus Injector v2.0</span>
          <ArrowRight size={17} />
        </button>

        <button
          type="button"
          className="hero-btn-secondary"
          onClick={() => scrollToSection('nexus-info')}
        >
          <span>Pelajari Cara Kerja</span>
        </button>
      </div>

      {/* Cyber HUD Terminal Card */}
      <div className="hero-hud-terminal">
        <div className="hud-header">
          <div className="hud-dots">
            <span className="hud-dot red"></span>
            <span className="hud-dot yellow"></span>
            <span className="hud-dot green"></span>
          </div>
          <span className="hud-title">nexus-engine-v2.0 // system_monitor</span>
          <span className="hud-status">STATUS: ONLINE</span>
        </div>
        <div className="hud-body">
          <div className="hud-metric">
            <span className="hud-key">CORE INJECTION:</span>
            <span className="hud-val cyan">CONTROLLED [ACTIVE]</span>
          </div>
          <div className="hud-metric">
            <span className="hud-key">PERMANENT MOD:</span>
            <span className="hud-val green">DISABLED (0% RISK)</span>
          </div>
          <div className="hud-metric">
            <span className="hud-key">SAMPLING RATE:</span>
            <span className="hud-val purple">MAX SENSITIVITY</span>
          </div>
          <div className="hud-metric">
            <span className="hud-key">DEVICE OS:</span>
            <span className="hud-val yellow">ANDROID 9 - 14+ OK</span>
          </div>
        </div>
      </div>
    </section>
  );
}
