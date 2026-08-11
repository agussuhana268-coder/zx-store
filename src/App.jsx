import { useState, useEffect } from 'react';
import Header from './components/Header';
import SecondaryNav from './components/SecondaryNav';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import OrderModal from './components/OrderModal';
import WhyChooseZX from './components/WhyChooseZX';
import AboutSupport from './components/AboutSupport';
import Footer from './components/Footer';
import { products } from './data/products';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
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
    <div className="app-container">
      <div className="container">
        <Header />
      </div>

      <SecondaryNav />

      <div className="container">
        <main>
          <Hero />

          <section id="products-catalog" className="products-section">
            <h2 className="section-title reveal">Katalog Produk</h2>
            <p className="section-subtitle reveal">
              Pilih produk yang sesuai dengan kebutuhan kamu.
            </p>

            <div className="products-grid">
              {products.map((product, index) => (
                <div key={product.id} id={product.id} className="product-card-wrapper">
                  <ProductCard
                    product={product}
                    index={index}
                    onSelectProduct={openOrderModal}
                  />
                </div>
              ))}
            </div>
          </section>

          <WhyChooseZX />

          <AboutSupport />
        </main>

        <Footer />
      </div>

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onCloseModal={closeOrderModal}
        />
      )}
    </div>
  );
}
