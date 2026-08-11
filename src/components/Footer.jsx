export default function Footer() {
  return (
    <footer className="site-footer reveal">
      <div className="footer-logo">
        <img
          src={`${import.meta.env.BASE_URL}assets/zx_tr.png`}
          alt="ZX"
          className="footer-logo-img"
        />
      </div>
      <div className="footer-tagline">ZETXITERS MARKET</div>
      <div className="footer-copyright">
        © 2026 MDZZXITERS. All rights reserved.
      </div>
    </footer>
  );
}
