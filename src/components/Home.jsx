// src/pages/Home.jsx
import React, { useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

/* ─── DATA ─────────────────────────────────────────────── */
const categories = [
  { name: "Soaps",       img: "/public/crystalsoap.png",       bg: "from-emerald-100 to-teal-50",   accent: "text-emerald-600",  icon: "🧼" },
  { name: "Dishwash $ Handwash",       img: "/public/handwash.png",       bg: "from-amber-100 to-yellow-50",   accent: "text-amber-600",    icon: "🍽️ 🧴" },
  { name: "Fabric Softener",img: "/public/softner.png",      bg: "from-violet-100 to-purple-50",  accent: "text-violet-600",   icon: "👕" },
  { name: "Vinegar",          img: "/public/vinegar.png",           bg: "from-rose-100 to-pink-50",      accent: "text-rose-600",     icon: "🍶" },
  { name: "Cleaners",       img: "/public/glass cleaner.png",       bg: "from-sky-100 to-blue-50",       accent: "text-sky-600",      icon: "🧹" },
];

const products = [
  { name: "Handwash",  price: 99,  img: "/public/yellow handwash.jpeg",  tag: "Best Seller" },
  { name: "Pure Vinegar",   price: 89,  img: "/public/vinegar.png",  tag: "New" },
  { name: "Rose Handwash",  price: 99,  img: "/public/handwash.png",      tag: "" },
  { name: "Fabric Softener",price: 149, img: "/public/softner.png", tag: "Popular" },
  { name: "Natural Soap",   price: 49,  img: "/public/crystalsoap.png",  tag: "Eco" },
];

const features = [
  { label: "Safe for Family", icon: "🛡️", color: "from-rose-100 to-pink-50",       accent: "bg-rose-400" },
  { label: "Powerful Clean",  icon: "⚡", color: "from-amber-100 to-yellow-50",    accent: "bg-amber-400" },
  { label: "Long Lasting",    icon: "♻️", color: "from-emerald-100 to-teal-50",    accent: "bg-emerald-400" },
  { label: "Eco Friendly",    icon: "🌿", color: "from-violet-100 to-purple-50",   accent: "bg-violet-400" },
];

/* ─── HELPERS ───────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function Section({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── COMPONENT ─────────────────────────────────────────── */
const Home = () => (
  <div className="bg-gradient-to-br from-violet-50 via-white to-emerald-50 min-h-screen overflow-x-hidden">

    {/* Ambient blobs */}
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%]  w-[40vw] h-[40vw] rounded-full bg-violet-200/20 blur-[80px]" />
      <div className="absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-200/25 blur-[80px]" />
      <div className="absolute bottom-[5%] left-[20%]  w-[30vw] h-[30vw] rounded-full bg-teal-100/30 blur-[80px]" />
    </div>

    <div className="relative z-10">
      <Header />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="bg-[url('/public/nilu-home.png')] bg-cover bg-center bg-no-repeat h-screen max-w-7xl max-w-full mx-auto px-6 py-20 grid md:grid-cols-2 items-center gap-14">

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Clean Home. Healthy Life.
          </motion.span>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-extrabold mt-5 text-gray-800 leading-[1.12] tracking-tight"
          >
            Better Care.{" "}
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-emerald-500 bg-clip-text text-transparent">
              Brighter Life.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 text-gray-500 text-lg leading-relaxed max-w-md"
          >
            Homecare products crafted with nature's best — for a cleaner, fresher home every day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link to={'/products'}><motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 8px 28px rgba(124,58,237,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 ms-22 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white font-semibold shadow-lg shadow-violet-200 transition-all"
            >
              Shop Now →
            </motion.button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-10 flex gap-8"
          >
            {[["10K+", "Happy Homes"], ["50+", "Products"], ["100%", "Natural"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">{val}</p>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 60, opacity: 0, rotate: 2 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-200/40 to-emerald-200/40 blur-2xl scale-105" />
          <img
            src="https://source.unsplash.com/600x500/?cleaning-products"
            alt="Nilu Homecare"
            className="relative w-full rounded-3xl shadow-2xl shadow-violet-100 object-cover"
          />
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
            className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white/60"
          >
            <p className="text-sm font-bold text-violet-600">Flat 20% OFF...!</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.05, type: "spring" }}
            className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white/60"
          >
            <p className="text-[0.7rem] text-gray-400">Eco-Certified</p>
            <p className="text-sm font-bold text-emerald-600">🌿 100% Natural</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <Section className="max-w-6xl mx-auto px-6 py-4">
        <motion.div
          variants={stagger}
          className="grid md:grid-cols-4 gap-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 px-6 py-6"
        >
          {features.map(({ label, icon, color, accent }, i) => (
            <motion.div
              key={label}
              variants={fadeUp(i * 0.08)}
              whileHover={{ y: -4, scale: 1.03 }}
              className={`flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-gradient-to-br ${color} transition-all`}
            >
              <div className={`w-11 h-11 rounded-full ${accent} bg-opacity-20 flex items-center justify-center text-xl shadow-sm`}>
                {icon}
              </div>
              <p className="font-semibold text-gray-700 text-sm">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <Section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div variants={fadeUp()} className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">Explore</p>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Shop by Category</h2>
        </motion.div>

        <Link to={'/products'}>
          <motion.div variants={stagger} className="grid md:grid-cols-5 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                variants={fadeUp(i * 0.07)}
                whileHover={{ scale: 1.06, y: -6, boxShadow: "0 16px 40px rgba(124,58,237,0.15)" }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${cat.bg} text-center cursor-pointer border border-white/70 shadow-sm transition-all`}
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <img src={cat.img} className="h-28 mx-auto mb-4 object-cover rounded-xl" alt={cat.name} />
                <h3 className="font-bold text-gray-800 text-sm">{cat.name}</h3>
                <p className={`text-xs font-semibold mt-2 ${cat.accent}`}>View All →</p>
              </motion.div>
          ))}
        </motion.div>
        </Link>
      </Section>

      {/* ── BANNER ─────────────────────────────────────────── */}
      <Section className="max-w-7xl mx-auto px-6 mb-4">
        <motion.div
          variants={fadeUp()}
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-3xl p-10 bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-violet-200"
        >
          {/* Shimmer */}
          <motion.div
            animate={{ x: ["−100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
          />
          <div>
            <p className="text-emerald-200 text-xs font-bold tracking-widest uppercase mb-2">Limited Time</p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-snug tracking-tight">
              Bringing Freshness,<br /> Bringing Home Nilu.
            </h2>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)" }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 px-6 py-2.5 rounded-full bg-white/20 border border-white/50 text-white font-semibold text-sm backdrop-blur-sm transition-all hover:text-violet-700"
            >
              Grab the Deal →
            </motion.button>
          </div>
          <motion.img
            whileHover={{ rotate: 3, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 200 }}
            src="https://source.unsplash.com/240x180/?laundry"
            className="w-48 h-36 object-cover rounded-2xl opacity-90 shadow-xl"
            alt="Laundry offer"
          />
        </motion.div>
      </Section>

      {/* ── PRODUCTS ───────────────────────────────────────── */}
      <Section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div variants={fadeUp()} className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-2">Trending</p>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Best Sellers</h2>
        </motion.div>

        <motion.div variants={stagger} className="grid md:grid-cols-5 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              variants={fadeUp(i * 0.08)}
              whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(124,58,237,0.15)" }}
              className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow border border-white/70 text-center relative group transition-all"
            >
              {p.tag && (
                <span className="absolute top-3 left-3 text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 text-white shadow-sm">
                  {p.tag}
                </span>
              )}
              <div className="overflow-hidden rounded-xl mb-4">
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                  src={p.img}
                  className="h-32 w-full mx-auto object-cover"
                  alt={p.name}
                />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">{p.name}</h3>
              <p className="text-violet-600 font-extrabold text-base mt-1">₹{p.price}</p>
              <Link to={'/products'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-emerald-500 text-white rounded-full text-xs font-bold shadow-md shadow-violet-100 transition-all"
                >
                  Grab it Now..!
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp(0.5)} className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.04, borderColor: "#7c3aed", color: "#7c3aed" }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 border-2 border-gray-200 rounded-full text-gray-500 font-semibold text-sm transition-all"
          >
            View All Products →
          </motion.button>
        </motion.div>
      </Section>

      <Footer />
    </div>
  </div>
);

export default Home;