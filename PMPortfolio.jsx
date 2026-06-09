import { useState, useEffect, useRef } from "react";

/* ─── EDIT THESE ─────────────────────────────── */
const ME = {
  name: "Anjali Shukla",
  title: "Product Manager",
  tagline: "I turn messy data into decisions that actually ship.",
  bio: "PM with a knack for making complexity legible — to users, to engineers, and to leadership. Currently exploring how vibe coding lets PMs prototype faster without engineering dependency.",
  email: "you@email.com",
  linkedin: "https://linkedin.com/in/yourhandle",
  github: "https://github.com/yourhandle",
};

const PROJECTS = [
  {
    id: 1,
    label: "Case study 01",
    title: "PM Metrics Dashboard",
    description:
      "A live SaaS product dashboard tracking MAU, churn, NPS, and MRR — with a filterable feature request table and time-range toggle. Built in a single afternoon using vibe coding, zero engineering support.",
    tags: ["React", "Recharts", "Vibe coding", "SaaS metrics"],
    url: "https://your-dashboard-url.vercel.app",
    stat: { value: "24,500", label: "Monthly active users tracked" },
    live: true,
  },
  {
    id: 2,
    label: "Case study 02",
    title: "Feature Prioritization Tool",
    description:
      "An interactive RICE scoring calculator that lets PMs weight features across Reach, Impact, Confidence, and Effort — with a live-sorted backlog view. Built to replace the spreadsheet my team used for quarterly planning.",
    tags: ["React", "Data viz", "Prioritization"],
    url: "#",
    stat: { value: "3×", label: "faster than spreadsheet workflow" },
    live: false,
  },
  {
    id: 3,
    label: "Case study 03",
    title: "A/B Test Results Analyzer",
    description:
      "A dashboard for interpreting experiment results — statistical significance calculator, variant comparison charts, and a plain-English summary of what the data means for the product decision.",
    tags: ["React", "Experimentation", "Statistics"],
    url: "#",
    stat: { value: "< 5min", label: "to read any experiment result" },
    live: false,
  },
];
/* ─────────────────────────────────────────────── */

/* ── Theme tokens ── */
const T = {
  primary:     "#0891B2", /* aqua-600 — main accent          */
  primaryDark: "#0E7490", /* cyan-700 — text on light fills  */
  primaryDeep: "#164E63", /* cyan-900 — darkest accent       */
  fillXLight:  "#ECFEFF", /* cyan-50  — tag bg, icon bg      */
  fillLight:   "#F0FDFA", /* teal-50  — section bg, hover    */
  fillMid:     "#CFFAFE", /* cyan-100 — button border, lines */
  borderAccent:"#A5F3FC", /* cyan-200 — card hover border    */
  barPassive:  "#A5F3FC", /* chart bars non-active           */
};

/* ── Animated counter hook ── */
function useCounter(target, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ── Mini dashboard SVG preview ── */
function DashPreview({ colors }) {
  const bars = [45, 62, 38, 78, 55, 91];
  const c = colors || {
    bar: T.barPassive,
    barActive: T.primary,
    card: T.fillXLight,
    line: T.fillMid,
  };
  return (
    <svg viewBox="0 0 180 110" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }} aria-hidden="true">
      <rect x="0" y="0" width="180" height="110" rx="6" fill="#FAFAFA" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={6 + i * 58} y={6} width={52} height={20} rx={3} fill={c.card} />
      ))}
      <rect x="6" y="34" width="108" height="70" rx="3" fill="white" stroke={c.line} strokeWidth="0.5" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={14 + i * 16}
          y={34 + 70 - 8 - (h / 100) * 52}
          width={10}
          height={(h / 100) * 52}
          rx={2}
          fill={i === bars.length - 1 ? c.barActive : c.bar}
        />
      ))}
      <rect x="120" y="34" width="54" height="32" rx="3" fill="white" stroke={c.line} strokeWidth="0.5" />
      <rect x="126" y="40" width="30" height="3" rx="1.5" fill={c.line} />
      <rect x="126" y="47" width="20" height="3" rx="1.5" fill={c.barActive} opacity="0.5" />
      <rect x="126" y="54" width="25" height="3" rx="1.5" fill={c.line} />
      <rect x="120" y="72" width="54" height="32" rx="3" fill="white" stroke={c.line} strokeWidth="0.5" />
      <rect x="126" y="78" width="22" height="3" rx="1.5" fill={c.line} />
      <rect x="126" y="85" width="36" height="3" rx="1.5" fill={c.barActive} opacity="0.4" />
      <rect x="126" y="92" width="28" height="3" rx="1.5" fill={c.line} />
    </svg>
  );
}

/* ── Thin horizontal rule ── */
const HR = () => (
  <div style={{ height: "0.5px", background: "#E8E8F0", margin: "0" }} />
);

/* ── Tag pill ── */
const Tag = ({ label }) => (
  <span style={{
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "99px",
    fontSize: "11px",
    fontWeight: 500,
    background: T.fillXLight,
    color: T.primaryDark,
    marginRight: "5px",
    marginBottom: "5px",
    letterSpacing: "0.01em",
  }}>
    {label}
  </span>
);

/* ── Project card ── */
function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 200px",
        gap: "0",
        background: hovered ? "#F5FFFE" : "#FFFFFF",
        border: "0.5px solid",
        borderColor: hovered ? T.borderAccent : "#E8E8F0",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "border-color 0.2s, background 0.2s",
        cursor: "default",
      }}
    >
      {/* Left: content */}
      <div style={{ padding: "28px 32px" }}>
        <div style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: T.primary,
          marginBottom: "10px",
        }}>
          {project.label}
        </div>

        <div style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "#0A0A0A",
          letterSpacing: "-0.02em",
          marginBottom: "10px",
          lineHeight: 1.2,
        }}>
          {project.title}
        </div>

        <div style={{
          fontSize: "13px",
          color: "#6B6B80",
          lineHeight: 1.7,
          marginBottom: "16px",
          maxWidth: "480px",
        }}>
          {project.description}
        </div>

        <div style={{ marginBottom: "20px" }}>
          {project.tags.map((t) => <Tag key={t} label={t} />)}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {project.live ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "13px",
                fontWeight: 500,
                color: T.primary,
                textDecoration: "none",
                padding: "7px 16px",
                borderRadius: "8px",
                border: `0.5px solid ${T.primary}`,
                transition: "background 0.15s",
                background: hovered ? T.fillXLight : "transparent",
              }}
            >
              View live dashboard →
            </a>
          ) : (
            <span style={{
              fontSize: "12px",
              color: "#B0B0C0",
              padding: "7px 0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#D0D0E0", display: "inline-block",
              }} />
              In progress
            </span>
          )}

          <div style={{ borderLeft: "0.5px solid #E8E8F0", paddingLeft: "20px" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#0A0A0A", lineHeight: 1 }}>
              {project.stat.value}
            </div>
            <div style={{ fontSize: "11px", color: "#A0A0B0", marginTop: "3px" }}>
              {project.stat.label}
            </div>
          </div>
        </div>
      </div>

      {/* Right: preview */}
      <div style={{
        background: hovered ? T.fillLight : "#F7FFFE",
        borderLeft: "0.5px solid #E8E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        transition: "background 0.2s",
      }}>
        <DashPreview
          colors={
            project.live
              ? { bar: T.barPassive, barActive: T.primary, card: T.fillXLight, line: T.fillMid }
              : { bar: "#E0E0F0", barActive: "#B0B0D0", card: "#F5F5FA", line: "#E8E8F0" }
          }
        />
      </div>
    </div>
  );
}

/* ── Main portfolio ── */
export default function PMPortfolio() {
  const heroRef = useRef(null);
  const [counterStarted, setCounterStarted] = useState(false);
  const mau = useCounter(24500, 1800, counterStarted);

  useEffect(() => {
    const timer = setTimeout(() => setCounterStarted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#FFFFFF",
      color: "#0A0A0A",
      minHeight: "100vh",
    }}>

      {/* ── Nav ── */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 48px",
        borderBottom: "0.5px solid #E8E8F0",
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
      }}>
        <div style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "-0.01em", color: "#0A0A0A" }}>
          Anjali
          <span style={{ color: T.primary }}>.</span>
        </div>
        <div style={{ display: "flex", gap: "32px" }}>
          {[["Work", "work"], ["About", "about"], ["Contact", "contact"]].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", color: "#6B6B80", fontWeight: 500,
                transition: "color 0.15s", padding: 0,
              }}
              onMouseEnter={(e) => e.target.style.color = "#0A0A0A"}
              onMouseLeave={(e) => e.target.style.color = "#6B6B80"}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "80px 48px 72px",
        position: "relative",
      }}>
        {/* Live metric counter — signature element */}
        <div style={{
          position: "absolute",
          top: "72px",
          right: "48px",
          textAlign: "right",
          opacity: 0.9,
        }}>
          <div style={{
            fontSize: "36px",
            fontWeight: 700,
            color: T.primary,
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}>
            {mau.toLocaleString()}
          </div>
          <div style={{ fontSize: "10px", color: "#A0A0B8", marginTop: "4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            MAU · live dashboard
          </div>
        </div>

        <div style={{
          display: "inline-block",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: T.primary,
          background: T.fillXLight,
          padding: "5px 12px",
          borderRadius: "99px",
          marginBottom: "24px",
        }}>
          {ME.title}
        </div>

        <h1 style={{
          fontSize: "clamp(42px, 7vw, 68px)",
          fontWeight: 700,
          letterSpacing: "-0.035em",
          lineHeight: 1.05,
          color: "#0A0A0A",
          margin: "0 0 24px",
          fontFamily: "Georgia, 'Times New Roman', serif",
          maxWidth: "580px",
        }}>
          {ME.name}
        </h1>

        <p style={{
          fontSize: "18px",
          color: "#6B6B80",
          lineHeight: 1.6,
          maxWidth: "480px",
          margin: "0 0 36px",
        }}>
          {ME.tagline}
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => scrollTo("work")}
            style={{
              padding: "11px 24px",
              borderRadius: "8px",
              border: "none",
              background: T.primary,
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.88"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            View my work
          </button>
          <a
            href={`mailto:${ME.email}`}
            style={{
              padding: "11px 24px",
              borderRadius: "8px",
              border: `0.5px solid ${T.fillMid}`,
              background: "transparent",
              color: T.primary,
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.15s",
              display: "inline-flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = T.fillLight}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Get in touch
          </a>
        </div>
      </section>

      <HR />

      {/* ── Work ── */}
      <section id="work" style={{ background: "#F7FFFE", padding: "72px 0" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.primary, marginBottom: "8px" }}>
                Selected work
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", color: "#0A0A0A", margin: 0, lineHeight: 1.2 }}>
                Products I've built
              </h2>
            </div>
            <div style={{ fontSize: "12px", color: "#B0B0C0" }}>
              All built with vibe coding
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      <HR />

      {/* ── About ── */}
      <section id="about" style={{ padding: "72px 0" }}>
        <div style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "0 48px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.primary, marginBottom: "12px" }}>
              About
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", color: "#0A0A0A", marginBottom: "16px", lineHeight: 1.2 }}>
              How I work
            </h2>
            <p style={{ fontSize: "15px", color: "#6B6B80", lineHeight: 1.8, margin: "0 0 20px" }}>
              {ME.bio}
            </p>
            <p style={{ fontSize: "15px", color: "#6B6B80", lineHeight: 1.8, margin: 0 }}>
              I believe the best PMs reduce friction between insight and action — whether that's a cleaner dashboard, a better-written spec, or a prototype that makes a fuzzy idea concrete.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Primary skill", value: "Product strategy & roadmapping" },
              { label: "Technical edge", value: "Vibe coding — ship prototypes fast" },
              { label: "Data fluency", value: "SQL, dashboards, experimentation" },
              { label: "Domain depth", value: "SaaS, B2B, growth products" },
            ].map((item) => (
              <div key={item.label} style={{
                padding: "14px 18px",
                background: T.fillXLight,
                border: `0.5px solid ${T.fillMid}`,
                borderRadius: "10px",
              }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B0B0C0", marginBottom: "4px" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#0A0A0A" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HR />

      {/* ── Contact ── */}
      <section id="contact" style={{ padding: "72px 0 100px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ maxWidth: "480px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.primary, marginBottom: "12px" }}>
              Contact
            </div>
            <h2 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-0.025em", color: "#0A0A0A", marginBottom: "16px", lineHeight: 1.15 }}>
              Let's talk.
            </h2>
            <p style={{ fontSize: "15px", color: "#6B6B80", lineHeight: 1.7, marginBottom: "32px" }}>
              Open to senior PM roles at product-led companies. I respond to every genuine message within 24 hours.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a
                href={`mailto:${ME.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 20px",
                  background: T.fillXLight,
                  border: `0.5px solid ${T.fillMid}`,
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "#0A0A0A",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.borderAccent; e.currentTarget.style.background = T.fillLight; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.fillMid; e.currentTarget.style.background = T.fillXLight; }}
              >
                <span style={{ width: "32px", height: "32px", borderRadius: "8px", background: T.fillMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>✉</span>
                {ME.email}
              </a>

              <a
                href={ME.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 20px",
                  background: T.fillXLight,
                  border: `0.5px solid ${T.fillMid}`,
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "#0A0A0A",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.borderAccent; e.currentTarget.style.background = T.fillLight; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.fillMid; e.currentTarget.style.background = T.fillXLight; }}
              >
                <span style={{ width: "32px", height: "32px", borderRadius: "8px", background: T.fillMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>in</span>
                LinkedIn profile →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <div style={{
        borderTop: "0.5px solid #E8E8F0",
        padding: "20px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: "12px", color: "#C0C0D0" }}>
          {ME.name} · Built with vibe coding
        </span>
        <span style={{ fontSize: "12px", color: "#C0C0D0" }}>
          {new Date().getFullYear()}
        </span>
      </div>

    </div>
  );
}
