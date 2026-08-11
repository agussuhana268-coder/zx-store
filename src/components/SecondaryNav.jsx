import { useState, useEffect, useRef } from 'react';
import { LayoutGrid, Cpu, Zap, Crown, Target } from 'lucide-react';

const navItems = [
  {
    id: 'products-catalog',
    name: 'All Products',
    subtitle: 'Overview',
    icon: LayoutGrid,
  },
  {
    id: 'zx-core',
    name: 'ZX CORE',
    subtitle: 'Basic Access',
    icon: Cpu,
  },
  {
    id: 'zx-apex',
    name: 'ZX APEX',
    subtitle: 'Advanced Access',
    icon: Zap,
  },
  {
    id: 'zx-exclusive',
    name: 'ZX EXCLUSIVE',
    subtitle: 'Premium Access',
    icon: Crown,
  },
  {
    id: 'zx-vortex',
    name: 'ZX VORTEX',
    subtitle: 'Ultimate Access',
    icon: Target,
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
      const navHeight = navElement ? navElement.offsetHeight : 64;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight - 16;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      isManualScroll.current = false;
    }, 800);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll.current) return;

      const navElement = document.querySelector('.secondary-nav-wrapper');
      const navHeight = navElement ? navElement.offsetHeight : 64;

      const catalogEl = document.getElementById('products-catalog');
      if (!catalogEl) return;

      const catalogTop = catalogEl.getBoundingClientRect().top;
      if (catalogTop > window.innerHeight * 0.5) {
        setActiveId('products-catalog');
        return;
      }

      const productIds = ['zx-core', 'zx-apex', 'zx-exclusive', 'zx-vortex'];
      let currentActive = 'products-catalog';

      for (const id of productIds) {
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
        <nav className="secondary-nav-bar" ref={navRef} aria-label="Secondary product navigation">
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
                <div className="nav-item-icon-wrapper">
                  <Icon size={15} className="nav-item-icon" />
                </div>
                <div className="nav-item-text">
                  <span className="nav-item-name">{item.name}</span>
                  <span className="nav-item-subtitle">{item.subtitle}</span>
                </div>
                {isActive && <span className="nav-item-indicator" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
