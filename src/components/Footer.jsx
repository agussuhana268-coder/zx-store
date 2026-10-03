export default function Footer() {
  return (
    <footer className="site-footer reveal">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-side">
            <div className="footer-logo-row">
              <img
                src={`${import.meta.env.BASE_URL}assets/zx_tr.png`}
                alt="ZetXiters"
                className="footer-logo-image"
              />
              <span className="footer-brand-heading">ZETXITERS MARKET</span>
            </div>
            <p className="footer-brand-subtitle">
              Sistem optimasi dan konfigurasi terstruktur untuk gaming kompetitif Android.
            </p>
          </div>

          <div className="footer-badge-side">
            <span className="footer-compat-badge">
              ANDROID 11 - 16+ (NEW VERSION)
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 <strong>MDZZXITERS</strong>. All rights reserved.
          </p>
          <div className="footer-nav-tags">
            <span>Nexus Injector v2.0</span>
            <span className="tag-dot">•</span>
            <span>Non-Root Architecture</span>
            <span className="tag-dot">•</span>
            <span>Zero Permanent System Change</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
