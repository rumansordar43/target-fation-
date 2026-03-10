import { useState, useEffect, FormEvent } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AnnouncementBar, Navbar, Footer, WhatsAppButton, ProductCard, TrustStrip } from './components';
import { Product, CartItem, Order } from './types';
import { formatPrice, CATEGORIES, SIZES, DIVISIONS, cn } from './utils';
import { ArrowRight, ArrowDown, Filter, X, ShoppingBag, Trash2, Plus, Minus, CheckCircle, Facebook, MessageCircle, Edit, Trash, LogOut, Package, ListOrdered, LayoutDashboard } from 'lucide-react';

// --- Auth ---
const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('tf_admin_token') === 'admin-token-123');
  
  const login = (token: string) => {
    localStorage.setItem('tf_admin_token', token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('tf_admin_token');
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
};

const AdminLogin = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success) {
      onLogin(data.token);
      navigate('/admin');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-dark-card border border-[var(--border-color)] p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-cinzel text-royal-gold">ADMIN LOGIN</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your password to access the dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
            <input 
              required 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-main-bg border border-[var(--border-color)] p-4 text-main-text focus:border-royal-gold outline-none" 
            />
          </div>
          {error && <p className="text-crimson-red text-xs font-bold">{error}</p>}
          <button type="submit" className="btn-gold w-full">Login</button>
        </form>
      </div>
    </div>
  );
};

// --- Pages ---

const Home = ({ products }: { products: Product[] }) => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-main-bg">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A84C_1px,transparent_1px),linear-gradient(to_bottom,#C9A84C_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-steel-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crimson-red/20 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-steel-blue/20 border border-steel-blue/50 text-steel-blue text-xs font-bold px-4 py-1 uppercase tracking-[0.3em] mb-6"
          >
            NEW COLLECTION 2025
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-cinzel font-black text-royal-gold leading-none mb-4"
          >
            WEAR YOUR <br /> TARGET
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-4xl font-cinzel text-crimson-red uppercase tracking-[0.5em] mb-8"
          >
            TARGET FASHION
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-main-text/60 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            Premium T-shirts crafted for the streets of Bangladesh. Experience the perfect blend of style and comfort.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/shop" className="btn-gold w-full sm:w-auto">Shop Now</Link>
            <Link to="/new-arrivals" className="btn-outline w-full sm:w-auto">New Arrivals</Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-royal-gold"
        >
          <ArrowDown size={32} />
        </motion.div>
      </section>

      <TrustStrip />

      {/* Shop By Style */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl text-royal-gold mb-2">SHOP BY STYLE</h2>
          <div className="w-20 h-1 bg-crimson-red mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link 
              key={cat} 
              to={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
              className="group relative aspect-[3/4] overflow-hidden bg-dark-card border border-[var(--border-color)]"
            >
              <img 
                src={`https://picsum.photos/seed/cat${i}/600/800`} 
                alt={cat}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main-bg via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-main-text group-hover:text-royal-gold transition-colors">{cat}</h3>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-royal-gold transition-all duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl text-royal-gold mb-2">BEST SELLERS</h2>
            <div className="w-20 h-1 bg-crimson-red" />
          </div>
          <Link to="/shop" className="text-royal-gold text-sm font-bold uppercase tracking-widest flex items-center group">
            View All <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Facebook Section */}
      <section className="bg-dark-card py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl text-royal-gold">FOLLOW US ON FACEBOOK</h2>
          <p className="text-main-text/60">আমাদের নতুন সব কালেকশন এবং অফার জানতে আমাদের ফেসবুক পেজে যুক্ত থাকুন।</p>
          <a 
            href="https://www.facebook.com/profile.php?id=61582254746458" 
            target="_blank"
            className="btn-outline inline-flex items-center"
          >
            আমাদের Facebook Page Follow করুন <Facebook size={20} className="ml-3" />
          </a>
        </div>
      </section>
    </div>
  );
};

const Shop = ({ products }: { products: Product[] }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-10">
          <div>
            <h3 className="font-cinzel text-royal-gold text-lg font-bold mb-6 flex items-center">
              <Filter size={18} className="mr-2" /> FILTERS
            </h3>
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "block w-full text-left text-sm uppercase tracking-widest transition-colors",
                  !selectedCategory ? "text-royal-gold font-bold" : "text-main-text/40 hover:text-main-text"
                )}
              >
                All Products
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "block w-full text-left text-sm uppercase tracking-widest transition-colors",
                    selectedCategory === cat ? "text-royal-gold font-bold" : "text-main-text/40 hover:text-main-text"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-cinzel text-royal-gold uppercase tracking-widest">
              {selectedCategory || "All Products"}
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{filteredProducts.length} Products Found</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetail = ({ products, addToCart }: { products: Product[], addToCart: (p: CartItem) => void }) => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-32 text-center">
        <h1 className="text-4xl font-cinzel text-royal-gold">PRODUCT NOT FOUND</h1>
        <Link to="/shop" className="btn-gold inline-block mt-8">Back to Shop</Link>
      </div>
    );
  }

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [whatsappNumber, setWhatsappNumber] = useState('8801856078978');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-dark-card border border-[var(--border-color)] overflow-hidden">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={cn(
                  "w-24 aspect-[4/5] bg-dark-card border transition-all flex-shrink-0",
                  activeImage === img ? "border-royal-gold" : "border-[var(--border-color)]"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <p className="text-steel-blue font-bold uppercase tracking-[0.3em] text-xs mb-2">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-cinzel text-main-text mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4">
              {product.sale_price ? (
                <>
                  <span className="text-3xl font-bold text-royal-gold">{formatPrice(product.sale_price)}</span>
                  <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-royal-gold">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>

          <p className="text-main-text/60 leading-relaxed">{product.description}</p>

          {/* Size Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-widest">Select Size</h4>
              <Link to="/size-guide" className="text-royal-gold text-xs underline uppercase tracking-widest">Size Chart</Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center border text-sm font-bold transition-all",
                    selectedSize === size ? "border-royal-gold bg-royal-gold text-deep-black" : "border-[var(--border-color)] text-main-text hover:border-royal-gold"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest">Select Color</h4>
            <div className="flex flex-wrap gap-3">
              {product.colors.map(color => (
                <button 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all",
                    selectedColor === color ? "border-royal-gold bg-royal-gold text-deep-black" : "border-[var(--border-color)] text-main-text hover:border-royal-gold"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-6 pt-6 border-t border-[var(--border-color)]">
            <div className="flex items-center space-x-6">
              <div className="flex items-center border border-[var(--border-color)]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-royal-gold"><Minus size={16} /></button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-royal-gold"><Plus size={16} /></button>
              </div>
              <p className="text-crimson-red text-xs font-bold uppercase tracking-widest">মাত্র ৫টি বাকি!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => addToCart({ ...product, selectedSize, selectedColor, quantity })}
                className="btn-gold flex items-center justify-center"
              >
                <ShoppingBag size={20} className="mr-3" /> Add to Cart
              </button>
              <button className="btn-outline">Buy Now</button>
            </div>

            <a 
              href={`https://wa.me/${whatsappNumber}?text=আমি এই প্রোডাক্টটি অর্ডার করতে চাই: ${product.name} (Size: ${selectedSize}, Color: ${selectedColor})`}
              target="_blank"
              className="w-full flex items-center justify-center py-4 border border-[#25D366] text-[#25D366] font-bold uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all"
            >
              <MessageCircle size={20} className="mr-3" /> WhatsApp-এ অর্ডার করুন
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = ({ cart, updateQuantity, removeItem }: { cart: CartItem[], updateQuantity: (id: number, q: number) => void, removeItem: (id: number) => void }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.sale_price || item.price) * item.quantity, 0);
  const deliveryCharge = subtotal >= 500 ? 0 : 60;
  const total = subtotal + deliveryCharge;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-32 text-center space-y-8">
        <ShoppingBag size={80} className="mx-auto text-gray-700" />
        <h1 className="text-4xl font-cinzel text-royal-gold">YOUR CART IS EMPTY</h1>
        <Link to="/shop" className="btn-gold inline-block">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-cinzel text-royal-gold mb-12">SHOPPING CART</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item, i) => (
            <div key={i} className="flex items-center space-x-6 bg-dark-card p-4 border border-[var(--border-color)]">
              <div className="w-24 aspect-[4/5] bg-main-bg flex-shrink-0">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-main-text">{item.name}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-[var(--border-color)]">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 hover:text-royal-gold"><Minus size={12} /></button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-royal-gold"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-crimson-red hover:text-royal-gold transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-royal-gold">{formatPrice((item.sale_price || item.price) * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-8">
          <div className="bg-dark-card p-8 border border-[var(--border-color)] space-y-6">
            <h3 className="font-cinzel text-royal-gold text-xl font-bold border-b border-[var(--border-color)] pb-4">ORDER SUMMARY</h3>
            <div className="space-y-4 text-sm uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-main-text">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Charge</span>
                <span className="text-main-text">{deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-[var(--border-color)] pt-4">
                <span className="text-royal-gold">Total</span>
                <span className="text-royal-gold">{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-gold w-full block text-center">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = ({ cart }: { cart: CartItem[] }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    division: 'Dhaka',
    district: '',
    address: '',
    note: ''
  });
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.sale_price || item.price) * item.quantity, 0);
  const deliveryCharge = subtotal >= 500 ? 0 : 60;
  const total = subtotal + deliveryCharge;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, items: cart, subtotal, delivery_charge: deliveryCharge, total })
    });
    const data = await response.json();
    if (data.success) {
      setOrderId(data.order_id);
      setIsOrdered(true);
      // Clear cart logic would go here
    }
  };

  if (isOrdered) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center space-y-8">
        <CheckCircle size={80} className="mx-auto text-royal-gold" />
        <h1 className="text-4xl font-cinzel text-royal-gold">ORDER PLACED SUCCESSFULLY!</h1>
        <p className="text-main-text/60">Order ID: <span className="text-main-text font-bold">{orderId}</span></p>
        <p className="bangla text-lg">আপনার অর্ডার কনফার্ম হয়েছে! ডেলিভারি ৩–৫ কার্যদিবসের মধ্যে পাবেন।</p>
        <div className="pt-8 space-y-4">
          <Link to="/shop" className="btn-gold w-full block">Continue Shopping</Link>
          <a href="https://www.facebook.com/profile.php?id=61582254746458" target="_blank" className="btn-outline w-full block">Follow us on Facebook</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-cinzel text-royal-gold mb-12">CHECKOUT</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="space-y-8">
          <h3 className="font-cinzel text-royal-gold text-xl font-bold">SHIPPING INFORMATION</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name *</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-dark-card border border-[var(--border-color)] p-4 text-main-text focus:border-royal-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number *</label>
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full bg-dark-card border border-[var(--border-color)] p-4 text-main-text focus:border-royal-gold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Division *</label>
              <select value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} className="w-full bg-dark-card border border-[var(--border-color)] p-4 text-main-text focus:border-royal-gold outline-none">
                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">District *</label>
              <input required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} type="text" className="w-full bg-dark-card border border-[var(--border-color)] p-4 text-main-text focus:border-royal-gold outline-none" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Address *</label>
              <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} className="w-full bg-dark-card border border-[var(--border-color)] p-4 text-main-text focus:border-royal-gold outline-none" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Order Note (Optional)</label>
              <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} rows={2} className="w-full bg-dark-card border border-[var(--border-color)] p-4 text-main-text focus:border-royal-gold outline-none" />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-8">
          <div className="bg-dark-card p-8 border border-[var(--border-color)] space-y-6">
            <h3 className="font-cinzel text-royal-gold text-xl font-bold border-b border-[var(--border-color)] pb-4">YOUR ORDER</h3>
            <div className="space-y-4">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.name} x {item.quantity}</span>
                  <span className="text-main-text">{formatPrice((item.sale_price || item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4 text-sm uppercase tracking-widest border-t border-[var(--border-color)] pt-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-main-text">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Charge</span>
                <span className="text-main-text">{deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-[var(--border-color)] pt-4">
                <span className="text-royal-gold">Total</span>
                <span className="text-royal-gold">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="bg-main-bg/50 p-4 border border-[var(--border-color)]">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Payment Method</p>
              <p className="text-sm font-bold text-royal-gold">Cash on Delivery (COD)</p>
            </div>
            <button type="submit" className="btn-gold w-full">Place Order</button>
          </div>
        </div>
      </form>
    </div>
  );
};

const CategoryPage = ({ products }: { products: Product[] }) => {
  const { name } = useParams();
  const categoryName = name?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const filteredProducts = products.filter(p => p.category.toLowerCase().replace(/ /g, '-') === name);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-cinzel text-royal-gold mb-12 uppercase tracking-widest">{categoryName}</h1>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-gray-500 uppercase tracking-widest">No products found in this category.</p>
          <Link to="/shop" className="btn-gold inline-block mt-8">Back to Shop</Link>
        </div>
      )}
    </div>
  );
};

const StaticPage = ({ title, content }: { title: string, content: string }) => (
  <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 space-y-8">
    <h1 className="text-4xl font-cinzel text-royal-gold uppercase tracking-widest">{title}</h1>
    <div className="prose prose-invert max-w-none text-main-text/60 leading-relaxed">
      {content.split('\n').map((p, i) => <p key={i} className="mb-4">{p}</p>)}
    </div>
  </div>
);

const AdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/products'),
        fetch('/api/settings')
      ]);
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      const settingsData = await settingsRes.json();
      setOrders(ordersData);
      setProducts(productsData);
      setSettings(settingsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const method = editingProduct.id ? 'PUT' : 'POST';
    const url = editingProduct.id ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingProduct,
          slug: editingProduct.slug || editingProduct.name?.toLowerCase().replace(/ /g, '-'),
          sku: editingProduct.sku || `TF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          images: editingProduct.images || ["https://picsum.photos/seed/new/800/1000"],
          colors: editingProduct.colors || ["Black"],
          sizes: editingProduct.sizes || ["S", "M", "L", "XL", "XXL"],
          tags: editingProduct.tags || ["new-arrival"],
          status: editingProduct.status || "Active"
        })
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) alert('Settings updated successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="py-32 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h1 className="text-4xl font-cinzel text-royal-gold">ADMIN DASHBOARD</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 border transition-all",
              activeTab === 'orders' ? "border-royal-gold bg-royal-gold text-deep-black" : "border-[var(--border-color)] text-main-text hover:border-royal-gold"
            )}
          >
            <ListOrdered size={18} /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 border transition-all",
              activeTab === 'products' ? "border-royal-gold bg-royal-gold text-deep-black" : "border-[var(--border-color)] text-main-text hover:border-royal-gold"
            )}
          >
            <Package size={18} /> Products
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 border transition-all",
              activeTab === 'settings' ? "border-royal-gold bg-royal-gold text-deep-black" : "border-[var(--border-color)] text-main-text hover:border-royal-gold"
            )}
          >
            <LayoutDashboard size={18} /> Settings
          </button>
          <button onClick={onLogout} className="flex items-center gap-2 px-6 py-2 border border-crimson-red text-crimson-red hover:bg-crimson-red hover:text-white transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="bg-dark-card border border-[var(--border-color)] p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><ListOrdered /> Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--border-color)] text-gray-500 uppercase tracking-widest">
                <tr>
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Total</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-main-text/5 transition-colors">
                    <td className="py-4 font-bold text-royal-gold">{order.order_id}</td>
                    <td className="py-4">{order.customer_name}<br/><span className="text-xs text-gray-500">{order.phone}</span></td>
                    <td className="py-4">{formatPrice(order.total)}</td>
                    <td className="py-4">
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-bold uppercase",
                        order.status === 'Pending' ? "bg-steel-blue/20 text-steel-blue" : "bg-green-500/20 text-green-500"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'products' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2"><Package /> Product Management</h3>
            <button 
              onClick={() => setEditingProduct({ name: '', price: 0, category: CATEGORIES[0], stock_count: 0 })}
              className="btn-gold flex items-center gap-2"
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>

          <div className="bg-dark-card border border-[var(--border-color)] p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--border-color)] text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="pb-4">Product</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">Stock</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-main-text/5 transition-colors">
                      <td className="py-4 flex items-center gap-4">
                        <img src={product.images[0]} alt="" className="w-10 h-10 object-cover" />
                        <div>
                          <p className="font-bold">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sku}</p>
                        </div>
                      </td>
                      <td className="py-4">{product.category}</td>
                      <td className="py-4">
                        {product.sale_price ? (
                          <div className="flex flex-col">
                            <span className="text-royal-gold font-bold">{formatPrice(product.sale_price)}</span>
                            <span className="text-xs line-through text-gray-500">{formatPrice(product.price)}</span>
                          </div>
                        ) : (
                          <span className="font-bold">{formatPrice(product.price)}</span>
                        )}
                      </td>
                      <td className="py-4">{product.stock_count}</td>
                      <td className="py-4">
                        <span className={cn(
                          "px-2 py-1 text-[10px] font-bold uppercase",
                          product.status === 'Active' ? "bg-green-500/20 text-green-500" : "bg-crimson-red/20 text-crimson-red"
                        )}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingProduct(product)} className="p-2 hover:text-royal-gold transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:text-crimson-red transition-colors"><Trash size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl bg-dark-card border border-[var(--border-color)] p-8">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2"><LayoutDashboard /> Website Settings</h3>
          <form onSubmit={handleSaveSettings} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold uppercase tracking-widest text-gray-500">Announcement Bar</label>
                <button 
                  type="button"
                  onClick={() => setSettings({...settings, announcement_enabled: settings.announcement_enabled === 'true' ? 'false' : 'true'})}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    settings.announcement_enabled === 'true' ? "bg-royal-gold" : "bg-gray-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    settings.announcement_enabled === 'true' ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Announcement Text</label>
                <textarea 
                  rows={3}
                  value={settings.announcement_text || ''}
                  onChange={e => setSettings({...settings, announcement_text: e.target.value})}
                  className="w-full bg-main-bg border border-[var(--border-color)] p-4 text-main-text focus:border-royal-gold outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">WhatsApp Number (e.g., 8801856078978)</label>
                <input 
                  value={settings.whatsapp_number || ''}
                  onChange={e => setSettings({...settings, whatsapp_number: e.target.value})}
                  className="w-full bg-main-bg border border-[var(--border-color)] p-4 text-main-text focus:border-royal-gold outline-none"
                />
              </div>
            </div>
            <div className="space-y-6 pt-6 border-t border-[var(--border-color)]">
              <h4 className="text-sm font-bold uppercase tracking-widest text-royal-gold">Trust Strip Features</h4>
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="bg-main-bg/50 p-6 border border-[var(--border-color)] space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Feature {num}</label>
                    <button 
                      type="button"
                      onClick={() => setSettings({...settings, [`feature${num}_enabled`]: settings[`feature${num}_enabled`] === 'true' ? 'false' : 'true'})}
                      className={cn(
                        "w-10 h-5 rounded-full transition-colors relative",
                        settings[`feature${num}_enabled`] === 'true' ? "bg-royal-gold" : "bg-gray-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                        settings[`feature${num}_enabled`] === 'true' ? "left-5.5" : "left-0.5"
                      )} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Title</label>
                      <input 
                        value={settings[`feature${num}_title`] || ''}
                        onChange={e => setSettings({...settings, [`feature${num}_title`]: e.target.value})}
                        className="w-full bg-main-bg border border-[var(--border-color)] p-2 text-sm text-main-text focus:border-royal-gold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Description</label>
                      <input 
                        value={settings[`feature${num}_desc`] || ''}
                        onChange={e => setSettings({...settings, [`feature${num}_desc`]: e.target.value})}
                        className="w-full bg-main-bg border border-[var(--border-color)] p-2 text-sm text-main-text focus:border-royal-gold outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className="btn-gold w-full">Save Settings</button>
          </form>
        </div>
      )}

      {/* Product Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-dark-card border border-[var(--border-color)] p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-cinzel text-royal-gold">{editingProduct.id ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h3>
                <button onClick={() => setEditingProduct(null)} className="hover:text-royal-gold"><X /></button>
              </div>
              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Product Name</label>
                  <input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Category</label>
                  <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Regular Price</label>
                  <input required type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Sale Price (Optional)</label>
                  <input type="number" value={editingProduct.sale_price || ''} onChange={e => setEditingProduct({...editingProduct, sale_price: e.target.value ? Number(e.target.value) : null})} className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Stock Count</label>
                  <input required type="number" value={editingProduct.stock_count} onChange={e => setEditingProduct({...editingProduct, stock_count: Number(e.target.value)})} className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Status</label>
                  <select value={editingProduct.status} onChange={e => setEditingProduct({...editingProduct, status: e.target.value})} className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Image URL</label>
                  <input required value={editingProduct.images?.[0]} onChange={e => setEditingProduct({...editingProduct, images: [e.target.value]})} className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none" placeholder="https://example.com/image.jpg" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Fabric Info</label>
                  <input value={editingProduct.fabric_info} onChange={e => setEditingProduct({...editingProduct, fabric_info: e.target.value})} className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none" placeholder="e.g. 100% Cotton, 180 GSM" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
                  <textarea rows={3} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tags (Comma separated)</label>
                  <input 
                    value={editingProduct.tags?.join(', ')} 
                    onChange={e => setEditingProduct({...editingProduct, tags: e.target.value.split(',').map(t => t.trim())})} 
                    className="w-full bg-main-bg border border-[var(--border-color)] p-3 text-main-text focus:border-royal-gold outline-none" 
                    placeholder="e.g. new-arrival, best-seller"
                  />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="btn-gold w-full">Save Product</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, login, logout } = useAuth();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
    
    const savedCart = localStorage.getItem('tf_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('tf_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (id: number, q: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-main-bg">
        <div className="w-12 h-12 border-4 border-royal-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/shop" element={<Shop products={products} />} />
            <Route path="/product/:slug" element={<ProductDetail products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} />} />
            <Route path="/checkout" element={<Checkout cart={cart} />} />
            <Route path="/category/:name" element={<CategoryPage products={products} />} />
            <Route path="/about" element={<StaticPage title="About Us" content="Target Fashion is a premium clothing brand based in Bangladesh. We specialize in high-quality T-shirts crafted for the streets of Bangladesh. Our mission is to provide stylish, comfortable, and durable apparel that reflects the vibrant culture of our country." />} />
            <Route path="/size-guide" element={<StaticPage title="Size Guide" content="Our T-shirts are available in S, M, L, XL, and XXL sizes. Please refer to the measurements below to find your perfect fit.\nS: Chest 38, Length 27\nM: Chest 40, Length 28\nL: Chest 42, Length 29\nXL: Chest 44, Length 30\nXXL: Chest 46, Length 31" />} />
            <Route path="/shipping" element={<StaticPage title="Shipping Policy" content="We deliver all over Bangladesh. Delivery charges are as follows:\nDhaka City: ৳60 (1-2 days)\nOutside Dhaka: ৳100-120 (3-5 days)\nFree delivery on orders over ৳500." />} />
            <Route path="/returns" element={<StaticPage title="Return & Exchange" content="We offer a 3-4 day exchange policy for unused and unwashed items with original packaging. Please contact us via Facebook or WhatsApp with your order ID to initiate an exchange." />} />
            <Route path="/faq" element={<StaticPage title="FAQ" content="Q: How do I order?\nA: You can order directly from our website or via WhatsApp.\nQ: Do you have Cash on Delivery?\nA: Yes, we provide Cash on Delivery all over Bangladesh." />} />
            <Route path="/contact" element={<StaticPage title="Contact Us" content="Email: info@targetfashion.com\nPhone: +880 1XXX XXXXXX\nFacebook: Target Fashion\nWhatsApp: +880 1XXX XXXXXX" />} />
            <Route path="/new-arrivals" element={<CategoryPage products={products.filter(p => p.tags.includes('new-arrival'))} />} />
            <Route path="/sale" element={<CategoryPage products={products.filter(p => p.sale_price !== null)} />} />
            <Route path="/admin/login" element={<AdminLogin onLogin={login} />} />
            <Route path="/admin" element={isAdmin ? <AdminPanel onLogout={logout} /> : <AdminLogin onLogin={login} />} />
            <Route path="*" element={<div className="py-32 text-center font-cinzel text-royal-gold text-4xl">PAGE UNDER CONSTRUCTION</div>} />
          </Routes>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}
