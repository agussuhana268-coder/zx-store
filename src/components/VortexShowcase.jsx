import { ArrowRight, Crown } from 'lucide-react';
import bannerImg from '../assets/banner.png';

export default function VortexShowcase() {
  const handleScrollToVortex = () => {
    const vortexEl = document.getElementById('zx-vortex');
    if (vortexEl) {
      const navElement = document.querySelector('.secondary-nav-wrapper');
      const navHeight = navElement ? navElement.offsetHeight : 64;
      const elementPosition = vortexEl.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight - 16;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="vortex-showcase-section reveal">
      <div className="vortex-showcase-card">
        <div className="vortex-showcase-content">
          <div className="vortex-eyebrow">
            <Crown size={14} className="eyebrow-icon" />
            <span>VIP EDITION TIER</span>
          </div>

          <h2 className="vortex-showcase-title">ZX VORTEX</h2>

          <p className="vortex-showcase-description">
            Paket tuning hardware & software kelas turnamen dengan Panel Injector Vortex terintegrasi untuk performa maksimal.
          </p>

          <button
            type="button"
            className="vortex-cta-btn"
            onClick={handleScrollToVortex}
          >
            <span>Lihat Spesifikasi ZX VORTEX</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="vortex-showcase-media" onClick={handleScrollToVortex}>
          <img
            src={bannerImg || `${import.meta.env.BASE_URL}assets/banner.png`}
            alt="ZX VORTEX Showcase"
            className="vortex-banner-img"
          />
          <div className="banner-gradient-overlay"></div>
        </div>
      </div>
    </section>
  );
}
