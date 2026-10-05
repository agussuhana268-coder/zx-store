import { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  Copy,
  Clock,
  MessageCircle,
  ShieldCheck,
  Download,
  ArrowLeft,
  Info,
  CheckCircle2,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import {
  ADMIN_WHATSAPP_NUMBER,
  ORDER_STATUS,
  buildQrisConfirmationMessage,
  getWhatsAppUrl
} from '../utils/order';
import { markOrderPaid, getOrder } from '../utils/api';
import { playSuccessSound } from '../utils/sound';

export default function QrisPaymentModal({
  order,
  onClose,
  onBack,
  onUpdateOrderStatus,
  onSyncOrder,
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [isReportingPaid, setIsReportingPaid] = useState(false);
  const [paidError, setPaidError] = useState('');

  const orderId = order?.orderId || order?.order_id;
  const currentStatus = order?.status || ORDER_STATUS.PENDING_PAYMENT;

  // Track status transitions to play success sound strictly on WAITING_VERIFICATION -> SUCCESS
  const prevStatusRef = useRef(currentStatus);
  const prevOrderIdRef = useRef(orderId);
  const hasPlayedSuccessSoundRef = useRef(false);

  useEffect(() => {
    // Reset tracker if orderId changes
    if (prevOrderIdRef.current !== orderId) {
      prevOrderIdRef.current = orderId;
      hasPlayedSuccessSoundRef.current = false;
    }

    const prevStatus = prevStatusRef.current;

    // Detect genuine transition from WAITING_VERIFICATION to SUCCESS
    if (
      prevStatus === ORDER_STATUS.WAITING_VERIFICATION &&
      currentStatus === ORDER_STATUS.SUCCESS &&
      !hasPlayedSuccessSoundRef.current
    ) {
      hasPlayedSuccessSoundRef.current = true;
      playSuccessSound();
    }

    prevStatusRef.current = currentStatus;
  }, [currentStatus, orderId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Polling for status updates only when in WAITING_VERIFICATION (5-10 seconds interval)
  useEffect(() => {
    if (!orderId || currentStatus !== ORDER_STATUS.WAITING_VERIFICATION) {
      return;
    }

    let isMounted = true;

    const pollStatus = async () => {
      try {
        const latestOrder = await getOrder(orderId);
        if (!isMounted) return;
        if (latestOrder && latestOrder.status && latestOrder.status !== currentStatus) {
          if (onSyncOrder) {
            onSyncOrder(latestOrder);
          } else if (onUpdateOrderStatus) {
            onUpdateOrderStatus(orderId, latestOrder.status, 'ADMIN');
          }
        }
      } catch (err) {
        // Polling failed temporarily - keep current status and retry on next interval
        console.warn('Polling status order gagal sementara:', err.message);
      }
    };

    const intervalId = setInterval(pollStatus, 7000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [orderId, currentStatus, onSyncOrder, onUpdateOrderStatus]);

  if (!order) return null;

  const {
    product,
    customerName = '',
    customerContact = '',
  } = order;

  const displayTotal = order.total || order.totalPrice || '';

  const isPending = currentStatus === ORDER_STATUS.PENDING_PAYMENT;
  const isWaitingVerification = currentStatus === ORDER_STATUS.WAITING_VERIFICATION;
  const isSuccess = currentStatus === ORDER_STATUS.SUCCESS;
  const isCancelled = currentStatus === ORDER_STATUS.CANCELLED;
  const showQrisCard = isPending || isWaitingVerification;

  const qrisImageUrl = `${import.meta.env.BASE_URL}images/qris-dana.png`;

  const copyToClipboard = (text, fieldName) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    }
  };

  const handleReportPaid = async () => {
    if (!isPending || isReportingPaid) return;
    setIsReportingPaid(true);
    setPaidError('');

    try {
      const updatedOrder = await markOrderPaid(orderId);
      if (onSyncOrder) {
        onSyncOrder(updatedOrder);
      } else if (onUpdateOrderStatus) {
        onUpdateOrderStatus(
          orderId,
          ORDER_STATUS.WAITING_VERIFICATION,
          'CUSTOMER'
        );
      }
    } catch (err) {
      console.error('Gagal melaporkan status pembayaran:', err);
      setPaidError(err.message || 'Gagal memverifikasi pembayaran. Silakan coba lagi.');
    } finally {
      setIsReportingPaid(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const message = buildQrisConfirmationMessage({
      orderId,
      productName: product?.name || 'Lisensi ZetXiters',
      totalPrice: displayTotal,
      customerName,
      customerContact,
    });
    const waUrl = getWhatsAppUrl(ADMIN_WHATSAPP_NUMBER, message);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-dialog qris-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dialog-header qris-dialog-header">
          <div className="qris-header-left">
            {onBack && isPending && (
              <button
                type="button"
                className="qris-back-btn"
                onClick={onBack}
                aria-label="Kembali ke formulir"
                title="Kembali ke data pemesan"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <div className="qris-modal-badge">
                <span>METODE PEMBAYARAN QRIS MANUAL</span>
              </div>
              <h3 className="dialog-title">Pembayaran QRIS DANA</h3>
              <p className="dialog-subtitle">
                {isSuccess
                  ? 'Pembayaran pesanan Anda telah berhasil diverifikasi oleh admin.'
                  : isCancelled
                  ? 'Status transaksi pesanan ini telah dibatalkan.'
                  : 'Scan kode QRIS menggunakan aplikasi DANA atau e-wallet / mobile banking lainnya.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="dialog-close-btn"
            onClick={onClose}
            aria-label="Tutup pembayaran"
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Details Summary Card */}
        <div className="qris-order-summary">
          <div className="qris-order-row">
            <div className="qris-order-meta">
              <span className="qris-label">Nomor / Order ID:</span>
              <div className="qris-order-id-wrap">
                <span className="qris-order-id-val">{orderId}</span>
                <button
                  type="button"
                  className="qris-copy-btn"
                  onClick={() => copyToClipboard(orderId, 'orderId')}
                  title="Salin Order ID"
                >
                  {copiedField === 'orderId' ? (
                    <>
                      <Check size={12} className="copy-check" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="qris-order-price-box">
              <span className="qris-label">Total Pembayaran:</span>
              <div className="qris-total-wrap">
                <span className="qris-total-val">{displayTotal}</span>
                <button
                  type="button"
                  className="qris-copy-btn"
                  onClick={() => copyToClipboard(displayTotal.replace(/\D/g, ''), 'price')}
                  title="Salin nominal transfer"
                >
                  {copiedField === 'price' ? (
                    <>
                      <Check size={12} className="copy-check" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Nominal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="qris-product-subline">
            <span className="qris-product-name">{product?.name}</span>
            <div className="qris-product-tags">
              <span className="summary-license-pill">
                <ShieldCheck size={12} />
                <span>{product?.license || 'Permanen / Lifetime'}</span>
              </span>
              {product?.compatibility && (
                <span className="summary-compat-pill">
                  <Smartphone size={12} />
                  <span>{product.compatibility}</span>
                </span>
              )}
            </div>
          </div>

          {customerName && (
            <div className="qris-customer-line">
              <span>Pemesan: <strong>{customerName}</strong> {customerContact ? `(${customerContact})` : ''}</span>
            </div>
          )}
        </div>

        {/* QRIS DANA Card (1:1 Aspect Ratio) - Displayed only for PENDING_PAYMENT & WAITING_VERIFICATION */}
        {showQrisCard && (
          <div className="qris-code-card">
            <div className="qris-code-header">
              <div className="qris-brand-left">
                <span className="qris-logo-text">QRIS</span>
                <span className="qris-sub-text">National Standard</span>
              </div>
              <div className="qris-dana-badge">
                <span className="dana-dot"></span>
                <span>DANA QR</span>
              </div>
            </div>

            {/* 1:1 Aspect Ratio Container */}
            <div className="qris-image-container-square">
              <img
                src={qrisImageUrl}
                alt="Kode QRIS DANA Pembayaran ZetXiters"
                className="qris-image-proportional"
                loading="eager"
              />
            </div>

            <div className="qris-code-footer">
              <span className="qris-merchant-title">ZETXITERS OFFICIAL STORE</span>
              <p className="qris-accepted-note">
                Menerima: DANA • GoPay • OVO • ShopeePay • BCA Mobile • Mandiri Livin • BRImo • Semua QRIS
              </p>
              <a
                href={qrisImageUrl}
                download="qris-dana-zxstore.png"
                target="_blank"
                rel="noopener noreferrer"
                className="qris-download-link"
              >
                <Download size={13} />
                <span>Simpan Gambar QRIS (Untuk Scan dari Galeri)</span>
              </a>
            </div>
          </div>
        )}

        {/* State 1: PENDING_PAYMENT -> Show instructions and 'Saya Sudah Membayar' button */}
        {isPending && (
          <>
            <div className="qris-instructions-card">
              <div className="instructions-header">
                <Info size={14} className="instructions-icon" />
                <span className="instructions-title">Instruksi Pembayaran:</span>
              </div>
              <ol className="instructions-step-list">
                <li>
                  Buka aplikasi <strong>DANA</strong>, <strong>GoPay</strong>, <strong>OVO</strong>, <strong>ShopeePay</strong>, atau <strong>Mobile Banking</strong> pilihan Anda.
                </li>
                <li>
                  Pilih menu <strong>Scan QR / Bayar</strong> dan arahkan kamera ke kode QRIS di atas (atau unggah dari galeri jika menggunakan 1 HP).
                </li>
                <li>
                  Pastikan nama merchant penerima dan nominal transfer tepat sebesar <strong>{displayTotal}</strong>.
                </li>
                <li>
                  Selesaikan transaksi hingga pembayaran berhasil di aplikasi Anda.
                </li>
                <li>
                  Kembali ke halaman ini lalu tekan tombol <strong>"Saya Sudah Membayar"</strong> di bawah.
                </li>
              </ol>
            </div>

            <div className="qris-action-section">
              <button
                type="button"
                className="btn-dialog-submit qris-btn-paid"
                onClick={handleReportPaid}
                disabled={isReportingPaid}
              >
                {isReportingPaid ? (
                  <>
                    <Clock size={17} />
                    <span>Memverifikasi Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    <span>Saya Sudah Membayar</span>
                  </>
                )}
              </button>

              {paidError && (
                <div className="field-error" style={{ textAlign: 'center', marginTop: '10px' }}>
                  {paidError}
                </div>
              )}

              <div className="qris-security-disclaimer">
                <ShieldCheck size={14} className="disclaimer-icon" />
                <span>
                  Simpan tangkapan layar (screenshot) bukti transaksi dari aplikasi Anda untuk kemudahan verifikasi.
                </span>
              </div>
            </div>
          </>
        )}

        {/* State 2: WAITING_VERIFICATION -> Show waiting message and WhatsApp confirmation button */}
        {isWaitingVerification && (
          <div className="qris-post-submit-section">
            <div className="qris-status-box status-pending-verification">
              <div className="status-badge-row">
                <Clock size={16} className="status-icon-pending" />
                <span className="status-badge-label">STATUS TRANSAKSI</span>
              </div>
              <h4 className="status-highlight-text">
                Pembayaran dikirim — menunggu verifikasi admin.
              </h4>
              <p className="status-details-text">
                Sistem pembayaran saat ini belum terhubung otomatis ke API DANA. Admin ZetXiters akan memverifikasi mutasi pembayaran Anda secara manual.
              </p>
              <div className="status-order-reminder">
                <span>Order ID: <strong>{orderId}</strong> • Total: <strong>{displayTotal}</strong></span>
              </div>
            </div>

            <div className="qris-confirm-actions">
              <button
                type="button"
                className="btn-whatsapp-confirm"
                onClick={handleOpenWhatsApp}
              >
                <MessageCircle size={18} />
                <span>Konfirmasi via WhatsApp</span>
              </button>

              <button
                type="button"
                className="qris-btn-close-secondary"
                onClick={onClose}
              >
                <span>Tutup Jendela Pembayaran</span>
              </button>
            </div>

            <div className="qris-wa-instruction-note">
              <span>
                💡 Klik tombol di atas untuk membuka WhatsApp Admin dengan pesan Order ID otomatis, lalu kirimkan bukti transfer screenshot Anda.
              </span>
            </div>
          </div>
        )}

        {/* State 3: SUCCESS -> Show success verified status */}
        {isSuccess && (
          <div className="qris-post-submit-section">
            <div className="qris-status-box status-success">
              <div className="status-badge-row">
                <CheckCircle2 size={16} />
                <span className="status-badge-label">STATUS TRANSAKSI</span>
              </div>
              <h4 className="status-highlight-text">
                Pembayaran Berhasil Diverifikasi!
              </h4>
              <p className="status-details-text">
                Pembayaran Anda telah berhasil diverifikasi oleh Admin ZetXiters. Lisensi dan file produk resmi Anda siap digunakan.
              </p>
              <div className="status-order-reminder">
                <span>Order ID: <strong>{orderId}</strong> • Total: <strong>{displayTotal}</strong></span>
              </div>
            </div>

            <div className="qris-confirm-actions">
              <button
                type="button"
                className="btn-whatsapp-confirm"
                onClick={handleOpenWhatsApp}
              >
                <MessageCircle size={18} />
                <span>Hubungi Admin via WhatsApp</span>
              </button>

              <button
                type="button"
                className="qris-btn-close-secondary"
                onClick={onClose}
              >
                <span>Tutup Jendela</span>
              </button>
            </div>
          </div>
        )}

        {/* State 4: CANCELLED -> Show cancelled status */}
        {isCancelled && (
          <div className="qris-post-submit-section">
            <div className="qris-status-box status-cancelled">
              <div className="status-badge-row">
                <AlertCircle size={16} />
                <span className="status-badge-label">STATUS TRANSAKSI</span>
              </div>
              <h4 className="status-highlight-text">
                Transaksi Dibatalkan
              </h4>
              <p className="status-details-text">
                Pesanan ini telah dibatalkan oleh Admin atau batas waktu verifikasi telah berakhir. Silakan hubungi tim kami jika memerlukan bantuan.
              </p>
              <div className="status-order-reminder">
                <span>Order ID: <strong>{orderId}</strong> • Total: <strong>{displayTotal}</strong></span>
              </div>
            </div>

            <div className="qris-confirm-actions">
              <button
                type="button"
                className="btn-whatsapp-confirm"
                onClick={handleOpenWhatsApp}
              >
                <MessageCircle size={18} />
                <span>Bantuan via WhatsApp</span>
              </button>

              <button
                type="button"
                className="qris-btn-close-secondary"
                onClick={onClose}
              >
                <span>Tutup Jendela</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
