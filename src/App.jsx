import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import OrderModal from './components/OrderModal';
import AboutSupport from './components/AboutSupport';
import Footer from './components/Footer';
import { products } from './data/products';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openOrderModal = (product) => {
    setSelectedProduct(product);
  };

  const closeOrderModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="container">
      <Header />

      <main>
        <Hero />

        <section className="products-section">
          <h2 className="section-title">Katalog Produk</h2>
          <p className="section-subtitle">
            Pilih produk yang sesuai dengan kebutuhan kamu.
          </p>

          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={openOrderModal}
              />
            ))}
          </div>
        </section>

        <AboutSupport />
      </main>

      <Footer />

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onCloseModal={closeOrderModal}
        />
      )}
    </div>
  );
}
