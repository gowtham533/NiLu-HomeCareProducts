import React, { useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, useInView } from "framer-motion";

/* ─── ANIMATION HELPERS ───────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function InView({ children, className = "", variants = stagger }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Contact = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-violet-50 via-white to-emerald-50">

      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-violet-300/30 blur-3xl rounded-full" />
        <div className="absolute top-[30%] right-0 w-[350px] h-[350px] bg-emerald-300/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-[30%] w-[300px] h-[300px] bg-cyan-200/30 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10">
        <Header />

        {/* HERO */}
        <section className="text-center px-6 pt-20 pb-14">
            <div className="align-center justify-center flex m-5"><img src="/public/mas group.jpeg" alt="" className="rounded-full border-0 w-40" />
            <img src="/public/nilu logo.jpeg" alt="" className="rounded-full border-0 w-40 " />
            </div>
          <InView>
            <span className="px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-emerald-500 text-white shadow-lg">
              Contact Us
            </span>

            <h1 className="mt-6 text-5xl font-extrabold">
              Let’s Build a{" "}
              <span className="bg-gradient-to-r from-violet-600 via-pink-500 to-emerald-500 bg-clip-text text-transparent">
                Cleaner Home
              </span>
            </h1>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Have questions about NiLu products, orders, or partnerships?
              We’re here to help you keep your home fresh and healthy.
            </p>
          </InView>
        </section>

        {/* CONTACT SECTION */}
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start pb-24">

          {/* CONTACT INFO */}
          <InView>
            <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800">
                Get in Touch
              </h2>

              <p className="mt-3 text-gray-600 text-sm">
                We usually respond within 24 hours.
              </p>

              <div className="mt-6 space-y-5 text-gray-700">

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-sm text-gray-500">
                      MAS Group, Kerala, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-gray-500">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-gray-500">support@nilu.com</p>
                  </div>
                </div>

              </div>
            </div>
          </InView>

          {/* CONTACT FORM */}
          <InView>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/70 to-white/40 backdrop-blur-xl border border-white/40 shadow-2xl">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Send a Message
              </h2>

              <form className="space-y-4">

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/50 outline-none focus:ring-2 focus:ring-violet-400"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/50 outline-none focus:ring-2 focus:ring-violet-400"
                />

                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/50 outline-none focus:ring-2 focus:ring-violet-400"
                />

                <textarea
                  rows="5"
                  placeholder="Your Message"
                  className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/50 outline-none focus:ring-2 focus:ring-violet-400"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-pink-500 to-emerald-500 shadow-lg"
                >
                  Send Message
                </motion.button>

              </form>
            </div>
          </InView>
        </section>

        {/* CTA BANNER */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="rounded-3xl p-10 text-center text-white bg-gradient-to-r from-violet-600 via-pink-500 to-emerald-500 shadow-2xl">

            <h2 className="text-3xl font-bold">
              We’re Here for Your Home 🏡
            </h2>

            <p className="mt-3 text-white/80">
              Clean home, happy life — NiLu is always with you.
            </p>

          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;