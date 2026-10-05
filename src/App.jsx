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
import { updateOrderStatus, ORDER_STATUS } from './utils/order';
import { getOrder } from './utils/api';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qrisOrder, setQrisOrder] = useState(null);
  const [isPromo, setIsPromo] = useState(isPromotionActive);

  // Restore active order from backend on page refresh
  useEffect(() => {
    try {
      const savedOrderId = localStorage.getItem('zx_active_order_id');
      if (!savedOrderId) return;

      let isCancelled = false;
      getOrder(savedOrderId)
        .then((existingOrder) => {
          if (isCancelled || !existingOrder) return;
          if (
            existingOrder.status === ORDER_STATUS.PENDING_PAYMENT ||
            existingOrder.status === ORDER_STATUS.WAITING_VERIFICATION
          ) {
            setQrisOrder(existingOrder);
          } else {
            localStorage.removeItem('zx_active_order_id');
          }
        })
        .catch((err) => {
          console.warn('Gagal memulihkan status order dari backend:', err.message);
          localStorage.removeItem('zx_active_order_id');
        });

      return () => {
        isCancelled = true;
      };
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

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

  const handleUpdateOrderStatus = (orderId, targetStatus, role) => {
    const currentOrderId = qrisOrder?.orderId || qrisOrder?.order_id;
    if (!qrisOrder || currentOrderId !== orderId) {
      console.warn(`Order dengan ID "${orderId}" tidak ditemukan.`);
      return false;
    }

    try {
      const updatedOrder = updateOrderStatus(qrisOrder, targetStatus, role);
      setQrisOrder(updatedOrder);
      if (
        targetStatus === ORDER_STATUS.SUCCESS ||
        targetStatus === ORDER_STATUS.CANCELLED
      ) {
        try {
          localStorage.removeItem('zx_active_order_id');
        } catch {}
      }
      return true;
    } catch (err) {
      console.error('Gagal memperbarui status order:', err.message);
      return false;
    }
  };

  const handleSyncOrder = (updatedOrder) => {
    if (!updatedOrder) return;
    setQrisOrder((prev) => ({
      ...prev,
      ...updatedOrder,
    }));
    if (
      updatedOrder.status === ORDER_STATUS.SUCCESS ||
      updatedOrder.status === ORDER_STATUS.CANCELLED
    ) {
      try {
        localStorage.removeItem('zx_active_order_id');
      } catch {}
    }
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
                ZetXiters menghadirkan varian konfigurasi sistem terstruktur untuk perangkat Android dan iOS demi kestabilan dan performa kompetitif.
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
            try {
              const activeId = orderData.orderId || orderData.order_id;
              if (activeId) {
                localStorage.setItem('zx_active_order_id', activeId);
              }
            } catch {}
          }}
        />
      )}

      {qrisOrder && (
        <QrisPaymentModal
          order={qrisOrder}
          onClose={() => {
            setQrisOrder(null);
            try {
              localStorage.removeItem('zx_active_order_id');
            } catch {}
          }}
          onBack={() => {
            const rawId = qrisOrder.product?.id;
            const catalogProduct = products.find((p) => p.id === rawId) || qrisOrder.product;
            let matchedDuration = null;
            if (catalogProduct?.durations) {
              matchedDuration =
                catalogProduct.durations.find(
                  (d) =>
                    d.label === qrisOrder.product?.duration ||
                    qrisOrder.product?.name?.includes(d.label) ||
                    d.price === qrisOrder.total
                ) || null;
            }
            setSelectedProduct({
              ...catalogProduct,
              selectedDuration: matchedDuration || catalogProduct?.durations?.find((d) => d.isDefault) || null,
            });
            setQrisOrder(null);
            try {
              localStorage.removeItem('zx_active_order_id');
            } catch {}
          }}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onSyncOrder={handleSyncOrder}
        />
      )}
    </div>
  );
}
