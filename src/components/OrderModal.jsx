import { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, Smartphone, QrCode, MessageCircle, ArrowRight } from 'lucide-react';
import { createOrder } from '../utils/order';

export default function OrderModal({ product, onCloseModal, isPromo, onProceedToQris }) {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris'); // 'qris' | 'whatsapp'
  const [errors, setErrors] = useState({ name: '', contact: '' });

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

  const hasActivePromo = Boolean(isPromo && product.promoPrice);
  const effectivePrice = hasActivePromo ? product.promoPrice : product.price;

  const normalizePhone = (phone) => {
    let cleaned = phone.replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('+62')) {
      cleaned = '0' + cleaned.slice(3);
    } else if (cleaned.startsWith('62')) {
      cleaned = '0' + cleaned.slice(2);
    }
    return cleaned;
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    const nameTrimmed = customerName.trim();
    const contactTrimmed = customerContact.trim();
    const newErrors = { name: '', contact: '' };
    let hasError = false;

    if (!nameTrimmed) {
      newErrors.name = 'Nama lengkap wajib diisi.';
      hasError = true;
    }

    if (!contactTrimmed) {
      newErrors.contact = 'Nomor WhatsApp wajib diisi.';
      hasError = true;
    } else {
      const normalized = normalizePhone(contactTrimmed);
      if (!/^\d{9,15}$/.test(normalized)) {
        newErrors.contact = 'Nomor WhatsApp tidak valid (contoh: 081234567890).';
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const normalizedPhone = normalizePhone(contactTrimmed);

    // If QRIS payment method is selected
    if (paymentMethod === 'qris' && onProceedToQris) {
      const newOrder = createOrder({
        product,
        total: effectivePrice,
        customerName: nameTrimmed,
        customerContact: normalizedPhone,
        paymentMethod: 'QRIS_DANA',
      });
      onProceedToQris(newOrder);
      return;
    }

    // Existing WhatsApp Order flow (100% preserved)
    const messageLines = [
      `Halo Admin Zet Xiters, saya ingin melakukan pemesanan lisensi resmi:`,
      `📦 *${product.name}*`,
      ...(product.compatibility ? [`📱 *Kompatibilitas:* ${product.compatibility}`] : []),
      `💰 *Harga:* ${effectivePrice} (${product.license || 'Permanen / Lifetime'})`,
      '',
      'Berikut data pemesan:',
      `👤 *Nama:* ${nameTrimmed}`,
      `📞 *WhatsApp:* ${normalizedPhone}`,
      '',
      'Mohon petunjuk untuk proses pembayaran dan panduan pengiriman file.',
      '',
      'Terima kasih.'
    ];

    const orderMessage = messageLines.join('\n');
    const whatsappUrl = `https://wa.me/6287833947151?text=${encodeURIComponent(orderMessage)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onCloseModal();
  };

  return (
    <div className="modal-backdrop" onClick={onCloseModal}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <div>
            <h3 className="dialog-title">Formulir Pemesanan Lisensi</h3>
            <p className="dialog-subtitle">
              Pilih metode transaksi dan lengkapi data kontak Anda.
            </p>
          </div>
          <button
            type="button"
            className="dialog-close-btn"
            onClick={onCloseModal}
            aria-label="Tutup form pemesanan"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Product Summary Box */}
        <div className="order-summary-box">
          <div className="summary-main">
            <span className="summary-title">{product.name}</span>
            <div className="summary-meta-line">
              <span className="summary-license-pill">
                <ShieldCheck size={12} />
                <span>{product.license || 'Permanen / Lifetime'}</span>
              </span>
              {product.compatibility && (
                <span className="summary-compat-pill">
                  <Smartphone size={12} />
                  <span>{product.compatibility}</span>
                </span>
              )}
            </div>
          </div>
          <div className="summary-price-area">
            {hasActivePromo ? (
              <>
                <span className="summary-price-active">{product.promoPrice}</span>
                <span className="summary-price-prev">{product.price}</span>
              </>
            ) : (
              <span className="summary-price-active">{product.price}</span>
            )}
          </div>
        </div>

        <form onSubmit={handleOrderSubmit} noValidate className="dialog-form">
          {/* Payment Method Selector */}
          <div className="payment-select-group">
            <label className="input-label">Pilih Metode Transaksi</label>
            <div className="payment-method-grid">
              <button
                type="button"
                className={`payment-method-card ${paymentMethod === 'qris' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('qris')}
              >
                <div className="method-card-head">
                  <div className="method-icon-wrap">
                    <QrCode size={16} />
                  </div>
                  <span className="method-pill-badge">Rekomendasi</span>
                </div>
                <div className="method-info">
                  <span className="method-title">QRIS DANA (Semua E-Wallet)</span>
                  <span className="method-sub">Scan QR DANA, GoPay, OVO, ShopeePay, BCA, dll</span>
                </div>
              </button>

              <button
                type="button"
                className={`payment-method-card ${paymentMethod === 'whatsapp' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('whatsapp')}
              >
                <div className="method-card-head">
                  <div className="method-icon-wrap">
                    <MessageCircle size={16} />
                  </div>
                  <span className="method-pill-badge manual">Manual CS</span>
                </div>
                <div className="method-info">
                  <span className="method-title">WhatsApp Admin Langsung</span>
                  <span className="method-sub">Pesan & konsultasi manual via chat WhatsApp</span>
                </div>
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="customer-name">
              Nama Lengkap
            </label>
            <input
              id="customer-name"
              type="text"
              className="text-input"
              placeholder="Contoh: Pratama Wijaya"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="customer-contact">
              Nomor WhatsApp
            </label>
            <input
              id="customer-contact"
              type="tel"
              className="text-input"
              placeholder="Contoh: 081234567890"
              value={customerContact}
              onChange={(e) => {
                setCustomerContact(e.target.value);
                if (errors.contact) setErrors((prev) => ({ ...prev, contact: '' }));
              }}
            />
            {errors.contact && <span className="field-error">{errors.contact}</span>}
          </div>

          <div className="dialog-security-note">
            <ShieldCheck size={14} className="note-icon" />
            <span>
              {paymentMethod === 'qris'
                ? 'Transaksi diproses melalui sistem QRIS DANA ZetXiters Official.'
                : 'Transaksi aman langsung dengan Admin WhatsApp resmi (087833947151).'}
            </span>
          </div>

          <div className="dialog-actions">
            {paymentMethod === 'qris' ? (
              <button type="submit" className="btn-dialog-submit">
                <span>Lanjut ke Pembayaran QRIS</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button type="submit" className="btn-dialog-submit">
                <span>Lanjutkan ke WhatsApp</span>
                <Send size={15} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
