export default function Hero() {
  return (
    <section className="hero-section">
      <img src={`${import.meta.env.BASE_URL}assets/zx_tr.png`} alt="ZX" className="hero-logo-img" />
      <div className="hero-subtitle">Premium Digital Store</div>
      <p className="hero-description">
        Premium digital products designed for a better experience.
      </p>
    </section>
  );
}
