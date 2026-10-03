import { MessageCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-brand-wrap">
        <a href="#root" className="brand-anchor" aria-label="ZetXiters Official">
          <img
            src={`${import.meta.env.BASE_URL}assets/zx_tr.png`}
            alt="ZetXiters"
            className="brand-logo-img"
          />
          <div className="brand-headings">
            <span className="brand-title">ZETXITERS</span>
            <span className="brand-sub">COMPANY STORE</span>
          </div>
        </a>
      </div>

      <nav className="header-nav" aria-label="Navigasi Utama">
        <a href="#about-company" className="nav-link">Tentang Kami</a>
        <a href="#products-catalog" className="nav-link">Katalog Produk</a>
        <a href="#company-benefits" className="nav-link">Keunggulan</a>
        <a href="#order-guide" className="nav-link">Cara Order</a>
        <a href="#support" className="nav-link">Bantuan</a>
      </nav>

      <div className="header-cta-wrap">
        <a
          href="https://wa.me/6287833947151?text=Halo%20Admin%20Zet%20Xiters,%20saya%20ingin%20konsultasi%20layanan%20ZetXiters"
          target="_blank"
          rel="noopener noreferrer"
          className="header-whatsapp-btn"
        >
          <MessageCircle size={15} />
          <span>Hubungi Kami</span>
        </a>
      </div>
    </header>
  );
}
