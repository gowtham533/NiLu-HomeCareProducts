// src/components/ProductView.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { getProductAPI, getAllProductsAPI } from "../services/allApi";
import { useCart } from "../context/CartContext";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

/* ─── HELPERS ─────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
});
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function InView({ children, className = "" }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

const Stars = ({ rating = 5, large }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`${large ? "text-base" : "text-xs"} ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}>★</span>
    ))}
  </div>
);

/* ─── Category styling ────────────────────────────────────── */
const categoryStyle = (cat) => {
  const map = {
    handwash: { color: "from-emerald-100 to-teal-50",  accent: "text-emerald-600"  },
    dishwash:  { color: "from-yellow-100 to-amber-50",  accent: "text-amber-600"    },
    fabric:    { color: "from-violet-100 to-purple-50", accent: "text-violet-600"   },
    soap:      { color: "from-orange-100 to-rose-50",   accent: "text-rose-600"     },
    cleaner:   { color: "from-sky-100 to-indigo-50",    accent: "text-indigo-600"   },
  };
  return map[(cat || "").toLowerCase()] || { color: "from-gray-100 to-gray-50", accent: "text-gray-600" };
};

/* ─── Static review pool ──────────────────────────────────── */
const reviewPool = [
  { name: "Ananya R.",   avatar: "AR", rating: 5, date: "Apr 2025", text: "Absolutely love this product! The fragrance lasts all day and my skin feels so soft. Will definitely repurchase." },
  { name: "Kiran M.",    avatar: "KM", rating: 5, date: "Mar 2025", text: "Been using Nilu products for 6 months now. This one is my favourite — gentle and effective." },
  { name: "Preethi S.",  avatar: "PS", rating: 4, date: "Mar 2025", text: "Good quality and nice smell. Packaging could be more eco-friendly but the product itself is great." },
  { name: "Rahul V.",    avatar: "RV", rating: 5, date: "Feb 2025", text: "My whole family uses this now. Even my kid with sensitive skin has no issues. Highly recommended!" },
  { name: "Divya K.",    avatar: "DK", rating: 4, date: "Feb 2025", text: "Great product. Slightly expensive but the quality justifies the price. Smells amazing." },
];

/* ─── IMAGE URL helper ────────────────────────────────────── */
const imgUrl = (img) => {
  if (!img) return "https://placehold.co/600x600?text=No+Image";
  if (img.startsWith("http")) return img;
  return `${SERVER_URL}/uploads/${img}`;
};

/* ─── SKELETON ────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="bg-gradient-to-br from-violet-50 via-white to-emerald-50 min-h-screen">
    <Header />
    <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-12 animate-pulse">
      <div className="aspect-square rounded-3xl bg-gray-100" />
      <div className="space-y-5 pt-4">
        <div className="h-3 w-20 bg-gray-100 rounded-full" />
        <div className="h-8 w-3/4 bg-gray-100 rounded-full" />
        <div className="h-4 w-1/2 bg-gray-100 rounded-full" />
        <div className="h-10 w-1/3 bg-gray-100 rounded-full" />
        <div className="h-12 bg-gray-100 rounded-full" />
        <div className="h-12 bg-gray-100 rounded-full" />
      </div>
    </div>
  </div>
);

/* ─── PAGE ────────────────────────────────────────────────── */
const ProductView = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { toggleCart, isInCart, toggleWishlist, isWishlisted } = useCart();

  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const [activeImg, setActiveImg]         = useState(0);
  const [qty, setQty]                     = useState(1);
  const [activeTab, setActiveTab]         = useState("description");
  const [pincode, setPincode]             = useState("");
  const [deliveryMsg, setDeliveryMsg]     = useState("");

  /* ── Fetch single product ── */
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError("");
      setActiveImg(0);
      try {
        const token     = sessionStorage.getItem("token");
        const reqHeader = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await getProductAPI(id, reqHeader);
        if (res.status === 200) {
          const p = res.data?.product || res.data;
          setProduct(p);

          // Fetch related products (same category)
          const allRes = await getAllProductsAPI(reqHeader);
          if (allRes.status === 200) {
            const all  = allRes.data?.products || allRes.data || [];
            const rel  = all.filter(x => x.category === p.category && x._id !== p._id).slice(0, 4);
            setRelated(rel);
          }
        } else {
          setError("Product not found.");
        }
      } catch {
        setError("Could not load product.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) return <Skeleton />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-emerald-50 flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-extrabold text-gray-700">Product not found</h2>
        <p className="text-gray-400 text-sm">{error}</p>
        <Link to="/products" className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white font-bold text-sm shadow">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const { color, accent } = categoryStyle(product.category);
  const inCart   = isInCart(product._id);
  const wished   = isWishlisted(product._id);

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryMsg("✅ Delivery available in 3–5 business days. Free shipping on this order!");
    } else {
      setDeliveryMsg("Please enter a valid 6-digit pincode.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-violet-50 via-white to-emerald-50 min-h-screen overflow-x-hidden">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[38vw] h-[38vw] rounded-full bg-violet-200/20 blur-[90px]" />
        <div className="absolute top-[40%] -right-16 w-[30vw] h-[30vw] rounded-full bg-emerald-200/25 blur-[80px]" />
      </div>

      <div className="relative z-10">
        <Header />

        {/* ── BREADCRUMB ── */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-gray-400 font-medium"
          >
            <Link to="/" className="hover:text-violet-600 transition-colors">Home</Link>
            <span className="text-gray-300">›</span>
            <Link to="/products" className="hover:text-violet-600 transition-colors">Products</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-600 font-semibold truncate max-w-[200px]">{product.productName}</span>
          </motion.nav>
        </div>

        {/* ── MAIN SECTION ── */}
        <section className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT — Image */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-28"
          >
            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${color} aspect-square shadow-xl border border-white/60`}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                  src={imgUrl(product.image)}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = "https://placehold.co/600x600?text=No+Image"; }}
                />
              </AnimatePresence>

              {/* Category badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r from-violet-600 to-emerald-500 shadow capitalize">
                {product.category}
              </div>

              {/* Quantity badge */}
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/85 backdrop-blur text-xs font-bold text-gray-700 border border-white/60 shadow">
                {product.quantity}
              </div>

              {/* Wishlist */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => toggleWishlist(product._id)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-base border border-white/60"
              >
                <motion.span animate={{ scale: wished ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}>
                  {wished ? "❤️" : "🤍"}
                </motion.span>
              </motion.button>
            </div>

            {/* Thumbnail row — single image product shows one thumb */}
            <div className="flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                onClick={() => setActiveImg(0)}
                className="flex-1 max-w-[80px] aspect-square rounded-xl overflow-hidden border-2 border-violet-500 shadow-md shadow-violet-100"
              >
                <img
                  src={imgUrl(product.image)}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = "https://placehold.co/80?text=N"; }}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* RIGHT — Info */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Category label */}
            <span className={`text-xs font-bold tracking-widest uppercase ${accent}`}>
              {product.category}
            </span>

            {/* Name */}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight leading-snug">
                {product.productName}
              </h1>
              <p className="text-gray-500 mt-1">{product.quantity} · {product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Stars rating={5} large />
              <span className="font-bold text-gray-700 text-sm">5.0</span>
              <span className="text-gray-400 text-xs">(New Arrival)</span>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2">
              {["Natural Formula", "Quality Tested", "Family Safe"].map(h => (
                <span key={h} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-br ${color} ${accent} border border-white/70 shadow-sm`}>
                  ✓ {h}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 py-2 border-t border-b border-gray-100">
              <span className="text-4xl font-extrabold text-gray-800">₹{product.price}</span>
              <span className="text-sm text-gray-400 mb-1">incl. all taxes</span>
            </div>

            {/* Qty control */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full overflow-hidden">
                  <motion.button whileTap={{ scale: 0.85 }}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-violet-600 font-bold text-lg transition-colors"
                  >−</motion.button>
                  <span className="w-10 text-center font-extrabold text-gray-800 text-sm">{qty}</span>
                  <motion.button whileTap={{ scale: 0.85 }}
                    onClick={() => setQty(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-violet-600 font-bold text-lg transition-colors"
                  >+</motion.button>
                </div>
                <span className="text-xs text-gray-400">Total: <span className="font-extrabold text-gray-700">₹{Number(product.price) * qty}</span></span>
              </div>
            </div>

            {/* Add to Cart + Buy Now */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 28px rgba(124,58,237,0.30)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleCart(product)}
                className={`flex-1 py-3.5 rounded-full font-bold text-sm transition-all shadow-md ${
                  inCart
                    ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-200 shadow-none"
                    : "bg-gradient-to-r from-violet-600 to-emerald-500 text-white shadow-violet-200"
                }`}
              >
                {inCart ? "✓ Added to Cart" : `Add to Cart · ₹${Number(product.price) * qty}`}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { toggleCart(product); navigate("/cart"); }}
                className="py-3.5 px-6 rounded-full border-2 border-violet-200 text-violet-600 font-bold text-sm hover:bg-violet-50 transition-all"
              >
                Buy Now
              </motion.button>
            </div>

            {/* Delivery check */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-600 mb-3">📍 Check Delivery</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={pincode}
                  onChange={e => { setPincode(e.target.value); setDeliveryMsg(""); }}
                  placeholder="Enter pincode"
                  className="flex-1 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 transition-colors"
                  maxLength={6}
                />
                <motion.button whileTap={{ scale: 0.95 }} onClick={checkDelivery}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-xs font-bold shadow"
                >Check</motion.button>
              </div>
              {deliveryMsg && (
                <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-emerald-600 font-medium"
                >{deliveryMsg}</motion.p>
              )}
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-4 pt-1">
              {[["🚚","Free delivery above ₹299"], ["↩️","Easy 7-day returns"], ["🔒","Secure checkout"], ["🌿","100% natural"]].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span>{icon}</span>{text}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── TABS ── */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <InView>
            <motion.div variants={fadeUp()} className="flex gap-1 bg-gray-100/80 rounded-2xl p-1.5 w-fit mb-8 border border-white/60 flex-wrap">
              {[
                { id: "description", label: "Description"   },
                { id: "howto",       label: "How to Use"    },
                { id: "reviews",     label: "Reviews (5)"   },
              ].map(tab => (
                <motion.button key={tab.id} whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-violet-600 shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >{tab.label}</motion.button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="max-w-3xl"
              >
                {activeTab === "description" && (
                  <div className="text-gray-600 leading-relaxed text-[0.95rem]">
                    <p>{product.description}</p>
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                      {[
                        ["🌿", "Natural",     "Made with plant-based ingredients"         ],
                        ["🧪", "Tested",      "Dermatologically tested and certified"      ],
                        ["👨‍👩‍👧", "Family Safe", "Safe for all ages when used as directed"   ],
                      ].map(([icon, title, desc]) => (
                        <div key={title} className={`p-4 rounded-2xl bg-gradient-to-br ${color} border border-white/70 shadow-sm`}>
                          <div className="text-2xl mb-2">{icon}</div>
                          <p className={`font-bold text-sm ${accent}`}>{title}</p>
                          <p className="text-gray-500 text-xs mt-1">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "howto" && (
                  <div className="space-y-4">
                    {[
                      "Apply the product as directed on the label.",
                      "Use the recommended quantity for best results.",
                      "Rinse thoroughly after use.",
                      "Store in a cool, dry place away from direct sunlight.",
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow">
                          {i + 1}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-5">
                    {/* Rating summary */}
                    <div className="flex items-center gap-6 p-5 bg-white/80 rounded-2xl border border-gray-100 shadow-sm mb-6">
                      <div className="text-center">
                        <p className="text-5xl font-extrabold text-gray-800">5.0</p>
                        <Stars rating={5} />
                        <p className="text-xs text-gray-400 mt-1">5 reviews</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5,4,3,2,1].map(star => {
                          const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 w-4">{star}★</span>
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full"
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-6">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {reviewPool.map((r, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="bg-white/80 rounded-2xl p-5 border border-gray-100 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center text-white text-xs font-extrabold shadow">
                              {r.avatar}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                              <p className="text-gray-400 text-[0.65rem]">Verified Purchase · {r.date}</p>
                            </div>
                          </div>
                          <Stars rating={r.rating} />
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </InView>
        </section>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-8 mb-8">
            <InView>
              <motion.div variants={fadeUp()} className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">More from this range</p>
                  <h2 className="text-2xl font-extrabold text-gray-800">You might also like</h2>
                </div>
                <Link to="/products">
                  <motion.span whileHover={{ x: 4 }} className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors">
                    View all →
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div variants={stagger} className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                {related.map(p => {
                  const { color: rColor, accent: rAccent } = categoryStyle(p.category);
                  return (
                    <motion.div key={p._id} variants={fadeUp()}
                      whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(124,58,237,0.12)" }}
                      onClick={() => { navigate(`/products/${p._id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="bg-white/80 rounded-2xl border border-white/60 shadow-sm overflow-hidden cursor-pointer transition-all"
                    >
                      <div className={`relative bg-gradient-to-br ${rColor} h-36 overflow-hidden`}>
                        <img
                          src={imgUrl(p.image)}
                          alt={p.productName}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={e => { e.target.src = "https://placehold.co/200x150?text=N"; }}
                        />
                        <span className={`absolute top-2 left-2 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 shadow capitalize`}>
                          {p.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className={`text-[0.65rem] font-bold uppercase tracking-wide ${rAccent}`}>{p.category}</p>
                        <h3 className="font-extrabold text-gray-800 text-sm mt-0.5 line-clamp-1">{p.productName}</h3>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-extrabold text-gray-800 text-base">₹{p.price}</span>
                          <span className="text-xs text-gray-400">{p.quantity}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </InView>
          </section>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default ProductView;