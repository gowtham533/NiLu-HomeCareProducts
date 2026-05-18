// src/components/Header.jsx
import { useState } from "react";
import { FaSearch, FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navItems = [
  { name: "Home",     path: "/"         },
  { name: "About",    path: "/about"    },
  { name: "Products", path: "/products" },
  { name: "Blog",     path: "/blog"     },
  { name: "Contact",  path: "/contact"  },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // cartItems.length = number of unique products in cart (what the badge should show)
  const { cartItems } = useCart();
  const badgeCount = cartItems.length;

  return (
    <>
      <header className="fixed top-4 left-0 w-full z-50 px-4">
        <div className="max-w-7xl mx-auto rounded-3xl border border-white/30 bg-white/20 backdrop-blur-2xl shadow-2xl px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img src="../public/nilu logo-Photoroom.png" alt="Logo" className="h-18" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}
                className="relative text-gray-800 font-semibold transition duration-300 group"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* ICONS */}
          <div className="flex items-center gap-5 text-gray-800 text-lg">
            <FaSearch className="hover:text-cyan-600 transition cursor-pointer" />

            <Link to="/login">
              <FaUser className="hover:text-cyan-600 transition" />
            </Link>

            {/* Cart icon — badge shows number of unique products */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="hover:text-cyan-600 transition" />
              {badgeCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </Link>

            {/* MOBILE TOGGLE */}
            <button className="md:hidden text-xl" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="max-w-7xl mx-auto mt-3 rounded-3xl border border-white/30 bg-white/20 backdrop-blur-2xl shadow-xl px-6 py-5 md:hidden">
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path}
                  className="block text-gray-800 font-semibold hover:text-cyan-600 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/cart" onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between text-gray-800 font-semibold hover:text-cyan-600 transition"
              >
                <span>Cart</span>
                {badgeCount > 0 && (
                  <span className="bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {badgeCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* SPACER for fixed navbar */}
      <div className="h-24" />
    </>
  );
};

export default Header;