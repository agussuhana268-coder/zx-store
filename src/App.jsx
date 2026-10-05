import { useState, useEffect } from 'react';
import Header from './components/Header';
import SecondaryNav from './components/SecondaryNav';
import Hero from './components/Hero';
import AboutCompany from './components/AboutCompany';
import ProductCard from './components/ProductCard';
import OrderModal from './components/OrderModal';
import QrisPaymentModal from './components/QrisPaymentModal';
import WhyChooseZX from './components/WhyChooseZX';
import HowItWorks from './components/HowItWorks';
import AboutSupport from './components/AboutSupport';
import Footer from './components/Footer';
import { products, isPromotionActive } from './data/products';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qrisOrder, setQrisOrder] = useState(null);
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
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
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

  return (
    <div className="app-wrapper">
      <div className="site-width-container">
        <Header />
      </div>

      <SecondaryNav />

      <div className="site-width-container">
        <main className="main-content-flow">
          <Hero />

          <AboutCompany />

          <section id="products-catalog" className="catalog-section reveal">
            <div className="section-head">
              <span className="section-pretitle">KATALOG RESMI ZETXITERS</span>
              <h2 className="section-main-title">Pilihan Produk & Lisensi Sistem</h2>
              <p className="section-subtext">
                ZetXiters menghadirkan dua varian konfigurasi sistem Android terstruktur untuk kestabilan dan performa kompetitif.
              </p>
            </div>

            <div className="pricing-cards-grid">
              {products.map((product, index) => (
                <div key={product.id} id={product.id} className="pricing-card-col">
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
          onProceedToQris={(orderData) => {
            setSelectedProduct(null);
            setQrisOrder(orderData);
          }}
        />
      )}

      {qrisOrder && (
        <QrisPaymentModal
          order={qrisOrder}
          onClose={() => setQrisOrder(null)}
          onBack={() => {
            setSelectedProduct(qrisOrder.product);
            setQrisOrder(null);
          }}
        />
      )}
    </div>
  );
}
