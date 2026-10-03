import { useState, useEffect, useRef } from 'react';
import { LayoutGrid, Cpu, Info, Sliders, Crown, CheckCircle2 } from 'lucide-react';

const navItems = [
  {
    id: 'products-catalog',
    name: 'Katalog Produk',
    icon: LayoutGrid,
  },
  {
    id: 'nexus-injector',
    name: 'Nexus Injector v2.0',
    icon: Cpu,
  },
  {
    id: 'nexus-info',
    name: 'Tentang Sistem',
    icon: Info,
  },
  {
    id: 'nexus-features',
    name: '16 Fitur',
    icon: Sliders,
  },
  {
    id: 'zx-vortex',
    name: 'ZX VORTEX',
    icon: Crown,
  },
  {
    id: 'how-it-works',
    name: 'Cara Order',
    icon: CheckCircle2,
  },
];

export default function SecondaryNav() {
  const [activeId, setActiveId] = useState('products-catalog');
  const navRef = useRef(null);
  const isManualScroll = useRef(false);

  const scrollToElement = (id) => {
    setActiveId(id);
    isManualScroll.current = true;

    const element = document.getElementById(id);
    if (element) {
      const navElement = document.querySelector('.secondary-nav-wrapper');
      const navHeight = navElement ? navElement.offsetHeight : 54;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight - 16;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      isManualScroll.current = false;
    }, 700);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll.current) return;

      const navElement = document.querySelector('.secondary-nav-wrapper');
      const navHeight = navElement ? navElement.offsetHeight : 54;

      const sectionIds = [
        'products-catalog',
        'nexus-injector',
        'nexus-info',
        'nexus-features',
        'zx-vortex',
        'how-it-works',
      ];

      let currentActive = 'products-catalog';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= navHeight + 120) {
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
    if (navRef.current) {
      const activeBtn = navRef.current.querySelector('.secondary-nav-item.active');
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
      <div className="secondary-nav-container">
        <nav className="secondary-nav-bar" ref={navRef} aria-label="Navigasi cepat produk">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`secondary-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => scrollToElement(item.id)}
              >
                <Icon size={14} className="nav-icon" />
                <span className="nav-label">{item.name}</span>
                {isActive && <span className="nav-active-bar" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
