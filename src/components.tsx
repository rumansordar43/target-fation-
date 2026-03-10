import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Facebook, MessageCircle, Mail, Phone, Truck, ShieldCheck, RefreshCcw, Star, ArrowRight, ArrowDown, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatPrice, CATEGORIES, DIVISIONS, SIZES } from './utils';
import { Product, CartItem } from './types';

// --- Components ---

export const AnnouncementBar = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  if (!settings || settings.announcement_enabled !== 'true') return null;

  return (
    <div className="bg-steel-blue text-white py-2 overflow-hidden sticky top-0 z-[60]">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="mx-4">{settings.announcement_text}</span>
        <span className="mx-4">{settings.announcement_text}</span>
        <span className="mx-4">{settings.announcement_text}</span>
      </div>
    </div>
  );
};

export const Navbar = ({ cartCount }: { cartCount: number }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Sale', path: '/sale' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-50 h-[70px] flex items-center px-4 md:px-8 transition-all duration-300",
        isScrolled ? "glass" : "bg-main-bg"
      )}>
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-main-text"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Target Fashion Logo" 
              className="h-10 md:h-12 object-contain"
            />
            <img 
              src="/logo name.png" 
              alt="Target Fashion Name" 
              className="h-6 md:h-8 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "text-sm font-semibold uppercase tracking-widest transition-colors hover:text-royal-gold",
                  location.pathname === link.path ? "text-royal-gold" : "text-main-text"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="text-main-text hover:text-royal-gold transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="text-main-text hover:text-royal-gold transition-colors">
              <Search size={22} />
            </button>
            <Link to="/wishlist" className="text-main-text hover:text-royal-gold transition-colors">
              <Heart size={22} />
            </Link>
            <Link to="/cart" className="relative text-main-text hover:text-royal-gold transition-colors">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-crimson-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-[70] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-main-bg z-[80] p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center space-x-2">
                  <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
                  <img src="/logo name.png" alt="Name" className="h-4 object-contain" />
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-main-text">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col space-y-6">
                {navLinks.map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    className="text-lg font-bold uppercase tracking-widest text-main-text hover:text-royal-gold"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-main-bg/95 z-[100] flex flex-col items-center justify-center p-4"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 text-main-text hover:text-royal-gold"
            >
              <X size={32} />
            </button>
            <div className="w-full max-w-2xl">
              <input 
                autoFocus
                type="text" 
                placeholder="Search products..."
                className="w-full bg-transparent border-b-2 border-royal-gold text-3xl md:text-5xl font-cinzel text-main-text focus:outline-none pb-4"
              />
              <p className="mt-4 text-gray-500 uppercase tracking-widest text-sm">Press Enter to Search</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-main-bg border-t border-[var(--border-color)] pt-20 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1 */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
            <img src="/logo name.png" alt="Name" className="h-4 object-contain" />
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium T-shirts crafted for the streets of Bangladesh. Wear your target with confidence and style.
          </p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/profile.php?id=61582254746458" target="_blank" className="text-main-text hover:text-royal-gold transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-main-text hover:text-royal-gold transition-colors">
              <MessageCircle size={20} />
            </a>
            <a href="#" className="text-main-text hover:text-royal-gold transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-cinzel text-royal-gold text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-main-text transition-colors">Home</Link></li>
            <li><Link to="/shop" className="hover:text-main-text transition-colors">Shop</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-main-text transition-colors">New Arrivals</Link></li>
            <li><Link to="/sale" className="hover:text-main-text transition-colors">Sale</Link></li>
            <li><Link to="/about" className="hover:text-main-text transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-cinzel text-royal-gold text-lg font-bold mb-6">Customer Care</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link to="/size-guide" className="hover:text-main-text transition-colors">Size Guide</Link></li>
            <li><Link to="/shipping" className="hover:text-main-text transition-colors">Shipping Policy</Link></li>
            <li><Link to="/returns" className="hover:text-main-text transition-colors">Return & Exchange</Link></li>
            <li><Link to="/faq" className="hover:text-main-text transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-main-text transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="font-cinzel text-royal-gold text-lg font-bold mb-6">Connect</h4>
          <div className="space-y-4 text-sm text-gray-400">
            <p className="flex items-center space-x-3">
              <Phone size={16} className="text-royal-gold" />
              <span>+880 1XXX XXXXXX</span>
            </p>
            <p className="flex items-center space-x-3">
              <Mail size={16} className="text-royal-gold" />
              <span>info@targetfashion.com</span>
            </p>
            <p className="flex items-start space-x-3">
              <Truck size={16} className="text-royal-gold mt-1" />
              <span>Dhaka, Bangladesh</span>
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[var(--border-color)] text-center text-xs text-gray-500 uppercase tracking-widest">
        © 2025 Target Fashion. All Rights Reserved.
      </div>
    </footer>
  );
};

export const ProductCard = ({ product }: { product: Product, key?: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-dark-card border border-[var(--border-color)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
        {product.tags.includes('new-arrival') && (
          <span className="bg-steel-blue text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tighter">NEW</span>
        )}
        {product.sale_price && (
          <span className="bg-crimson-red text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tighter">SALE</span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 text-main-text/50 hover:text-royal-gold transition-colors">
        <Heart size={20} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden relative">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered ? "scale-110 opacity-0" : "scale-100 opacity-100"
          )}
        />
        <img 
          src={product.images[1] || product.images[0]} 
          alt={product.name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-700",
            isHovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
          )}
        />
        
        {/* Quick Add Button */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 transform",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigate(`/product/${product.slug}`);
            }}
            className="w-full bg-royal-gold text-deep-black font-bold py-2 text-xs uppercase tracking-widest hover:bg-white transition-colors"
          >
            Quick View
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-1">
        <p className="text-[10px] text-steel-blue font-bold uppercase tracking-widest">{product.category}</p>
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-bold text-main-text line-clamp-1 group-hover:text-royal-gold transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center space-x-2">
          {product.sale_price ? (
            <>
              <span className="text-royal-gold font-bold">{formatPrice(product.sale_price)}</span>
              <span className="text-gray-500 text-xs line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-royal-gold font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/8801XXXXXXXX?text=আমি Target Fashion থেকে অর্ডার করতে চাই" 
      target="_blank"
      className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform animate-pulse-gentle"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export const TrustStrip = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  if (!settings) return null;

  const allFeatures = [
    { icon: Truck, id: 'feature1' },
    { icon: ShieldCheck, id: 'feature2' },
    { icon: RefreshCcw, id: 'feature3' },
    { icon: Star, id: 'feature4' },
  ];

  const activeFeatures = allFeatures.filter(f => settings[`${f.id}_enabled`] === 'true');

  if (activeFeatures.length === 0) return null;

  return (
    <div className="bg-dark-card border-y border-[var(--border-color)] py-12 px-4 md:px-8">
      <div className={cn(
        "max-w-7xl mx-auto grid gap-8",
        activeFeatures.length === 1 ? "grid-cols-1" : 
        activeFeatures.length === 2 ? "grid-cols-2" : 
        activeFeatures.length === 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"
      )}>
        {activeFeatures.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-3">
            <f.icon size={32} className="text-royal-gold" />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-main-text">
                {settings[`${f.id}_title`]}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {settings[`${f.id}_desc`]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
