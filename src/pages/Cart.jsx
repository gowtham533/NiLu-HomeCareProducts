// src/components/Cart.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Must match your backend server URL
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
});

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartTotal, updateQty, removeFromCart, clearCart } = useCart();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => { removeFromCart(id); setRemovingId(null); }, 300);
  };

  const deliveryFee = cartTotal >= 299 ? 0 : 49;
  const grandTotal  = cartTotal + deliveryFee;
  const isEmpty     = cartItems.length === 0;

  // Build image URL — handles both filename-only and full URL cases
  const getImageUrl = (image) => {
    if (!image) return "https://placehold.co/80?text=N";
    if (image.startsWith("http")) return image;
    return `${SERVER_URL}/uploads/${image}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 overflow-x-hidden">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[38vw] h-[38vw] rounded-full bg-violet-200/20 blur-[90px]" />
        <div className="absolute top-[40%] -right-16 w-[30vw] h-[30vw] rounded-full bg-emerald-200/25 blur-[80px]" />
      </div>

      <div className="relative z-10">
        <Header />

        {/* ── PAGE TITLE ── */}
        <section className="max-w-7xl mx-auto px-6 pt-6 pb-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-1">
              <Link to="/products" className="text-xs text-violet-500 font-bold hover:text-violet-700 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Your Cart</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {isEmpty
                    ? "Your cart is empty"
                    : `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in your cart`}
                </p>
              </div>
              {!isEmpty && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={clearCart}
                  className="text-xs text-rose-400 font-bold border border-rose-100 bg-rose-50 px-4 py-2 rounded-full hover:bg-rose-100 transition-colors"
                >
                  🗑 Clear All
                </motion.button>
              )}
            </div>
          </motion.div>
        </section>

        {/* ── EMPTY STATE ── */}
        {isEmpty && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center px-6"
          >
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              className="text-7xl mb-6"
            >🛒</motion.div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm max-w-xs mb-8">
              Looks like you haven't added anything yet. Explore our premium homecare range!
            </p>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(124,58,237,0.28)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/products")}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-violet-200"
            >
              Shop Now →
            </motion.button>
          </motion.div>
        )}

        {/* ── CART LAYOUT ── */}
        {!isEmpty && (
          <div className="max-w-7xl mx-auto px-6 pb-20 grid lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* ── LEFT: ITEMS ── */}
            <div className="space-y-4">

              {/* Free delivery progress bar */}
              {cartTotal < 299 ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-amber-700">
                      🚚 Add <span className="text-amber-900">₹{299 - cartTotal}</span> more for FREE delivery
                    </p>
                    <span className="text-xs text-amber-500 font-semibold">
                      {Math.round((cartTotal / 299) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((cartTotal / 299) * 100, 100)}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 flex items-center gap-3"
                >
                  <span className="text-xl">🎉</span>
                  <p className="text-xs font-bold text-emerald-700">You've unlocked FREE delivery!</p>
                </motion.div>
              )}

              {/* Item list */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Cart Items ({cartItems.length})
                  </p>
                </div>

                <AnimatePresence>
                  {cartItems.map((product, i) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={removingId === product._id
                        ? { opacity: 0, x: -30 }
                        : { opacity: 1, y: 0 }
                      }
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="flex gap-5 items-center px-6 py-5 border-b border-gray-50 last:border-0 hover:bg-violet-50/20 transition-colors group"
                    >
                      {/* Product image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.productName}
                          className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
                          onError={e => { e.target.src = "https://placehold.co/80?text=N"; }}
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-violet-600 to-emerald-500 rounded-full text-white text-[0.55rem] font-extrabold flex items-center justify-center shadow">
                          {product.qty || 1}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.6rem] font-extrabold uppercase tracking-widest text-violet-500 mb-0.5">
                          {product.category}
                        </p>
                        <h3 className="font-extrabold text-gray-800 text-sm leading-snug">
                          {product.productName}
                        </h3>
                        <p className="text-gray-400 text-[0.68rem] mt-0.5">{product.quantity}</p>
                        <p className="text-[0.65rem] text-gray-300 mt-1 line-clamp-1">{product.description}</p>
                      </div>

                      {/* Qty + price + remove */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <p className="font-extrabold text-gray-800 text-base">
                          ₹{(Number(product.price) * (product.qty || 1)).toLocaleString()}
                        </p>
                        {(product.qty || 1) > 1 && (
                          <p className="text-[0.6rem] text-gray-300">₹{product.price} × {product.qty}</p>
                        )}

                        {/* Qty stepper */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-1 py-1 border border-gray-100">
                          <motion.button whileTap={{ scale: 0.85 }}
                            onClick={() => updateQty(product._id, -1)}
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center hover:border-violet-300 hover:text-violet-600 transition-colors shadow-sm"
                          >−</motion.button>
                          <span className="text-xs font-extrabold text-gray-700 w-5 text-center">
                            {product.qty || 1}
                          </span>
                          <motion.button whileTap={{ scale: 0.85 }}
                            onClick={() => updateQty(product._id, 1)}
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center hover:border-violet-300 hover:text-violet-600 transition-colors shadow-sm"
                          >+</motion.button>
                        </div>

                        {/* Remove */}
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemove(product._id)}
                          className="text-[0.65rem] text-rose-400 font-bold flex items-center gap-1 hover:text-rose-600 transition-colors"
                        >
                          🗑 Remove
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Wishlist nudge */}
              <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❤️</span>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Saved for later?</p>
                    <p className="text-xs text-gray-400">Check your wishlist on the Products page</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/products")}
                  className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-100 px-4 py-2 rounded-full hover:bg-violet-100 transition-colors"
                >
                  Browse →
                </motion.button>
              </motion.div>
            </div>

            {/* ── RIGHT: ORDER SUMMARY ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="sticky top-32 space-y-4"
            >
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Order Summary</p>
                </div>
                <div className="px-6 py-5 space-y-3.5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})</span>
                    <span className="font-bold text-gray-800">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery fee</span>
                    <span className={`font-bold ${deliveryFee === 0 ? "text-emerald-600" : "text-gray-800"}`}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                      <span>Delivery savings</span>
                      <span>−₹49</span>
                    </div>
                  )}
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between">
                    <span className="font-extrabold text-gray-800">Total</span>
                    <div className="text-right">
                      <p className="font-extrabold text-gray-800 text-lg">₹{grandTotal.toLocaleString()}</p>
                      <p className="text-[0.6rem] text-gray-400">incl. all taxes</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 12px 32px rgba(124,58,237,0.28)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <span>→</span>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.01 }}
                    onClick={() => navigate("/products")}
                    className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ← Continue Shopping
                  </motion.button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 space-y-3">
                {[
                  { icon: "🔒", text: "Secure & encrypted checkout"  },
                  { icon: "🚚", text: "Free delivery on orders ₹299+" },
                  { icon: "↩️", text: "Easy 7-day returns"           },
                  { icon: "🌿", text: "100% natural ingredients"      },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="text-base">{icon}</span>
                    <p className="text-xs text-gray-500 font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {!isEmpty && <Footer />}
      </div>
    </div>
  );
};

export default Cart;