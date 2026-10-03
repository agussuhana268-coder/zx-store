import { MessageCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-left">
        <a href="#root" className="brand-logo-link">
          <img
            src={`${import.meta.env.BASE_URL}assets/zx_tr.png`}
            alt="ZetXiters Logo"
            className="brand-logo-img"
          />
          <div className="brand-text-group">
            <span className="brand-name">ZETXITERS</span>
            <span className="brand-tagline">OFFICIAL STORE</span>
          </div>
        </a>
        <span className="brand-version-badge">v2.0</span>
      </div>

      <nav className="header-nav-links">
        <a href="#nexus-info" className="header-nav-link">Tentang Nexus</a>
        <a href="#nexus-features" className="header-nav-link">16 Fitur</a>
        <a href="#products-catalog" className="header-nav-link">Katalog</a>
        <a href="#how-it-works" className="header-nav-link">Cara Order</a>
      </nav>

      <div className="header-right">
        <a
          href="https://wa.me/6287833947151?text=Halo%20Admin%20Zet%20Xiters,%20saya%20ingin%20konsultasi%20Nexus%20Injector%20v2.0"
          target="_blank"
          rel="noopener noreferrer"
          className="header-cta-btn"
        >
          <MessageCircle size={15} />
          <span>Hubungi Admin</span>
        </a>
      </div>
    </header>
  );
}
