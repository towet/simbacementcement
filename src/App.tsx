import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import type { Product, CartItem } from './types';
import { allProducts } from './data/products';
import Carousel from './components/Carousel';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProducts = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const handleRequestOffer = (product: Product) => {
    const message = `Hi, I'm interested in ${product.name} priced at KSh ${product.price}. Could you provide more information?`;
    window.open(`https://wa.me/254762458700?text=${encodeURIComponent(message)}`);
  };

  const handleRequestOrder = () => {
    const message = cartItems
      .map(item => `${item.quantity}x ${item.product.name} @ KSh ${item.product.price}`)
      .join('\n');
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const fullMessage = `New Order:\n\n${message}\n\nTotal: KSh ${total}`;
    window.open(`https://wa.me/254762458700?text=${encodeURIComponent(fullMessage)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setShowCart(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Carousel />

        <div className="mt-8">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onRequestOffer={handleRequestOffer}
              />
            ))}
          </div>
        </div>

        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <button
                  onClick={() => setShowCart(false)}
                  className="float-right text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
                <Cart
                  items={cartItems}
                  onUpdateQuantity={(id, qty) => {
                    setCartItems(prev =>
                      prev.map(item =>
                        item.product.id === id
                          ? { ...item, quantity: qty }
                          : item
                      )
                    );
                  }}
                  onRemove={(id) => {
                    setCartItems(prev => prev.filter(item => item.product.id !== id));
                  }}
                  onRequestOrder={handleRequestOrder}
                />
              </div>
            </div>
          </div>
        )}

        <a
          href="https://wa.me/254762458700?text=I%20would%20like%20to%20inquire%20about%20your%20products"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </main>
    </div>
  );
}

export default App;