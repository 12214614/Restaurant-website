import { useState, useEffect } from 'react';
import { Flame, ShoppingBag, Package, MessageCircle } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import Hero from './components/Hero';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Chatbot from './components/Chatbot';
import { Order } from './types/order';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsAdminLoggedIn(adminLoggedIn);

    if (window.location.pathname === '/admin') {
      setShowAdmin(true);
    }
  }, []);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order: Order) => {
    setCurrentOrder(order);
    setIsTrackingOpen(true);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
  };

  const totalItems = getTotalItems();

  if (showAdmin) {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <Flame className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900">Spicy Biryani</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Home</a>
              <a href="#menu" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Menu</a>
              <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Contact</a>
              <button
                onClick={() => setShowAdmin(true)}
                className="text-gray-700 hover:text-red-600 transition-colors font-medium"
              >
                Admin
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsTrackingOpen(true)}
                className="relative p-2.5 text-gray-700 hover:text-red-600 transition-colors"
                title="Track Order"
              >
                <Package className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700 transition-all transform hover:scale-105 font-medium shadow-lg flex items-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <Menu />
      <About />
      <Contact />
      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />
      <OrderTracking
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        order={currentOrder}
      />
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
      
      {/* Floating Chat Button */}
      {!isChatbotOpen && !showAdmin && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-full shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-110 z-40 flex items-center justify-center group"
          title="Chat with us"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
