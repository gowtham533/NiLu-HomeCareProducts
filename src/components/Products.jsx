// src/pages/Products.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { getAllProductsAPI } from "../services/allApi";
import { useCart } from "../context/CartContext";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

/* ─── ANIMATION HELPERS ───────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
});
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function InView({ children, className = "", variants = stagger, amount = 0.1 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── CATEGORY CONFIG ─────────────────────────────────────── */
const categories = [
  { id: "all",      label: "All Products", icon: "✨" },
  { id: "handwash", label: "Handwash",     icon: "🧴" },
  { id: "dishwash", label: "Dishwash",     icon: "🍽️" },
  { id: "fabric",   label: "Fabric Care",  icon: "👕" },
  { id: "soap",     label: "Soaps",        icon: "🧼" },
  { id: "cleaner",  label: "Cleaners",     icon: "🧹" },
];

const categoryColor = (cat) => {
  const map = {
    handwash: { color: "from-emerald-100 to-teal-50",  accent: "text-emerald-600", badge: "bg-emerald-500" },
    dishwash:  { color: "from-yellow-100 to-amber-50",  accent: "text-amber-600",   badge: "bg-amber-500"   },
    fabric:    { color: "from-violet-100 to-purple-50", accent: "text-violet-600",  badge: "bg-violet-500"  },
    soap:      { color: "from-orange-100 to-rose-50",   accent: "text-rose-600",    badge: "bg-rose-500"    },
    cleaner:   { color: "from-sky-100 to-indigo-50",    accent: "text-indigo-600",  badge: "bg-indigo-500"  },
  };
  return map[cat] || { color: "from-gray-100 to-gray-50", accent: "text-gray-600", badge: "bg-gray-500" };
};

const sortOptions = [
  { value: "default",    label: "Featured"          },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

/* ─── STARS ───────────────────────────────────────────────── */
const Stars = () => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => <span key={s} className="text-[0.65rem] text-amber-400">★</span>)}
  </div>
);

/* ─── SKELETON ────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-50" />
    <div className="p-5 space-y-3">
      <div className="h-2.5 bg-gray-100 rounded-full w-1/4" />
      <div className="h-4 bg-gray-100 rounded-full w-2/3" />
      <div className="h-3 bg-gray-100 rounded-full w-full" />
      <div className="flex justify-between items-center pt-3">
        <div className="h-7 bg-gray-100 rounded-full w-16" />
        <div className="h-9 bg-gray-100 rounded-full w-28" />
      </div>
    </div>
  </div>
);

/* ─── PRODUCT CARD ────────────────────────────────────────── */
const ProductCard = ({ product, onView }) => {
  const { toggleCart, isInCart, toggleWishlist, isWishlisted } = useCart();
  const [hovered, setHovered] = useState(false);
  const { color, accent, badge } = categoryColor(product.category);
  const inCart  = isInCart(product._id);
  const wished  = isWishlisted(product._id);

  return (
    <motion.div
      variants={fadeUp()}
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -10 }}
      className="relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-[0_24px_56px_rgba(124,58,237,0.14)] transition-shadow"
    >
      {/* Wishlist */}
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => toggleWishlist(product._id)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 border border-gray-100 shadow-sm flex items-center justify-center text-sm"
      >
        <motion.span animate={{ scale: wished ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.3 }}>
          {wished ? "❤️" : "🤍"}
        </motion.span>
      </motion.button>

      {/* Image */}
      <div onClick={onView} className={`relative overflow-hidden bg-gradient-to-br ${color} h-52 flex items-center justify-center cursor-pointer`}>
        <motion.img
          animate={{ scale: hovered ? 1.09 : 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          src={`${SERVER_URL}/uploads/${product.image}`}
          alt={product.productName}
          className="h-full w-full object-cover"
          onError={e => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
        />
        <motion.div animate={{ opacity: hovered ? 1 : 0 }} className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-white text-[0.6rem] font-bold ${badge} shadow-sm capitalize`}>
          {product.category}
        </div>
        <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-white/85 backdrop-blur text-[0.6rem] font-bold text-gray-600 border border-white/60">
          {product.quantity}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className={`text-[0.6rem] font-extrabold tracking-[0.12em] uppercase ${accent}`}>{product.category}</p>
        <h3 onClick={onView} className="font-extrabold text-gray-800 text-sm mt-1 leading-snug cursor-pointer hover:text-violet-600 transition-colors line-clamp-1">
          {product.productName}
        </h3>
        <p className="text-[0.7rem] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="h-px bg-gray-50 my-3.5" />
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-gray-800">₹{product.price}</span>
            <p className="text-[0.6rem] text-gray-300 mt-0.5">incl. all taxes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => toggleCart(product)}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              inCart
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-gradient-to-r from-violet-600 to-emerald-500 text-white shadow-violet-200 hover:shadow-lg"
            }`}
          >
            {inCart ? "✓ Added" : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── PAGE ────────────────────────────────────────────────── */
const Products = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartTotal, removeFromCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy]           = useState("default");
  const [search, setSearch]           = useState("");
  const [cartOpen, setCartOpen]       = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); setError("");
      try {
        const token = sessionStorage.getItem("token");
        const reqHeader = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await getAllProductsAPI(reqHeader);
        if (res.status === 200) {
          const data = res.data;
          setAllProducts(Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : []);
        } else { setError("Failed to load products."); }
      } catch { setError("Unable to connect to server."); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const filtered = allProducts
    .filter(p => activeCategory === "all" || p.category === activeCategory)
    .filter(p =>
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-asc")  return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      return 0;
    });

  const startingPrice = allProducts.length > 0
    ? Math.min(...allProducts.map(p => Number(p.price))) : null;

  return (
    <div className="bg-gradient-to-br from-violet-50 via-white to-emerald-50 min-h-screen overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[38vw] h-[38vw] rounded-full bg-violet-200/20 blur-[90px]" />
        <div className="absolute top-[35%] -right-16 w-[30vw] h-[30vw] rounded-full bg-emerald-200/25 blur-[80px]" />
        <div className="absolute bottom-0 left-[20%] w-[28vw] h-[28vw] rounded-full bg-teal-100/30 blur-[70px]" />
      </div>

      <div className="relative z-10">
        <Header />

        {/* ── HERO ── */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
          <InView variants={stagger}>
            <motion.div variants={fadeUp(0)}
              className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500 p-10 md:p-14 text-white shadow-2xl shadow-violet-200 flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <motion.div animate={{ x: ["-100%", "220%"] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none" />
              <div>
                <span className="text-emerald-200 text-xs font-bold tracking-widest uppercase">Nilu Homecare</span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2 leading-tight">All Products</h1>
                <p className="mt-3 text-white/70 text-sm max-w-sm">Premium homecare essentials — crafted for cleaner, fresher, healthier homes.</p>
              </div>
              <div className="flex gap-6">
                {[
                  [loading ? "…" : `${allProducts.length}+`, "Products"],
                  ["5★", "Avg Rating"],
                  [loading ? "…" : startingPrice != null ? `₹${startingPrice}` : "—", "Starting at"],
                ].map(([val, lbl]) => (
                  <div key={lbl} className="text-center">
                    <motion.p key={val} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-extrabold">{val}</motion.p>
                    <p className="text-xs text-white/60 mt-0.5">{lbl}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </InView>
        </section>

        {/* ── FILTER BAR ── */}
        <div className="sticky top-[5.5rem] z-30 max-w-7xl mx-auto px-6 mb-8">
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-white/85 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg px-5 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <motion.button key={cat.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-violet-600 to-emerald-500 text-white shadow-md shadow-violet-200"
                      : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-violet-200 hover:text-violet-600"
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                  {cat.id !== "all" && !loading && (
                    <span className="opacity-50 ml-0.5">({allProducts.filter(p => p.category === cat.id).length})</span>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-52">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                  className="w-full pl-8 pr-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 transition-colors" />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-600 outline-none focus:border-violet-300 cursor-pointer">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </motion.div>
        </div>

        {/* ── GRID ── */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          {!loading && !error && (
            <motion.p key={activeCategory + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs text-gray-400 font-medium mb-6"
            >
              Showing <span className="font-bold text-violet-500">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "all" && <> in <span className="font-bold text-gray-600">{categories.find(c => c.id === activeCategory)?.label}</span></>}
            </motion.p>
          )}

          {loading && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && error && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="font-extrabold text-gray-700 text-lg">Could not load products</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">{error}</p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-sm font-bold shadow"
              >Retry</motion.button>
            </motion.div>
          )}

          {!loading && !error && (
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <motion.div key={activeCategory + search + sortBy} variants={stagger} initial="hidden" animate="visible"
                  className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {filtered.map(p => (
                    <ProductCard key={p._id} product={p} onView={() => navigate(`/products/${p._id}`)} />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-extrabold text-gray-700 text-lg">No products found</h3>
                  <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setSearch(""); setActiveCategory("all"); }}
                    className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-sm font-bold shadow"
                  >Clear filters</motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>

        {/* ── WHY NILU ── */}
        <section className="max-w-7xl mx-auto px-6 mb-10">
          <InView>
            <motion.div variants={stagger} className="grid md:grid-cols-4 gap-4">
              {[
                { icon: "🚚", title: "Free Delivery",  desc: "On orders above ₹299",      color: "from-violet-100 to-purple-50" },
                { icon: "↩️", title: "Easy Returns",   desc: "Hassle-free 7-day returns",  color: "from-emerald-100 to-teal-50" },
                { icon: "🌿", title: "100% Natural",   desc: "No harmful chemicals",        color: "from-lime-100 to-green-50"   },
                { icon: "🔒", title: "Secure Payment", desc: "Safe & encrypted checkout",   color: "from-sky-100 to-blue-50"     },
              ].map(({ icon, title, desc, color }, i) => (
                <motion.div key={title} variants={fadeUp(i * 0.07)} whileHover={{ y: -4 }}
                  className={`flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br ${color} border border-white/70 shadow-sm`}
                >
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </InView>
        </section>

        <Footer />
      </div>

      {/* ── FLOATING CART BUTTON ── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white shadow-2xl shadow-violet-300 font-bold text-sm"
          >
            <span className="relative">
              🛒
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-violet-600 rounded-full text-[0.6rem] font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            </span>
            View Cart · ₹{cartTotal}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-xl z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div>
                  <h2 className="font-extrabold text-gray-800 text-lg">Your Cart</h2>
                  <p className="text-xs text-gray-400">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm"
                >✕</motion.button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <AnimatePresence>
                  {cartItems.map(p => (
                    <motion.div key={p._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 items-center bg-gray-50 rounded-2xl p-3 border border-gray-100"
                    >
                      <img src={`${SERVER_URL}/uploads/${p.image}`} alt={p.productName}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                        onError={e => { e.target.src = "https://placehold.co/56?text=N"; }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-xs truncate">{p.productName}</p>
                        <p className="text-gray-400 text-[0.65rem]">{p.quantity}</p>
                        <p className="font-extrabold text-violet-600 text-sm mt-0.5">₹{p.price}</p>
                      </div>
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeFromCart(p._id)}
                        className="w-7 h-7 rounded-full bg-rose-50 border border-rose-100 text-rose-400 text-xs flex items-center justify-center"
                      >✕</motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="px-6 py-5 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-sm font-bold text-gray-700">
                  <span>Total</span>
                  <span className="text-violet-600">₹{cartTotal}</span>
                </div>
                {cartTotal < 299 && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
                    Add ₹{299 - cartTotal} more for free delivery 🚚
                  </p>
                )}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setCartOpen(false); navigate("/cart"); }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-violet-200"
                >View Full Cart →</motion.button>
                <motion.button whileHover={{ scale: 1.01 }} onClick={() => setCartOpen(false)}
                  className="w-full py-2.5 rounded-full border border-gray-200 text-gray-500 text-xs font-semibold"
                >Continue Shopping</motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;