export default function Footer() {
  return (
    <footer className="site-footer reveal">
      <div className="footer-top-row">
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src={`${import.meta.env.BASE_URL}assets/zx_tr.png`}
              alt="ZX"
              className="footer-logo-img"
            />
          </div>
          <div className="footer-brand-info">
            <span className="footer-title">ZETXITERS MARKET</span>
            <span className="footer-desc">Premium Android Gaming Optimization & Tools</span>
          </div>
        </div>

        <div className="footer-system-status">
          <div className="status-indicator-pill">
            <span className="status-live-beacon"></span>
            <span className="status-label">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-row">
        <div className="footer-copyright">
          © 2026 <strong>MDZZXITERS</strong>. All rights reserved. Built with precision for competitive gaming.
        </div>
        <div className="footer-tags">
          <span className="footer-tag-item">Nexus Engine v2.0</span>
          <span className="footer-divider">•</span>
          <span className="footer-tag-item">Safe System Injection</span>
          <span className="footer-divider">•</span>
          <span className="footer-tag-item">Non-Root Safe</span>
        </div>
      </div>
    </footer>
  );
}
