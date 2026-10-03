import { MessageCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-brand-group">
        <div className="brand-logo-wrapper">
          <img
            src={`${import.meta.env.BASE_URL}assets/zx_tr.png`}
            alt="ZX"
            className="brand-logo-img"
          />
        </div>
        <div className="brand-meta">
          <span className="brand-name">ZETXITERS</span>
          <span className="brand-tagline">DIGITAL STORE</span>
        </div>
      </div>

      <div className="header-status-indicator">
        <span className="status-ping">
          <span className="status-ping-dot"></span>
        </span>
        <span className="status-text">NEXUS ENGINE v2.0 ONLINE</span>
      </div>

      <div className="header-actions">
        <a
          href="https://wa.me/6287833947151?text=Halo%20Admin%20Zet%20Xiters,%20saya%20ingin%20tanya%20seputar%20Nexus%20Injector%20v2.0"
          target="_blank"
          rel="noopener noreferrer"
          className="header-contact-btn"
          aria-label="Hubungi Admin WhatsApp"
        >
          <MessageCircle size={15} />
          <span>Chat Admin</span>
        </a>
      </div>
    </header>
  );
}
