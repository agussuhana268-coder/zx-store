import { useState, useEffect } from 'react';
import Header from './components/Header';
import SecondaryNav from './components/SecondaryNav';
import Hero from './components/Hero';
import NexusShowcase from './components/NexusShowcase';
import ProductCard from './components/ProductCard';
import OrderModal from './components/OrderModal';
import VortexShowcase from './components/VortexShowcase';
import WhyChooseZX from './components/WhyChooseZX';
import HowItWorks from './components/HowItWorks';
import AboutSupport from './components/AboutSupport';
import Footer from './components/Footer';
import { products, isPromotionActive } from './data/products';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPromo, setIsPromo] = useState(isPromotionActive);

  useEffect(() => {
    setIsPromo(isPromotionActive());
    const interval = setInterval(() => {
      setIsPromo(isPromotionActive());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const openOrderModal = (product) => {
    setSelectedProduct(product);
  };

  const closeOrderModal = () => {
    setSelectedProduct(null);
  };

  const nexusProduct = products.find((p) => p.id === 'nexus-injector') || products[0];

  return (
    <div className="app-container">
      {/* Background Ambient Glows */}
      <div className="bg-glow-top"></div>
      <div className="bg-glow-middle"></div>

      <div className="container">
        <Header />
      </div>

      <SecondaryNav />

      <div className="container">
        <main>
          <Hero onSelectNexus={() => openOrderModal(nexusProduct)} />

          <NexusShowcase onSelectNexus={() => openOrderModal(nexusProduct)} />

          <section id="products-catalog" className="products-section">
            <div className="section-header-block">
              <span className="section-eyebrow">KATALOG PILIHAN</span>
              <h2 className="section-title reveal">Katalog Produk Resmi</h2>
              <p className="section-subtitle reveal">
                Pilih paket lisensi permanen yang sesuai dengan kebutuhan gaming kamu.
              </p>
            </div>

            <div className="products-grid">
              {products.map((product, index) => (
                <div key={product.id} id={product.id} className="product-card-wrapper">
                  <ProductCard
                    product={product}
                    index={index}
                    isPromo={isPromo}
                    onSelectProduct={openOrderModal}
                  />
                </div>
              ))}
            </div>
          </section>

          <VortexShowcase />

          <WhyChooseZX />

          <HowItWorks />

          <AboutSupport />
        </main>

        <Footer />
      </div>

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          isPromo={isPromo}
          onCloseModal={closeOrderModal}
        />
      )}
    </div>
  );
}
