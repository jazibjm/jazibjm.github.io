import { useEffect, useState } from 'react'
import {
  aboutProse,
  quickFacts,
  skillGroups,
  projects,
  experience,
  education,
  certs,
  honors,
  socials,
} from './data.js'

const MONO = "'JetBrains Mono', monospace"
const GROTESK = "'Space Grotesk', sans-serif"

// CRT config — scanline + flicker overlays that give the page its retro look.
const CONFIG = { scanlines: true, flicker: true }

// Reveal `text` one character at a time while `active` is true; when inactive,
// the full text is shown immediately. Returns the visible slice + done flag.
function useTypewriter(text, active, speed = 90) {
  const [n, setN] = useState(active ? 0 : text.length)
  useEffect(() => {
    setN(active ? 0 : text.length)
  }, [active, text])
  useEffect(() => {
    if (!active || n >= text.length) return
    const id = setTimeout(() => setN((c) => c + 1), speed)
    return () => clearTimeout(id)
  }, [active, n, text, speed])
  return { shown: text.slice(0, n), done: n >= text.length }
}

// Tracks whether the viewport is at/below `maxWidth` (mobile breakpoint).
function useIsMobile(maxWidth = 760) {
  const q = `(max-width:${maxWidth}px)`
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = (e) => setM(e.matches)
    mq.addEventListener('change', on)
    setM(mq.matches)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

// Render the hero name, breaking the first space onto a second line.
function renderName(s) {
  const idx = s.indexOf(' ')
  if (idx === -1) return s
  return (
    <>
      {s.slice(0, idx)}
      <br />
      {s.slice(idx + 1)}
    </>
  )
}

export default function App() {
  const isMobile = useIsMobile()

  // Hero name types itself out on load.
  const heroName = useTypewriter('Jazib Malik', true, 95)

  const projectsView = projects.map((p, i) => ({
    ...p,
    num: String(i + 1).padStart(2, '0'),
    isInProgress: p.status === 'in progress',
  }))

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#060807',
        color: '#2fd968',
        fontFamily: MONO,
        overflowX: 'hidden',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {/* nav */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            backdropFilter: 'blur(10px)',
            background: 'rgba(5,8,6,.82)',
            borderBottom: '1px solid #14241a',
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: '0 auto',
              padding: isMobile ? '11px 16px' : '15px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              rowGap: 10,
              gap: isMobile ? 10 : 20,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: isMobile ? 13 : 14, letterSpacing: '1.5px', color: '#eafff0' }}>
              JAZIB&nbsp;MALIK <span style={{ color: '#1c7a3c' }}>/ swe</span>
            </div>
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: isMobile ? '8px 14px' : '0px 24px',
                fontFamily: MONO,
                fontSize: isMobile ? 12 : 13,
                width: isMobile ? '100%' : 'auto',
              }}
            >
              {['about', 'work', 'skills', 'experience', 'education', 'certs', 'honors', 'contact'].map((id) => (
                <a key={id} href={'#' + id} className="dc-navlink" style={{ color: '#6f9c80', textDecoration: 'none' }}>
                  {id}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <main style={{ maxWidth: 1180, margin: '0 auto', padding: isMobile ? '0 16px' : '0 28px' }}>
          {/* hero */}
          <section
            style={{
              padding: isMobile ? '40px 0 36px' : '84px 0 68px',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.08fr .92fr',
              gap: isMobile ? 30 : 54,
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontFamily: MONO, color: '#1c7a3c', fontSize: isMobile ? 10.5 : 12, letterSpacing: isMobile ? '1.5px' : '2.5px', marginBottom: isMobile ? 16 : 22 }}>
                // FULL-STACK&nbsp;SOFTWARE&nbsp;ENGINEER · CS&nbsp;@&nbsp;VIRGINIA&nbsp;TECH
              </div>
              <h1
                style={{
                  fontFamily: GROTESK,
                  fontWeight: 700,
                  fontSize: isMobile ? 48 : 76,
                  lineHeight: 0.96,
                  margin: 0,
                  minHeight: '1.92em', // reserve two lines so the typing name doesn't shift layout
                  color: '#eafff0',
                  letterSpacing: isMobile ? '-1.5px' : '-2.5px',
                }}
              >
                {renderName(heroName.shown)}
                <span style={{ color: '#2fd968', animation: 'blink 1.1s step-end infinite' }}>_</span>
              </h1>
              <p style={{ fontFamily: GROTESK, fontSize: isMobile ? 17 : 20, lineHeight: 1.5, color: '#9fd3b0', maxWidth: 460, margin: isMobile ? '20px 0 0' : '26px 0 0' }}>
                I build full-stack applications from idea to deployment, combining modern web technologies with scalable backend systems and cloud infrastructure.
              </p>
              <div style={{ display: 'flex', gap: 13, marginTop: 34, flexWrap: 'wrap' }}>
                <a
                  href="#work"
                  className="dc-primary"
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    textDecoration: 'none',
                    background: '#2fd968',
                    color: '#04140a',
                    fontWeight: 700,
                    padding: '13px 22px',
                    borderRadius: 3,
                  }}
                >
                  view work ▸
                </a>
                <a
                  href="#contact"
                  className="dc-open-btn"
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    textDecoration: 'none',
                    background: 'transparent',
                    color: '#2fd968',
                    border: '1px solid #2a5a38',
                    padding: '13px 22px',
                    borderRadius: 3,
                  }}
                >
                  get in touch
                </a>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  marginTop: 30,
                  fontFamily: MONO,
                  fontSize: 12,
                  color: '#6f9c80',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2fd968', boxShadow: '0 0 8px #2fd968', display: 'inline-block' }} />
                open to software engineering internships
              </div>
            </div>

            {/* decorative terminal card */}
            <div
              style={{
                border: '1px solid #16331f',
                borderRadius: 6,
                overflow: 'hidden',
                background: '#000810',
                boxShadow: '0 24px 60px rgba(0,0,0,.5)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '10px 13px',
                  background: '#0a0f0b',
                  borderBottom: '1px solid #16331f',
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#e8604a', display: 'inline-block' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#e0b341', display: 'inline-block' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#2fd968', display: 'inline-block' }} />
                <span style={{ flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: 11, color: '#6f9c80' }}>~/whoami</span>
              </div>
              <div style={{ padding: 20, fontFamily: MONO, fontSize: 13, lineHeight: 1.85, textShadow: '0 0 6px rgba(60,255,120,.35)' }}>
                <div>
                  <span style={{ color: '#74ffa6' }}>jazib@ctf:~$</span> <span style={{ color: '#cfeedb' }}>whoami</span>
                </div>
                <div style={{ color: '#2fd968' }}>jazib_malik</div>
                <div>
                  <span style={{ color: '#74ffa6' }}>jazib@ctf:~$</span> <span style={{ color: '#cfeedb' }}>cat role.txt</span>
                </div>
                <div style={{ color: '#2fd968' }}>full-stack software engineer</div>
                <div>
                  <span style={{ color: '#74ffa6' }}>jazib@ctf:~$</span> <span style={{ color: '#cfeedb' }}>npm run deploy</span>
                </div>
                <div style={{ color: '#9fd3b0' }}>
                  [+] build passed · <span style={{ color: '#2fd968' }}>shipped to production ✓</span>
                </div>
                <div>
                  <span style={{ color: '#74ffa6' }}>jazib@ctf:~$</span>{' '}
                  <span style={{ background: '#2fd968', color: '#000', animation: 'blink 1.1s step-end infinite' }}>&nbsp;</span>
                </div>
              </div>
            </div>
          </section>

          {/* about */}
          <section id="about" style={{ padding: isMobile ? '40px 0' : '64px 0', borderTop: '1px solid #14241a' }}>
            <SectionLabel text="01 / ABOUT" />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', gap: isMobile ? 18 : 50 }}>
              <h2
                style={{
                  fontFamily: GROTESK,
                  fontSize: isMobile ? 28 : 38,
                  fontWeight: 600,
                  color: '#eafff0',
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: '-1px',
                }}
              >
                Full-stack,
                <br />
                end to end.
              </h2>
              <div>
                <p style={{ fontFamily: GROTESK, fontSize: isMobile ? 16 : 18, lineHeight: 1.7, color: '#9fd3b0', margin: '0 0 22px' }}>
                  {aboutProse}
                </p>
                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                  {quickFacts.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontFamily: MONO,
                        fontSize: 12,
                        color: '#2fd968',
                        border: '1px solid #16331f',
                        padding: '5px 11px',
                        borderRadius: 3,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* work */}
          <section id="work" style={{ padding: isMobile ? '40px 0' : '64px 0', borderTop: '1px solid #14241a' }}>
            <SectionLabel text="02 / SELECTED&nbsp;WORK" />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 14 : 20 }}>
              {projectsView.map((p) => (
                <a
                  key={p.name}
                  href={p.link}
                  target="_blank"
                  rel="noopener"
                  className="dc-proj-card"
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    background: '#0a0f0b',
                    border: '1px solid #14241a',
                    borderRadius: 4,
                    padding: isMobile ? 22 : 28,
                    transition: 'transform .18s,border-color .18s,background .18s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: MONO,
                      fontSize: 12,
                      color: '#1c7a3c',
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span>{p.num}</span>
                      {p.isInProgress && (
                        <span
                          style={{
                            color: '#e0b341',
                            border: '1px solid #5a4a18',
                            borderRadius: 2,
                            padding: '2px 7px',
                            fontSize: 10,
                            letterSpacing: '.5px',
                          }}
                        >
                          IN&nbsp;PROGRESS
                        </span>
                      )}
                    </span>
                    <span style={{ color: '#2fd968' }}>↗</span>
                  </div>
                  <h3 style={{ fontFamily: GROTESK, fontSize: isMobile ? 22 : 25, fontWeight: 600, color: '#eafff0', margin: '0 0 11px' }}>{p.name}</h3>
                  <p style={{ fontFamily: GROTESK, fontSize: 15, lineHeight: 1.55, color: '#8fbf9f', margin: '0 0 20px' }}>{p.desc}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: MONO,
                          fontSize: 11,
                          color: '#2fd968',
                          border: '1px solid #16331f',
                          padding: '3px 9px',
                          borderRadius: 2,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* skills */}
          <section id="skills" style={{ padding: isMobile ? '40px 0' : '64px 0', borderTop: '1px solid #14241a' }}>
            <SectionLabel text="03 / TOOLKIT" />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 14 : 20 }}>
              {skillGroups.map((g) => (
                <div key={g.title} style={{ border: '1px solid #14241a', borderRadius: 4, padding: 26, background: '#0a0f0b' }}>
                  <div style={{ fontFamily: MONO, fontSize: 13, color: '#74ffa6', marginBottom: 18, letterSpacing: '.5px' }}>
                    [ {g.title} ]
                  </div>
                  <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                    {g.items.map((it) => (
                      <span
                        key={it}
                        style={{
                          fontFamily: MONO,
                          fontSize: 13,
                          color: '#2fd968',
                          background: 'rgba(20,40,24,.4)',
                          border: '1px solid #16331f',
                          padding: '5px 11px',
                          borderRadius: 3,
                        }}
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* experience */}
          <section id="experience" style={{ padding: isMobile ? '40px 0' : '64px 0', borderTop: '1px solid #14241a' }}>
            <SectionLabel text="04 / EXPERIENCE" tight />
            {experience.map((e) => (
              <TimelineRow key={e.role + e.year} e={e} isMobile={isMobile} />
            ))}
          </section>

          {/* education */}
          <section id="education" style={{ padding: isMobile ? '40px 0' : '64px 0', borderTop: '1px solid #14241a' }}>
            <SectionLabel text="05 / EDUCATION" tight />
            {education.map((e) => (
              <TimelineRow key={e.role + e.year} e={e} isMobile={isMobile} />
            ))}
          </section>

          {/* certs */}
          <section id="certs" style={{ padding: isMobile ? '40px 0' : '64px 0', borderTop: '1px solid #14241a' }}>
            <SectionLabel text="06 / CERTIFICATIONS" />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fit,minmax(190px,1fr))', gap: isMobile ? 12 : 18 }}>
              {certs.map((c) => (
                <div
                  key={c.code}
                  className="dc-cert-card"
                  style={{ background: '#0a0f0b', border: '1px solid #14241a', borderRadius: 4, padding: isMobile ? '22px 14px' : '30px 22px', textAlign: 'center' }}
                >
                  <div
                    style={{
                      fontFamily: GROTESK,
                      fontSize: isMobile ? 24 : 30,
                      fontWeight: 700,
                      color: '#2fd968',
                      textShadow: '0 0 16px rgba(47,217,104,.4)',
                      marginBottom: 9,
                      letterSpacing: '.5px',
                    }}
                  >
                    {c.code}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 12, lineHeight: 1.5, color: '#8fbf9f' }}>{c.name}</div>
                </div>
              ))}
            </div>
          </section>

          {/* honors */}
          <section id="honors" style={{ padding: isMobile ? '40px 0' : '64px 0', borderTop: '1px solid #14241a' }}>
            <SectionLabel text="07 / HONORS&nbsp;&amp;&nbsp;AWARDS" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              {honors.map((h) => (
                <div
                  key={h}
                  className="dc-cert-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 13,
                    background: '#0a0f0b',
                    border: '1px solid #14241a',
                    borderRadius: 4,
                    padding: '20px 22px',
                  }}
                >
                  <span style={{ color: '#2fd968', fontSize: 18, textShadow: '0 0 12px rgba(47,217,104,.5)' }}>★</span>
                  <span style={{ fontFamily: MONO, fontSize: 14, lineHeight: 1.45, color: '#cfeedb' }}>{h}</span>
                </div>
              ))}
            </div>
          </section>

          {/* contact */}
          <section id="contact" style={{ padding: isMobile ? '46px 0 32px' : '80px 0 40px', borderTop: '1px solid #14241a' }}>
            <SectionLabel text="08 / CONTACT" half />
            <h2
              style={{
                fontFamily: GROTESK,
                fontSize: isMobile ? 36 : 60,
                fontWeight: 700,
                color: '#eafff0',
                lineHeight: 1,
                margin: isMobile ? '0 0 26px' : '0 0 40px',
                letterSpacing: isMobile ? '-1px' : '-2px',
              }}
            >
              Let's build
              <br />
              something.
            </h2>
            <div style={{ borderBottom: '1px solid #14241a' }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="dc-social"
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? 3 : 0,
                    textDecoration: 'none',
                    borderTop: '1px solid #14241a',
                    padding: isMobile ? '16px 0' : '22px 0',
                    fontFamily: GROTESK,
                    fontSize: isMobile ? 19 : 24,
                    color: '#cfeedb',
                    transition: 'padding .18s,color .18s',
                  }}
                >
                  <span>{s.label}</span>
                  <span className="dc-social-meta" style={{ fontFamily: MONO, fontSize: isMobile ? 12 : 14, color: '#6f9c80', wordBreak: 'break-all' }}>
                    {s.display} ↗
                  </span>
                </a>
              ))}
            </div>
            <div style={{ marginTop: 34, fontFamily: MONO, fontSize: 12, color: '#6f9c80' }}>built in the terminal · © 2026</div>
          </section>
        </main>
      </div>

      {/* ================= CRT OVERLAYS ================= */}
      {CONFIG.scanlines && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 60,
              background: 'linear-gradient(rgba(18,40,24,0) 50%,rgba(0,0,0,.32) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
          <div
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 60,
              background: 'radial-gradient(ellipse at center,rgba(0,0,0,0) 52%,rgba(0,0,0,.55) 100%)',
            }}
          />
        </>
      )}
      {CONFIG.flicker && (
        <>
          <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: 0,
              height: 150,
              pointerEvents: 'none',
              zIndex: 61,
              background: 'linear-gradient(rgba(120,255,160,0) 0%,rgba(80,255,140,.05) 50%,rgba(120,255,160,0) 100%)',
              animation: 'scanmove 7s linear infinite',
            }}
          />
          <div
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 62,
              background: '#000',
              opacity: 0,
              animation: 'flicker 4s steps(1) infinite',
            }}
          />
        </>
      )}
    </div>
  )
}

// Section header: number label + trailing rule. `tight`/`half` match the
// design's varying bottom margins (24px / 34px vs the default 40px).
function SectionLabel({ text, tight, half }) {
  const mb = tight ? 24 : half ? 34 : 40
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: mb }}>
      <span
        style={{ fontFamily: MONO, fontSize: 12, color: '#2fd968', letterSpacing: '1px' }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <span style={{ flex: 1, height: 1, background: '#14241a' }} />
    </div>
  )
}

// Shared row for the Experience and Education timelines.
function TimelineRow({ e, isMobile }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '170px 1fr',
        gap: isMobile ? 6 : 28,
        padding: isMobile ? '20px 0' : '26px 0',
        borderTop: '1px solid #14241a',
        alignItems: 'start',
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: isMobile ? 12.5 : 14, color: '#2fd968', paddingTop: isMobile ? 0 : 4, letterSpacing: isMobile ? '.5px' : 0 }}>
        {e.year}
      </div>
      <div>
        <div style={{ fontFamily: GROTESK, fontSize: isMobile ? 19 : 22, fontWeight: 600, color: '#eafff0', marginBottom: 4 }}>
          {e.role} <span style={{ color: '#1c7a3c', fontSize: isMobile ? 14 : 16, fontWeight: 400 }}>@ {e.org}</span>
        </div>
        <div style={{ fontFamily: GROTESK, fontSize: isMobile ? 15 : 16, lineHeight: 1.6, color: '#8fbf9f' }}>{e.desc}</div>
      </div>
    </div>
  )
}
