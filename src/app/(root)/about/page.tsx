"use client";

import Navbar from "@/component/organisms/Navbar";
import Footer from "@/component/organisms/Footer";
import "./style.css";

const stats = [
  { value: "1,000+", label: "Students Mentored" },
  { value: "Grades 2–12", label: "Age Range Served" },
  { value: "NEP 2020", label: "Aligned Curriculum" },
  { value: "4 Modules", label: "Learning Areas" },
];

const values = [
  {
    icon: "🧠",
    title: "Think First",
    description:
      "We nurture critical thinking and logical reasoning before introducing technology. Minds that think clearly build better with AI.",
  },
  {
    icon: "💻",
    title: "Build with Code",
    description:
      "From visual blocks to real Python — students progress at their own pace, building confidence with every line of code.",
  },
  {
    icon: "🤖",
    title: "Explore AI & Robotics",
    description:
      "Kids don't just use AI — they understand it, train it, and question it. Real robots, real sensors, real learning.",
  },
  {
    icon: "🌱",
    title: "Grow for Tomorrow",
    description:
      "Our mission is to prepare students not just for exams but for a future shaped by AI, automation, and creative problem-solving.",
  },
];

const timeline = [
  {
    year: "2020",
    event: "CareerCafe founded — mentoring students into top tech companies.",
  },
  {
    year: "2022",
    event:
      "Mentored 500+ students. Realized the 8–16 learning gap in Indian schools.",
  },
  {
    year: "2024",
    event:
      "EasyCode launched with 4 integrated modules: EasyCode, EasyAI, EasyBot, EasyThink.",
  },
  {
    year: "2025",
    event: "Aligned with NEP 2020. Partnered with CBSE & State Board schools.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />

      {/* ── HERO ── */}
      <section className="ab-hero">
        <span className="ab-badge">Who We Are</span>
        <h1 className="ab-hero-title">
          Building <span className="ab-accent">Future-Ready Minds</span> for the
          AI Era
        </h1>
        <p className="ab-hero-sub">
          EasyCode is an AI-first EdTech platform integrating coding, AI,
          robotics, and critical thinking — designed for students aged 8–16
          across Indian schools, aligned with NEP 2020.
        </p>
        <div className="ab-hero-tags">
          {[
            "NEP 2020 Aligned",
            "CBSE & ICSE Ready",
            "Grades 2–12",
            "Teacher-First",
          ].map((t) => (
            <span key={t} className="ab-tag">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="ab-stats">
        {stats.map((s) => (
          <div key={s.label} className="ab-stat">
            <span className="ab-stat-val">{s.value}</span>
            <span className="ab-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── MISSION ── */}
      <section className="ab-section">
        <div className="ab-section-inner">
          <span className="ab-label">Our Mission</span>
          <h2 className="ab-title">Why EasyCode Exists</h2>
          <div className="ab-mission-grid">
            <div className="ab-mission-card ab-card-highlight">
              <h3>The Gap We Saw</h3>
              <p>
                Our education system misses the critical 8–16 age window — when
                children&apos;s brains are neurologically primed for abstract
                reasoning. Schools introduce logic, coding, and problem-solving
                far too late, just as AI reshapes every career students will
                enter.
              </p>
            </div>
            <div className="ab-mission-card">
              <h3>What We Do</h3>
              <p>
                After mentoring 1,000+ students into top tech companies through
                CareerCafe, we designed EasyCode to close this gap — fusing
                critical thinking, coding fluency, and AI literacy into one
                connected learning journey.
              </p>
            </div>
            <div className="ab-mission-card">
              <h3>Our Approach</h3>
              <p>
                We nurture reasoning before syntax. Students build logic first,
                then layer on coding, AI, and robotics — creating confident
                creators who don&apos;t just use technology but think through it
                and innovate with it.
              </p>
            </div>
            <div className="ab-mission-card ab-card-quote">
              <span className="ab-quote-mark">&ldquo;</span>
              <p>
                In an age where machines can think, our mission is to help
                children think smarter.
              </p>
              <span className="ab-quote-author">— Founder, EasyCode</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="ab-section ab-section-alt">
        <div className="ab-section-inner">
          <span className="ab-label">Our Values</span>
          <h2 className="ab-title">The EasyCode Philosophy</h2>
          <div className="ab-values-grid">
            {values.map((v) => (
              <div key={v.title} className="ab-value-card">
                <span className="ab-value-icon">{v.icon}</span>
                <h3 className="ab-value-title">{v.title}</h3>
                <p className="ab-value-desc">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="ab-section">
        <div className="ab-section-inner">
          <span className="ab-label">Our Journey</span>
          <h2 className="ab-title">How EasyCode Grew</h2>
          <div className="ab-timeline">
            {timeline.map((item, i) => (
              <div key={i} className="ab-timeline-item">
                <div className="ab-timeline-year">{item.year}</div>
                <div className="ab-timeline-dot" />
                <div className="ab-timeline-event">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION BANNER ── */}
      <section className="ab-vision">
        <div className="ab-vision-inner">
          <span className="ab-label ab-label-light">Our Vision</span>
          <h2 className="ab-vision-title">
            Turning Curiosity into a Lifelong Superpower
          </h2>
          <p className="ab-vision-text">
            EasyCode transforms raw childhood curiosity into confident creators.
            We don&apos;t just teach kids to use technology — we train young
            minds to think critically, build creatively, and lead in a world
            shaped by AI.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
