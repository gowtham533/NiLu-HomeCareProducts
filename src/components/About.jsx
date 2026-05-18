import React, { useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion, useInView } from "framer-motion";

/* ─── HELPERS ─────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
});

const fadeLeft = (delay = 0) => ({
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
});

const fadeRight = (delay = 0) => ({
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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

/* ─── DATA ────────────────────────────────────────────── */
const values = [
  {
    icon: "🌿",
    label: "Safe Ingredients",
    desc: "Carefully chosen cleaning and care ingredients safe for everyday home use.",
  },
  {
    icon: "🏡",
    label: "Made for Homes",
    desc: "Designed specifically for Indian households and daily cleaning needs.",
  },
  {
    icon: "🧪",
    label: "Lab Tested",
    desc: "Every product is tested for safety, quality, and performance.",
  },
  {
    icon: "♻️",
    label: "Eco Friendly",
    desc: "Sustainable packaging and environmentally responsible formulas.",
  },
];

const milestones = [
  { year: "2018", title: "MAS Group Founded", desc: "Started with a vision to build trusted consumer brands." },
  { year: "2020", title: "NiLu Concept Started", desc: "Idea of a safe and affordable homecare brand was born." },
  { year: "2021", title: "First Products Launched", desc: "Entered households with cleaning essentials." },
  { year: "2023", title: "Pan India Reach", desc: "Expanded distribution across multiple states." },
  { year: "2025", title: "10K+ Homes", desc: "Trusted by thousands of families across India." },
];

const team = [
  { name: "Lusha Annie Maneksha", role: "Founder & CEO", img: "/public/lusha.jpeg" },
  { name: "Reji Mathew", role: "Product Head", img: "/public/reji.jpeg" },
  { name: "Nisha N U", role: "Marketing", img: "/public/nisha.jpeg" },
  { name: "", role: "", img: "/public/mas group.jpeg" },
];

/* ─── PAGE ────────────────────────────────────────────── */
const About = () => (
  <div className="bg-gradient-to-br from-violet-50 via-white to-emerald-50 min-h-screen overflow-x-hidden">

    <div className="relative z-10">
      <Header />

      {/* ── HERO ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <InView>
          <motion.span className="px-4 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase">
            Our Story
          </motion.span>

          <motion.h1 className="mt-5 text-5xl font-extrabold text-gray-800">
            Cleaning Homes,{" "}
            <span className="bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
              Caring Lives
            </span>
          </motion.h1>

          <motion.p className="mt-5 text-gray-500 max-w-2xl mx-auto">
            NiLu is a homecare brand built to make every home cleaner, safer, and healthier.
            We create high-quality cleaning and hygiene products for everyday life.
          </motion.p>
        </InView>
      </section>

      {/* ── IMAGE ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <img
          src="/public/nilu-home.png"
          className="w-full h-150 object-cover rounded-3xl shadow-xl"
          alt="Homecare" style={{marginTop:"50px"}}
        />
      </section>

      {/* ── WHAT WE DO ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 mb-24 grid md:grid-cols-2 gap-12 items-center">
        <InView>
          <h2 className="text-4xl font-extrabold text-gray-800">
            A Brand Built for{" "}
            <span className="text-violet-600">Clean Living</span>
          </h2>

          <p className="mt-4 text-gray-500">
            NiLu offers homecare essentials like dishwash liquids, floor cleaners,
            disinfectants, hand washes, and personal care products designed for daily use.
          </p>

          <p className="mt-3 text-gray-500">
            Our focus is simple — safe products that make homes healthier and life easier.
          </p>
        </InView>

        <img
          src="https://source.unsplash.com/600x420/?cleaning,spray"
          className="rounded-2xl shadow-lg"
          alt="Cleaning Products"
        />
      </section>

      {/* ── VALUES ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Values</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.label} className="p-6 bg-white rounded-2xl shadow">
              <div className="text-3xl">{v.icon}</div>
              <h3 className="font-bold mt-3">{v.label}</h3>
              <p className="text-sm text-gray-500 mt-2">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 mb-24">
        {milestones.map((m) => (
          <div key={m.year} className="mb-6 border-l-2 pl-4">
            <p className="text-violet-600 font-bold">{m.year}</p>
            <h3 className="font-semibold">{m.title}</h3>
            <p className="text-gray-500 text-sm">{m.desc}</p>
          </div>
        ))}
      </section>

      {/* ── TEAM ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <h2 className="text-3xl font-bold mb-10">Meet Our Team</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {team.map((t) => (
            <div key={t.name}>
              <img src={t.img} className="rounded-full mx-auto mb-3" />
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  </div>
);

export default About;