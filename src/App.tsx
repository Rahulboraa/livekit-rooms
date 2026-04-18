import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronRight,
  Zap,
  Shield,
  Globe,
  Cpu,
  GitMerge,
  Smartphone,
  RefreshCw,
  Terminal,
  Lightbulb,
  Mail,
  Star,
  Link2,
  MessageSquare,
  Globe2,
  Quote,
  type LucideIcon,
} from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Services", href: "services" },
  { label: "About",    href: "about"    },
  { label: "Contact",  href: "contact"  },
];

const MARQUEE_ITEMS = [
  "Senior-only delivery",
  "20+ years combined",
  "No junior handoffs",
  "Production-grade",
  "3 Senior Principals",
  "Architecture experts",
  "Trusted globally",
  "Zero compromises",
];

interface Service {
  id: number;
  Icon: LucideIcon;
  title: string;
  desc: string;
  scope: string;
}

const SERVICES: Service[] = [
  { id: 1, Icon: Terminal,   title: "Custom Software & Internal Tools",   scope: "Full-stack",      desc: "Bespoke software built for how your team actually works — not how a template assumes it does." },
  { id: 2, Icon: Lightbulb,  title: "Problem-Solving & Advisory",         scope: "Strategic",       desc: "Technical audits, architecture decisions, and strategic second opinions. The most valuable deliverable is sometimes just the right decision before the first line of code is written." },
  { id: 3, Icon: Cpu,        title: "Cloud & Infrastructure",             scope: "AWS · GCP · Azure",desc: "Scalable cloud architecture designed to survive real load and real failure — not just demos." },
  { id: 4, Icon: GitMerge,   title: "DevOps",                             scope: "CI/CD · IaC",     desc: "CI/CD, observability, and deployment pipelines that let your team ship with confidence." },
  { id: 5, Icon: Zap,        title: "Integrations & Automation",          scope: "API · Workflow",  desc: "Connecting systems and automating workflows so your team spends time on what matters." },
  { id: 6, Icon: Globe,      title: "Websites & Web Applications",        scope: "Web",             desc: "From high-conversion marketing sites to complex interactive platforms — built to last." },
  { id: 7, Icon: Smartphone, title: "Mobile & Cross-Platform Apps",       scope: "iOS · Android",   desc: "Native-quality experiences on iOS and Android without the overhead of two separate teams." },
  { id: 8, Icon: Shield,     title: "Cybersecurity & Digital Resilience", scope: "Security",        desc: "Threat modeling, audits, and hardening for systems where security is non-negotiable." },
  { id: 9, Icon: RefreshCw,  title: "Legacy Modernization",               scope: "Migration",       desc: "Bringing old systems into the modern stack — carefully, without burning down what works." },
];

const TEAM = [
  { initials: "RK", name: "Raj Kumar",       role: "Co-founder",     accent: "#3b82f6", desc: "Systems architecture and code quality. Has built and broken enough systems to know the difference between clever and right." },
  { initials: "AT", name: "Ajith Thoutam",   role: "Co-founder",     accent: "#f59e0b", desc: "Cloud infrastructure and technical delivery. Has scaled systems that handle real load, in real production, with real consequences for failure." },
  { initials: "SR", name: "Satyakam Rahul",  role: "Senior Partner", accent: "#10b981", desc: "AI and applied research. Professor-level academic background across India, Nigeria, and beyond." },
];

const STATS = [
  { value: 20, suffix: "+", label: "Years Combined" },
  { value: 3,  suffix: "",  label: "Senior Principals" },
  { value: 0,  suffix: "",  label: "Junior Handoffs" },
];

const TESTIMONIALS = [
  { quote: "syphrX delivered production-grade infrastructure that scaled without a hitch. Their senior-only model is the real deal.", name: "David M.", role: "CTO, FinTech Startup" },
  { quote: "Best technical advisory engagement we've had. No fluff — straight to the structural problem and out with a solution.", name: "Sarah K.", role: "VP Engineering" },
  { quote: "The architecture review alone saved us months of rework. Genuinely exceptional level of expertise.", name: "Priya N.", role: "Founder, B2B SaaS" },
];

const SOCIAL_LINKS = [
  { Icon: Link2,         href: "https://github.com",   label: "GitHub"   },
  { Icon: Globe2,        href: "https://linkedin.com",  label: "LinkedIn" },
  { Icon: MessageSquare, href: "https://twitter.com",   label: "Twitter"  },
];

// ─── SCROLL PROGRESS ──────────────────────────────────────────────────────────

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 to-blue-400 origin-left z-[100] pointer-events-none"
      style={{ scaleX }}
    />
  );
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────

function Cursor() {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const dotX  = useSpring(mx, { stiffness: 600, damping: 30 });
  const dotY  = useSpring(my, { stiffness: 600, damping: 30 });
  const ringX = useSpring(mx, { stiffness: 130, damping: 22 });
  const ringY = useSpring(my, { stiffness: 130, damping: 22 });
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    const over  = (e: MouseEvent) => setHover(!!(e.target as HTMLElement).closest("a,button,[data-hover]"));
    const down  = () => setActive(true);
    const up    = () => setActive(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup",   up);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup",   up);
      document.body.style.cursor = "";
    };
  }, [mx, my]);

  const ringSize = active ? 20 : hover ? 48 : 32;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-[7px] h-[7px] bg-blue-400 rounded-full pointer-events-none z-[999] mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[998] border border-blue-400/50"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", width: ringSize, height: ringSize, opacity: hover ? 0.9 : 0.4 }}
        transition={{ duration: 0.18 }}
      />
    </>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="border-y border-white/[0.06] bg-white/[0.015] py-3 overflow-hidden select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-7 text-[11px] font-semibold tracking-[0.18em] text-white/30 uppercase">
            <span className="w-1 h-1 rounded-full bg-blue-500/60 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── COUNT UP ─────────────────────────────────────────────────────────────────

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number;
    const duration = 1600;

    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── GRID BACKGROUND ──────────────────────────────────────────────────────────

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div className="relative h-px">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rounded-full border border-white/[0.1] bg-[#171717]" />
    </div>
  );
}

// ─── SPOTLIGHT CARD ───────────────────────────────────────────────────────────

function SpotlightCard({
  children,
  className = "",
  accent = "#3b82f6",
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-[inherit]"
        style={{
          opacity: visible ? 1 : 0,
          background: `radial-gradient(380px at ${pos.x}px ${pos.y}px, ${accent}18, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

// ─── FLOATING CODE BG ─────────────────────────────────────────────────────────

const CODE_SNIPPETS = [
  "fn deploy() {", "arch.validate()", "k8s.scale(3)", "if critical {",
  "git commit -m",  "SELECT * FROM",   "docker build",  "npm run prod",
  "SSL_VERIFY=true","REDIS_TTL=3600",  "pg.migrate()",  "async fn main()",
];

function FloatingCode() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {CODE_SNIPPETS.map((snippet, i) => (
        <motion.span
          key={i}
          className="absolute text-[11px] font-mono text-white/[0.04]"
          style={{ left: `${(i * 13 + 7) % 88}%`, top: `${(i * 17 + 5) % 85}%` }}
          animate={{ y: [0, -22, 0], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
        >
          {snippet}
        </motion.span>
      ))}
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_LINKS.forEach(({ href }) => {
      const el = document.getElementById(href);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(href); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-6xl mx-auto px-6 pt-5">
        <motion.div
          className={`flex items-center justify-between px-5 h-13 rounded-2xl transition-all duration-300 ${
            scrolled
              ? "bg-[#1c1c1c] border border-white/[0.09] shadow-2xl shadow-black/50"
              : "bg-[#1c1c1c]/80 backdrop-blur-xl border border-white/[0.06]"
          }`}
        >
          <a href="#" className="flex items-center gap-0.5 group">
            <span className="text-white text-lg font-black tracking-tight group-hover:text-white/75 transition-colors">syphr</span>
            <span className="text-blue-400 text-lg font-black">X</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }, i) => {
              const isActive = activeSection === href;
              return (
                <motion.a
                  key={href}
                  href={`#${href}`}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive ? "text-white" : "text-white/35 hover:text-white/70"
                  }`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.4 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/[0.07] rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </motion.a>
              );
            })}
          </nav>

          <motion.a
            href="#contact"
            className="flex items-center gap-1.5 bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.04, backgroundColor: "#60a5fa" }}
            whileTap={{ scale: 0.96 }}
          >
            Get in touch <ArrowUpRight size={13} />
          </motion.a>
        </motion.div>
      </div>
    </motion.header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#171717] overflow-hidden pt-16">
      <FloatingCode />

      {/* Breathing glow blob */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-56 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-24">
        {/* Rating + trust anchoring row */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="flex -space-x-2">
            {["RK", "AT", "SR"].map((init, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#171717] bg-gradient-to-br from-blue-500/40 to-slate-700 flex items-center justify-center text-[10px] font-bold text-white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.45 + i * 0.08, type: "spring", stiffness: 400 }}
              >
                {init}
              </motion.div>
            ))}
          </div>

          <div className="h-4 w-px bg-white/[0.1]" />

          {/* Rating badge */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-blue-400 text-blue-400" />
              ))}
            </div>
            <span className="text-sm font-semibold text-white/70">5.0</span>
            <span className="text-xs text-white/30">· Trusted by 30+ teams</span>
          </div>

          <div className="h-4 w-px bg-white/[0.1]" />

          <motion.span
            className="font-caveat text-[15px] font-bold text-white bg-white/[0.12] border border-white/20 px-3 py-1 rounded-full"
            animate={{ borderColor: ["rgba(255,255,255,0.15)", "rgba(255,255,255,0.3)", "rgba(255,255,255,0.15)"] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          >
            Senior-only delivery
          </motion.span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            {/* Headline */}
            <h1 className="text-6xl lg:text-[5.5rem] font-black leading-[1.02] tracking-tight mb-7">
              {[
                { word: "Disciplined", className: "text-white" },
                { word: "Engineering", className: "animated-gradient-text" },
              ].map(({ word, className }, wi) => (
                <span key={wi} className="block overflow-hidden">
                  <motion.span
                    className={`block ${className}`}
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ delay: 0.55 + wi * 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="text-[1.05rem] text-white/70 max-w-[420px] mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.6 }}
            >
              Senior technical execution and advisory for critical software infrastructure.
            </motion.p>

            {/* CTAs — clearly differentiated */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <motion.a
                href="#services"
                className="inline-flex items-center gap-2 bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-full shadow-xl shadow-blue-500/25 text-sm"
                whileHover={{ scale: 1.05, backgroundColor: "#60a5fa", boxShadow: "0 0 40px rgba(96,165,250,0.4)" }}
                whileTap={{ scale: 0.96 }}
              >
                Explore Capabilities <ChevronRight size={15} />
              </motion.a>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white/75 font-semibold px-7 py-3.5 rounded-full text-sm"
                whileHover={{
                  borderColor: "rgba(96,165,250,0.5)",
                  color: "rgba(255,255,255,0.95)",
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(59,130,246,0.1)",
                }}
                whileTap={{ scale: 0.96 }}
              >
                Get in touch <ArrowUpRight size={14} />
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 mt-12 pt-7 border-t border-white/[0.07]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-black text-white tabular-nums">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-white/35 mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right floating card */}
          <motion.div
            className="hidden lg:block mt-10"
            initial={{ opacity: 0, x: 50, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.65, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <SpotlightCard
                className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-8 backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                accent="#3b82f6"
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <motion.div
                    className="w-11 h-11 bg-blue-500/15 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20"
                    whileHover={{ scale: 1.12, backgroundColor: "rgba(59,130,246,0.22)" }}
                  >
                    <Zap size={18} />
                  </motion.div>
                  <span className="font-caveat text-sm font-bold text-white bg-white/[0.12] border border-white/20 px-3 py-1 rounded-full">
                    How we work ✦
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                  Improving the structural integrity and maintainability of critical systems.
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  We don't hand off to junior teams — we lead the work ourselves. When things go wrong, we fix them.
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {["Architecture", "DevOps", "Cloud"].map((tag) => (
                    <motion.span
                      key={tag}
                      className="text-xs bg-white/[0.05] border border-white/[0.1] text-white/45 px-2.5 py-1 rounded-full"
                      whileHover={{ borderColor: "rgba(96,165,250,0.45)", color: "rgba(255,255,255,0.7)" }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </SpotlightCard>

              {/* Floating pill */}
              <motion.div
                className="absolute -bottom-5 -left-6 bg-[#222222] border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <motion.div
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <span className="text-xs text-white/55 font-medium">No junior handoffs. Ever.</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" className="bg-[#171717] py-28 relative">
      <SectionDivider />

      <div className="max-w-6xl mx-auto px-6 mt-px">
        <motion.div
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <motion.span
              className="font-caveat text-xl text-blue-400 mb-2 block"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              What we do
            </motion.span>
            <h2 className="text-5xl font-black text-white">Capabilities</h2>
          </div>
          <p className="text-white/40 max-w-sm text-sm leading-relaxed md:text-right">
            Full lifecycle coverage — from architecture to deployment. We solve structural problems, not just implement features.
          </p>
        </motion.div>

        <div className="divide-y divide-white/[0.06] border border-white/[0.08] rounded-2xl overflow-hidden">
          {SERVICES.map((s, i) => {
            const Icon = s.Icon;
            const isOpen = open === i;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-colors duration-200 ${
                    isOpen ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                    isOpen ? "bg-blue-500/20 border border-blue-500/30 text-blue-400" : "bg-white/[0.04] border border-white/[0.08] text-white/35"
                  }`}>
                    <Icon size={14} />
                  </div>
                  <span className={`flex-1 text-sm font-medium transition-colors duration-200 ${isOpen ? "text-white" : "text-white/55"}`}>
                    {s.title}
                  </span>
                  <span className="text-[10px] text-white/20 mr-3 hidden sm:block">{s.scope}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-lg leading-none flex-shrink-0 transition-colors duration-200 ${isOpen ? "text-blue-400" : "text-white/20"}`}
                  >
                    +
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 flex items-start justify-between gap-6">
                        <p className="text-sm text-white/45 leading-relaxed max-w-xl">{s.desc}</p>
                        <a
                          href="#contact"
                          className="flex-shrink-0 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mt-0.5"
                        >
                          Discuss <ArrowUpRight size={11} />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── TEAM ─────────────────────────────────────────────────────────────────────

function Team() {
  return (
    <section id="about" className="bg-[#1c1c1c] py-28 relative">
      <SectionDivider />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-white/[0.1] to-transparent" />

      <div className="max-w-6xl mx-auto px-6 mt-px">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="font-caveat text-xl text-blue-400 mb-2 block">
            The people
          </span>
          <h2 className="text-5xl font-black text-white mb-4">The People.</h2>
          <p className="text-white/45 max-w-xl text-[1.05rem] leading-[1.65]">
            Principals who build and deliver. We don't hand off to junior teams — we lead the work ourselves. When things go wrong, we fix them.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-white/[0.025] border border-white/[0.08] rounded-2xl p-6 text-center group cursor-default shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ borderColor: "rgba(59,130,246,0.2)", backgroundColor: "rgba(59,130,246,0.04)" }}
            >
              <div className="text-4xl font-black text-white mb-1.5 tabular-nums">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-white/35 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Team cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.14, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -7 }}
            >
              <SpotlightCard
                className="bg-white/[0.025] border border-white/[0.08] rounded-2xl p-7 h-full group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                accent={member.accent}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black mb-5"
                  style={{ backgroundColor: member.accent + "1a", border: `1.5px solid ${member.accent}35` }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 350 }}
                >
                  <span style={{ color: member.accent }}>{member.initials}</span>
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4 block"
                  style={{ color: member.accent }}
                >
                  {member.role}
                </span>
                <p className="text-[13px] text-white/40 leading-relaxed">{member.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="bg-[#171717] py-24 relative">
      <SectionDivider />

      <div className="max-w-6xl mx-auto px-6 mt-px">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-caveat text-xl text-blue-400 mb-2 block">What clients say</span>
          <h2 className="text-4xl font-black text-white">Trusted words.</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard
                className="bg-white/[0.025] border border-white/[0.08] rounded-2xl p-7 h-full flex flex-col gap-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                accent="#3b82f6"
              >
                <Quote size={20} className="text-blue-500/50 flex-shrink-0" />
                <p className="text-[0.92rem] text-white/55 leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-slate-700 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80">{t.name}</div>
                    <div className="text-[11px] text-white/35">{t.role}</div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="bg-[#1c1c1c] py-32 relative overflow-hidden">
      <SectionDivider />

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(59,130,246,0.08) 0%, transparent 100%)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center mt-px">
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="font-caveat text-xl text-blue-400 mb-5 block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            Let's talk
          </motion.span>

          <h2 className="text-6xl lg:text-[5.5rem] font-black text-white mb-6 leading-[1.02]">
            Start a<br />
            <span className="animated-gradient-text">Conversation.</span>
          </h2>

          <p className="text-white/45 text-[1.05rem] mb-14 max-w-sm mx-auto leading-relaxed">
            Looking for senior technical expertise? Let's discuss your challenges.
          </p>

          {/* Animated email button */}
          <motion.a
            href="mailto:raj@syphrx.com"
            className="group inline-flex items-center gap-3 bg-white text-black font-bold text-lg px-8 py-4 rounded-full relative overflow-hidden shadow-2xl shadow-black/30"
            whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(96,165,250,0.25)" }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="relative flex items-center gap-3 group-hover:text-white transition-colors duration-350">
              <Mail size={18} />
              raj@syphrx.com
              <ArrowUpRight
                size={15}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </span>
          </motion.a>

          {/* Response badge */}
          <div className="flex justify-center mt-8">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-xs text-white/40">We typically respond within 24 hours</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#141414] border-t border-white/[0.06] py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/[0.05]">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-0.5 mb-2">
              <span className="text-white font-black text-lg">syphr</span>
              <span className="text-blue-400 font-black text-lg">X</span>
            </div>
            <p className="text-[13px] text-white/30 max-w-[220px] leading-snug">
              Disciplined engineering, delivered by principals.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={`#${href}`}
                className="text-sm text-white/30 hover:text-white/65 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/20 mr-1">Connect</span>
            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/35"
                whileHover={{ backgroundColor: "rgba(59,130,246,0.12)", borderColor: "rgba(59,130,246,0.3)", color: "rgba(255,255,255,0.8)", scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={14} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-xs text-white/20">© 2026 syphrX. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-[#171717] min-h-screen">
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Team />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
