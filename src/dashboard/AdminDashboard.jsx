// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addProductAPI,
  editProductAPI,
  deleteProductAPI,
  getAllProductsAPI,
} from "../services/allApi";

/* ─── CONFIG ─────────────────────────────────────────────── */
const SERVER_URL  = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
const CATEGORIES  = ["handwash", "dishwash", "fabric", "soap", "cleaner"];
const EMPTY_FORM  = { productName: "", description: "", category: "", quantity: "", price: "", image: null };

const getReqHeader = () => ({
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
});

/* ─── HELPERS ────────────────────────────────────────────── */
const categoryStyle = (cat) => {
  const map = {
    handwash: "bg-emerald-100 text-emerald-700",
    dishwash:  "bg-amber-100  text-amber-700",
    fabric:    "bg-violet-100 text-violet-700",
    soap:      "bg-rose-100   text-rose-700",
    cleaner:   "bg-sky-100    text-sky-700",
  };
  return map[cat] || "bg-gray-100 text-gray-600";
};

/* ─── STAT CARD ──────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, gradient, isLoading }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg cursor-default ${gradient}`}
  >
    <div className="absolute -top-3 -right-3 text-white/10 text-8xl select-none leading-none">{icon}</div>
    <p className="text-white/70 text-[0.65rem] font-bold uppercase tracking-widest mb-2">{label}</p>
    {isLoading ? (
      <div className="h-9 w-16 bg-white/20 rounded-lg animate-pulse" />
    ) : (
      <motion.p
        key={String(value)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black tracking-tight"
      >
        {value}
      </motion.p>
    )}
    {sub && <p className="text-white/60 text-xs mt-1.5">{sub}</p>}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
  </motion.div>
);

/* ─── CATEGORY BREAKDOWN BAR ─────────────────────────────── */
const CategoryBar = ({ products }) => {
  const counts = CATEGORIES.map(cat => ({
    cat,
    count: products.filter(p => p.category === cat).length,
  }));
  const max = Math.max(...counts.map(c => c.count), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Products by Category</p>
      <div className="space-y-3">
        {counts.map(({ cat, count }) => (
          <div key={cat} className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 w-20 capitalize">{cat}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(count / max) * 100}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full"
              />
            </div>
            <span className="text-xs font-extrabold text-gray-700 w-5 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── ADD / EDIT MODAL ───────────────────────────────────── */
const ProductModal = ({ mode, product, onClose, onSuccess }) => {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const fileRef               = useRef();

  useEffect(() => {
    if (mode === "edit" && product) {
      setForm({
        productName: product.productName,
        description: product.description,
        category:    product.category,
        quantity:    product.quantity,
        price:       product.price,
        image:       null,
      });
      setPreview(`${SERVER_URL}/uploads/${product.image}`);
    }
  }, [mode, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setError("");
    const { productName, description, category, quantity, price, image } = form;

    // ── Client-side validation ──
    if (!productName.trim())  return setError("Product name is required.");
    if (!description.trim())  return setError("Description is required.");
    if (!category)            return setError("Please select a category.");
    if (!quantity.trim())     return setError("Quantity / size is required.");
    if (!price && price !== 0) return setError("Price is required.");
    if (Number(price) <= 0)   return setError("Price must be greater than ₹0.");
    if (mode === "add" && !image) return setError("Please upload a product image.");

    const fd = new FormData();
    fd.append("productName", productName.trim());
    fd.append("description", description.trim());
    fd.append("category",    category);
    fd.append("quantity",    quantity.trim());
    fd.append("price",       Number(price));
    if (image) fd.append("image", image);

    // ── DO NOT set Content-Type manually for multipart —
    //    the browser must set it with the correct boundary automatically.
    const reqHeader = { ...getReqHeader() };

    setLoading(true);
    try {
      const res = mode === "add"
        ? await addProductAPI(fd, reqHeader)
        : await editProductAPI(product._id, fd, reqHeader);

      if (res.status === 200 || res.status === 201) {
        onSuccess(mode === "add" ? "Product added successfully!" : "Product updated successfully!");
        onClose();
      } else {
        // Surface the real server error message
        setError(
          res.data?.message ||
          res.data?.error   ||
          (typeof res.data === "string" ? res.data : "Something went wrong.")
        );
      }
    } catch (err) {
      // Surface axios / network error details
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        err?.message                 ||
        "Server error. Please try again.";
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-emerald-50">
          <div>
            <h2 className="font-extrabold text-gray-800 text-lg">
              {mode === "add" ? "➕ Add New Product" : "✏️ Edit Product"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {mode === "add" ? "Fill in details and upload an image" : "Update any field below"}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500 text-sm transition-colors shadow-sm"
          >✕</button>
        </div>

        {/* Body */}
        <div className="px-7 py-5 space-y-4 max-h-[68vh] overflow-y-auto">
          {/* Image upload */}
          <div
            onClick={() => fileRef.current.click()}
            className="relative h-44 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/40 transition-all cursor-pointer flex items-center justify-center overflow-hidden group"
          >
            {preview ? (
              <>
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full">📷 Change Image</span>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-4xl">🖼️</p>
                <p className="text-xs text-gray-400 mt-2 font-medium">Click to upload product image</p>
                <p className="text-[0.6rem] text-gray-300 mt-0.5">JPG, PNG, WEBP accepted</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Product Name</label>
            <input name="productName" value={form.productName} onChange={handleChange}
              placeholder="e.g. Aloe Vera Handwash" className={inputCls} />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the product..." rows={3}
              className={inputCls + " resize-none"} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Quantity / Size</label>
              <input name="quantity" value={form.quantity} onChange={handleChange}
                placeholder="e.g. 250ml, 100g" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Price (₹)</label>
            <input
              name="price"
              type="number"
              min="1"
              step="1"
              value={form.price}
              onKeyDown={e => ["-", "+", "e", "E", "."].includes(e.key) && e.preventDefault()}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setForm(f => ({ ...f, price: val }));
              }}
              placeholder="e.g. 99"
              className={inputCls}
            />
            {form.price !== "" && Number(form.price) <= 0 && (
              <p className="text-[0.65rem] text-rose-400 mt-1 font-medium">⚠ Price must be greater than ₹0</p>
            )}
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5"
            >⚠️ {error}</motion.p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >Cancel</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-sm font-bold shadow-md shadow-violet-200 disabled:opacity-60 transition-all"
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </span>
              : mode === "add" ? "Add Product" : "Save Changes"
            }
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── DELETE MODAL ───────────────────────────────────────── */
const DeleteModal = ({ product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteProductAPI(product._id, getReqHeader());
      if (res.status === 200) { onSuccess("Product deleted."); onClose(); }
    } catch { onClose(); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl mb-4"
        >🗑️</motion.div>
        <h3 className="font-extrabold text-gray-800 text-lg mb-1">Delete Product?</h3>
        <p className="text-gray-400 text-sm mb-6">
          <span className="font-bold text-gray-600">{product.productName}</span> will be permanently removed from the catalogue.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >Cancel</button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleDelete} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold transition-colors disabled:opacity-60"
          >{loading ? "Deleting…" : "Yes, Delete"}</motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── TOAST ──────────────────────────────────────────────── */
const Toast = ({ message, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-2xl bg-gray-900 text-white text-sm font-semibold shadow-2xl flex items-center gap-2 whitespace-nowrap"
    >
      <span>✅</span> {message}
    </motion.div>
  );
};

/* ─── MAIN DASHBOARD ─────────────────────────────────────── */
const AdminDashboard = () => {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterCat, setFilterCat]   = useState("all");
  const [modal, setModal]           = useState(null); // { type: "add"|"edit"|"delete", product? }
  const [toast, setToast]           = useState("");

  /* ── Fetch ── */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProductsAPI(getReqHeader());
      if (res.status === 200) {
        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : [];
        setProducts(list);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSuccess = (msg) => {
    setToast(msg);
    fetchProducts(); // Re-fetch so Products page sees updated list immediately
  };

  /* ── Filtered list ── */
  const filtered = products
    .filter(p => filterCat === "all" || p.category === filterCat)
    .filter(p =>
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );

  /* ── Live stats ── */
  const totalValue    = products.reduce((s, p) => s + Number(p.price), 0);
  const catCount      = [...new Set(products.map(p => p.category))].length;
  const latestProduct = products[products.length - 1];

  return (
    <div className="min-h-screen bg-[#f4f3f8] font-sans">

      {/* ── SIDEBAR ── */}
      <div className="fixed top-0 left-0 h-full w-16 bg-gradient-to-b from-violet-700 via-violet-800 to-emerald-700 flex flex-col items-center py-6 gap-4 z-30 shadow-2xl">
        {/* Logo */}
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-lg shadow ring-1 ring-white/20">
          N
        </div>
        <div className="w-8 h-px bg-white/10 rounded" />

        <div className="flex-1" />

        {[
          { icon: "📦", label: "Products", active: true },
          { icon: "📊", label: "Analytics" },
          { icon: "⚙️",  label: "Settings"  },
        ].map(({ icon, label, active }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            title={label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
              active
                ? "bg-white/25 shadow-lg ring-1 ring-white/30 text-white"
                : "hover:bg-white/10 text-white/60"
            }`}
          >{icon}</motion.button>
        ))}

        <div className="flex-1" />

        <motion.button
          whileHover={{ scale: 1.1 }}
          title="Logout"
          className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-lg text-white/60 transition-all"
        >🚪</motion.button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="ml-16 min-h-screen flex flex-col">

        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Admin Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">Nilu Homecare · Product Management</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live count badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-violet-600">
                {loading ? "…" : `${products.length} Products Live`}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(124,58,237,0.30)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModal({ type: "add" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-sm font-bold shadow-lg shadow-violet-200 transition-shadow"
            >
              <span className="text-base font-light">＋</span> Add Product
            </motion.button>
          </div>
        </div>

        <div className="px-8 py-8 space-y-7 flex-1">

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon="📦" label="Total Products"
              value={loading ? "…" : products.length}
              sub={`${catCount} categor${catCount === 1 ? "y" : "ies"}`}
              gradient="bg-gradient-to-br from-violet-600 to-purple-500"
              isLoading={loading}
            />
            <StatCard
              icon="🗂️" label="Categories Active"
              value={loading ? "…" : catCount}
              sub="out of 5 total"
              gradient="bg-gradient-to-br from-emerald-500 to-teal-400"
              isLoading={loading}
            />
            <StatCard
              icon="💰" label="Catalogue Value"
              value={loading ? "…" : `₹${totalValue.toLocaleString()}`}
              sub="sum of all prices"
              gradient="bg-gradient-to-br from-amber-500 to-orange-400"
              isLoading={loading}
            />
            <StatCard
              icon="🆕" label="Latest Added"
              value={loading ? "…" : latestProduct ? latestProduct.productName.split(" ").slice(0, 2).join(" ") : "—"}
              sub={latestProduct ? `₹${latestProduct.price}` : "No products yet"}
              gradient="bg-gradient-to-br from-sky-500 to-blue-500"
              isLoading={loading}
            />
          </div>

          {/* ── CATEGORY BREAKDOWN ── */}
          {!loading && products.length > 0 && (
            <CategoryBar products={products} />
          )}

          {/* ── FILTER BAR ── */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="flex flex-wrap gap-2">
              {["all", ...CATEGORIES].map(cat => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterCat(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filterCat === cat
                      ? "bg-gradient-to-r from-violet-600 to-emerald-500 text-white shadow"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-violet-300 hover:text-violet-600"
                  }`}
                >
                  {cat === "all" ? "✨ All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  {cat !== "all" && (
                    <span className="ml-1.5 opacity-60">
                      ({products.filter(p => p.category === cat).length})
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="relative md:ml-auto w-full md:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or description…"
                className="w-full pl-8 pr-4 py-2 rounded-full bg-white border border-gray-200 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-violet-300 transition-colors shadow-sm"
              />
            </div>
          </div>

          {/* ── RESULT COUNT ── */}
          <p className="text-xs text-gray-400 -mt-3">
            Showing <span className="font-bold text-violet-500">{filtered.length}</span> of{" "}
            <span className="font-bold text-gray-600">{products.length}</span> products
          </p>

          {/* ── PRODUCT TABLE ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Table header */}
            <div className="grid grid-cols-[56px_1.6fr_2fr_1fr_1fr_90px_100px] gap-4 px-6 py-3 bg-gray-50/80 border-b border-gray-100 text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">
              <span>Image</span>
              <span>Product</span>
              <span>Description</span>
              <span>Category</span>
              <span>Qty · Price</span>
              <span className="text-center">Status</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-9 h-9 rounded-full border-4 border-violet-200 border-t-violet-600"
                />
                <p className="text-sm text-gray-400 font-medium">Fetching products from server…</p>
              </div>

            /* Empty */
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <p className="text-5xl mb-3">📭</p>
                <p className="font-extrabold text-gray-700">No products found</p>
                <p className="text-sm text-gray-400 mt-1.5">
                  {search || filterCat !== "all"
                    ? "Try clearing your filters"
                    : 'Click "Add Product" to get started'}
                </p>
                {(search || filterCat !== "all") && (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSearch(""); setFilterCat("all"); }}
                    className="mt-5 px-5 py-2 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-bold"
                  >
                    Clear filters
                  </motion.button>
                )}
              </div>

            /* Rows */
            ) : (
              <AnimatePresence>
                {filtered.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.025 }}
                    className="grid grid-cols-[56px_1.6fr_2fr_1fr_1fr_90px_100px] gap-4 px-6 py-4 items-center border-b border-gray-50 last:border-0 hover:bg-violet-50/20 transition-colors group"
                  >
                    {/* Image */}
                    <img
                      src={`${SERVER_URL}/uploads/${product.image}`}
                      alt={product.productName}
                      className="w-11 h-11 rounded-xl object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
                      onError={e => { e.target.src = "https://placehold.co/44?text=N"; }}
                    />

                    {/* Name + ID */}
                    <div>
                      <p className="font-bold text-gray-800 text-sm leading-snug">{product.productName}</p>
                      <p className="text-[0.6rem] text-gray-300 mt-0.5 font-mono">#{product._id.slice(-6)}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{product.description}</p>

                    {/* Category */}
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wide w-fit ${categoryStyle(product.category)}`}>
                      {product.category}
                    </span>

                    {/* Qty · Price */}
                    <div>
                      <p className="font-extrabold text-gray-800 text-sm">₹{product.price}</p>
                      <p className="text-[0.65rem] text-gray-400 mt-0.5">{product.quantity}</p>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[0.6rem] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        ● Active
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setModal({ type: "edit", product })}
                        title="Edit"
                        className="w-8 h-8 rounded-lg bg-violet-50 hover:bg-violet-100 border border-violet-100 text-violet-600 flex items-center justify-center text-sm transition-colors"
                      >✏️</motion.button>
                      <motion.button
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setModal({ type: "delete", product })}
                        title="Delete"
                        className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-500 flex items-center justify-center text-sm transition-colors"
                      >🗑️</motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <p className="text-center text-xs text-gray-300 pb-4">
            Nilu Homecare Admin Panel · {products.length} product{products.length !== 1 ? "s" : ""} in catalogue
          </p>
        </div>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {modal?.type === "add" && (
          <ProductModal mode="add" onClose={() => setModal(null)} onSuccess={handleSuccess} />
        )}
        {modal?.type === "edit" && (
          <ProductModal mode="edit" product={modal.product} onClose={() => setModal(null)} onSuccess={handleSuccess} />
        )}
        {modal?.type === "delete" && (
          <DeleteModal product={modal.product} onClose={() => setModal(null)} onSuccess={handleSuccess} />
        )}
      </AnimatePresence>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast("")} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;