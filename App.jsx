import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, ShoppingBag, Moon, Sun, ChevronLeft, ChevronRight, 
  CreditCard, ShieldCheck, Truck, RefreshCw, HelpCircle, FileText, 
  Settings, Lock, Copy, Check, Plus, Trash2, Edit3, X, Eye, 
  ExternalLink, ArrowUp, DollarSign, RotateCcw, Image as ImageIcon, 
  MessageCircle, Save, Store, UserCheck, Heart, UserPlus, Info,
  QrCode, Download, CheckCircle2, Clock, Share2, Bell
} from 'lucide-react';

// Narutomaki Spiral Icon Component (🍥)
const PinkSwirlIcon = ({ size = 24, className = "" }) => (
  <span 
    style={{ fontSize: `${size}px`, lineHeight: 1 }} 
    role="img" 
    aria-label="Narutomaki"
    className={`inline-block select-none transform hover:rotate-45 transition-transform duration-300 ${className}`}
  >
    🍥
  </span>
);

// Currency Formatter
const formatVND = (price) => {
  if (typeof price === 'number') {
    return price.toLocaleString('vi-VN') + 'đ';
  }
  const num = parseInt(String(price).replace(/\D/g, ''), 10) || 0;
  return num.toLocaleString('vi-VN') + 'đ';
};

// Initial Data Sets
const INITIAL_PRODUCTS = [
  {
    id: 1358,
    name: '[KEONHO] Anbuli/ An Bất Lí 安不理 5cm',
    price: 214000,
    category: 'Outfit & Doll',
    image: 'https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=600&auto=format&fit=crop&q=80',
    tags: ['Pre-order'],
    tagColors: ['bg-amber-100 text-amber-800'],
    shopName: '無症狀嗜睡',
    description: 'chưa bao gồm ship nội địa chia đều, đã bao gồm 0,1kg cân ạ',
    size: '5cm - body sao đen',
    includes: '1 only doll, ... (giá trên là của đoàn 100, nếu đoàn thấp hơn tiền chênh lệch sẽ tặng thêm gift)',
    productionTime: '3-4 tháng',
    stock: 999,
    status: 'open',
    endDate: new Date(Date.now() + (6 * 86400000) + (5 * 3600000) + (49 * 60000) + 46000)
  },
  {
    id: 1248,
    name: '[CORTIS] Tag gập',
    price: 9000,
    category: 'Merch',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    tags: ['Pre-order'],
    tagColors: ['bg-amber-100 text-amber-800'],
    shopName: '愛地球 (xhs)',
    description: 'chưa bao gồm cân, nội địa chia đều ạ',
    size: '7cm',
    includes: '10c/ set',
    productionTime: '1 tháng',
    stock: 999,
    status: 'open',
    endDate: new Date(Date.now() + (2 * 86400000) + (5 * 3600000) + (49 * 60000) + 4000)
  },
  {
    id: 101,
    name: '[CORTIS] Photostrip vàng',
    price: 7500,
    category: 'Merch',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    tags: ['Pre-order', 'CORTIS'],
    tagColors: ['bg-amber-100 text-amber-800', 'bg-pink-100 text-pink-700'],
    shopName: '愛地球 (xhs)',
    description: 'Bao gồm card ảnh strip vàng phủ bóng',
    size: '15x5cm',
    includes: '1 strip',
    productionTime: '1 tháng',
    stock: 500,
    status: 'open',
    endDate: new Date(Date.now() + 864000000)
  },
  {
    id: 102,
    name: '[CORTIS] Gift mua lẻ - Sticker làm mặt xấu',
    price: 6000,
    category: 'Merch',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    tags: ['Pre-order', 'CORTIS'],
    tagColors: ['bg-amber-100 text-amber-800', 'bg-pink-100 text-pink-700'],
    shopName: '愛地球 (xhs)',
    description: 'Set sticker bóc dán làm mặt xấu vui nhộn',
    size: '10x10cm',
    includes: 'Set 5 sticker',
    productionTime: '15 ngày',
    stock: 0,
    status: 'closed',
    endDate: new Date(Date.now() - 10000)
  }
];

const INITIAL_SHOPS = [
  {
    id: 's1',
    name: '無症狀嗜睡',
    avatar: '🧸',
    openProducts: 1,
    totalProducts: 2,
    isFollowing: false
  },
  {
    id: 's2',
    name: '愛地球 (xhs)',
    avatar: '🐰',
    openProducts: 2,
    totalProducts: 3,
    isFollowing: true
  }
];

const INITIAL_INFO = {
  accountName: 'BUI THANH NHU Y',
  vpBankNo: '0395939035',
  vpBankQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VPBANK_0395939035_BUITHANHNHUY',
  vcbNo: '1012345678',
  vcbQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VCB_1012345678_BUITHANHNHUY',
  momoNo: '0395939035',
  momoQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MOMO_0395939035_BUITHANHNHUY',
  hotline: '0395 939 035',
  contactZalo: '0395939035',
  contactFacebook: 'fb.com/chunnorder.official',
  instagram: '@chunn_order',
  threads: '@chunn_order',
  email: 'chunnorder@gmail.com',
  warehouseAddress: 'TP. Hồ Chí Minh',
  branch: 'TP. Hồ Chí Minh'
};

const INITIAL_POLICIES = [
  { id: 1, title: 'Chính sách đặt hàng', iconType: 'order', items: ['Thanh toán trước 50-100% cho hàng order.', 'Không hỗ trợ hủy đơn khi xưởng đã nhận tiền.'] },
  { id: 2, title: 'Chính sách thanh toán', iconType: 'payment', items: ['Chuyển khoản theo đúng cú pháp STK và Tên chủ TK.', 'Kiểm tra kỹ thông tin trước khi chuyển.'] },
  { id: 3, title: 'Chính sách vận chuyển', iconType: 'shipping', items: ['Thời gian hàng về 5-15 ngày từ khi kho Trung nhận.', 'Phí ship nội địa VN tính theo đơn vị vận chuyển.'] },
  { id: 4, title: 'Chính sách đổi trả', iconType: 'return', items: ['Quay video unboxing đầy đủ 6 mặt hộp.', 'Hỗ trợ đổi trả lỗi nhà sản xuất trong 3 ngày.'] },
  { id: 5, title: 'Chính sách bồi thường', iconType: 'refund', items: ['Hàng thất lạc được hoàn tiền cọc tương ứng.', 'Miễn trừ trách nhiệm nếu khách không có clip mở hàng.'] },
  { id: 6, title: 'Chính sách bảo mật', iconType: 'privacy', items: ['Tuyệt đối bảo mật SĐT và thông tin nhận hàng.', 'Chỉ sử dụng thông tin để giao nhận đơn.'] }
];

function PolicyCard({ policy, darkMode }) {
  const renderPolicyIcon = (type) => {
    switch (type) {
      case 'order': return <FileText size={18} className="text-blue-500" />;
      case 'payment': return <CreditCard size={18} className="text-emerald-500" />;
      case 'shipping': return <Truck size={18} className="text-amber-500" />;
      case 'return': return <RotateCcw size={18} className="text-purple-500" />;
      case 'refund': return <DollarSign size={18} className="text-rose-500" />;
      case 'privacy': return <Lock size={18} className="text-cyan-500" />;
      default: return <ShieldCheck size={18} className="text-pink-500" />;
    }
  };

  return (
    <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-pink-100'} space-y-3 shadow-2xs`}>
      <h3 className="font-bold text-sm text-pink-500 flex items-center gap-2">
        {renderPolicyIcon(policy.iconType)}
        <span>{policy.title}</span>
      </h3>
      <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-disc pl-4">
        {policy.items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [info, setInfo] = useState(INITIAL_INFO);
  const [policies, setPolicies] = useState(INITIAL_POLICIES);

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shopSubTab, setShopSubTab] = useState('open'); // 'all', 'open', 'closed'

  // Cart & Order
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [qrModal, setQrModal] = useState(null);
  const [copiedText, setCopiedText] = useState('');

  // Admin Security & State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSubTab, setAdminSubTab] = useState('products');

  // Admin Product Form State
  const [editingProductId, setEditingProductId] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    price: '',
    category: 'Outfit & Doll',
    image: '',
    tags: 'Pre-order',
    shopName: '無症狀嗜睡',
    description: 'chưa bao gồm ship nội địa chia đều ạ',
    size: '5cm',
    includes: '1 set',
    productionTime: '3-4 tháng',
    stock: 999,
    daysLeft: 2,
    hoursLeft: 5,
    minutesLeft: 49,
    secondsLeft: 30
  });

  // Countdown timer hook
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!selectedProduct?.endDate) return;
    const interval = setInterval(() => {
      const diff = new Date(selectedProduct.endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedProduct]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, qty }];
    });
    setShowCart(true);
  };

  const openShopDetail = (shopName) => {
    const foundShop = shops.find(s => s.name === shopName) || {
      id: 'shop_' + Date.now(),
      name: shopName,
      avatar: '🛍️',
      openProducts: products.filter(p => p.shopName === shopName && p.status !== 'closed').length,
      totalProducts: products.filter(p => p.shopName === shopName).length,
      isFollowing: false
    };
    setSelectedShop(foundShop);
    setSelectedProduct(null);
    setShopSubTab('open');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === 'chunn123') {
      setIsAdminLoggedIn(true);
      setAdminError('');
    } else {
      setAdminError('Mật khẩu quản trị không đúng!');
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) return;

    const tagsArray = prodForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    const newProd = {
      id: editingProductId || Date.now(),
      name: prodForm.name,
      price: parseInt(prodForm.price) || 0,
      category: prodForm.category,
      image: prodForm.image || 'https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=600&auto=format&fit=crop&q=80',
      tags: tagsArray.length > 0 ? tagsArray : ['Pre-order'],
      tagColors: ['bg-amber-100 text-amber-800'],
      shopName: prodForm.shopName,
      description: prodForm.description,
      size: prodForm.size,
      includes: prodForm.includes,
      productionTime: prodForm.productionTime,
      stock: parseInt(prodForm.stock) || 999,
      status: 'open',
      endDate: new Date(Date.now() + 
        (parseInt(prodForm.daysLeft) || 0) * 86400000 + 
        (parseInt(prodForm.hoursLeft) || 0) * 3600000 + 
        (parseInt(prodForm.minutesLeft) || 0) * 60000 + 
        (parseInt(prodForm.secondsLeft) || 0) * 1000
      )
    };

    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? newProd : p));
    } else {
      setProducts([newProd, ...products]);
    }

    setEditingProductId(null);
    setProdForm({
      name: '', price: '', category: 'Outfit & Doll', image: '',
      tags: 'Pre-order', shopName: '無症狀嗜睡', description: '', size: '',
      includes: '', productionTime: '', stock: 999, daysLeft: 2, hoursLeft: 5, minutesLeft: 49, secondsLeft: 30
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-[#fffdf8] text-amber-950'} font-sans`}>
      
      {/* Navigation Header */}
      <header className={`sticky top-0 z-40 border-b ${darkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-[#fffdf8]/90 border-pink-100'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div 
            onClick={() => { setActiveTab('products'); setSelectedProduct(null); setSelectedShop(null); }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <PinkSwirlIcon size={30} />
            <span className="text-xl font-black text-pink-500 tracking-tight lowercase">chunn order</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {[
              { id: 'products', label: 'Sản phẩm' },
              { id: 'shops', label: 'Shops' },
              { id: 'policy', label: 'Chính sách' },
              { id: 'info', label: 'Thông tin' },
              { id: 'admin', label: 'Quản trị' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedProduct(null); setSelectedShop(null); }}
                className={`hover:text-pink-500 transition-colors ${activeTab === tab.id ? 'text-pink-500 font-bold' : 'text-zinc-600 dark:text-zinc-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-pink-50 dark:hover:bg-zinc-800">
              {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            <button onClick={() => setShowCart(true)} className="relative p-2 rounded-full hover:bg-pink-50 dark:hover:bg-zinc-800">
              <ShoppingBag size={22} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Submenu */}
        <div className="md:hidden flex overflow-x-auto px-4 py-2 space-x-3 border-t border-pink-100 dark:border-zinc-800 text-xs font-semibold">
          <button onClick={() => { setActiveTab('products'); setSelectedProduct(null); setSelectedShop(null); }} className={`px-3 py-1 rounded-full ${activeTab === 'products' ? 'bg-pink-100 text-pink-600' : ''}`}>Sản phẩm</button>
          <button onClick={() => { setActiveTab('shops'); setSelectedProduct(null); setSelectedShop(null); }} className={`px-3 py-1 rounded-full ${activeTab === 'shops' ? 'bg-pink-100 text-pink-600' : ''}`}>Shops</button>
          <button onClick={() => { setActiveTab('policy'); setSelectedProduct(null); setSelectedShop(null); }} className={`px-3 py-1 rounded-full ${activeTab === 'policy' ? 'bg-pink-100 text-pink-600' : ''}`}>Chính sách</button>
          <button onClick={() => { setActiveTab('info'); setSelectedProduct(null); setSelectedShop(null); }} className={`px-3 py-1 rounded-full ${activeTab === 'info' ? 'bg-pink-100 text-pink-600' : ''}`}>Thông tin</button>
          <button onClick={() => { setActiveTab('admin'); setSelectedProduct(null); setSelectedShop(null); }} className={`px-3 py-1 rounded-full ${activeTab === 'admin' ? 'bg-pink-500 text-white' : ''}`}>Quản trị</button>
        </div>
      </header>

      {/* Dynamic Announcement Pink Banner */}
      <div className="bg-pink-200/80 dark:bg-pink-950/60 text-pink-900 dark:text-pink-200 text-xs py-2 overflow-hidden border-b border-pink-300/40">
        <div className="whitespace-nowrap animate-marquee flex space-x-12">
          <span className="flex items-center gap-1.5">📦 Hàng order về từ 5-15 ngày sau khi kho Trung nhận được hàng 📦</span>
          <span className="flex items-center gap-1.5">🍥 Hàng pre-order thời gian sản xuất lâu, cân nhắc kỹ trước khi đặt hàng 🍥</span>
          <span className="flex items-center gap-1.5">✈️ chunn order - Chuyên săn goods Kpop, Anime, Merch chuẩn xưởng 🌸</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* PRODUCT DETAIL VIEW (When Product Clicked) */}
        {selectedProduct ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Back Row */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border flex items-center justify-center hover:bg-pink-50 shadow-2xs"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xs sm:text-sm font-semibold truncate max-w-md px-2">{selectedProduct.name}</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full bg-white dark:bg-zinc-800 border hover:bg-pink-50"><Share2 size={16} /></button>
                <button onClick={() => setShowCart(true)} className="p-2 rounded-full bg-white dark:bg-zinc-800 border hover:bg-pink-50"><ShoppingBag size={16} /></button>
              </div>
            </div>

            {/* Product Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Preview Side */}
              <div className="space-y-3">
                <div className="aspect-square rounded-3xl overflow-hidden bg-pink-50 border relative shadow-xs">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">1/1</span>
                </div>
              </div>

              {/* Information Side */}
              <div className="space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs mb-2">Pre-order</span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{selectedProduct.name}</h1>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-2xl font-black text-pink-500">{formatVND(selectedProduct.price)}</span>
                    <span className="text-xs text-zinc-400">*Chưa full phí</span>
                  </div>

                  {/* Shop Tag */}
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="text-xs text-zinc-500">Shop: <strong className="text-pink-600 hover:underline cursor-pointer" onClick={() => openShopDetail(selectedProduct.shopName)}>{selectedProduct.shopName}</strong></span>
                    <button onClick={() => openShopDetail(selectedProduct.shopName)} className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold">Theo dõi</button>
                  </div>
                </div>

                {/* Countdown Timer Block */}
                <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-zinc-800/80 border border-amber-200/60 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <Clock size={16} />
                    <span>Thời gian còn lại để order</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl shadow-2xs"><span className="text-lg font-black text-pink-500 block">{timeLeft.days}</span><span className="text-[10px] text-zinc-400">Ngày</span></div>
                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl shadow-2xs"><span className="text-lg font-black text-pink-500 block">{timeLeft.hours}</span><span className="text-[10px] text-zinc-400">Giờ</span></div>
                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl shadow-2xs"><span className="text-lg font-black text-pink-500 block">{timeLeft.minutes}</span><span className="text-[10px] text-zinc-400">Phút</span></div>
                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl shadow-2xs"><span className="text-lg font-black text-pink-500 block">{timeLeft.seconds}</span><span className="text-[10px] text-zinc-400">Giây</span></div>
                  </div>
                  <button className="w-full py-2 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold flex items-center justify-center space-x-1.5 border hover:bg-pink-50">
                    <Bell size={14} className="text-pink-500" />
                    <span>Thêm lời nhắc</span>
                  </button>
                </div>

                {/* Info Table */}
                <div className="border rounded-2xl overflow-hidden text-xs divide-y">
                  <div className="grid grid-cols-3 p-3 bg-zinc-50 dark:bg-zinc-800/50"><span className="font-bold text-zinc-400">Mô tả</span><span className="col-span-2">{selectedProduct.description}</span></div>
                  <div className="grid grid-cols-3 p-3"><span className="font-bold text-zinc-400">Kích thước</span><span className="col-span-2">{selectedProduct.size}</span></div>
                  <div className="grid grid-cols-3 p-3 bg-zinc-50 dark:bg-zinc-800/50"><span className="font-bold text-zinc-400">Bao gồm</span><span className="col-span-2">{selectedProduct.includes}</span></div>
                  <div className="grid grid-cols-3 p-3"><span className="font-bold text-zinc-400">Thời gian SX</span><span className="col-span-2">{selectedProduct.productionTime}</span></div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold">Số lượng <span className="text-[10px] text-zinc-400 font-normal">(Kho: {selectedProduct.stock} kiện)</span></span>
                  <div className="flex items-center space-x-3 border rounded-xl p-1 bg-white dark:bg-zinc-800">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-7 h-7 rounded-lg hover:bg-pink-100 font-bold">-</button>
                    <span className="text-xs font-bold w-6 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 rounded-lg hover:bg-pink-100 font-bold">+</button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => addToCart(selectedProduct, quantity)}
                    className="flex-1 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs shadow-2xs"
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button 
                    onClick={() => { addToCart(selectedProduct, quantity); setShowCart(true); }}
                    className="flex-1 py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-2xs"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Related Products from same Shop */}
            <div className="pt-8 space-y-4 border-t">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base">Sản phẩm liên quan cùng shop</h3>
                <button onClick={() => openShopDetail(selectedProduct.shopName)} className="text-xs text-pink-500 font-bold">Xem tất cả</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {products.filter(p => p.shopName === selectedProduct.shopName && p.id !== selectedProduct.id).slice(0, 6).map(rel => (
                  <div key={rel.id} onClick={() => setSelectedProduct(rel)} className="group cursor-pointer space-y-2">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-pink-50 border">
                      <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h4 className="text-xs font-semibold line-clamp-2">{rel.name}</h4>
                    <p className="text-xs font-bold text-pink-500">{formatVND(rel.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedShop ? (
          /* SHOP DEDICATED VIEW (When Shop Clicked) */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSelectedShop(null)} className="p-2 rounded-full border hover:bg-pink-50"><ChevronLeft size={18} /></button>
              <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl">{selectedShop.avatar}</div>
              <div>
                <h1 className="text-xl font-extrabold">{selectedShop.name}</h1>
                <p className="text-xs text-zinc-400">{products.filter(p => p.shopName === selectedShop.name).length} sản phẩm</p>
              </div>
            </div>

            {/* Filter Subtabs for Shop with product counts */}
            <div className="flex space-x-2 border-b pb-2">
              <button onClick={() => setShopSubTab('open')} className={`px-4 py-2 rounded-full text-xs font-bold ${shopSubTab === 'open' ? 'bg-pink-500 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                Đang mở ({products.filter(p => p.shopName === selectedShop.name && p.status !== 'closed').length})
              </button>
              <button onClick={() => setShopSubTab('all')} className={`px-4 py-2 rounded-full text-xs font-bold ${shopSubTab === 'all' ? 'bg-pink-500 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                Tất cả ({products.filter(p => p.shopName === selectedShop.name).length})
              </button>
              <button onClick={() => setShopSubTab('closed')} className={`px-4 py-2 rounded-full text-xs font-bold ${shopSubTab === 'closed' ? 'bg-pink-500 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                Đã đóng ({products.filter(p => p.shopName === selectedShop.name && p.status === 'closed').length})
              </button>
            </div>

            {/* Product Cards for Selected Shop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {products.filter(p => {
                if (p.shopName !== selectedShop.name) return false;
                if (shopSubTab === 'open') return p.status !== 'closed';
                if (shopSubTab === 'closed') return p.status === 'closed';
                return true;
              }).map(prod => (
                <div key={prod.id} onClick={() => setSelectedProduct(prod)} className="group cursor-pointer rounded-2xl border p-3 bg-white dark:bg-zinc-800 space-y-2">
                  <div className="aspect-square rounded-xl overflow-hidden bg-pink-50 relative">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    {prod.status === 'closed' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">Hết hạn</div>
                    )}
                  </div>
                  <h4 className="text-xs font-bold line-clamp-2">{prod.name}</h4>
                  <p className="text-xs font-black text-pink-500">{formatVND(prod.price)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* TAB 1: ALL PRODUCTS VIEW */
          activeTab === 'products' && (
            <div className="space-y-10">
              {/* Header Box */}
              <div className="text-center max-w-xl mx-auto space-y-3">
                <div className="inline-flex p-3 rounded-full bg-pink-100 dark:bg-zinc-800 text-pink-500">
                  <Search size={22} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Sản phẩm</h1>
                <p className="text-xs sm:text-sm text-zinc-500">Order sản phẩm K-pop, C-pop, Anime từ Taobao, PDD, Douyin, XHS, 1688</p>

                <div className="relative pt-2">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm, artist, danh mục..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-full text-xs sm:text-sm border outline-none bg-white dark:bg-zinc-800 shadow-2xs"
                  />
                </div>
              </div>

              {/* Product Sections with Horizontal Sliders */}
              {['Outfit & Doll', 'Merch'].map(category => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">{category}</h2>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded-full border hover:bg-pink-50"><ChevronLeft size={16} /></button>
                      <button className="p-1 rounded-full border hover:bg-pink-50"><ChevronRight size={16} /></button>
                      <span className="text-xs text-pink-500 font-bold ml-2 cursor-pointer">Xem thêm &gt;</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {products.filter(p => p.category === category && p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedProduct(item)}
                        className="group cursor-pointer rounded-2xl border p-3 bg-white dark:bg-zinc-800 hover:border-pink-300 transition-all space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-square rounded-xl overflow-hidden bg-pink-50 relative mb-2">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <h3 className="text-xs font-semibold line-clamp-2">{item.name}</h3>
                        </div>
                        <div className="pt-2 flex items-center justify-between border-t border-pink-50">
                          <span className="text-xs font-extrabold text-pink-500">{formatVND(item.price)}</span>
                          <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 font-bold text-xs flex items-center justify-center">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* TAB 2: SHOPS & MASTERS VIEW */}
        {activeTab === 'shops' && !selectedShop && !selectedProduct && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <div className="inline-flex p-3 rounded-full bg-pink-100 dark:bg-zinc-800 text-pink-500">
                <Store size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Shops & Masters</h1>
              <p className="text-xs sm:text-sm text-zinc-500">Khám phá và đặt sản phẩm theo từng shop / master</p>

              <div className="relative pt-2">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Tìm theo tên shop, master..." 
                  className="w-full pl-11 pr-4 py-2.5 rounded-full text-xs sm:text-sm border outline-none bg-white dark:bg-zinc-800 shadow-2xs"
                />
              </div>
            </div>

            {/* Shops List */}
            <div className="space-y-6 max-w-4xl mx-auto">
              {shops.map(shop => (
                <div key={shop.id} className="p-5 rounded-3xl border bg-white dark:bg-zinc-800 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-pink-100 text-xl flex items-center justify-center">{shop.avatar}</div>
                      <div>
                        <h3 className="font-extrabold text-base">{shop.name}</h3>
                        <p className="text-xs text-zinc-400">{shop.openProducts} sản phẩm đang mở</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3.5 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-bold">Theo dõi</button>
                      <button onClick={() => openShopDetail(shop.name)} className="text-xs text-pink-500 font-bold flex items-center">Xem shop &gt;</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {products.filter(p => p.shopName === shop.name).slice(0, 5).map(prod => (
                      <div key={prod.id} onClick={() => setSelectedProduct(prod)} className="group cursor-pointer">
                        <div className="aspect-square rounded-xl overflow-hidden bg-pink-50 mb-1">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <p className="text-[11px] font-bold line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-pink-500 font-bold">{formatVND(prod.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: POLICY VIEW */}
        {activeTab === 'policy' && !selectedProduct && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <div className="inline-flex p-3 rounded-full bg-pink-100 text-pink-500">
                <ShieldCheck size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Chính sách mua hàng</h1>
              <p className="text-xs sm:text-sm text-zinc-500">Các quy định và hướng dẫn order tại Chunn Order</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map(p => (
                <PolicyCard key={p.id} policy={p} darkMode={darkMode} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INFO & PAYMENT VIEW */}
        {activeTab === 'info' && !selectedProduct && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-pink-100 text-pink-500">
                <Info size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Thông tin & Thanh toán</h1>
            </div>

            <div className="p-6 rounded-3xl border bg-white dark:bg-zinc-800 space-y-4 shadow-2xs">
              <h3 className="font-bold text-sm text-pink-500 border-b pb-2">Thông tin Chuyển khoản</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center bg-pink-50/50 dark:bg-zinc-900/50 p-2.5 rounded-2xl">
                  <span>Tên chủ TK:</span>
                  <strong className="font-bold text-sm">{info.accountName}</strong>
                </div>

                {/* VPBank */}
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-2xl">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">VPBank</span>
                    <strong className="font-bold text-pink-500 text-sm">{info.vpBankNo}</strong>
                  </div>
                  <div className="flex space-x-1.5">
                    <button onClick={() => handleCopy(info.vpBankNo, 'VPBank')} className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border text-zinc-700 dark:text-zinc-200 text-[11px] font-bold hover:bg-pink-50 flex items-center gap-1">
                      {copiedText === 'VPBank' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      <span>{copiedText === 'VPBank' ? 'Đã sao chép' : 'Copy'}</span>
                    </button>
                    <button onClick={() => setQrModal({ bank: 'VPBank', stk: info.vpBankNo, qrUrl: info.vpBankQrUrl })} className="px-2.5 py-1 rounded-xl bg-pink-500 text-white text-[11px] font-bold hover:bg-pink-600">
                      Mã QR ∨
                    </button>
                  </div>
                </div>

                {/* Vietcombank */}
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-2xl">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Vietcombank</span>
                    <strong className="font-bold text-pink-500 text-sm">{info.vcbNo}</strong>
                  </div>
                  <div className="flex space-x-1.5">
                    <button onClick={() => handleCopy(info.vcbNo, 'Vietcombank')} className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border text-zinc-700 dark:text-zinc-200 text-[11px] font-bold hover:bg-pink-50 flex items-center gap-1">
                      {copiedText === 'Vietcombank' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      <span>{copiedText === 'Vietcombank' ? 'Đã sao chép' : 'Copy'}</span>
                    </button>
                    <button onClick={() => setQrModal({ bank: 'Vietcombank', stk: info.vcbNo, qrUrl: info.vcbQrUrl })} className="px-2.5 py-1 rounded-xl bg-pink-500 text-white text-[11px] font-bold hover:bg-pink-600">
                      Mã QR ∨
                    </button>
                  </div>
                </div>

                {/* MoMo */}
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-2xl">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Ví MoMo</span>
                    <strong className="font-bold text-pink-500 text-sm">{info.momoNo}</strong>
                  </div>
                  <div className="flex space-x-1.5">
                    <button onClick={() => handleCopy(info.momoNo, 'MoMo')} className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border text-zinc-700 dark:text-zinc-200 text-[11px] font-bold hover:bg-pink-50 flex items-center gap-1">
                      {copiedText === 'MoMo' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      <span>{copiedText === 'MoMo' ? 'Đã sao chép' : 'Copy'}</span>
                    </button>
                    <button onClick={() => setQrModal({ bank: 'Ví MoMo', stk: info.momoNo, qrUrl: info.momoQrUrl })} className="px-2.5 py-1 rounded-xl bg-pink-500 text-white text-[11px] font-bold hover:bg-pink-600">
                      Mã QR ∨
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Social & Support Channels */}
            <div className="p-6 rounded-3xl border bg-white dark:bg-zinc-800 space-y-3 shadow-2xs text-xs">
              <h3 className="font-bold text-sm text-pink-500 border-b pb-2">Kênh Hỗ Trợ & Mạng Xã Hội</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a href={`https://zalo.me/${info.contactZalo || '0987654321'}`} target="_blank" rel="noreferrer" className="p-3 rounded-2xl border hover:border-pink-300 hover:bg-pink-50/50 flex items-center justify-between transition-colors">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Hotline / Zalo</span>
                    <strong className="font-bold text-zinc-800 dark:text-zinc-100">{info.contactZalo || '0987654321'}</strong>
                  </div>
                  <ExternalLink size={14} className="text-pink-500" />
                </a>

                <a href={info.contactFacebook ? (info.contactFacebook.startsWith('http') ? info.contactFacebook : `https://${info.contactFacebook}`) : 'https://facebook.com'} target="_blank" rel="noreferrer" className="p-3 rounded-2xl border hover:border-pink-300 hover:bg-pink-50/50 flex items-center justify-between transition-colors">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Facebook Fanpage</span>
                    <strong className="font-bold text-zinc-800 dark:text-zinc-100 truncate block max-w-[150px]">{info.contactFacebook || 'Facebook'}</strong>
                  </div>
                  <ExternalLink size={14} className="text-pink-500" />
                </a>

                <a href={info.instagram ? (info.instagram.startsWith('http') ? info.instagram : `https://instagram.com/${info.instagram.replace('@','')}`) : 'https://instagram.com'} target="_blank" rel="noreferrer" className="p-3 rounded-2xl border hover:border-pink-300 hover:bg-pink-50/50 flex items-center justify-between transition-colors">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Instagram</span>
                    <strong className="font-bold text-zinc-800 dark:text-zinc-100">{info.instagram || '@chunn_order'}</strong>
                  </div>
                  <ExternalLink size={14} className="text-pink-500" />
                </a>

                <a href={info.threads ? (info.threads.startsWith('http') ? info.threads : `https://threads.net/${info.threads.replace('@','')}`) : 'https://threads.net'} target="_blank" rel="noreferrer" className="p-3 rounded-2xl border hover:border-pink-300 hover:bg-pink-50/50 flex items-center justify-between transition-colors">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Threads</span>
                    <strong className="font-bold text-zinc-800 dark:text-zinc-100">{info.threads || '@chunn_order'}</strong>
                  </div>
                  <ExternalLink size={14} className="text-pink-500" />
                </a>

                <a href={`mailto:${info.email || 'chunnorder@gmail.com'}`} className="p-3 rounded-2xl border hover:border-pink-300 hover:bg-pink-50/50 flex items-center justify-between transition-colors">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Email hỗ trợ</span>
                    <strong className="font-bold text-zinc-800 dark:text-zinc-100 truncate block max-w-[150px]">{info.email || 'chunnorder@gmail.com'}</strong>
                  </div>
                  <ExternalLink size={14} className="text-pink-500" />
                </a>

                <div className="p-3 rounded-2xl border flex items-center justify-between">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Địa chỉ kho</span>
                    <strong className="font-bold text-zinc-800 dark:text-zinc-100">{info.branch || 'TP. Hồ Chí Minh'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} className="max-w-sm mx-auto p-6 rounded-3xl border bg-white dark:bg-zinc-800 text-center space-y-4 shadow-2xs">
                <Lock size={30} className="mx-auto text-pink-500" />
                <h2 className="font-bold text-base">Đăng nhập Quản trị</h2>
                <input 
                  type="password" 
                  placeholder="Nhập mật khẩu..." 
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border text-xs text-center outline-none"
                />
                {adminError && <p className="text-xs text-rose-500">{adminError}</p>}
                <button type="submit" className="w-full py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs">Xác nhận</button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <h1 className="font-extrabold text-lg flex items-center gap-2"><Settings size={20} className="text-pink-500" /> Bảng Quản Trị</h1>
                  <button onClick={() => setIsAdminLoggedIn(false)} className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold">Đăng xuất</button>
                </div>

                {/* Subtabs for Admin */}
                <div className="flex space-x-2 border-b pb-2 overflow-x-auto">
                  <button onClick={() => setAdminSubTab('products')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${adminSubTab === 'products' ? 'bg-pink-500 text-white' : 'bg-zinc-100 text-zinc-700'}`}>Sản phẩm ({products.length})</button>
                  <button onClick={() => setAdminSubTab('shops')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${adminSubTab === 'shops' ? 'bg-pink-500 text-white' : 'bg-zinc-100 text-zinc-700'}`}>Shops & Masters ({shops.length})</button>
                  <button onClick={() => setAdminSubTab('info')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${adminSubTab === 'info' ? 'bg-pink-500 text-white' : 'bg-zinc-100 text-zinc-700'}`}>Thông tin & QR</button>
                  <button onClick={() => setAdminSubTab('policies')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${adminSubTab === 'policies' ? 'bg-pink-500 text-white' : 'bg-zinc-100 text-zinc-700'}`}>Chính sách ({policies.length})</button>
                </div>

                {/* SUBTAB 1: MANAGING PRODUCTS */}
                {adminSubTab === 'products' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-pink-100'} space-y-4 h-fit`}>
                      <h2 className="font-extrabold text-sm border-b pb-2 text-pink-500">
                        {editingProductId ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
                      </h2>
                      <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold">Tên sản phẩm</label>
                          <input 
                            type="text" required placeholder="Tên sản phẩm..." value={prodForm.name}
                            onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                            className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="font-bold">Giá bán (VNĐ)</label>
                            <input 
                              type="number" required placeholder="214000" value={prodForm.price}
                              onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                              className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                            />
                          </div>
                          <div>
                            <label className="font-bold">Số lượng (Kho)</label>
                            <input 
                              type="number" placeholder="999" value={prodForm.stock}
                              onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                              className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                            />
                          </div>
                        </div>

                        {/* Order Countdown Settings */}
                        <div className="space-y-1 p-2.5 rounded-xl bg-amber-50 dark:bg-zinc-900/50 border border-amber-200/60">
                          <label className="font-bold text-amber-900 dark:text-amber-300 block">Thời gian còn lại để Order</label>
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            <div>
                              <span className="text-[10px] text-zinc-400">Ngày</span>
                              <input type="number" min="0" value={prodForm.daysLeft} onChange={e => setProdForm({...prodForm, daysLeft: e.target.value})} className="w-full text-center py-1 rounded-lg border text-xs bg-white dark:bg-zinc-800 font-bold" />
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400">Giờ</span>
                              <input type="number" min="0" max="23" value={prodForm.hoursLeft} onChange={e => setProdForm({...prodForm, hoursLeft: e.target.value})} className="w-full text-center py-1 rounded-lg border text-xs bg-white dark:bg-zinc-800 font-bold" />
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400">Phút</span>
                              <input type="number" min="0" max="59" value={prodForm.minutesLeft} onChange={e => setProdForm({...prodForm, minutesLeft: e.target.value})} className="w-full text-center py-1 rounded-lg border text-xs bg-white dark:bg-zinc-800 font-bold" />
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400">Giây</span>
                              <input type="number" min="0" max="59" value={prodForm.secondsLeft} onChange={e => setProdForm({...prodForm, secondsLeft: e.target.value})} className="w-full text-center py-1 rounded-lg border text-xs bg-white dark:bg-zinc-800 font-bold" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold">Danh mục</label>
                          <select 
                            value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                            className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                          >
                            <option value="Outfit & Doll">Outfit & Doll</option>
                            <option value="Merch">Merch</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold">URL Hình ảnh</label>
                          <input 
                            type="text" placeholder="https://..." value={prodForm.image}
                            onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                            className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold">Tên Shop</label>
                          <select 
                            value={prodForm.shopName} onChange={(e) => setProdForm({ ...prodForm, shopName: e.target.value })}
                            className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                          >
                            {shops.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold">Mô tả chi tiết</label>
                          <input type="text" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="font-bold">Kích thước</label>
                            <input type="text" value={prodForm.size} onChange={e => setProdForm({...prodForm, size: e.target.value})} className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`} />
                          </div>
                          <div>
                            <label className="font-bold">Thời gian SX</label>
                            <input type="text" value={prodForm.productionTime} onChange={e => setProdForm({...prodForm, productionTime: e.target.value})} className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`} />
                          </div>
                        </div>

                        <div className="pt-2 flex space-x-2">
                          <button type="submit" className="flex-1 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs transition-colors">
                            {editingProductId ? 'Lưu cập nhật' : 'Thêm mới'}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="lg:col-span-2 space-y-3">
                      {products.map(p => (
                        <div key={p.id} className="p-3 rounded-2xl border flex items-center justify-between space-x-3 bg-white dark:bg-zinc-800">
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                            <div className="truncate">
                              <h4 className="font-bold text-xs truncate">{p.name}</h4>
                              <p className="text-[11px] text-pink-500 font-semibold">{formatVND(p.price)} • Kho: {p.stock || 999} • <span className="text-zinc-400">{p.shopName}</span></p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button onClick={() => { 
                              setEditingProductId(p.id); 
                              setProdForm({ 
                                ...prodForm, 
                                name: p.name, 
                                price: p.price, 
                                stock: p.stock || 999,
                                shopName: p.shopName, 
                                image: p.image,
                                description: p.description || '',
                                size: p.size || '',
                                includes: p.includes || '',
                                productionTime: p.productionTime || ''
                              }); 
                            }} className="p-1.5 rounded-lg bg-pink-50 text-pink-600"><Edit3 size={14} /></button>
                            <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-1.5 rounded-lg bg-rose-50 text-rose-600"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: MANAGING SHOPS */}
                {adminSubTab === 'shops' && (
                  <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-pink-100'} space-y-4`}>
                    <h2 className="font-extrabold text-sm border-b pb-2 text-pink-500">Danh sách Shops & Masters</h2>
                    <div className="space-y-3">
                      {shops.map(s => (
                        <div key={s.id} className="p-4 rounded-2xl border flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{s.avatar}</span>
                            <div>
                              <h3 className="font-bold text-sm">{s.name}</h3>
                              <p className="text-xs text-zinc-400">{s.openProducts} sản phẩm đang mở</p>
                            </div>
                          </div>
                          <button onClick={() => setShops(shops.filter(x => x.id !== s.id))} className="p-1.5 rounded-lg bg-rose-50 text-rose-600"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB 3: MANAGING INFO & QR */}
                {adminSubTab === 'info' && (
                  <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-pink-100'} space-y-5 max-w-3xl mx-auto`}>
                    <h2 className="font-extrabold text-sm border-b pb-2 text-pink-500">Cập nhật Ngân hàng, Ví MoMo & Kênh Liên Hệ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-pink-600">Chủ tài khoản (Tên chung)</label>
                        <input 
                          type="text" 
                          value={info.accountName} 
                          onChange={(e) => setInfo({ ...info, accountName: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none font-bold ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>

                      {/* Bank 1: VPBank */}
                      <div className="space-y-1">
                        <label className="font-bold">Số tài khoản VPBank</label>
                        <input 
                          type="text" 
                          value={info.vpBankNo} 
                          onChange={(e) => setInfo({ ...info, vpBankNo: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold">URL Ảnh Mã QR VPBank</label>
                        <input 
                          type="text" 
                          value={info.vpBankQrUrl} 
                          onChange={(e) => setInfo({ ...info, vpBankQrUrl: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>

                      {/* Bank 2: Vietcombank */}
                      <div className="space-y-1">
                        <label className="font-bold">Số tài khoản Vietcombank</label>
                        <input 
                          type="text" 
                          value={info.vcbNo || ''} 
                          onChange={(e) => setInfo({ ...info, vcbNo: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold">URL Ảnh Mã QR Vietcombank</label>
                        <input 
                          type="text" 
                          value={info.vcbQrUrl || ''} 
                          onChange={(e) => setInfo({ ...info, vcbQrUrl: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>

                      {/* MoMo E-Wallet */}
                      <div className="space-y-1">
                        <label className="font-bold">Số điện thoại Ví MoMo</label>
                        <input 
                          type="text" 
                          value={info.momoNo} 
                          onChange={(e) => setInfo({ ...info, momoNo: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold">URL Ảnh Mã QR MoMo</label>
                        <input 
                          type="text" 
                          value={info.momoQrUrl || ''} 
                          onChange={(e) => setInfo({ ...info, momoQrUrl: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>

                      {/* Contact & Social Info */}
                      <div className="space-y-1">
                        <label className="font-bold">SĐT Hotline / Zalo</label>
                        <input 
                          type="text" 
                          value={info.hotline} 
                          onChange={(e) => setInfo({ ...info, hotline: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold">Trang Fanpage Facebook</label>
                        <input 
                          type="text" 
                          value={info.contactFacebook || ''} 
                          onChange={(e) => setInfo({ ...info, contactFacebook: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold">Trang Instagram</label>
                        <input 
                          type="text" 
                          value={info.instagram || ''} 
                          onChange={(e) => setInfo({ ...info, instagram: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold">Trang Threads</label>
                        <input 
                          type="text" 
                          value={info.threads || ''} 
                          onChange={(e) => setInfo({ ...info, threads: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold">Địa chỉ Email</label>
                        <input 
                          type="text" 
                          value={info.email} 
                          onChange={(e) => setInfo({ ...info, email: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold">Địa chỉ Kho</label>
                        <input 
                          type="text" 
                          value={info.warehouseAddress} 
                          onChange={(e) => setInfo({ ...info, warehouseAddress: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-pink-50/50 border-pink-200'}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 4: MANAGING POLICIES */}
                {adminSubTab === 'policies' && (
                  <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-pink-100'} space-y-4`}>
                    <h2 className="font-extrabold text-sm border-b pb-2 text-pink-500">Quản lý Chính sách</h2>
                    <div className="space-y-3">
                      {policies.map(p => (
                        <div key={p.id} className="p-3 rounded-2xl border space-y-1">
                          <h4 className="font-bold text-xs">{p.id}. {p.title}</h4>
                          <p className="text-[11px] text-zinc-400">{p.items.length} quy định</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="font-bold text-base flex items-center gap-2"><ShoppingBag size={20} className="text-pink-500" /> Giỏ hàng</h2>
                <button onClick={() => setShowCart(false)}><X size={20} /></button>
              </div>

              <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-xs text-zinc-400 py-8">Giỏ hàng trống</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-3 text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div><h4 className="font-bold line-clamp-1">{item.name}</h4><p className="text-pink-500 font-bold">{formatVND(item.price)} x {item.qty}</p></div>
                      </div>
                      <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-rose-500"><Trash2 size={16} /></button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between font-bold text-sm">
                  <span>Tổng tiền:</span>
                  <span className="text-pink-500">{formatVND(cart.reduce((a, b) => a + (b.price * b.qty), 0))}</span>
                </div>
                <button onClick={() => { alert('Đã tạo đơn thành công!'); setCart([]); setShowCart(false); }} className="w-full py-3 rounded-full bg-pink-500 text-white font-bold text-xs">Thanh toán ngay</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white dark:bg-zinc-800 p-6 text-center space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-pink-500">Mã QR {qrModal.bank}</h3>
              <button onClick={() => setQrModal(null)}><X size={18} /></button>
            </div>
            <img src={qrModal.qrUrl} alt="QR Code" className="w-48 h-48 mx-auto border rounded-2xl p-2 bg-white" />
            <p className="text-xs font-mono font-bold">STK: <span className="text-pink-500">{qrModal.stk}</span></p>
          </div>
        </div>
      )}

    </div>
  );
}
