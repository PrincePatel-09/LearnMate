/**
 * Landing Page — Hero, Features, How It Works, Testimonials, FAQ, Footer
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdArrowForward, MdCheck, MdStar, MdExpandMore, MdExpandLess } from "react-icons/md";
import {
  FaBrain, FaRoad, FaChartLine, FaTrophy,
  FaBookOpen, FaRocket, FaGraduationCap, FaCode,
} from "react-icons/fa";
import Footer from "../components/layout/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: FaBrain,         title: "Agentic AI Coach",       desc: "Not just a chatbot — an intelligent agent that understands your goals, skill gaps, and learning style.", color: "#0F62FE" },
  { icon: FaRoad,          title: "Personalized Roadmaps",  desc: "AI-generated step-by-step learning pathways tailored to your career goal and current skill level.", color: "#8A3FFC" },
  { icon: FaBookOpen,      title: "Curated Courses",        desc: "Hand-picked free and paid courses from IBM SkillsBuild, Coursera, freeCodeCamp, edX, and more.", color: "#08BDBA" },
  { icon: FaChartLine,     title: "Progress Tracking",      desc: "Visual dashboards with charts, streaks, and weekly targets to keep you consistently on track.", color: "#0F62FE" },
  { icon: FaTrophy,        title: "Gamification",           desc: "Earn badges, build streaks, collect XP, and unlock achievements as you complete topics.", color: "#F1C21B" },
  { icon: FaRocket,        title: "Project Suggestions",    desc: "The AI recommends real projects to build after every learning phase so your portfolio grows.", color: "#8A3FFC" },
  { icon: FaGraduationCap, title: "Certification Guidance", desc: "Know exactly which certifications matter for your target role and how to get them for free.", color: "#08BDBA" },
  { icon: FaCode,          title: "IBM Granite Powered",    desc: "Built on IBM's enterprise-grade Granite AI model through watsonx.ai for accurate, safe guidance.", color: "#0F62FE" },
];

const STEPS = [
  { num: "01", title: "Set Your Goal",       desc: "Tell LearnMate your career goal, current skill level, and how many hours you can study per week." },
  { num: "02", title: "Get Your Roadmap",    desc: "IBM Granite AI instantly generates a personalised, phased learning roadmap with resources and projects." },
  { num: "03", title: "Learn & Chat",        desc: "Chat with your AI coach anytime — ask questions, get explanations, request motivation, update your path." },
  { num: "04", title: "Track & Grow",        desc: "Mark topics complete, earn badges, watch your skill chart grow, and get your roadmap updated dynamically." },
];

const TESTIMONIALS = [
  { name: "Aryan Sharma", role: "B.Tech CSE, IIIT Delhi", text: "I had no idea where to start with web dev. LearnMate gave me a full roadmap in seconds and I landed my internship in 4 months!", stars: 5 },
  { name: "Priya Nair",   role: "Final Year, VIT Chennai",  text: "The AI coach is incredible. It knows which topics I've covered and adjusts my path. Best learning tool I've used.", stars: 5 },
  { name: "Rohan Gupta",  role: "MCA Student, Pune",        text: "The IBM Granite AI is so much better than generic chatbots. The roadmap.sh integration is genius!", stars: 5 },
];

const FAQS = [
  { q: "Is LearnMate completely free to use?",          a: "LearnMate's core features are free. The AI is powered by IBM watsonx.ai — you need a watsonx.ai account (free tier available)." },
  { q: "What makes this different from regular chatbots?", a: "LearnMate is an agentic AI — it maintains context, tracks your progress, updates your roadmap, and takes actions. It's a learning coach, not a conversation bot." },
  { q: "Which AI model does LearnMate use?",            a: "IBM Granite 13B Chat through IBM watsonx.ai — an enterprise-grade, safe, and reliable foundation model." },
  { q: "Can I use this if I'm a complete beginner?",    a: "Absolutely! LearnMate starts with a skill assessment and builds a path from your current level, whether that's zero or advanced." },
  { q: "Does it support Indian career guidance?",       a: "Yes! LearnMate is built with Indian students in mind — it knows about GATE, placement season, NPTEL, Indian companies, and fee waivers." },
];

// ── Components ────────────────────────────────────────────────────────────────
function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ibm-blue to-ibm-purple flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-xl gradient-text">LearnMate</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-ibm-blue transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-ibm-blue text-white rounded-xl text-sm font-semibold hover:bg-ibm-hover transition-colors shadow-lg shadow-ibm-blue/30"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white dark:bg-ibm-dark pt-20">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ibm-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ibm-purple/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-6 text-center relative z-10"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-ibm-blue/10 text-ibm-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <span>🤖</span> Powered by IBM Granite via watsonx.ai
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
          Your AI-Powered{" "}
          <span className="gradient-text">Learning Coach</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          LearnMate is an intelligent agent that understands your goals, builds personalised roadmaps,
          recommends courses, and coaches you step by step to your dream career.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-ibm-blue text-white rounded-2xl text-lg font-bold hover:bg-ibm-hover transition-all shadow-2xl shadow-ibm-blue/40 hover:scale-105"
          >
            Start Learning for Free <MdArrowForward size={22} />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-2xl text-lg font-semibold hover:border-ibm-blue transition-all"
          >
            Sign In
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
          {["Free to get started", "IBM Granite AI", "10,000+ students"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <MdCheck className="text-ibm-teal" size={16} /> {t}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-24 bg-ibm-gray dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Everything You Need to <span className="gradient-text">Level Up</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-400">
            LearnMate is more than a chatbot — it's a complete learning system
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="bg-white dark:bg-[#161616] rounded-2xl p-6 card-hover border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}20` }}>
                <f.icon size={24} style={{ color: f.color }} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-ibm-dark">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
          <motion.h2 variants={fadeUp} className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            How <span className="gradient-text">LearnMate</span> Works
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-gray-400">
            From goal to career — in 4 intelligent steps
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STEPS.map((s) => (
            <motion.div key={s.num} variants={fadeUp} className="flex gap-5 p-6 bg-ibm-gray dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="text-4xl font-black gradient-text flex-shrink-0">{s.num}</div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 bg-ibm-gray dark:bg-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-14">
          <motion.h2 variants={fadeUp} className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Students Love <span className="gradient-text">LearnMate</span>
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={fadeUp} className="bg-white dark:bg-[#161616] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 card-hover">
              <div className="flex gap-0.5 mb-4">
                {Array(t.stars).fill(0).map((_, i) => (
                  <MdStar key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5 italic">"{t.text}"</p>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-24 bg-white dark:bg-ibm-dark">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-14">
          <motion.h2 variants={fadeUp} className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>
        </motion.div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {faq.q}
                {open === i ? <MdExpandLess /> : <MdExpandMore />}
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ibm-blue via-ibm-purple to-ibm-teal opacity-90" />
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer}>
          <motion.h2 variants={fadeUp} className="text-4xl font-black text-white mb-4">
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/80 text-lg mb-8">
            Join thousands of students using LearnMate to reach their career goals faster.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-ibm-blue rounded-2xl text-lg font-bold hover:scale-105 transition-transform shadow-2xl"
            >
              Create Free Account <MdArrowForward size={22} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
