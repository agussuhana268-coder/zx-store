import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';

export default function OrderModal({ product, onCloseModal }) {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCloseModal]);

  if (!product) return null;

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const orderMessage = `Halo ZX, saya ingin order *${product.name}* (${product.price}).\n\nNama: ${customerName || '-'}\nKontak: ${customerContact || '-'}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onCloseModal();
  };

  return (
    <div className="modal-overlay" onClick={onCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Order Produk</h2>
          <button
            type="button"
            className="close-btn"
            onClick={onCloseModal}
            aria-label="Tutup order modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="selected-product-summary">
          <div>
            <div className="summary-name">{product.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.slots}</div>
          </div>
          <div className="summary-price">{product.price}</div>
        </div>

        <form onSubmit={handleOrderSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="customer-name">
              Nama Lengkap
            </label>
            <input
              id="customer-name"
              type="text"
              className="form-input"
              placeholder="Masukkan nama kamu"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-contact">
              Nomor WhatsApp / Telegram
            </label>
            <input
              id="customer-contact"
              type="text"
              className="form-input"
              placeholder="Contoh: 08123456789"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              <span>Lanjutkan Order</span>
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
