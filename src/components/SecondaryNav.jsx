import { useState, useEffect, useRef } from 'react';
import { Building2, Package, ShieldCheck, HelpCircle, Headphones } from 'lucide-react';

const navItems = [
  {
    id: 'about-company',
    name: 'Tentang Kami',
    icon: Building2,
  },
  {
    id: 'products-catalog',
    name: 'Katalog Produk',
    icon: Package,
  },
  {
    id: 'company-benefits',
    name: 'Keunggulan',
    icon: ShieldCheck,
  },
  {
    id: 'order-guide',
    name: 'Cara Order',
    icon: HelpCircle,
  },
  {
    id: 'support',
    name: 'Bantuan',
    icon: Headphones,
  },
];

export default function SecondaryNav() {
  const [activeId, setActiveId] = useState('about-company');
  const navRef = useRef(null);
  const isManualScroll = useRef(false);

  const scrollToElement = (id) => {
    setActiveId(id);
    isManualScroll.current = true;

    const element = document.getElementById(id);
    if (element) {
      const navElement = document.querySelector('.secondary-nav-wrapper');
      const navHeight = navElement ? navElement.offsetHeight : 52;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight - 16;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      isManualScroll.current = false;
    }, 600);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll.current) return;

      const navElement = document.querySelector('.secondary-nav-wrapper');
      const navHeight = navElement ? navElement.offsetHeight : 52;

      const sectionIds = [
        'about-company',
        'products-catalog',
        'company-benefits',
        'order-guide',
        'support',
      ];

      let currentActive = 'about-company';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= navHeight + 140) {
            currentActive = id;
          }
        }
      }

      setActiveId(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current && navRef.current.scrollWidth > navRef.current.clientWidth) {
      const activeBtn = navRef.current.querySelector('.sec-nav-btn.active');
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeId]);

  return (
    <div className="secondary-nav-wrapper">
      <div className="secondary-nav-inner">
        <nav className="secondary-nav-track" ref={navRef} aria-label="Navigasi bagian halaman">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sec-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => scrollToElement(item.id)}
              >
                <Icon size={14} className="sec-nav-icon" />
                <span>{item.name}</span>
                {isActive && <span className="sec-active-indicator" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
