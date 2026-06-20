

export const aboutProse =
  "I'm a Computer Science student at Virginia Tech, minoring in AI and cybersecurity. I have a passion for software development, cybersecurity, cloud computing, and building technology that solves real-world problems. My experience spans full-stack development, cybersecurity competitions, CTF challenge design, and cloud technologies, supported by certifications including CompTIA Security+, AWS Cloud Practitioner, CompTIA A+, and Microsoft Qubit x Qubit Quantum Computing. I enjoy creating practical projects, exploring new technologies, and continuously expanding my skills through hands-on learning and development."

export const quickFacts = ["Virginia Tech '27", 'GPA 3.87']

export const skillGroups = [
  { title: 'Languages', items: ['Java', 'Python', 'C', 'TypeScript', 'JavaScript', 'SQL', 'Swift'] },
  { title: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Bootstrap', 'HTML / CSS', 'WCAG a11y'] },
  { title: 'Backend', items: ['Node.js / Express', 'Flask', 'Django', 'REST APIs', 'MongoDB', 'PostgreSQL'] },
  { title: 'Cloud & Tooling', items: ['AWS (S3 · EC2 · RDS)', 'Docker', 'CI/CD', 'Git', 'Unit Testing', 'Cloudinary'] },
  { title: 'AI / LLMs', items: ['Claude', 'GPT', 'Gemini', 'Context Engineering', 'Cursor', 'Claude Code'] },
]

export const projects = [
  {
    name: 'Blacksburg Apartment Finder',
    tags: ['React', 'TypeScript', 'Node/Express', 'PostgreSQL'],
    desc: 'Full-stack apartment search built at VT Hacks 13 — scrapes 300+ listings with Puppeteer and serves dynamic cards plus an AI chatbot with session memory.',
    link: 'https://github.com/jazibjm/blacksburg-apartments',
  },
  {
    name: 'Daily Tech Digest',
    status: 'in progress',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'OpenAI', 'Next.js'],
    desc: "An automated daily pipeline that pulls the day's top tech stories, summarizes them with the OpenAI API into topic categories, and delivers a clean digest to Discord and a Next.js dashboard — stored in Postgres and fully hands-off on a cron job.",
    link: 'https://github.com/jazibjm/',
  },
  {
    name: 'AI Math Problem Generator',
    tags: ['Python', 'Symbolic Compute', 'Testing'],
    desc: 'Research platform that auto-generates and validates thousands of template-based math problems at >90% accuracy, halving prep time for educators.',
    link: 'https://github.com/jazibjm/',
  },
  {
    name: 'SwiftChart',
    tags: ['Node.js', 'REST APIs', 'FHIR'],
    desc: 'An EMR interaction-layer prototype that runs on top of Epic-style systems — role-based charting interfaces, an admin console for custom templates, real-time validation, and a pluggable Epic FHIR adapter.',
    link: 'https://github.com/jazibjm/SwiftChart',
  },
]

export const experience = [
  {
    year: 'May 2025 — Now',
    role: 'Software Engineering Intern',
    org: 'Virginia Cyber Range',
    desc: 'Design and build 20+ Jeopardy-style CTF challenges across cryptography, reverse engineering, networking, and forensics — packaged as containerized, reproducible environments with Docker, Bash, and CI/CD, scaling to 300+ concurrent users and cutting setup time 40%.',
  },
  {
    year: 'Jan 2026 — May 2026',
    role: 'AI Research Assistant',
    org: 'Virginia Tech · CS Dept',
    desc: 'Built Python backend validation pipelines with symbolic-computation libraries for an AI platform generating thousands of math problems at >90% accuracy.',
  },
  {
    year: 'Jan 2026 — May 2026',
    role: 'Teaching Assistant',
    org: 'Virginia Tech · Pamplin',
    desc: 'Mentor 50+ students across 10+ systems & tooling labs; turn around feedback on 100+ submissions in under 48 hours.',
  },
  {
    year: '2023 — 2024',
    role: 'Mathematics Tutor',
    org: 'Mathnasium',
    desc: 'Tutored 15+ students weekly in problem-solving and number sense; twice recognized as employee of the month.',
  },
]

export const education = [
  {
    year: '2024 — 2027',
    role: 'B.S. Computer Science',
    org: 'Virginia Tech',
    desc: "Minors in AI & Cybersecurity · GPA 3.87 · President's & Dean's List.",
  },
  {
    year: '2022 — 2024',
    role: 'IT & Cybersecurity (Dual Enrollment)',
    org: 'Northern Virginia CC',
    desc: 'Career Studies Certificate · GPA 4.0.',
  },
]

export const honors = [
  'CyberPatriot Platinum Qualifier',
  'RUSecure CTF — Top 20',
  'National Cyber Cup — Top 15',
  'Commonwealth Cyber Cup — Top 10',
  'VEX Robotics State — 9th',
]

export const certs = [
  { code: 'Security+', name: 'CompTIA Security+' },
  { code: 'A+', name: 'CompTIA A+' },
  { code: 'AWS CCP', name: 'AWS Cloud Practitioner' },
  { code: 'GFACT', name: 'GIAC Foundational Cyber' },
  { code: 'MS Q#', name: 'Microsoft Quantum Computing' },
]

export const socials = [
  { label: 'GitHub', href: 'https://github.com/jazibjm/', display: 'github.com/jazibjm' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jazibm/', display: 'linkedin.com/in/jazibm' },
  { label: 'Email', href: 'mailto:jazibmalik731@gmail.com', display: 'jazibmalik731@gmail.com' },
]
