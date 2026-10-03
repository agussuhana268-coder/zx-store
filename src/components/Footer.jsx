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
              <span className="footer-brand-heading">ZETXITERS COMPANY</span>
            </div>
            <p className="footer-brand-subtitle">
              Divisi produk digital resmi dari MDZZXITERS yang berdedikasi menyediakan solusi optimasi gaming Android yang aman, stabil, dan terpercaya.
            </p>
          </div>

          <div className="footer-links-side">
            <a href="#about-company" className="footer-link">Tentang Kami</a>
            <a href="#products-catalog" className="footer-link">Katalog Produk</a>
            <a href="#company-benefits" className="footer-link">Keunggulan</a>
            <a href="#order-guide" className="footer-link">Cara Order</a>
            <a href="#support" className="footer-link">Pusat Bantuan</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 <strong>MDZZXITERS</strong>. All rights reserved.
          </p>
          <p className="footer-legal-note">
            Seluruh transaksi dan distribusi resmi dikelola langsung melalui saluran komunikasi resmi ZetXiters.
          </p>
        </div>
      </div>
    </footer>
  );
}
