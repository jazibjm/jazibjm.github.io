import { useEffect, useRef, useState } from 'react'
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
import { commandOutput } from './terminal.js'

const MONO = "'JetBrains Mono', monospace"
const GROTESK = "'Space Grotesk', sans-serif"

// CRT / boot config — mirrors the design's props (scanlines, flicker, startMode).
const CONFIG = { scanlines: true, flicker: true, startMode: 'terminal' }

const BANNER = `     ██╗ █████╗ ███████╗██╗██████╗
     ██║██╔══██╗╚══███╔╝██║██╔══██╗
     ██║███████║  ███╔╝ ██║██████╔╝
██   ██║██╔══██║ ███╔╝  ██║██╔══██╗
╚█████╔╝██║  ██║███████╗██║██████╔╝
 ╚════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝ `

// Boot sequence typed out one character at a time when terminal mode loads.
const BOOT_LINES = [
  { t: 'jazib-os 4.0.4 (tty1) — kernel 6.8.0-flag', c: '#1c7a3c' },
  { t: 'mounting /dev/portfolio ............ ok', c: '#6f9c80' },
  { t: 'loading modules: about · projects · skills · experience · contact ... ok', c: '#6f9c80' },
  { t: 'authenticating session ... root@flag access granted', c: '#74ffa6' },
  { t: "type 'help' to list commands, or tap a shortcut below.", c: '#9fd3b0' },
]
const TYPE_SPEED = 16 // ms per character
const LINE_PAUSE = 200 // ms between lines

function initialMode() {
  try {
    const s = localStorage.getItem('jm_mode')
    if (s) return s
  } catch (e) {}
  return CONFIG.startMode
}

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
  const inputRef = useRef(null)
  const outRef = useRef(null)
  const uid = useRef(0)
  const cmdHistory = useRef([])
  const histIndex = useRef(0)

  const outputEntry = (html) => ({ id: ++uid.current, isOutput: true, html: { __html: html } })
  const inputEntry = (text) => ({ id: ++uid.current, isInput: true, prompt: 'jazib@ctf:~$', text })

  const [mode, setMode] = useState(initialMode)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])

  // Typewriter boot sequence — only when terminal is the entry mode.
  const [booting, setBooting] = useState(() => initialMode() === 'terminal')
  const [bootLine, setBootLine] = useState(0) // index of the line currently typing
  const [bootChar, setBootChar] = useState(0) // chars revealed on the current line

  const finishBoot = () => {
    setBooting(false)
    setBootLine(BOOT_LINES.length)
    setBootChar(0)
  }

  useEffect(() => {
    if (!booting) return
    if (bootLine >= BOOT_LINES.length) {
      setBooting(false)
      return
    }
    const full = BOOT_LINES[bootLine].t
    if (bootChar < full.length) {
      const id = setTimeout(() => setBootChar((c) => c + 1), TYPE_SPEED)
      return () => clearTimeout(id)
    }
    // Current line finished — pause, then advance to the next line.
    const id = setTimeout(() => {
      setBootLine((l) => l + 1)
      setBootChar(0)
    }, LINE_PAUSE)
    return () => clearTimeout(id)
  }, [booting, bootLine, bootChar])

  const focusInput = () => {
    const el = inputRef.current
    if (el) el.focus()
  }

  // Keep the terminal pinned to the latest output + focused after each command.
  useEffect(() => {
    const el = outRef.current
    if (el) el.scrollTop = el.scrollHeight
    if (mode === 'terminal' && !booting) focusInput()
  }, [history, mode, booting, bootLine, bootChar])

  const goToMode = (m) => {
    try {
      localStorage.setItem('jm_mode', m)
    } catch (e) {}
    setMode(m)
    window.scrollTo(0, 0)
  }
  const goGui = () => goToMode('gui')
  const goTerminal = () => goToMode('terminal')

  const runCommand = (raw) => {
    const cmd = (raw || '').trim()
    const inEntry = inputEntry(cmd)
    if (cmd !== '') cmdHistory.current.push(cmd)
    histIndex.current = cmdHistory.current.length
    const base = cmd.toLowerCase().split(/\s+/)[0]

    if (base === 'clear') {
      setHistory([])
      setInput('')
      return
    }
    if (base === 'gui' || base === 'startx' || base === 'exit') {
      const boot = outputEntry(
        '<span style="color:#74ffa6">▸ launching graphical interface</span><span style="color:#1c7a3c"> ... initialising window manager ...</span>'
      )
      setHistory((h) => [...h, inEntry, boot])
      setInput('')
      setTimeout(() => goToMode('gui'), 650)
      return
    }
    const out = outputEntry(commandOutput(cmd.toLowerCase()).html)
    setHistory((h) => [...h, inEntry, out])
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.current.length) {
        histIndex.current = Math.max(0, histIndex.current - 1)
        setInput(cmdHistory.current[histIndex.current] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (cmdHistory.current.length) {
        histIndex.current = Math.min(cmdHistory.current.length, histIndex.current + 1)
        setInput(cmdHistory.current[histIndex.current] || '')
      }
    }
  }

  const isMobile = useIsMobile()

  // Hero name types itself out each time the GUI mode is shown.
  const heroName = useTypewriter('Jazib Malik', mode === 'gui', 95)

  const chips = ['help', 'about', 'projects', 'skills', 'experience', 'education', 'certs', 'honors', 'contact', 'gui']
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
        background: '#000',
        color: '#2fd968',
        fontFamily: MONO,
        overflowX: 'hidden',
      }}
    >
      {/* ================= TERMINAL MODE ================= */}
      {mode === 'terminal' && (
        <div style={{ minHeight: '100vh', padding: isMobile ? '14px 9px 26px' : '34px 18px 40px', textShadow: '0 0 6px rgba(60,255,120,.4)' }}>
          <div
            style={{
              maxWidth: 1080,
              margin: '0 auto',
              border: '1px solid #16331f',
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: '0 0 60px rgba(20,80,40,.18),inset 0 0 120px rgba(10,40,20,.25)',
              background: '#000810',
            }}
          >
            {/* titlebar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '11px 15px',
                background: '#0a0f0b',
                borderBottom: '1px solid #16331f',
              }}
            >
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#e8604a', display: 'inline-block' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#e0b341', display: 'inline-block' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#2fd968', display: 'inline-block' }} />
              <span style={{ flex: 1, textAlign: 'center', fontSize: isMobile ? 10 : 12, color: '#6f9c80', letterSpacing: '.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isMobile ? 'jazib@ctf: ~' : 'jazib@ctf: ~ — bash — 80×24'}
              </span>
              <button
                onClick={goGui}
                className="dc-gui-btn"
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: '#2fd968',
                  background: 'transparent',
                  border: '1px solid #16331f',
                  padding: '4px 10px',
                  borderRadius: 3,
                  cursor: 'pointer',
                }}
              >
                GUI ▸
              </button>
            </div>

            {/* screen body */}
            <div
              ref={outRef}
              onClick={booting ? finishBoot : focusInput}
              style={{
                height: isMobile ? '70vh' : '64vh',
                minHeight: 380,
                overflowY: 'auto',
                overflowX: 'auto',
                padding: isMobile ? '15px 13px 14px' : '22px 22px 18px',
                fontSize: isMobile ? 13 : 14,
                cursor: 'text',
                background: 'radial-gradient(ellipse at 50% 40%,#04140a 0%,#000810 90%)',
              }}
            >
              <pre
                style={{
                  margin: 0,
                  color: '#2fd968',
                  fontSize: isMobile ? 8.5 : 13,
                  lineHeight: 1.12,
                  whiteSpace: 'pre',
                  animation: 'bootglow 3.5s ease-in-out infinite',
                }}
              >
                {BANNER}
              </pre>
              <div style={{ color: '#6f9c80', fontSize: isMobile ? 10.5 : 12, margin: '8px 0 16px', letterSpacing: isMobile ? 0.3 : 1 }}>
                // MALIK · software engineer · full-stack developer · CS @ virginia tech
              </div>
              <div style={{ height: 1, background: 'linear-gradient(90deg,#16331f,transparent)', marginBottom: 14 }} />

              {/* typewriter boot sequence */}
              {BOOT_LINES.map((line, i) => {
                if (i > bootLine) return null
                const text = i < bootLine ? line.t : line.t.slice(0, bootChar)
                const isTyping = booting && i === bootLine
                return (
                  <div key={'boot' + i} style={{ color: line.c, lineHeight: 1.65, margin: '2px 0', whiteSpace: 'pre-wrap' }}>
                    {text}
                    {isTyping && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 15,
                          marginLeft: 1,
                          verticalAlign: '-2px',
                          background: '#2fd968',
                          animation: 'blink 1.1s step-end infinite',
                        }}
                      />
                    )}
                  </div>
                )
              })}

              {history.map((entry) =>
                entry.isInput ? (
                  <div key={entry.id} style={{ display: 'flex', gap: 10, lineHeight: 1.6 }}>
                    <span style={{ color: '#74ffa6', whiteSpace: 'nowrap' }}>{entry.prompt}</span>
                    <span style={{ color: '#cfeedb', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{entry.text}</span>
                  </div>
                ) : (
                  <div key={entry.id} style={{ lineHeight: 1.65, margin: '3px 0 12px' }} dangerouslySetInnerHTML={entry.html} />
                )
              )}

              {/* live prompt — hidden until the boot sequence finishes */}
              <div style={{ display: booting ? 'none' : 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <span style={{ color: '#74ffa6', whiteSpace: 'nowrap' }}>jazib@ctf:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck="false"
                  autoComplete="off"
                  autoCapitalize="off"
                  placeholder="type a command — try 'help'"
                  className="dc-prompt-input"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#74ffa6',
                    fontFamily: MONO,
                    fontSize: 14,
                    textShadow: '0 0 6px rgba(60,255,120,.5)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* shortcut chips */}
          <div
            style={{
              maxWidth: 1080,
              margin: '14px auto 0',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              flexWrap: 'wrap',
              padding: '0 2px',
            }}
          >
            <span style={{ fontSize: 11, color: '#6f9c80', letterSpacing: 1, marginRight: 4 }}>SHORTCUTS</span>
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => runCommand(chip)}
                className="dc-chip"
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  color: '#2fd968',
                  background: 'rgba(20,40,24,.35)',
                  border: '1px solid #16331f',
                  padding: '6px 13px',
                  cursor: 'pointer',
                  borderRadius: 3,
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= GUI MODE ================= */}
      {mode === 'gui' && (
        <div style={{ position: 'relative', zIndex: 1, background: '#060807', minHeight: '100vh' }}>
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
                {['about', 'work', 'skills', 'experience', 'education', 'certs', 'honors'].map((id) => (
                  <a key={id} href={'#' + id} className="dc-navlink" style={{ color: '#6f9c80', textDecoration: 'none' }}>
                    {id}
                  </a>
                ))}
                <button
                  onClick={goTerminal}
                  className="dc-term-btn"
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: '#2fd968',
                    background: 'transparent',
                    border: '1px solid #2a5a38',
                    padding: '6px 13px',
                    borderRadius: 3,
                    cursor: 'pointer',
                  }}
                >
                  ▸ terminal
                </button>
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
                  <button
                    onClick={goTerminal}
                    className="dc-open-btn"
                    style={{
                      fontFamily: MONO,
                      fontSize: 13,
                      background: 'transparent',
                      color: '#2fd968',
                      border: '1px solid #2a5a38',
                      padding: '13px 22px',
                      borderRadius: 3,
                      cursor: 'pointer',
                    }}
                  >
                    open terminal
                  </button>
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

              {/* mini terminal card */}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginTop: 34 }}>
                <div style={{ fontFamily: MONO, fontSize: 12, color: '#6f9c80' }}>built in the terminal · © 2026</div>
                <button
                  onClick={goTerminal}
                  className="dc-term-btn"
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: '#2fd968',
                    background: 'transparent',
                    border: '1px solid #2a5a38',
                    padding: '8px 15px',
                    borderRadius: 3,
                    cursor: 'pointer',
                  }}
                >
                  ▸ back to terminal
                </button>
              </div>
            </section>
          </main>
        </div>
      )}

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
