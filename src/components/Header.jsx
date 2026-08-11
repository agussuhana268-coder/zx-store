export default function Header() {
  return (
    <header className="site-header">
      <img src={`${import.meta.env.BASE_URL}assets/zx_tr.png`} alt="ZX" className="brand-logo-img" />
      <span className="brand-tag">Digital Store</span>
    </header>
  );
}
