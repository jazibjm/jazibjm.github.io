
import {
  aboutProse,
  skillGroups,
  projects,
  experience,
  education,
  honors,
  certs,
  socials,
} from './data.js'

const notfound = (msg) =>
  '<span style="color:#e8604a">' +
  msg +
  '</span><br><span style="color:#9fd3b0">Type </span><span style="color:#74ffa6">help</span><span style="color:#9fd3b0"> for a list of commands.</span>'

// ---- virtual filesystem -------------------------------------------------
// Home (~) holds flat files plus a single `projects/` directory. Each project
// is its own `.txt` file inside it, so you can `cd projects` and `cat` them.
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const projectFiles = projects.map((p) => ({ name: slugify(p.name) + '.txt', project: p }))

function out_help() {
  const rows = [
    ['about', 'who I am'],
    ['projects', "things I've built"],
    ['skills', 'languages & tools'],
    ['experience', 'work history'],
    ['education', 'school & degrees'],
    ['certs', 'certifications'],
    ['honors', 'awards & recognition'],
    ['contact', 'links & email'],
    ['ls', 'list files in the current directory'],
    ['cd &lt;dir&gt;', 'change directory — try: cd projects'],
    ['cat &lt;file&gt;', 'print a file — try: cat projects/*.txt'],
    ['clear', 'clear the screen'],
    ['gui', 'launch graphical portfolio'],
  ]
  const body = rows
    .map(
      (r) =>
        '<div style="display:flex;gap:16px"><span style="color:#74ffa6;min-width:120px">' +
        r[0] +
        '</span><span style="color:#9fd3b0">' +
        r[1] +
        '</span></div>'
    )
    .join('')
  return '<div style="line-height:1.75">' + body + '</div>'
}

function out_about() {
  return (
    '<div style="max-width:720px;line-height:1.75"><div style="color:#74ffa6;margin-bottom:8px">jazib malik :: full-stack software engineer</div><div style="color:#9fd3b0">' +
    aboutProse +
    '</div></div>'
  )
}

function out_skills() {
  const body = skillGroups
    .map(
      (g) =>
        '<div style="margin-bottom:10px;display:flex;gap:14px;flex-wrap:wrap"><span style="color:#74ffa6;min-width:160px">' +
        g.title +
        '</span><span style="color:#2fd968">' +
        g.items.join('  ·  ') +
        '</span></div>'
    )
    .join('')
  return '<div style="line-height:1.7">' + body + '</div>'
}

// One project block — shared by `projects` and per-file `cat`.
function projectBlock(p, i) {
  return (
    '<div style="margin-bottom:16px;line-height:1.6"><div><span style="color:#1c7a3c">[' +
    String(i + 1).padStart(2, '0') +
    ']</span> <span style="color:#74ffa6;font-weight:700">' +
    p.name +
    '</span>' +
    (p.status ? ' <span style="color:#e0b341">[' + p.status + ']</span>' : '') +
    ' <span style="color:#1c7a3c">— ' +
    p.tags.join(' · ') +
    '</span></div><div style="color:#9fd3b0;padding-left:38px">' +
    p.desc +
    '</div><div style="color:#1c7a3c;padding-left:38px">↳ ' +
    p.link +
    '</div></div>'
  )
}

function out_projects() {
  return '<div>' + projects.map(projectBlock).join('') + '</div>'
}

function out_exp() {
  const body = experience
    .map(
      (e) =>
        '<div style="margin-bottom:14px;line-height:1.6"><div><span style="color:#74ffa6">' +
        e.year +
        '</span>  <span style="color:#cfeedb">' +
        e.role +
        '</span> <span style="color:#1c7a3c">@ ' +
        e.org +
        '</span></div><div style="color:#9fd3b0">' +
        e.desc +
        '</div></div>'
    )
    .join('')
  return '<div>' + body + '</div>'
}

function out_education() {
  const body = education
    .map(
      (e) =>
        '<div style="margin-bottom:12px;line-height:1.6"><div><span style="color:#74ffa6">' +
        e.year +
        '</span>  <span style="color:#cfeedb">' +
        e.role +
        '</span> <span style="color:#1c7a3c">@ ' +
        e.org +
        '</span></div><div style="color:#9fd3b0">' +
        e.desc +
        '</div></div>'
    )
    .join('')
  return '<div>' + body + '</div>'
}

function out_awards() {
  return (
    '<div style="line-height:1.7">' +
    honors
      .map(
        (hn) =>
          '<div><span style="color:#74ffa6">★</span> <span style="color:#9fd3b0">' +
          hn +
          '</span></div>'
      )
      .join('') +
    '</div>'
  )
}

function out_certs() {
  const body = certs
    .map(
      (c) =>
        '<div style="margin-bottom:6px"><span style="color:#74ffa6">✓ ' +
        c.code +
        '</span> <span style="color:#9fd3b0">— ' +
        c.name +
        '</span></div>'
    )
    .join('')
  return '<div style="line-height:1.6">' + body + '</div>'
}

function out_contact() {
  const body = socials
    .map(
      (s) =>
        '<div style="margin-bottom:5px"><span style="color:#1c7a3c;display:inline-block;min-width:96px">' +
        s.label +
        '</span><a href="' +
        s.href +
        '" target="_blank" rel="noopener" style="color:#74ffa6;text-decoration:none;border-bottom:1px solid #1c7a3c">' +
        s.display +
        '</a></div>'
    )
    .join('')
  return '<div style="line-height:1.6">' + body + '</div>'
}

function fileList(files) {
  return (
    '<div style="display:flex;gap:22px;flex-wrap:wrap">' +
    files
      .map(
        (f) =>
          '<span style="color:' +
          (f.endsWith('/') ? '#74ffa6' : '#2fd968') +
          '">' +
          f +
          '</span>'
      )
      .join('') +
    '</div>'
  )
}

function out_ls(cwd) {
  if (cwd === 'projects') return fileList(projectFiles.map((f) => f.name))
  return fileList([
    'about.txt',
    'projects/',
    'skills.txt',
    'experience.log',
    'education.txt',
    'certs.md',
    'honors.txt',
    'contact.txt',
  ])
}

// Flat home files → their renderer.
const homeFiles = {
  'about.txt': out_about,
  'skills.txt': out_skills,
  'experience.log': out_exp,
  'education.txt': out_education,
  'certs.md': out_certs,
  'honors.txt': out_awards,
  'contact.txt': out_contact,
}

// Fuzzy fallback so `cat about` works as well as `cat about.txt`.
function fuzzyHome(name) {
  const n = name.replace(/\.[a-z]+$/, '')
  if (n.includes('about')) return out_about()
  if (n.includes('skill')) return out_skills()
  if (n.includes('exp')) return out_exp()
  if (n.includes('edu')) return out_education()
  if (n.includes('cert')) return out_certs()
  if (n.includes('honor') || n.includes('award')) return out_awards()
  if (n.includes('contact')) return out_contact()
  return null
}

function catProject(token) {
  const t = token.replace(/\.txt$/, '')
  const pf =
    projectFiles.find((f) => f.name.replace(/\.txt$/, '') === t) ||
    projectFiles.find((f) => f.name.replace(/\.txt$/, '').includes(t))
  if (pf) return '<div>' + projectBlock(pf.project, projects.indexOf(pf.project)) + '</div>'
  return null
}

function out_cat(arg, cwd) {
  if (!arg) return notfound('cat: missing file operand')
  const a = arg.replace(/^\.\//, '')

  // The projects directory itself is not a file.
  if (a === 'projects' && cwd !== 'projects') return notfound('cat: projects: Is a directory')

  // Resolve a reference into the projects directory.
  let projTarget = null
  if (a.startsWith('projects/')) projTarget = a.slice('projects/'.length)
  else if (cwd === 'projects' && !a.startsWith('../')) projTarget = a

  if (projTarget !== null) {
    if (projTarget === '' || projTarget === '*' || projTarget === '*.txt') return out_projects()
    const hit = catProject(projTarget)
    if (hit) return hit
    return notfound('cat: ' + arg + ': No such file or directory')
  }

  // Home files (reachable from projects via ../name too).
  const home = a.replace(/^\.\.\//, '')
  if (homeFiles[home]) return homeFiles[home]()
  const fuzzy = fuzzyHome(home)
  if (fuzzy) return fuzzy

  return notfound('cat: ' + arg + ': No such file or directory')
}

function out_cd(arg, cwd) {
  const a = (arg || '~').replace(/\/+$/, '')
  if (a === '' || a === '~' || a === '/' || a === '..' || a === '~/') return { cd: '~' }
  if (a === 'projects' || a === './projects' || a === '~/projects') {
    if (cwd === 'projects') return { html: notfound('cd: projects: No such file or directory') }
    return { cd: 'projects' }
  }
  return { html: notfound('cd: ' + arg + ': No such file or directory') }
}

// Returns { html } for normal output, { cd } to change directory, or
// { goGui } (handled in App). `cwd` is '~' or 'projects'.
export function commandOutput(cmd, cwd = '~') {
  const parts = cmd.split(/\s+/)
  const base = parts[0]
  if (base === 'echo') return { html: '<span style="color:#cfeedb">' + cmd.slice(5) + '</span>' }
  if (base === 'cd') return out_cd(parts[1], cwd)
  if (base === 'cat') return { html: out_cat(parts[1] || '', cwd) }
  switch (base) {
    case 'help':
    case '?':
      return { html: out_help() }
    case 'about':
    case 'whoami':
    case 'bio':
      return { html: out_about() }
    case 'skills':
    case 'stack':
      return { html: out_skills() }
    case 'projects':
    case 'work':
      return { html: out_projects() }
    case 'experience':
    case 'resume':
    case 'exp':
      return { html: out_exp() }
    case 'education':
    case 'edu':
    case 'school':
      return { html: out_education() }
    case 'awards':
    case 'honors':
      return { html: out_awards() }
    case 'certs':
    case 'certifications':
      return { html: out_certs() }
    case 'contact':
    case 'links':
      return { html: out_contact() }
    case 'ls':
      return { html: out_ls(cwd) }
    case 'pwd':
      return { html: '<span style="color:#9fd3b0">/home/jazib' + (cwd === 'projects' ? '/projects' : '') + '</span>' }
    case 'date':
      return { html: '<span style="color:#9fd3b0">' + new Date().toString() + '</span>' }
    case 'sudo':
      return { html: '<span style="color:#e8604a">jazib is not in the sudoers file. This incident will be reported.</span>' }
    case 'hire':
      return { html: '<span style="color:#74ffa6">[+] excellent choice. → jazibmalik731@gmail.com</span>' }
    case '':
      return { html: '' }
    default:
      return { html: notfound(base + ': command not found') }
  }
}
