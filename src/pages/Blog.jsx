// src/components/Blog.jsx
import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

/* ─── HELPERS ───────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
});

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function Section({ children, className = "" }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  return (
    <motion.section ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.section>
  );
}

/* ─── DATA ──────────────────────────────────────────────────── */
const categories = [
  { id: "all",     label: "All",            icon: "✨" },
  { id: "tips",    label: "Cleaning Tips",  icon: "🧹" },
  { id: "guide",   label: "Usage Guides",   icon: "📖" },
  { id: "health",  label: "Health & Hygiene", icon: "🌿" },
  { id: "diy",     label: "DIY Hacks",      icon: "⚡" },
];

const posts = [
  {
    id: 1,
    category: "tips",
    tag: "Featured",
    title: "10 Clever Kitchen Cleaning Hacks That Actually Work",
    excerpt: "Transform your kitchen from greasy to gleaming with these simple, natural cleaning tricks using everyday Nilu products.",
    author: "Nilu Team",
    date: "May 12, 2025",
    readTime: "5 min read",
    icon: "🍳",
    bg: "from-amber-100 to-yellow-50",
    accent: "text-amber-600",
    badge: "bg-amber-500",
    tagColor: "bg-gradient-to-r from-violet-600 to-emerald-500",
  },
  {
    id: 2,
    category: "health",
    tag: "Popular",
    title: "Why Handwashing Matters More Than You Think",
    excerpt: "Discover the science behind proper handwashing and how choosing the right handwash can protect your entire family.",
    author: "Dr. Priya Nair",
    date: "May 8, 2025",
    readTime: "4 min read",
    icon: "🧴",
    bg: "from-emerald-100 to-teal-50",
    accent: "text-emerald-600",
    badge: "bg-emerald-500",
    tagColor: "bg-emerald-500",
  },
  {
    id: 3,
    category: "guide",
    tag: "New",
    title: "The Complete Guide to Fabric Softener — Are You Using It Right?",
    excerpt: "Most people use fabric softener incorrectly. Here's everything you need to know for softer, fresher laundry every time.",
    author: "Nilu Team",
    date: "May 3, 2025",
    readTime: "6 min read",
    icon: "👕",
    bg: "from-violet-100 to-purple-50",
    accent: "text-violet-600",
    badge: "bg-violet-500",
    tagColor: "bg-violet-500",
  },
  {
    id: 4,
    category: "diy",
    tag: "Trending",
    title: "5 DIY Natural Cleaners You Can Make at Home",
    excerpt: "Skip the harsh chemicals — these easy DIY recipes use vinegar, baking soda, and Nilu concentrates for a toxin-free clean.",
    author: "Meera K.",
    date: "Apr 28, 2025",
    readTime: "7 min read",
    icon: "⚡",
    bg: "from-rose-100 to-pink-50",
    accent: "text-rose-600",
    badge: "bg-rose-500",
    tagColor: "bg-rose-500",
  },
  {
    id: 5,
    category: "tips",
    tag: "",
    title: "How to Keep Your Bathroom Smelling Fresh All Day",
    excerpt: "A clean bathroom is a happy bathroom. These expert tips will help you maintain freshness between deep cleans effortlessly.",
    author: "Nilu Team",
    date: "Apr 22, 2025",
    readTime: "3 min read",
    icon: "🚿",
    bg: "from-sky-100 to-blue-50",
    accent: "text-sky-600",
    badge: "bg-sky-500",
    tagColor: "bg-sky-500",
  },
  {
    id: 6,
    category: "health",
    tag: "",
    title: "Natural vs Chemical Cleaners: What's Safer for Kids?",
    excerpt: "If you have young children at home, this breakdown of natural vs chemical cleaning agents is a must-read for every parent.",
    author: "Dr. Arun Menon",
    date: "Apr 15, 2025",
    readTime: "5 min read",
    icon: "👶",
    bg: "from-lime-100 to-green-50",
    accent: "text-lime-600",
    badge: "bg-lime-500",
    tagColor: "bg-lime-500",
  },
];

const featuredPost = posts[0];
const tips = [
  { icon: "🧼", tip: "Use cold water to rinse handwash for better lather." },
  { icon: "🍋", tip: "Add a few drops of vinegar to dishwash for extra shine." },
  { icon: "👕", tip: "Always add fabric softener in the rinse cycle, not wash." },
  { icon: "🌿", tip: "Natural cleaners work best when left for 5 minutes." },
];

/* ─── BLOG CARD ─────────────────────────────────────────────── */
const BlogCard = ({ post, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={fadeUp(index * 0.08)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, boxShadow: "0 24px 56px rgba(124,58,237,0.13)" }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/70 shadow overflow-hidden group cursor-pointer transition-all"
    >
      {/* Image area */}
      <div className={`relative h-44 bg-gradient-to-br ${post.bg} flex items-center justify-center overflow-hidden`}>
        <motion.span
          animate={{ scale: hovered ? 1.2 : 1, rotate: hovered ? 8 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl select-none"
        >{post.icon}</motion.span>

        {/* Shimmer on hover */}
        <motion.div
          animate={{ x: hovered ? "200%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
        />

        {post.tag && (
          <span className={`absolute top-3 left-3 text-[0.6rem] font-bold px-2.5 py-1 rounded-full text-white shadow-sm ${post.tagColor}`}>
            {post.tag}
          </span>
        )}
        <span className={`absolute bottom-3 right-3 text-[0.6rem] font-bold px-2.5 py-1 rounded-full text-white ${post.badge} shadow-sm`}>
          {categories.find(c => c.id === post.category)?.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className={`font-extrabold text-gray-800 text-sm leading-snug group-hover:text-violet-600 transition-colors`}>
          {post.title}
        </h3>
        <p className="text-[0.7rem] text-gray-400 mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>

        <div className="h-px bg-gray-50 my-3.5" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-emerald-400 flex items-center justify-center text-[0.55rem] text-white font-bold">
              {post.author[0]}
            </div>
            <div>
              <p className="text-[0.6rem] font-bold text-gray-700">{post.author}</p>
              <p className="text-[0.55rem] text-gray-400">{post.date}</p>
            </div>
          </div>
          <span className="text-[0.6rem] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
            ⏱ {post.readTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── PAGE ──────────────────────────────────────────────────── */
const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch]                 = useState("");
  const [email, setEmail]                   = useState("");
  const [subscribed, setSubscribed]         = useState(false);

  const filtered = posts.filter(p =>
    (activeCategory === "all" || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) ||
     p.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-gradient-to-br from-violet-50 via-white to-emerald-50 min-h-screen overflow-x-hidden">

      {/* Ambient blobs — exactly like Home.jsx */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%]   w-[40vw] h-[40vw] rounded-full bg-violet-200/20 blur-[80px]" />
        <div className="absolute top-[30%]  right-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-200/25 blur-[80px]" />
        <div className="absolute bottom-[5%] left-[20%]  w-[30vw] h-[30vw] rounded-full bg-teal-100/30 blur-[80px]" />
      </div>

      <div className="relative z-10">
        <Header />

        {/* ── HERO BANNER ─────────────────────────────────────── */}
        <Section className="max-w-7xl mx-auto px-6 pt-6 pb-4">
          <motion.div
            variants={fadeUp(0)}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500 p-10 md:p-14 text-white shadow-2xl shadow-violet-200 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            {/* Shimmer — exactly like Home.jsx banner */}
            <motion.div
              animate={{ x: ["−100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
            />
            <div>
              <p className="text-emerald-200 text-xs font-bold tracking-widest uppercase mb-2">Nilu Homecare Blog</p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.12]">
                Tips, Guides &<br />
                <span className="text-white/80">Clean Living Ideas</span>
              </h1>
              <p className="mt-3 text-white/70 text-sm max-w-sm">
                Expert advice on homecare, hygiene, and natural living — straight from the Nilu family.
              </p>
            </div>
            {/* Stats */}
            <div className="flex gap-8 flex-shrink-0">
              {[["6+", "Articles"], ["3", "Categories"], ["Weekly", "Updates"]].map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <p className="text-2xl font-extrabold">{val}</p>
                  <p className="text-xs text-white/60 mt-0.5">{lbl}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* ── FEATURED POST ────────────────────────────────────── */}
        <Section className="max-w-7xl mx-auto px-6 py-6">
          <motion.div variants={fadeUp()} className="mb-6">
            <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-1">Editor's Pick</p>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Featured Article</h2>
          </motion.div>

          <motion.div
            variants={fadeUp(0.1)}
            whileHover={{ y: -4, boxShadow: "0 28px 60px rgba(124,58,237,0.16)" }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/70 shadow-lg overflow-hidden cursor-pointer"
          >
            <div className="grid md:grid-cols-2">
              {/* Left — big icon area */}
              <div className={`relative h-64 md:h-auto bg-gradient-to-br ${featuredPost.bg} flex items-center justify-center overflow-hidden`}>
                <motion.span
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="text-8xl select-none"
                >{featuredPost.icon}</motion.span>
                <span className={`absolute top-4 left-4 text-[0.65rem] font-bold px-3 py-1 rounded-full text-white shadow ${featuredPost.tagColor}`}>
                  ⭐ {featuredPost.tag}
                </span>
              </div>

              {/* Right — content */}
              <div className="p-8 flex flex-col justify-center">
                <span className={`text-[0.6rem] font-extrabold tracking-widest uppercase ${featuredPost.accent} mb-2`}>
                  {categories.find(c => c.id === featuredPost.category)?.icon} {categories.find(c => c.id === featuredPost.category)?.label}
                </span>
                <h2 className="text-xl font-extrabold text-gray-800 leading-snug mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{featuredPost.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-emerald-400 flex items-center justify-center text-xs text-white font-bold">
                      {featuredPost.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">{featuredPost.author}</p>
                      <p className="text-[0.65rem] text-gray-400">{featuredPost.date} · {featuredPost.readTime}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(124,58,237,0.28)" }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-xs font-bold shadow-md shadow-violet-200"
                  >
                    Read More →
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </Section>

        {/* ── FILTER + SEARCH ──────────────────────────────────── */}
        <div className="sticky top-[5.5rem] z-30 max-w-7xl mx-auto px-6 mb-6">
          <motion.div
            initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-white/85 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg px-5 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-violet-600 to-emerald-500 text-white shadow-md shadow-violet-200"
                      : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-violet-200 hover:text-violet-600"
                  }`}
                >
                  {cat.icon} {cat.label}
                  {cat.id !== "all" && (
                    <span className="opacity-40 ml-0.5">
                      ({posts.filter(p => p.category === cat.id).length})
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-56">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-8 pr-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 transition-colors"
              />
            </div>
          </motion.div>
        </div>

        {/* ── BLOG GRID ────────────────────────────────────────── */}
        <Section className="max-w-7xl mx-auto px-6 pb-10">
          {!search && activeCategory === "all" && (
            <motion.div variants={fadeUp()} className="mb-6">
              <p className="text-xs font-bold tracking-widest text-emerald-500 uppercase mb-1">All Stories</p>
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Latest Articles</h2>
            </motion.div>
          )}

          {filtered.length > 0 ? (
            <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-extrabold text-gray-700 text-lg">No articles found</h3>
              <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setSearch(""); setActiveCategory("all"); }}
                className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-sm font-bold shadow"
              >Clear filters</motion.button>
            </motion.div>
          )}
        </Section>

        {/* ── QUICK TIPS STRIP ─────────────────────────────────── */}
        <Section className="max-w-7xl mx-auto px-6 mb-8">
          <motion.div variants={fadeUp()} className="text-center mb-6">
            <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-1">Quick Wins</p>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Pro Cleaning Tips</h2>
          </motion.div>
          <motion.div variants={stagger} className="grid md:grid-cols-4 gap-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/60 px-6 py-6">
            {tips.map(({ icon, tip }, i) => (
              <motion.div
                key={i}
                variants={fadeUp(i * 0.08)}
                whileHover={{ y: -4, scale: 1.03 }}
                className="flex flex-col items-center text-center gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-emerald-50 border border-white/70 transition-all"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-100 to-emerald-100 flex items-center justify-center text-2xl shadow-sm">
                  {icon}
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* ── NEWSLETTER ───────────────────────────────────────── */}
        <Section className="max-w-7xl mx-auto px-6 mb-10">
          <motion.div
            variants={fadeUp()}
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl p-10 bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-500 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-violet-200"
          >
            {/* Shimmer — same as Home.jsx banner */}
            <motion.div
              animate={{ x: ["−100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
            />
            <div>
              <p className="text-emerald-200 text-xs font-bold tracking-widest uppercase mb-2">Stay Updated</p>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-snug tracking-tight">
                Get Weekly Tips<br />
                <span className="text-white/80">Straight to Your Inbox</span>
              </h2>
              <p className="text-white/60 text-sm mt-2 max-w-xs">
                No spam. Just clean living ideas, product tips, and special offers every week.
              </p>
            </div>

            {/* Subscribe input */}
            <div className="flex-shrink-0 w-full md:w-auto">
              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 text-center"
                >
                  <p className="text-2xl mb-1">🎉</p>
                  <p className="font-bold text-white text-sm">You're subscribed!</p>
                  <p className="text-white/70 text-xs mt-0.5">Check your inbox for a welcome email.</p>
                </motion.div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="px-5 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/50 text-sm outline-none focus:bg-white/30 transition-colors backdrop-blur-sm w-full sm:w-64"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => email && setSubscribed(true)}
                    className="px-6 py-3 rounded-full bg-white/20 border border-white/50 text-white font-bold text-sm backdrop-blur-sm transition-all hover:text-violet-700 whitespace-nowrap"
                  >
                    Subscribe →
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </Section>

        <Footer />
      </div>
    </div>
  );
};

export default Blog;