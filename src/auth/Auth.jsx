import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loginAPI, registerAPI } from "../services/allApi";

// ── Floating Bubble ──────────────────────────────────────────
const Bubble = ({ size, x, y, delay, duration }) => (
  <motion.div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background:
        "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), rgba(255,255,255,0.04))",
      border: "1px solid rgba(255,255,255,0.25)",
      left: x,
      top: y,
      pointerEvents: "none",
      backdropFilter: "blur(1px)",
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.8, 0.5, 0.8, 0],
      scale: [0, 1, 1.05, 1, 0.9],
      y: [0, -30, -60, -90, -130],
      x: [0, 8, -5, 10, 2],
    }}
    transition={{
      delay,
      duration,
      repeat: Infinity,
      repeatDelay: Math.random() * 3 + 1,
      ease: "easeInOut",
    }}
  />
);

// ── Droplet SVG decoration ───────────────────────────────────
const Droplet = ({ color, style }) => (
  <svg viewBox="0 0 100 140" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 5 C50 5 10 60 10 90 C10 115 28 135 50 135 C72 135 90 115 90 90 C90 60 50 5 50 5Z"
      fill={color}
      opacity="0.18"
    />
    <path
      d="M50 25 C50 25 25 68 25 90 C25 107 36 120 50 120 C64 120 75 107 75 90 C75 68 50 25 50 25Z"
      fill={color}
      opacity="0.12"
    />
    <ellipse cx="38" cy="75" rx="7" ry="14" fill="white" opacity="0.25" transform="rotate(-20 38 75)" />
  </svg>
);

// ── Input Field ──────────────────────────────────────────────
const Field = ({ label, type = "text", value, onChange, placeholder }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", marginBottom: "18px" }}>
      <motion.label
        animate={{ y: focused || value ? -22 : 0, scale: focused || value ? 0.78 : 1, color: focused ? "#a8eddc" : "rgba(255,255,255,0.5)" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          position: "absolute",
          left: 0,
          top: "12px",
          fontSize: "15px",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.04em",
          transformOrigin: "left",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {label}
      </motion.label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ""}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: `2px solid ${focused ? "#a8eddc" : "rgba(255,255,255,0.2)"}`,
          outline: "none",
          color: "#fff",
          fontSize: "16px",
          fontFamily: "'DM Sans', sans-serif",
          padding: "12px 0 8px",
          transition: "border-color 0.3s",
          boxSizing: "border-box",
        }}
      />
      <motion.div
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "2px",
          background: "linear-gradient(90deg, #a8eddc, #5fcfaf)",
          transformOrigin: "left",
        }}
      />
    </div>
  );
};

// ── Main Auth Component ───────────────────────────────────────
 function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [bubbles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: `${Math.random() * 55 + 18}px`,
      x: `${Math.random() * 90}%`,
      y: `${Math.random() * 80 + 10}%`,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 5,
    }))
  );

  const handle = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  // Add inside Auth component

// input validation
const validateForm = () => {
  if (mode === "register" && form.username.trim() === "") {
    setMsg({ text: "Enter your name", type: "error" });
    return false;
  }

  if (form.email.trim() === "") {
    setMsg({ text: "Enter email", type: "error" });
    return false;
  }

  if (!form.email.includes("@")) {
    setMsg({ text: "Enter valid email", type: "error" });
    return false;
  }

  if (form.password.trim() === "") {
    setMsg({ text: "Enter password", type: "error" });
    return false;
  }

  if (form.password.length < 6) {
    setMsg({ text: "Password must be 6+ characters", type: "error" });
    return false;
  }

  return true;
};

  const submit = async () => {
  setMsg({ text: "", type: "" });

  if (!validateForm()) return;

  setLoading(true);

  try {
    let res;

    if (mode === "login") {
      res = await loginAPI({
        email: form.email,
        password: form.password,
      });

      if (res.status === 200) {
  sessionStorage.setItem("token", res.data.token);
  sessionStorage.setItem("user", JSON.stringify(res.data.user));

  setMsg({ text: "Login Success 🎉", type: "success" });

  setForm({ username: "", email: "", password: "" });

  const role = res.data.user.role;

  setTimeout(() => {
    if (role === "admin") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/";
    }
  }, 1000);
}
    }

    if (mode === "register") {
      res = await registerAPI({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      if (res.status === 200) {
        setMsg({ text: "Register Success ✅ Please Login", type: "success" });

        setForm({ username: "", email: "", password: "" });

        setTimeout(() => {
          setMode("login");
        }, 1200);
      }
    }
  } catch (error) {
    if (error.response) {
      setMsg({
        text: error.response.data,
        type: "error",
      });
    } else {
      setMsg({
        text: "Server Error",
        type: "error",
      });
    }
  }

  setLoading(false);
};

  // ── Panel slide variants ─────────────────────────────────
  const panelVariants = {
    hidden: (dir) => ({ x: dir * 60, opacity: 0, filter: "blur(8px)" }),
    visible: { x: 0, opacity: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 260, damping: 28 } },
    exit: (dir) => ({ x: dir * -60, opacity: 0, filter: "blur(8px)", transition: { duration: 0.3 } }),
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0d2b24 0%, #0f3d32 35%, #0b2e40 70%, #081e30 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: rgba(255,255,255,0.25); }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #0f3d32 inset !important; -webkit-text-fill-color: #fff !important; }
      `}</style>

      {/* ── Background mesh blobs ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", width: "520px", height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(95,207,175,0.18) 0%, transparent 70%)",
            top: "-180px", left: "-160px",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            position: "absolute", width: "600px", height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(32,120,200,0.14) 0%, transparent 70%)",
            bottom: "-200px", right: "-180px",
          }}
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          style={{
            position: "absolute", width: "300px", height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,237,220,0.10) 0%, transparent 70%)",
            top: "40%", right: "10%",
          }}
        />
      </div>

      {/* ── Floating bubbles ── */}
      {bubbles.map((b) => <Bubble key={b.id} {...b} />)}

      {/* ── Decorative droplets ── */}
      <Droplet color="#5fcfaf" style={{ position: "absolute", width: 160, top: -20, right: "18%", opacity: 0.9 }} />
      <Droplet color="#2078c8" style={{ position: "absolute", width: 100, bottom: 30, left: "8%", opacity: 0.7 }} />
      <Droplet color="#a8eddc" style={{ position: "absolute", width: 70, top: "55%", right: "5%", opacity: 0.5 }} />

      {/* ── Brand watermark text ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ delay: 0.5 }}
        style={{
          position: "absolute",
          fontSize: "clamp(80px, 15vw, 180px)",
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.02em",
          userSelect: "none",
          pointerEvents: "none",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          whiteSpace: "nowrap",
        }}
      >
        NiLu
      </motion.div>

      {/* ── Main card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "min(920px, 95vw)",
          minHeight: "560px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderRadius: "32px",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* ──── LEFT: Brand Panel ──── */}
        <div
          style={{
            background: "linear-gradient(160deg, rgba(95,207,175,0.22) 0%, rgba(15,61,50,0.95) 50%, rgba(8,30,48,0.98) 100%)",
            padding: "56px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "conic-gradient(from 0deg, #5fcfaf, #2078c8, #a8eddc, #5fcfaf)",
                  boxShadow: "0 0 20px rgba(95,207,175,0.4)",
                }}
              />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>
                NiLu
              </span>
            </div>
            <p style={{ color: "rgba(168,237,220,0.6)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Home & Care Essentials
            </p>
          </motion.div>

          {/* Center headline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <motion.h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 4vw, 46px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.15,
                marginBottom: 20,
              }}
            >
              Clean living,<br />
              <em style={{ color: "#a8eddc", fontStyle: "italic" }}>beautifully</em><br />
              crafted.
            </motion.h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
              Premium handwash, floor cleaners, soaps, softeners & more — engineered for homes that care.
            </p>

            {/* Product pill tags */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}
            >
              {["Handwash", "Floor Cleaner", "Soap", "Softener", "Sanitizer"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.08 }}
                  whileHover={{ scale: 1.06, backgroundColor: "rgba(95,207,175,0.25)" }}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(168,237,220,0.3)",
                    color: "rgba(168,237,220,0.85)",
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    cursor: "default",
                    transition: "background 0.2s",
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, letterSpacing: "0.12em" }}
          >
            © 2025 NiLu — ALL RIGHTS RESERVED
          </motion.p>
        </div>

        {/* ──── RIGHT: Form Panel ──── */}
        <div
          style={{
            background: "rgba(10, 28, 22, 0.92)",
            backdropFilter: "blur(30px)",
            padding: "56px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle inner glow */}
          <div style={{
            position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(95,207,175,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Tab switcher */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 14,
              padding: 4,
              marginBottom: 40,
              position: "relative",
            }}
          >
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setMsg({ text: "", type: "" }); }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  border: "none",
                  background: "transparent",
                  color: mode === m ? "#0d2b24" : "rgba(255,255,255,0.4)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "capitalize",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 2,
                  transition: "color 0.3s",
                }}
              >
                {m}
              </button>
            ))}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              style={{
                position: "absolute",
                top: 4, bottom: 4,
                left: mode === "login" ? 4 : "50%",
                width: "calc(50% - 4px)",
                background: "linear-gradient(135deg, #a8eddc, #5fcfaf)",
                borderRadius: 10,
                zIndex: 1,
              }}
            />
          </motion.div>

          {/* Form content */}
          <div style={{ position: "relative", minHeight: 280 }}>
            <AnimatePresence mode="wait" custom={mode === "login" ? -1 : 1}>
              <motion.div
                key={mode}
                custom={mode === "login" ? -1 : 1}
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ position: "absolute", width: "100%" }}
              >
                {/* Heading */}
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 6,
                  }}>
                    {mode === "login" ? "Welcome back" : "Join PURÉ"}
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, letterSpacing: "0.02em" }}>
                    {mode === "login"
                      ? "Sign in to explore our premium range"
                      : "Create your account and start exploring"}
                  </p>
                </div>

                {/* Fields */}
                {mode === "register" && (
                  <Field label="Full Name" value={form.username} onChange={handle("username")} placeholder="e.g. Aryan Sharma" />
                )}
                <Field label="Email Address" type="email" value={form.email} onChange={handle("email")} placeholder="you@example.com" />
                <Field label="Password" type="password" value={form.password} onChange={handle("password")} placeholder="••••••••" />

                {/* Message */}
                <AnimatePresence>
                  {msg.text && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        marginTop: 10,
                        padding: "10px 16px",
                        borderRadius: 10,
                        fontSize: 13,
                        background: msg.type === "success" ? "rgba(95,207,175,0.15)" : "rgba(255,80,80,0.12)",
                        border: `1px solid ${msg.type === "success" ? "rgba(95,207,175,0.35)" : "rgba(255,80,80,0.3)"}`,
                        color: msg.type === "success" ? "#a8eddc" : "#ff9090",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {msg.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  onClick={submit}
                  disabled={loading}
                  whileHover={{ scale: 1.025, boxShadow: "0 12px 40px rgba(95,207,175,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    marginTop: 28,
                    width: "100%",
                    padding: "15px 0",
                    borderRadius: 14,
                    border: "none",
                    background: loading
                      ? "rgba(95,207,175,0.3)"
                      : "linear-gradient(135deg, #5fcfaf 0%, #2ea88a 50%, #1d7a65 100%)",
                    color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    boxShadow: "0 6px 30px rgba(95,207,175,0.2)",
                    transition: "background 0.3s",
                  }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: 18, height: 18, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid #fff",
                      }}
                    />
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                    </>
                  )}
                </motion.button>

                {/* Switch hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.3)", fontSize: 13 }}
                >
                  {mode === "login" ? "New here?" : "Already have an account?"}
                  <button
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); setMsg({ text: "", type: "" }); }}
                    style={{
                      background: "none", border: "none", color: "#a8eddc",
                      fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                      cursor: "pointer", marginLeft: 6, textDecoration: "underline",
                    }}
                  >
                    {mode === "login" ? "Create an account" : "Sign in instead"}
                  </button>
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 640px) {
          .auth-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default Auth