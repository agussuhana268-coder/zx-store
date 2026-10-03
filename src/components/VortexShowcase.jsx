import { ArrowRight, Crown } from 'lucide-react';
import bannerImg from '../assets/banner.png';

export default function VortexShowcase() {
  const handleScrollToVortex = () => {
    const vortexEl = document.getElementById('zx-vortex');
    if (vortexEl) {
      const navElement = document.querySelector('.secondary-nav-wrapper');
      const navHeight = navElement ? navElement.offsetHeight : 54;
      const elementPosition = vortexEl.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight - 16;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="vortex-section reveal">
      <div className="vortex-box">
        <div className="vortex-info-col">
          <div className="vortex-pill-tag">
            <Crown size={13} />
            <span>VIP EDITION TIER</span>
          </div>

          <h2 className="vortex-heading">ZX VORTEX Edition</h2>

          <p className="vortex-paragraph">
            Paket tuning hardware & software kelas turnamen dengan Panel Injector Vortex terintegrasi,
            thermal stability mode, dan aimlock assist untuk performa gaming tingkat tinggi.
          </p>

          <button
            type="button"
            className="btn-vortex-action"
            onClick={handleScrollToVortex}
          >
            <span>Lihat Paket ZX VORTEX</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="vortex-visual-col" onClick={handleScrollToVortex}>
          <img
            src={bannerImg || `${import.meta.env.BASE_URL}assets/banner.png`}
            alt="ZX VORTEX Showcase"
            className="vortex-img-render"
          />
        </div>
      </div>
    </section>
  );
}
