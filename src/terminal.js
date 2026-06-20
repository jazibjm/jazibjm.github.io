
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
    ['ls', 'list files'],
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

function out_projects() {
  const body = projects
    .map(
      (p, i) =>
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
    .join('')
  return '<div>' + body + '</div>'
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

function out_ls() {
  const files = ['about.txt', 'projects/', 'skills.txt', 'experience.log', 'education.txt', 'certs.md', 'contact.txt']
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

// Returns { html } for a normal command, or { goGui: true } to trigger the GUI boot.
export function commandOutput(cmd) {
  const parts = cmd.split(/\s+/)
  const base = parts[0]
  if (base === 'echo') return { html: '<span style="color:#cfeedb">' + cmd.slice(5) + '</span>' }
  if (base === 'cat') {
    const f = parts[1] || ''
    if (f.includes('about')) return { html: out_about() }
    if (f.includes('skill')) return { html: out_skills() }
    if (f.includes('project')) return { html: out_projects() }
    if (f.includes('exp')) return { html: out_exp() }
    if (f.includes('edu')) return { html: out_education() }
    if (f.includes('cert')) return { html: out_certs() }
    if (f.includes('contact')) return { html: out_contact() }
    return { html: notfound('cat: ' + f + ': No such file or directory') }
  }
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
      return { html: out_ls() }
    case 'pwd':
      return { html: '<span style="color:#9fd3b0">/home/jazib</span>' }
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
