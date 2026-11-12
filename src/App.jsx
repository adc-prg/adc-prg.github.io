import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig, useScroll, useSpring } from 'framer-motion';


// ─── Icons ────────────────────────────────────────────────────────────────────
const Sun = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);
const Moon = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);
const Linkedin = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const Mail = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const ChevronDown = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const ExternalLink = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const ArrowRight = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const ArrowLeft = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
  </svg>
);
const ArrowUp = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>
  </svg>
);
const Search = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const Copy = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="13" height="13" x="9" y="9" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const Check = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);
// Renders \mathbb{R}P^n / \mathbb{C}P^n without needing a LaTeX engine
const ProjSpace = ({ field }) => (
  <span style={{ whiteSpace:'nowrap' }}>
    {field === 'R' ? 'ℝ' : 'ℂ'}P<sup style={{ fontStyle:'italic', fontSize:'0.75em', lineHeight:0 }}>n</sup>
  </span>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const cvData = {
  name: "Adeetya Choubey",
  location: "Bhopal, Madhya Pradesh, India",
  profile: {
    intro: "Math undergrad at IISER Bhopal.",
    interests: "Academically, I am interested in abstract algebra. To be specific, my interests are in homological algebra, and algebraic geometry with a lot of categorical flavor. I am a final year BS-MS student at the department of mathematics, IISER Bhopal.",
    ambition: "Apart from academics, I enjoy. I want to enjoy whatever I can, however I can, whenever I can. Things like football, music, mangas, board games, table tennis, are just some of the things that bring me joy. I am recently exploring a lot of music, outside of my usual interests (Hip-Hop, and RnB), like Indian classical, Rock, Soul, and I enjoy working on creative personal projects from time to time."
  },
  research: [{
    title: "Exploring Integrality and Genus of some specific Cayley Graphs",
    guide: "Guide: Prof. Ashish Upadhyay",
    description: "Cayley graphs are graphs which exhibit the nature of action of a group G on a set S, which is closed under inverses (typically generating set). A graph is said to be integral if each of the eigenvalues of its Adjacency Matrix is an integer. The genus of a graph is the minimum number of handles that must be added to a sphere to embed the graph on the resulting surface without any edge crossings. The goal was to work towards finding out the fields for which the 'generalised' Cayley graphs are integral and what genus do they have."
  }],
  
  education: [
    { institution: "Indian Institute of Science Education and Research, Bhopal", degree: "BS-MS (Dual Degree), Major: Mathematics", duration: "2022 – 2027 (Expected)", grades: ["Cumulative performance: 8.75 / 10"] }
    
  ],
  responsibilities: [
    { role: "Department Representative, Math Dept.", institution: "IISER Bhopal", duration: "Sep 2024 – Sep 2025",
      description: "I was elected as the batch representative for the batch of '22, math department. Primary responsibilities included facilitating effective communication between the students and the administration." },
    { role: "Core Member, Math Club", institution: "IISER Bhopal", duration: "Jun 2024 – Jul 2025",
      description: "Joined with the intent of helping towards a better culture and acceptance towards math. I hope I was able to achieve that." },
    { role: "Peer Counselor", institution: "IISER Bhopal", duration: "Jul 2023 – Jul 2025",
      description: "A brilliant initiative (theoretically) by the counselling cell @IISERB, which fosters this idea that help is closer than you think. The counselling cell selects a few students on campus who work towards a more accepting culture in the student community. " }
  ],
  openboard: {
    role: "Co-founder, Openboard",
    institution: "IISER Bhopal",
    duration: "Ongoing",
    cofounder: { name: "Samriddha", url: "https://samriddhaganguly.github.io/" },
    website: "https://openboard-web.vercel.app/",
    description: "Along with my friend Samriddha we have started an independent initiative to let students come forward and speak their minds about topics they are passionate about, preferably to a general audience.",
    mission: "Openboard is a formal platform to be informal, or an informal platform to be formal. It is dedicated to ideas. Samriddha and I believed that curiosity should have an outlet beyond the classroom; a space where students can address a general audience on topics they genuinely care about.",
    talks: [
      { title: "The Probabilistic Method", speaker: "Adeetya Choubey", description: "I gave the inaugural talk for this small initiative of ours. The probabilistic method is a way of proving existence of any object without explicitly constructing it, through the means of Probability. The famous proof by Erdős for the bounds on Ramsey numbers was discussed in this talk." }
    ]
  },
  academicExperiences: {
    internships: [
      { title: "Summer Intern", institution: "Institute of Science, Banaras Hindu University", duration: "May 2025 – Aug 2025",
        description: "The first phase involved getting used to some algebraic topology, referring to books like Hatcher, Harper and Munkres. Towards the end, the focus shifted to finding out groups with integral Cayley graphs of genus one through computational and algebraic means." },
      { title: "Summer Intern", institution: "Institute of Science, Banaras Hindu University", duration: "May – July 2024",
        description: "This project focussed on studying general topology from the book by J Dugundji, while working through problems, along with reading the book by Murasugi on Braids." }
    ],
    summerSchools: [
      { title: "Summer Program", institution: "TIFR — Centre for Applicable Mathematics", duration: "June – July 2025",
        description: "The program included short courses on RKHS, Geometric Measure Theory, Geometric Function Theory, Gibbs Measure and Entropy, Multiscale problems in PDE, Microlocal Analysis and Inverse Problems, along with several keynote lectures on ongoing research in Analysis and Combinatorics." },
      { title: "Mathematics Summer Program", institution: "Indraprastha Institute of Information Technology, Delhi", duration: "June 2024",
        description: "This was a two week residential summer program covering some elementary aspects of Analysis, Algebra, Topology. This program included daily lectures on the aforementioned topics, along with problem solving sessions." }
    ]
  },
  events: [
    { title: "Discussion Meeting on Topics in Algebra", tag: "Attended",
      description: "I was a participant, and a student volunteer for this event held at IISER Bhopal. Vibecoded the website and Vibe attended all the talks. Good talks, good food and great people, along with a lot to learn, even outside of Math.",
      link: { url: "https://dmtia-iiserb.github.io/", text: "Discussion meeting" } },
    { title: "GANIT Symposium", tag: "Attended",
      description: "I attended this 2.5 day symposium @IIT Gandhinagar, which featured mini series and lectures, discussing Commutative Algebra, Algebraic Geometry and Number theory. I bit off more than I could chew, but this was one of those points which pushed me more towards pursuing Algebra in general.",
      link: { url: "https://events.iitgn.ac.in/2026/caag/", text: "GANIT Symposium" } },
    { title: "The Probabilistic Method", tag: "Openboard Talk",
      description: "Gave the first Openboard talk. More about that talk can be looked at on the Openboard website.",
      link: { url: "https://openboard-web.vercel.app/", text: "Openboard website" } },
    { title: "खेल-culus", tag: "Organised",
      description: "खेल, in Hindi, stands for sport. खेल-culus (khel-culus; /kʰeːl/) represents the treatise of calculus as a sport — the name for the integration bee held during the annual math fest, Continuum, organised by the department of math at IISER Bhopal. I helped organise the event (and gave the idea for the event and the name), along with Yash Sharma." },
    { title: "Big-Tac-Toe", tag: "Organised",
      description: "A wordplay on Big + Tic-tac-toe — another name for ultimate tic-tac-toe. Held at Continuum in collaboration with the board games club, Ingenium. The event featured a knockout stage with Saurav Kanetkar emerging as the Big-Tac-Toe champion, 2025 edition.",
      link: { url: "https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe", text: "Ultimate Tic-Tac-Toe" } },
    { title: "Realizing Grassmannian as a Projective Variety and the Segre embedding", tag: "Seminar Talk",
      description: "I gave a seminar on the classical result that the Grassmannian Gr(k, n) embeds into projective space via the Plücker embedding, making it a projective variety. The focus then shifted to discussing the Segre embedding and how it helps to see product of two projective spaces as a projective variety embedded into a much larger projective space." },
    { title: "Cup Product Structure on Real and Complex Projective Space", tag: "Seminar Talk",
      description: (
        <>
          The seminar discussed the structure of the cohomology ring for <ProjSpace field="R" /> and <ProjSpace field="C" /> after setting up some basic definitions. This seminar was graded and was a part of my Topology II course.
        </>
      ) }
  ],
  contact: { email: "adeetya22@iiserb.ac.in", linkedin: "https://www.linkedin.com/in/adeetya-choubey-6b2a44254/" }
};

const navPages = [
  { label: 'AcadEx',    path: '/acadex',    desc: 'academic venture during the summer' },
  { label: 'Projects',  path: '/projects',  desc: 'attempts to be more academically acceptable :)' },
  { label: 'Proofs', path: '/proofs', desc: 'proofs I enjoyed working through' },
  { label: 'Events',    path: '/events',    desc: 'events I\'ve helped organise.' },
  { label: 'OpenBoard', path: '/openboard', desc: 'a place to speak' },
  { label: 'Contact',   path: '/contact',   desc: 'how to get in touch' },
];


// ─── Settings you may want to change ──────────────────────────────────────────
// Your photo: put it in the project's `public/` folder. A relative path (no
// leading slash) also works on GitHub Pages sub-paths, since HashRouter never
// changes the real URL path.
const PROFILE_PHOTO = 'profile.jpg';
// Which point of the photo sits in the centre of the circle (x% y%).
const PROFILE_PHOTO_POSITION = '50% 50%';
// Dark theme: 'slate' (soft grey-blue with muted gold) or 'navy' (deep navy with gold).
const DARK_STYLE = 'slate';

// Vintage newspaper type: blackletter masthead, Playfair headlines, Caslon body,
// Franklin for small labels.
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=UnifrakturMaguntia&family=Libre+Franklin:wght@400;500;600&display=swap';

const CSS = `
  :root {
    --bg:          #F0EADD;
    --surface:     #F6F1E7;
    --ink:         #1F1A17;
    --ink2:        #463E38;
    --ink3:        #695F56;
    --accent:      #8A2F37;
    --accent-soft: rgba(138,47,55,0.07);
    --accent-line: rgba(138,47,55,0.32);
    --line:        #DCD2C2;
    --line-strong: #C5B9A5;
    --on-ink:      #F0EADD;
    --on-accent:   #FFFFFF;
    --grain:       0.05;
    --pop-shadow:  0 24px 60px -24px rgba(40,25,15,0.35), 0 2px 6px rgba(40,25,15,0.06);

    --masthead: 'UnifrakturMaguntia', 'Old English Text MT', 'Times New Roman', serif;
    --display:  'Playfair Display', 'Bodoni 72', Didot, Georgia, serif;
    --text:     'Libre Caslon Text', 'Big Caslon', Georgia, 'Times New Roman', serif;
    --ui:       'Libre Franklin', 'Franklin Gothic Book', 'Helvetica Neue', Arial, sans-serif;

    --fs-ui:   0.875rem;
    --fs-ui-s: 0.8125rem;
    --fs-body: 1.0625rem;
    --fs-lead: 1.25rem;
    --fs-h3:   1.3125rem;
    --fs-h1:   clamp(2.25rem, 1.6rem + 2.4vw, 3.125rem);
    --fs-hero: clamp(3rem, 1.5rem + 5.6vw, 5.25rem);
    --lh:      1.75;
    --measure: 64ch;

    --nav-h:  70px;
    --r:      8px;
    --ease:   cubic-bezier(0.16, 1, 0.3, 1);
  }
  .dark {
    --bg:          #14171E;
    --surface:     #1A1E27;
    --ink:         #EAE6E0;
    --ink2:        #BDB9B3;
    --ink3:        #8D8E95;
    --accent:      #D4B373;
    --accent-soft: rgba(212,179,115,0.09);
    --accent-line: rgba(212,179,115,0.34);
    --line:        #262B36;
    --line-strong: #353B49;
    --on-ink:      #14171E;
    --on-accent:   #1A1508;
    --grain:       0.06;
    --pop-shadow:  0 24px 60px -20px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.2);
  }
  .dark[data-dark="navy"] {
    --bg:          #0A1120;
    --surface:     #101B30;
    --ink:         #F4EFE3;
    --ink2:        #C7CEDD;
    --ink3:        #7E8CAA;
    --accent:      #E3B23C;
    --accent-soft: rgba(227,178,60,0.08);
    --accent-line: rgba(227,178,60,0.34);
    --line:        #1C2A44;
    --line-strong: #2A3B5C;
    --on-ink:      #0A1120;
    --on-accent:   #1C1206;
  }

  /* ── Base ─────────────────────────────────────────── */
  *, *::before, *::after { box-sizing:border-box; }
  html { -webkit-text-size-adjust:100%; }
  body {
    margin:0; background:var(--bg); color:var(--ink);
    font-family:var(--text); font-size:var(--fs-body); line-height:var(--lh);
    font-kerning:normal; font-feature-settings:"kern" 1, "liga" 1;
    -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; text-rendering:optimizeLegibility;
    -webkit-tap-highlight-color:transparent;
  }
  h1,h2,h3,h4,p,figure { margin:0; }
  h1,h2,h3 { text-wrap:balance; }
  p { text-wrap:pretty; overflow-wrap:break-word; }
  button, input { font:inherit; color:inherit; }
  strong { font-weight:700; color:var(--ink); }
  ::selection { background:var(--accent); color:var(--on-accent); }
  :focus-visible { outline:2px solid var(--accent); outline-offset:3px; border-radius:4px; }
  main:focus { outline:none; }
  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  kbd {
    font-family:var(--ui); font-size:0.6875rem; line-height:1.6; padding:0 5px; border-radius:4px;
    border:1px solid var(--line-strong); color:var(--ink2);
  }

  /* Newsprint grain */
  .grain { position:fixed; inset:0; z-index:200; pointer-events:none; opacity:var(--grain);
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .dark .grain {
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* Theme switch: circular reveal (View Transitions), cross-fade as fallback */
  ::view-transition-old(root), ::view-transition-new(root) { animation:none; mix-blend-mode:normal; }
  .theme-anim, .theme-anim *, .theme-anim *::before, .theme-anim *::after {
    transition: background-color .45s ease, border-color .45s ease, color .45s ease, fill .45s ease, stroke .45s ease !important;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
  }

  .wrap { width:100%; max-width:1120px; margin:0 auto; padding:0 clamp(20px, 4vw, 40px); }

  .skip {
    position:fixed; left:16px; top:-60px; z-index:100; padding:8px 16px; border-radius:var(--r);
    background:var(--ink); color:var(--on-ink); font-family:var(--ui); font-size:var(--fs-ui); text-decoration:none; transition:top .3s var(--ease);
  }
  .skip:focus { top:12px; }

  /* ── Links & buttons ─────────────────────────────── */
  .lnk {
    color:var(--accent); text-decoration:underline; text-decoration-thickness:1px;
    text-underline-offset:3px; text-decoration-color:var(--accent-line); transition:text-decoration-color .3s ease;
  }
  .lnk:hover { text-decoration-color:var(--accent); }

  .btn {
    display:inline-flex; align-items:center; gap:12px; padding:13px 24px; border-radius:var(--r);
    background:var(--ink); color:var(--on-ink); border:1px solid var(--ink);
    font-family:var(--ui); font-size:var(--fs-ui); font-weight:500; letter-spacing:0.01em; line-height:1.3;
    text-decoration:none; cursor:pointer; user-select:none;
    transition:background-color .35s ease, border-color .35s ease, color .35s ease, transform .35s var(--ease);
  }
  .btn:hover { background:var(--accent); border-color:var(--accent); color:var(--on-accent); }
  .btn:active { transform:scale(0.97); transition-duration:.12s; }
  .btn-ghost { background:transparent; color:var(--ink); border-color:var(--line-strong); }
  .btn-ghost:hover { background:transparent; color:var(--accent); border-color:var(--accent); }
  .btn svg { transition:transform .5s var(--ease); }
  .btn:hover svg { transform:translateX(3px); }

  .icon-btn {
    width:38px; height:38px; flex-shrink:0; display:inline-flex; align-items:center; justify-content:center;
    border-radius:var(--r); border:1px solid var(--line-strong); background:transparent; color:var(--ink2); cursor:pointer;
    transition:border-color .3s ease, color .3s ease, transform .35s var(--ease);
  }
  .icon-btn:hover { color:var(--accent); border-color:var(--accent); }
  .icon-btn:active { transform:scale(0.92); transition-duration:.12s; }

  /* ── Navbar (masthead) ───────────────────────────── */
  .nav { position:sticky; top:0; z-index:50; background:var(--bg); border-bottom:1px solid transparent; transition:border-color .35s ease; }
  .nav.is-scrolled, .nav.is-open { border-bottom-color:var(--line-strong); }
  .nav-inner { height:var(--nav-h); display:flex; align-items:center; justify-content:space-between; gap:24px; }
  .brand { font-family:var(--masthead); font-size:1.625rem; font-weight:400; line-height:1; color:var(--ink); text-decoration:none; white-space:nowrap; transition:color .3s ease; }
  .brand:hover { color:var(--accent); }
  .nav-links { position:relative; display:flex; align-items:center; gap:2px; }
  .nav-link { position:relative; isolation:isolate; padding:7px 13px; border-radius:999px; font-family:var(--text); font-size:0.9375rem; color:var(--ink2); text-decoration:none; transition:color .3s ease; }
  .nav-link:hover, .nav-link.active { color:var(--ink); }
  .nav-link.active { color:var(--accent); }
  .nav-pill { position:absolute; inset:0; z-index:-1; border-radius:inherit; background:var(--accent-soft); }
  .nav-underline { position:absolute; left:13px; right:13px; bottom:1px; height:1px; background:var(--accent); }
  .nav-actions { display:flex; align-items:center; gap:8px; }
  .search-btn {
    display:inline-flex; align-items:center; gap:8px; height:38px; padding:0 8px 0 12px; border-radius:var(--r);
    border:1px solid var(--line-strong); background:transparent; color:var(--ink3); font-family:var(--ui); font-size:var(--fs-ui-s); cursor:pointer;
    transition:border-color .3s ease, color .3s ease, transform .35s var(--ease);
  }
  .search-btn:hover { color:var(--accent); border-color:var(--accent); }
  .search-btn:active { transform:scale(0.96); transition-duration:.12s; }
  .menu-btn { display:none; }
  .burger { position:relative; width:16px; height:10px; }
  .burger span { position:absolute; left:0; right:0; height:1.5px; border-radius:1px; background:currentColor; transition:transform .5s var(--ease), top .5s var(--ease); }
  .burger span:first-child { top:0; }
  .burger span:last-child  { top:8.5px; }
  .is-open .burger span:first-child { top:4.25px; transform:rotate(45deg); }
  .is-open .burger span:last-child  { top:4.25px; transform:rotate(-45deg); }

  .mobile-menu { position:fixed; top:var(--nav-h); left:0; right:0; bottom:0; z-index:49; background:var(--bg); overflow-y:auto; padding:8px 0 48px; transform-origin:top center; }
  .m-link { display:block; padding:16px 0; border-bottom:1px solid var(--line); text-decoration:none; }
  .m-label { display:block; font-family:var(--display); font-size:1.5rem; font-weight:600; line-height:1.25; color:var(--ink); transition:color .3s ease; }
  .m-desc  { display:block; margin-top:2px; font-size:0.9375rem; font-style:italic; color:var(--ink3); }
  .m-link.active .m-label, .m-link:active .m-label { color:var(--accent); }

  @media (max-width: 1000px) {
    .nav-links { display:none; }
    .menu-btn { display:inline-flex; }
    .search-btn { width:38px; padding:0; justify-content:center; }
    .search-btn .search-label, .search-btn kbd { display:none; }
  }

  /* ── Spotlight-style search ──────────────────────── */
  .cmdk-backdrop {
    position:fixed; inset:0; z-index:80; display:flex; justify-content:center; align-items:flex-start;
    padding:14vh 16px 16px; background:rgba(15,10,8,0.18);
  }
  .cmdk {
    width:100%; max-width:580px; border-radius:16px; overflow:hidden; font-family:var(--ui);
    background:color-mix(in srgb, var(--surface) 86%, transparent);
    -webkit-backdrop-filter:blur(28px) saturate(1.5); backdrop-filter:blur(28px) saturate(1.5);
    border:1px solid color-mix(in srgb, var(--ink) 10%, transparent); box-shadow:var(--pop-shadow);
  }
  .cmdk-input-row { display:flex; align-items:center; gap:12px; padding:16px 20px; border-bottom:1px solid var(--line); color:var(--ink3); }
  .cmdk-input { flex:1; min-width:0; border:0; outline:none; background:transparent; font-family:var(--text); font-size:1.1875rem; color:var(--ink); }
  .cmdk-input::placeholder { color:var(--ink3); font-style:italic; }
  .cmdk-list { max-height:min(56vh, 420px); overflow-y:auto; padding:6px 8px 10px; overscroll-behavior:contain; }
  .cmdk-group { padding:12px 12px 4px; font-size:var(--fs-ui-s); color:var(--ink3); }
  .cmdk-item { position:relative; isolation:isolate; display:flex; justify-content:space-between; align-items:baseline; gap:16px; padding:10px 12px; border-radius:10px; cursor:pointer; font-size:var(--fs-ui); color:var(--ink); }
  .cmdk-item.active .cmdk-label { color:var(--on-accent); }
  .cmdk-item.active .cmdk-hint { color:color-mix(in srgb, var(--on-accent) 75%, transparent); }
  .cmdk-hl { position:absolute; inset:0; z-index:-1; border-radius:inherit; background:var(--accent); }
  .cmdk-hint { max-width:55%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:var(--fs-ui-s); color:var(--ink3); transition:color .2s ease; }
  .cmdk-empty { padding:28px 12px; text-align:center; font-family:var(--text); font-style:italic; color:var(--ink3); }
  .cmdk-foot { display:flex; gap:18px; padding:10px 20px; border-top:1px solid var(--line); font-size:var(--fs-ui-s); color:var(--ink3); }
  @media (hover: none) { .cmdk-foot { display:none; } }

  /* ── Back-to-top with reading progress ───────────── */
  .to-top {
    position:fixed; right:clamp(16px, 3vw, 32px); bottom:calc(clamp(16px, 3vw, 32px) + env(safe-area-inset-bottom, 0px)); z-index:40;
    width:46px; height:46px; border-radius:50%; border:0; cursor:pointer; color:var(--ink2);
    display:flex; align-items:center; justify-content:center; background:var(--bg);
    transition:color .3s ease;
  }
  .to-top:hover { color:var(--accent); }
  .to-top .ring-svg { position:absolute; inset:0; width:46px; height:46px; transform:rotate(-90deg); }
  .ring-bg { fill:none; stroke:var(--line-strong); stroke-width:1; }
  .ring    { fill:none; stroke:var(--accent); stroke-width:1.5; }

  .toast-wrap { position:fixed; left:0; right:0; bottom:calc(28px + env(safe-area-inset-bottom, 0px)); z-index:90; display:flex; justify-content:center; pointer-events:none; }
  .toast { padding:10px 18px; border-radius:999px; background:var(--ink); color:var(--on-ink); font-family:var(--ui); font-size:var(--fs-ui); box-shadow:var(--pop-shadow); }

  /* ── Inner page layout ───────────────────────────── */
  main { display:block; min-height:calc(100vh - var(--nav-h)); }
  .page {
    display:grid; grid-template-columns:minmax(220px, 290px) minmax(0, 1fr); gap:clamp(40px, 7vw, 104px);
    align-items:start; padding-top:clamp(48px, 7vw, 88px); padding-bottom:24px;
  }
  .page-aside { align-self:stretch; }
  .page-aside-inner { position:sticky; top:calc(var(--nav-h) + 40px); }
  .kicker { font-family:var(--text); font-style:italic; font-size:0.9375rem; color:var(--accent); margin-bottom:10px; }
  .page-title { font-family:var(--display); font-size:var(--fs-h1); line-height:1.08; font-weight:700; letter-spacing:-0.01em; color:var(--ink); }
  .page-intro { margin-top:16px; max-width:30ch; font-size:1rem; line-height:1.6; font-style:italic; color:var(--ink3); }

  .toc { margin-top:36px; display:flex; flex-direction:column; border-left:1px solid var(--line-strong); }
  .toc-item { position:relative; text-align:left; background:none; border:0; padding:6px 0 6px 18px; font-family:var(--ui); font-size:var(--fs-ui); color:var(--ink3); cursor:pointer; transition:color .3s ease; }
  .toc-item:hover, .toc-item.active { color:var(--ink); }
  .toc-bar { position:absolute; left:-1px; top:6px; bottom:6px; width:2px; border-radius:2px; background:var(--accent); }

  .page-body { min-width:0; max-width:46rem; }
  .sec { scroll-margin-top:calc(var(--nav-h) + 32px); }
  .sec + .sec { margin-top:72px; }
  .sec-title { font-family:var(--display); font-size:1.0625rem; font-weight:600; font-style:italic; color:var(--ink); padding-bottom:10px; border-bottom:3px double var(--ink); }

  .entry { padding:28px 0; border-bottom:1px solid var(--line); }
  .sec .entry:last-child, .entries > :last-child .entry { border-bottom:0; }
  .entry-head { display:flex; justify-content:space-between; align-items:baseline; gap:4px 24px; flex-wrap:wrap; }
  .entry-title { font-family:var(--display); font-size:var(--fs-h3); line-height:1.3; font-weight:700; color:var(--ink); }
  .entry-date { font-family:var(--text); font-style:italic; font-size:0.9375rem; color:var(--ink3); white-space:nowrap; }
  .entry-sub { margin-top:6px; font-family:var(--ui); font-size:var(--fs-ui); line-height:1.5; color:var(--ink2); }
  .tag { color:var(--accent); font-weight:500; }
  .tag + span { margin-left:12px; }
  .entry-body { margin-top:14px; max-width:var(--measure); color:var(--ink2); }
  .entry-body > * + * { margin-top:0.9em; }

  .title-link {
    color:inherit; text-decoration:none;
    background-image:linear-gradient(currentColor, currentColor); background-repeat:no-repeat;
    background-size:0% 1px; background-position:0 100%;
    transition:background-size .6s var(--ease), color .3s ease;
  }
  .title-link:hover { color:var(--accent); background-size:100% 1px; }
  .title-link-icon { display:inline-block; margin-left:8px; vertical-align:0.02em; color:var(--ink3); transition:color .3s ease, transform .5s var(--ease); }
  .title-link:hover .title-link-icon { color:var(--accent); transform:translate(2px,-2px); }

  .lead { font-family:var(--display); font-size:var(--fs-lead); line-height:1.45; font-style:italic; color:var(--ink); max-width:40ch; }
  .prose { max-width:var(--measure); color:var(--ink2); }
  .prose > * + * { margin-top:0.9em; }
  .dropcap::first-letter {
    float:left; font-family:var(--display); font-weight:700; font-size:3.6em; line-height:0.82;
    padding:0.08em 0.1em 0 0; color:var(--accent);
  }
  @media (min-width: 700px) {
    .prose p:not(.lead), .entry-body p { text-align:justify; -webkit-hyphens:auto; hyphens:auto; }
  }
  .actions { margin-top:28px; display:flex; flex-wrap:wrap; gap:12px; }

  .pill { display:inline-block; margin-top:12px; padding:3px 12px; border-radius:999px; border:1px solid var(--line-strong); font-family:var(--ui); font-size:var(--fs-ui-s); color:var(--ink2); font-variant-numeric:tabular-nums; }
  .status { display:inline-flex; align-items:center; gap:10px; font-family:var(--ui); font-size:var(--fs-ui-s); font-weight:500; color:var(--accent); }
  .status-dot { position:relative; width:6px; height:6px; border-radius:50%; background:currentColor; }
  .status-dot::after { content:''; position:absolute; inset:-4px; border-radius:50%; border:1px solid currentColor; opacity:0; animation:ping 3s var(--ease) infinite; }
  @keyframes ping { 0% { transform:scale(.6); opacity:.6; } 100% { transform:scale(1.9); opacity:0; } }
  .note { padding:24px 26px; border-radius:var(--r); background:var(--accent-soft); border-left:2px solid var(--accent); }
  .note p { margin-top:10px; color:var(--ink2); max-width:56ch; }

  .filters { margin-top:32px; display:flex; flex-wrap:wrap; gap:8px; }
  .chip {
    position:relative; isolation:isolate; display:inline-flex; align-items:center; gap:6px;
    padding:6px 13px; border-radius:999px; border:1px solid var(--line-strong); background:transparent;
    font-family:var(--ui); font-size:var(--fs-ui-s); color:var(--ink2); cursor:pointer; transition:color .3s ease, border-color .3s ease;
  }
  .chip:hover { color:var(--ink); border-color:var(--ink3); }
  .chip.active { color:var(--on-ink); border-color:var(--ink); }
  .chip-bg { position:absolute; inset:-1px; z-index:-1; border-radius:inherit; background:var(--ink); }
  .chip-count { opacity:.65; font-variant-numeric:tabular-nums; }

  .pager { margin-top:88px; display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .pager-link {
    display:flex; flex-direction:column; gap:2px; padding:16px 20px; border:1px solid var(--line-strong); border-radius:var(--r);
    text-decoration:none; transition:border-color .35s ease, background-color .35s ease, transform .35s var(--ease);
  }
  .pager-link:hover { border-color:var(--ink); background:var(--surface); }
  .pager-link:active { transform:scale(0.98); transition-duration:.12s; }
  .pager-link.next { grid-column:2; align-items:flex-end; text-align:right; }
  .pager-dir { display:inline-flex; align-items:center; gap:6px; font-family:var(--ui); font-size:var(--fs-ui-s); color:var(--ink3); }
  .pager-label { font-family:var(--display); font-size:1.25rem; font-weight:600; color:var(--ink); transition:color .3s ease; }
  .pager-link:hover .pager-label { color:var(--accent); }
  .pager-link svg { transition:transform .5s var(--ease); }
  .pager-link.prev:hover svg { transform:translateX(-3px); }
  .pager-link.next:hover svg { transform:translateX(3px); }

  .contact-row {
    display:grid; grid-template-columns:42px minmax(0,1fr) auto; align-items:center; gap:18px;
    padding:20px 0; border-bottom:1px solid var(--line); color:var(--ink); text-decoration:none;
  }
  .contact-row:first-child { padding-top:0; }
  .contact-icon { width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1px solid var(--line-strong); color:var(--accent); transition:border-color .35s ease, transform .5s var(--ease); }
  .contact-row:hover .contact-icon { border-color:var(--accent); transform:scale(1.06); }
  .contact-k { display:block; font-family:var(--ui); font-size:var(--fs-ui-s); color:var(--ink3); }
  .contact-v { display:block; font-family:var(--display); font-size:1.25rem; line-height:1.4; overflow-wrap:anywhere; transition:color .3s ease; }
  .contact-row:hover .contact-v { color:var(--accent); }
  .contact-go { color:var(--ink3); transition:color .3s ease, transform .5s var(--ease); }
  .contact-row:hover .contact-go { color:var(--accent); transform:translate(2px,-2px); }
  .copy-btn { margin-top:18px; background:none; border:0; padding:0; font-family:var(--ui); font-size:var(--fs-ui); color:var(--ink3); cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:color .3s ease; }
  .copy-btn:hover { color:var(--accent); }

  /* ── Home ────────────────────────────────────────── */
  .hero {
    display:grid; grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr); gap:56px; align-items:center;
    padding-top:clamp(40px, 9vw, 112px); padding-bottom:clamp(56px, 8vw, 104px);
  }
  .hero-name { font-family:var(--display); font-size:var(--fs-hero); line-height:1; font-weight:800; letter-spacing:-0.015em; color:var(--ink); }
  .hero-name .word { display:block; white-space:nowrap; }
  .hero-name .char { display:inline-block; will-change:transform, opacity, filter; }
  .hero-rule { margin-top:26px; width:72px; height:0; border-top:3px double var(--accent); }
  .hero-role { margin-top:20px; font-family:var(--display); font-size:var(--fs-lead); font-style:italic; color:var(--accent); }
  .hero-lead { margin-top:10px; max-width:44ch; color:var(--ink2); }
  .hero-actions { margin-top:34px; display:flex; flex-wrap:wrap; align-items:center; gap:12px; }
  .kbd-hint { margin-top:22px; font-family:var(--ui); font-size:var(--fs-ui-s); color:var(--ink3); }
  .kbd-hint button { background:none; border:0; padding:0; color:inherit; cursor:pointer; transition:color .3s ease; }
  .kbd-hint button:hover { color:var(--ink); }
  @media (hover: none), (pointer: coarse) { .kbd-hint { display:none; } }

  .portrait { justify-self:end; width:100%; max-width:330px; }
  .portrait-stage { position:relative; aspect-ratio:1; }
  .portrait-ring { position:absolute; inset:-12px; border-radius:50%; border:1px solid var(--line-strong); }
  .portrait-frame { position:absolute; inset:0; border-radius:50%; overflow:hidden; background:var(--surface); -webkit-mask-image:-webkit-radial-gradient(white, black); }
  .portrait-frame img {
    position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:var(--photo-pos, 50% 50%); display:block;
    opacity:0; transform:scale(1.06); transition:opacity 1.2s ease, transform 1.6s var(--ease);
  }
  .portrait-frame img.is-loaded { opacity:1; transform:scale(1); }
  @media (hover: hover) { .portrait:hover .portrait-frame img.is-loaded { transform:scale(1.035); } }
  .portrait-fallback {
    position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
    font-family:var(--masthead); font-size:clamp(3rem, 6vw, 4.5rem); color:var(--accent);
  }
  .portrait figcaption { margin-top:30px; text-align:center; font-family:var(--text); font-style:italic; font-size:0.9375rem; color:var(--ink3); }

  .split {
    display:grid; grid-template-columns:minmax(150px, 220px) minmax(0,1fr); gap:16px clamp(32px, 7vw, 104px);
    padding:48px 0; border-top:3px double var(--ink);
  }
  .split-label { font-family:var(--display); font-size:1.125rem; font-weight:600; font-style:italic; color:var(--ink); padding-top:2px; }
  .split .entry:first-child { padding-top:0; }
  .split .entry:last-child { padding-bottom:0; border-bottom:0; }

  /* ── Footer ──────────────────────────────────────── */
  .footer { margin-top:72px; border-top:3px double var(--ink); padding:28px 0 calc(44px + env(safe-area-inset-bottom, 0px)); }
  .footer-inner { display:flex; justify-content:space-between; align-items:flex-start; gap:20px 32px; flex-wrap:wrap; }
  .footer-name { font-family:var(--masthead); font-size:1.375rem; line-height:1.2; color:var(--ink); }
  .footer-note { margin-top:4px; font-family:var(--ui); font-size:var(--fs-ui-s); color:var(--ink3); }
  .footer-links { display:flex; flex-wrap:wrap; gap:8px 22px; align-items:center; font-family:var(--ui); font-size:var(--fs-ui); }
  .footer-links a, .footer-links button { background:none; border:0; padding:0; cursor:pointer; color:var(--ink2); text-decoration:none; transition:color .3s ease; }
  .footer-links a:hover, .footer-links button:hover { color:var(--accent); }

  /* ── Responsive ──────────────────────────────────── */
  @media (max-width: 900px) {
    .page { grid-template-columns:1fr; gap:36px; }
    .page-aside-inner { position:static; }
    .page-intro { max-width:52ch; }
    .toc { flex-direction:row; flex-wrap:wrap; gap:6px; margin-top:24px; border-left:0; }
    .toc-item { padding:5px 12px; border:1px solid var(--line-strong); border-radius:999px; font-size:var(--fs-ui-s); }
    .toc-item.active { border-color:var(--accent); color:var(--accent); }
    .toc-bar { display:none; }
    .filters { margin-top:24px; }
  }
  @media (max-width: 820px) {
    .hero { grid-template-columns:1fr; gap:40px; }
    .portrait { order:-1; justify-self:center; max-width:210px; margin-top:12px; }
    .portrait figcaption { display:none; }
  }
  @media (max-width: 640px) {
    :root { --fs-body:1rem; --fs-h3:1.1875rem; --nav-h:60px; --lh:1.7; }
    .brand { font-size:1.4375rem; }
    .split { grid-template-columns:1fr; padding:40px 0; }
    .pager { grid-template-columns:1fr; }
    .pager-link.next { grid-column:1; }
    .entry-head { flex-direction:column; gap:2px; }
    .contact-v { font-size:1.0625rem; }
  }
`;

// ─── Motion vocabulary ────────────────────────────────────────────────────────
// Springs tuned to settle quickly with no visible wobble, the way macOS UI moves.
const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 };
const SPRING_SOFT = { type: 'spring', stiffness: 220, damping: 28 };

const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');
const prefersReduced = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
};
const smoothScrollTo = (top) => window.scrollTo({ top, behavior: prefersReduced() ? 'auto' : 'smooth' });
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
};

// Soft rise-and-focus as content scrolls into view (plays once)
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18, filter: 'blur(4px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.9, delay, ease: EASE },
});

// ─── Theme ────────────────────────────────────────────────────────────────────
const getInitialTheme = () => {
  try { const s = localStorage.getItem('theme'); if (s === 'light' || s === 'dark') return s; } catch (e) {}
  try { if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'; } catch (e) {}
  return 'light';
};
const applyThemeClass = (t) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(t);
  root.dataset.dark = DARK_STYLE;
  root.style.colorScheme = t;
};

const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const timer = useRef(null);
  useEffect(() => {
    applyThemeClass(theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  // Grows the new theme out of the button that was pressed (where supported)
  const toggleTheme = (e) => {
    const next = theme === 'light' ? 'dark' : 'light';
    const root = document.documentElement;
    if (!document.startViewTransition || prefersReduced()) {
      root.classList.add('theme-anim');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => root.classList.remove('theme-anim'), 500);
      setTheme(next);
      return;
    }
    let x = window.innerWidth - 60, y = 34;
    if (e && e.currentTarget && e.currentTarget.getBoundingClientRect) {
      const r = e.currentTarget.getBoundingClientRect();
      x = r.left + r.width / 2; y = r.top + r.height / 2;
    }
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = document.startViewTransition(() => {
      applyThemeClass(next);
      flushSync(() => setTheme(next));
    });
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
  };
  return { theme, toggleTheme };
};

// Highlights the last section whose top has passed ~35% of the viewport
const useScrollSpy = (ids) => {
  const key = ids.join('|');
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!ids.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) { setActive(ids[ids.length - 1]); return; }
      const line = window.innerHeight * 0.35;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return [active, setActive];
};

// ─── Small components ─────────────────────────────────────────────────────────
const ThemeToggle = ({ theme, toggleTheme }) => (
  <button onClick={toggleTheme} className="icon-btn" aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}>
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={theme}
        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
        transition={SPRING}
        style={{ display: 'flex' }}
      >
        {theme === 'light' ? <Moon /> : <Sun />}
      </motion.span>
    </AnimatePresence>
  </button>
);

const ExtLink = ({ href, children, className = 'lnk' }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
);

const Entry = ({ title, href, tag, sub, date, children, animate = true }) => (
  <motion.article className="entry" {...(animate ? reveal() : {})}>
    <header className="entry-head">
      <h3 className="entry-title">
        {href
          ? <a href={href} target="_blank" rel="noopener noreferrer" className="title-link">{title}<ExternalLink className="title-link-icon" aria-hidden="true" /></a>
          : title}
      </h3>
      {date && <span className="entry-date">{date}</span>}
    </header>
    {(tag || sub) && (
      <p className="entry-sub">
        {tag && <span className="tag">{tag}</span>}
        {sub && <span>{sub}</span>}
      </p>
    )}
    {children && <div className="entry-body">{children}</div>}
  </motion.article>
);

const Section = ({ id, title, children }) => (
  <section id={id} className="sec" aria-labelledby={`${id}-title`}>
    <motion.h2 id={`${id}-title`} className="sec-title" {...reveal()}>{title}</motion.h2>
    {children}
  </section>
);

const Pager = () => {
  const { pathname } = useLocation();
  const i = navPages.findIndex(p => p.path === pathname);
  if (i < 0) return null;
  const prev = i > 0 ? navPages[i - 1] : { label: 'Home', path: '/' };
  const next = navPages[i + 1];
  return (
    <motion.nav className="pager" aria-label="Previous and next page" {...reveal()}>
      <Link to={prev.path} className="pager-link prev">
        <span className="pager-dir"><ArrowLeft /> Previous</span>
        <span className="pager-label">{prev.label}</span>
      </Link>
      {next && (
        <Link to={next.path} className="pager-link next">
          <span className="pager-dir">Next <ArrowRight /></span>
          <span className="pager-label">{next.label}</span>
        </Link>
      )}
    </motion.nav>
  );
};

// Shared shell for every inner page: sticky title column + content column
const PageLayout = ({ kicker, title, intro, sections = [], aside, children }) => {
  const [active, setActive] = useScrollSpy(sections.map(s => s.id));
  return (
    <div className="wrap page">
      <aside className="page-aside">
        <div className="page-aside-inner">
          {kicker && <p className="kicker">{kicker}</p>}
          <h1 className="page-title">{title}</h1>
          {intro && <p className="page-intro">{intro}</p>}
          {sections.length > 1 && (
            <nav className="toc" aria-label="On this page">
              {sections.map(s => (
                <button key={s.id} type="button" className={`toc-item${active === s.id ? ' active' : ''}`}
                  aria-current={active === s.id ? 'location' : undefined}
                  onClick={() => { setActive(s.id); scrollToId(s.id); }}>
                  {active === s.id && <motion.span layoutId="toc-bar" className="toc-bar" transition={SPRING} />}
                  {s.label}
                </button>
              ))}
            </nav>
          )}
          {aside}
        </div>
      </aside>
      <div className="page-body">
        {children}
        <Pager />
      </div>
    </div>
  );
};

const pageDesc = (path) => cap(navPages.find(p => p.path === path)?.desc);

// ─── Spotlight-style search (⌘K / Ctrl K / "/") ───────────────────────────────
const CommandPalette = ({ open, onClose, theme, toggleTheme, notify }) => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const listRef = useRef(null);
  const returnFocus = useRef(null);

  const items = useMemo(() => [
    { group: 'Pages', label: 'Home', hint: 'Start here', run: () => navigate('/') },
    ...navPages.map(p => ({ group: 'Pages', label: p.label, hint: cap(p.desc), run: () => navigate(p.path) })),
    { group: 'Actions', label: theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme', run: () => toggleTheme() },
    { group: 'Actions', label: 'Copy email address', hint: cvData.contact.email, run: async () => {
        try { await navigator.clipboard.writeText(cvData.contact.email); notify('Email address copied'); }
        catch (e) { notify(cvData.contact.email); }
      } },
    { group: 'Actions', label: 'Write an email', hint: 'Opens your mail app', run: () => { window.location.href = `mailto:${cvData.contact.email}`; } },
    { group: 'Actions', label: 'Open LinkedIn', hint: 'Opens in a new tab', run: () => window.open(cvData.contact.linkedin, '_blank', 'noopener,noreferrer') },
  ], [navigate, theme, toggleTheme, notify]);

  const query = q.trim().toLowerCase();
  const results = query ? items.filter(i => `${i.label} ${i.hint || ''}`.toLowerCase().includes(query)) : items;

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    setQ(''); setIdx(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      if (returnFocus.current && returnFocus.current.focus) returnFocus.current.focus();
    };
  }, [open]);
  useEffect(() => { setIdx(0); }, [q]);
  useEffect(() => {
    const el = listRef.current && listRef.current.querySelector(`[data-idx="${idx}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  const choose = (item) => { if (!item) return; onClose(); window.setTimeout(item.run, 80); };
  const onKeyDown = (e) => {
    const n = results.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); if (n) setIdx(i => (i + 1) % n); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (n) setIdx(i => (i - 1 + n) % n); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[idx]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  };

  let lastGroup = null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmdk-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div className="cmdk" role="dialog" aria-modal="true" aria-label="Quick navigation"
            initial={{ opacity: 0, scale: 0.96, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
            transition={SPRING}>
            <div className="cmdk-input-row">
              <Search aria-hidden="true" />
              <input autoFocus className="cmdk-input" value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKeyDown}
                placeholder="Jump to a page or action…" aria-label="Search pages and actions"
                role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-activedescendant={results[idx] ? `cmdk-${idx}` : undefined} />
              <kbd>Esc</kbd>
            </div>
            <div className="cmdk-list" id="cmdk-list" role="listbox" ref={listRef}>
              {results.length === 0 && <p className="cmdk-empty">No matches for “{q}”. Try a page name, like “events”.</p>}
              {results.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                return (
                  <React.Fragment key={item.label}>
                    {header && <div className="cmdk-group" role="presentation">{header}</div>}
                    <div id={`cmdk-${i}`} data-idx={i} role="option" aria-selected={i === idx}
                      className={`cmdk-item${i === idx ? ' active' : ''}`}
                      onMouseMove={() => { if (i !== idx) setIdx(i); }} onClick={() => choose(item)}>
                      {i === idx && <motion.span layoutId="cmdk-hl" className="cmdk-hl" transition={{ type: 'spring', stiffness: 600, damping: 42 }} />}
                      <span className="cmdk-label">{item.label}</span>
                      {item.hint && <span className="cmdk-hint">{item.hint}</span>}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            <div className="cmdk-foot">
              <span><kbd>↑</kbd> <kbd>↓</kbd> to move</span>
              <span><kbd>Enter</kbd> to open</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ theme, toggleTheme, onSearch }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        <div className="wrap nav-inner">
          <Link to="/" className="brand" aria-label="Adeetya Choubey, home">{cvData.name}</Link>
          <nav className="nav-links" aria-label="Main" onMouseLeave={() => setHovered(null)}>
            {navPages.map(({ label, path }) => {
              const active = pathname === path;
              return (
                <Link key={path} to={path} className={`nav-link${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}
                  onMouseEnter={() => setHovered(path)}>
                  <AnimatePresence>
                    {hovered === path && <motion.span layoutId="nav-pill" className="nav-pill" transition={SPRING}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }} />}
                  </AnimatePresence>
                  {label}
                  {active && <motion.span layoutId="nav-underline" className="nav-underline" transition={SPRING} />}
                </Link>
              );
            })}
          </nav>
          <div className="nav-actions">
            <button type="button" className="search-btn" onClick={onSearch} aria-label="Search pages and actions" aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}>
              <Search aria-hidden="true" />
              <span className="search-label">Search</span>
              <kbd>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button type="button" className="icon-btn menu-btn" aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(o => !o)}>
              <span className="burger" aria-hidden="true"><span /><span /></span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" className="mobile-menu"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
            transition={SPRING_SOFT}>
            <nav className="wrap" aria-label="Main">
              {[{ label: 'Home', path: '/', desc: 'start here' }, ...navPages].map(({ label, path, desc }, i) => (
                <motion.div key={path} initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ ...SPRING_SOFT, delay: 0.04 * i }}>
                  <Link to={path} className={`m-link${pathname === path ? ' active' : ''}`} aria-current={pathname === path ? 'page' : undefined}>
                    <span className="m-label">{label}</span>
                    <span className="m-desc">{cap(desc)}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const BackToTop = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [show, setShow] = useState(false);
  useEffect(() => scrollY.on('change', v => setShow(v > 520)), [scrollY]);
  return (
    <AnimatePresence>
      {show && (
        <motion.button type="button" className="to-top" aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
          transition={SPRING} whileTap={{ scale: 0.9 }}
          onClick={() => smoothScrollTo(0)}>
          <svg className="ring-svg" viewBox="0 0 46 46" aria-hidden="true">
            <circle className="ring-bg" cx="23" cy="23" r="21.5" />
            <motion.circle className="ring" cx="23" cy="23" r="21.5" style={{ pathLength: progress }} />
          </svg>
          <ArrowUp aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="wrap footer-inner">
      <div>
        <p className="footer-name">{cvData.name}</p>
        <p className="footer-note">© {new Date().getFullYear()}. You may use, share, and adapt with proper credits.</p>
      </div>
      <div className="footer-links">
        <a href={`mailto:${cvData.contact.email}`}>Email</a>
        <a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <button type="button" onClick={() => smoothScrollTo(0)}>Back to top</button>
      </div>
    </div>
  </footer>
);

// ─── Home ─────────────────────────────────────────────────────────────────────
let heroPlayed = false; // the intro plays once per visit, not on every return to Home

const HeroName = ({ play }) => {
  let k = 0;
  return (
    <h1 className="hero-name">
      <span className="sr-only">{cvData.name}</span>
      {cvData.name.split(' ').map(word => (
        <span key={word} className="word" aria-hidden="true">
          {Array.from(word).map((c, ci) => {
            const delay = 0.1 + (k++) * 0.04;
            return (
              <motion.span key={ci} className="char"
                initial={play ? { opacity: 0, y: '0.3em', filter: 'blur(10px)' } : false}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                transition={{ duration: 1, delay, ease: EASE }}>{c}</motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
};

const Portrait = ({ play }) => {
  const [state, setState] = useState('loading'); // loading | loaded | error
  const imgRef = useRef(null);
  useEffect(() => {
    const im = imgRef.current;
    if (im && im.complete) setState(im.naturalWidth ? 'loaded' : 'error');
  }, []);
  return (
    <motion.figure className="portrait"
      initial={play ? { opacity: 0, scale: 0.94, filter: 'blur(8px)' } : false}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      transition={{ duration: 1.3, delay: 0.3, ease: EASE }}>
      <div className="portrait-stage">
        <motion.div className="portrait-ring" aria-hidden="true"
          initial={play ? { scale: 0.9, opacity: 0 } : false} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.55, ease: EASE }} />
        <div className="portrait-frame" style={{ '--photo-pos': PROFILE_PHOTO_POSITION }}>
          {state !== 'error' && (
            <img ref={imgRef} src={PROFILE_PHOTO} alt={`${cvData.name}, smiling with arms crossed in front of bougainvillea`}
              width="1000" height="1000" decoding="async"
              className={state === 'loaded' ? 'is-loaded' : ''}
              onLoad={() => setState('loaded')} onError={() => setState('error')} />
          )}
          {state === 'error' && <div className="portrait-fallback" aria-label={`${cvData.name} (photo not found)`}>AC</div>}
        </div>
      </div>
      <figcaption>Currently: <Link to="/projects" className="lnk">homotopical algebra</Link></figcaption>
    </motion.figure>
  );
};

const HomePage = ({ onSearch }) => {
  const [play] = useState(() => !heroPlayed);
  useEffect(() => { heroPlayed = true; }, []);
  const rise = (d) => play ? {
    initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
    transition: { duration: 0.9, delay: d, ease: EASE },
  } : {};

  return (
    <div className="home">
      <section className="wrap hero">
        <div>
          <HeroName play={play} />
          <motion.div className="hero-rule" aria-hidden="true" style={{ originX: 0 }}
            initial={play ? { scaleX: 0 } : false} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.55, ease: EASE }} />
          <motion.p className="hero-role" {...rise(0.6)}>Idle category theorist (aspiring)</motion.p>
          <motion.p className="hero-lead" {...rise(0.7)}>
            Math undergrad at <ExtLink href="https://maths.iiserb.ac.in/">IISER Bhopal</ExtLink>. An informal introduction to my formal (academic) self.
          </motion.p>
          <motion.div className="hero-actions" {...rise(0.8)}>
            <Link to="/projects" className="btn">See my work <ArrowRight /></Link>
            <Link to="/contact" className="btn btn-ghost">Get in touch</Link>
          </motion.div>
          <motion.p className="kbd-hint" {...rise(0.9)}>
            <button type="button" onClick={onSearch}>Press <kbd>/</kbd> to jump anywhere</button>
          </motion.p>
        </div>
        <Portrait play={play} />
      </section>

      <motion.section className="wrap" aria-labelledby="about-title" {...reveal()}>
        <div className="split">
          <h2 id="about-title" className="split-label">About</h2>
          <div className="prose" lang="en">
            <p className="lead">{cvData.profile.intro}</p>
            <p className="dropcap">{cvData.profile.interests}</p>
            <p>{cvData.profile.ambition}</p>
          </div>
        </div>
      </motion.section>

      <motion.section className="wrap" aria-labelledby="edu-title" {...reveal()}>
        <div className="split">
          <h2 id="edu-title" className="split-label">Education</h2>
          <div>
            {cvData.education.map(edu => (
              <Entry key={edu.institution} title={edu.institution} sub={edu.degree} date={edu.duration} animate={false}>
                {edu.grades?.length > 0 && <div>{edu.grades.map(g => <span key={g} className="pill">{g}</span>)}</div>}
              </Entry>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="wrap" aria-labelledby="resp-title" {...reveal()}>
        <div className="split">
          <h2 id="resp-title" className="split-label">Positions of responsibility</h2>
          <div lang="en">
            {cvData.responsibilities.map(r => (
              <Entry key={r.role} title={r.role} sub={r.institution} date={r.duration}>
                <p>{r.description}</p>
              </Entry>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

// ─── Academic Experiences ─────────────────────────────────────────────────────
const AcademicExperiencesPage = () => (
  <PageLayout kicker="AcadEx" title="Where I've learned" intro={pageDesc('/acadex')}
    sections={[{ id: 'internships', label: 'Research internships' }, { id: 'schools', label: 'Summer schools' }]}>
    <Section id="internships" title="Research internships">
      {cvData.academicExperiences.internships.map(exp => (
        <Entry key={exp.duration} title={exp.title} sub={exp.institution} date={exp.duration}><p>{exp.description}</p></Entry>
      ))}
    </Section>
    <Section id="schools" title="Summer schools">
      {cvData.academicExperiences.summerSchools.map(exp => (
        <Entry key={exp.institution} title={exp.title} sub={exp.institution} date={exp.duration}><p>{exp.description}</p></Entry>
      ))}
    </Section>
  </PageLayout>
);

// ─── Projects ─────────────────────────────────────────────────────────────────
const ResearchPage = () => (
  <PageLayout kicker="Projects" title="Past work & what's ahead" intro={pageDesc('/projects')}
    sections={[{ id: 'ongoing', label: 'Ongoing' }, { id: 'completed', label: 'Completed' }]}>
    <Section id="ongoing" title="Ongoing">
      <Entry title="Homotopical Algebra" sub="MS thesis, advised by Dr. Vivek Sadhu">
        <p className="status"><span className="status-dot" aria-hidden="true" />In progress</p>
        <p>
          Homotopical algebra grew out of the observation that a lot of things one can do in topology can be carried out in a "well behaved category". Quillen's definition of a model category isolates the bare minimum conditions one needs to impose on a category so that one can talk about homotopy theory. The primary goal is to understand the definition and basic theory of a model category, together with enough worked out examples, including the classical model structure on the category of topological spaces. This will be followed by some applications in algebraic K-theory and higher homotopy theory (hopefully!).
        </p>
      </Entry>
    </Section>
    <Section id="completed" title="Completed">
      {cvData.research.map(item => (
        <Entry key={item.title} title={item.title} sub={item.guide}>
          <p>
            <strong>Cayley graphs</strong> exhibit the nature of the action of a group G on a set S closed under inverses. A graph is <strong>integral</strong> if each eigenvalue of its adjacency matrix is an integer. The <strong>genus</strong> is the minimum number of handles that must be added to a sphere to embed the graph on the resulting surface without edge crossings.
          </p>
          <p>
            The goal of the project was to read relevant literature and try to come up with expressions for the genus of generalized Cayley graphs (Cayley graphs over fields). I used computational and algebraic tools to explore these two properties of Cayley graphs on finite abelian groups and of generalized Cayley graphs.
          </p>
        </Entry>
      ))}
    </Section>
  </PageLayout>
);

// ─── Events ───────────────────────────────────────────────────────────────────
const EventsPage = () => {
  const featuredTitles = ["Discussion Meeting on Topics in Algebra", "GANIT Symposium"];
  const sortedEvents = [
    ...featuredTitles.map(t => cvData.events.find(e => e.title === t)).filter(Boolean),
    ...cvData.events.filter(e => e.title.includes('Grassmannian')),
    ...cvData.events.filter(e => e.title.startsWith('Cup Product')),
    ...cvData.events.filter(e => !featuredTitles.includes(e.title) && !e.title.includes('Grassmannian') && !e.title.startsWith('Cup Product')),
  ];
  const tags = ['All', ...Array.from(new Set(sortedEvents.map(e => e.tag)))];
  const [filter, setFilter] = useState('All');
  const shown = sortedEvents.filter(e => filter === 'All' || e.tag === filter);

  const renderDescription = (ev) => {
    const d = ev.description;
    if (ev.link && typeof d === 'string' && d.includes(ev.link.text)) {
      const [before, ...rest] = d.split(ev.link.text);
      return <>{before}<ExtLink href={ev.link.url}>{ev.link.text}</ExtLink>{rest.join(ev.link.text)}</>;
    }
    return d;
  };
  const titleHref = (ev) => (ev.link && !(typeof ev.description === 'string' && ev.description.includes(ev.link.text)) ? ev.link.url : undefined);

  return (
    <PageLayout kicker="Events" title="Things I have been a part of" intro={pageDesc('/events')}
      aside={
        <div className="filters" role="group" aria-label="Filter events by type">
          {tags.map(t => {
            const on = filter === t;
            const count = t === 'All' ? sortedEvents.length : sortedEvents.filter(e => e.tag === t).length;
            return (
              <motion.button key={t} type="button" className={`chip${on ? ' active' : ''}`} aria-pressed={on} onClick={() => setFilter(t)}
                whileTap={{ scale: 0.95 }} transition={SPRING}>
                {on && <motion.span layoutId="chip-bg" className="chip-bg" transition={SPRING} />}
                {t}<span className="chip-count">{count}</span>
              </motion.button>
            );
          })}
        </div>
      }>
      <div className="entries" lang="en">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map(ev => (
            <motion.div key={ev.title} layout
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
              transition={{ ...SPRING_SOFT, opacity: { duration: 0.35 }, filter: { duration: 0.35 } }}>
              <Entry title={ev.title} href={titleHref(ev)} tag={ev.tag} animate={false}>
                <p>{renderDescription(ev)}</p>
              </Entry>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

// ─── Proofs (under construction) ──────────────────────────────────────────────
const ProofsPage = () => (
  <PageLayout kicker="Proofs" title="Proofs" intro="Some of the abstract nonsense which really made sense.">
    <motion.div className="note" {...reveal(0.1)}>
      <p className="status" style={{ marginTop: 0 }}><span className="status-dot" aria-hidden="true" />Under construction</p>
      <p>Nothing here yet. In the meantime, have a look at <Link to="/projects" className="lnk">Projects</Link> or <Link to="/events" className="lnk">Events</Link>.</p>
    </motion.div>
  </PageLayout>
);

// ─── OpenBoard ────────────────────────────────────────────────────────────────
const OpenBoardPage = () => (
  <PageLayout kicker="OpenBoard" title="Ideas, spoken freely" intro={pageDesc('/openboard')}
    sections={[
      { id: 'about', label: 'About' },
      { id: 'founders', label: 'Co-founders' },
      { id: 'status', label: 'Status' },
      { id: 'talks', label: 'Talks so far' },
    ]}>
    <Section id="about" title="About">
      <motion.div {...reveal()}>
        <div className="prose" style={{ marginTop: 28 }} lang="en">
          <p className="lead">A space for students to speak about what they care about, to a general audience.</p>
          <p>{cvData.openboard.mission}</p>
        </div>
        <div className="actions">
          <a href={cvData.openboard.website} target="_blank" rel="noopener noreferrer" className="btn">Visit OpenBoard <ExternalLink /></a>
        </div>
      </motion.div>
    </Section>

    <Section id="founders" title="Co-founders">
      <Entry title={cvData.openboard.role} sub={`${cvData.openboard.institution}, student-run`} date={cvData.openboard.duration}>
        <p>
          Along with my friend <ExtLink href={cvData.openboard.cofounder.url}>{cvData.openboard.cofounder.name}</ExtLink>, I started an independent initiative to let students come forward and speak their minds about topics they are passionate about, preferably to a general audience.
        </p>
        <p>We welcome all disciplines. If you have an idea you'd like to talk about, reach out.</p>
      </Entry>
    </Section>

    <Section id="status" title="Status">
      <motion.div className="note" style={{ marginTop: 28 }} {...reveal()}>
        <p className="status" style={{ marginTop: 0 }}><span className="status-dot" aria-hidden="true" />Currently on hold</p>
        <p>Due to academic commitments, we are currently on hold. We would like your help to bring it back. Reach out if you have ideas.</p>
        <div className="actions" style={{ marginTop: 20 }}>
          <a href={`mailto:${cvData.contact.email}`} className="btn">Reach out <ArrowRight /></a>
        </div>
      </motion.div>
    </Section>

    <Section id="talks" title="Talks so far">
      {cvData.openboard.talks.map(talk => (
        <Entry key={talk.title} title={talk.title} href={cvData.openboard.website} sub={`By ${talk.speaker}`}>
          <p>{talk.description}</p>
        </Entry>
      ))}
    </Section>
  </PageLayout>
);

// ─── Contact ──────────────────────────────────────────────────────────────────
const ContactPage = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(cvData.contact.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch (e) {}
  };
  return (
    <PageLayout kicker="Contact" title="Get in touch"
      intro="Feel free to reach out for collaborations, academic discussions, or just a friendly exchange of ideas.">
      <motion.div {...reveal(0.05)}>
        <a href={`mailto:${cvData.contact.email}`} className="contact-row">
          <span className="contact-icon"><Mail /></span>
          <span><span className="contact-k">Email</span><span className="contact-v">{cvData.contact.email}</span></span>
          <ArrowRight className="contact-go" aria-hidden="true" />
        </a>
        <a href={cvData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-row">
          <span className="contact-icon"><Linkedin /></span>
          <span><span className="contact-k">LinkedIn</span><span className="contact-v">Adeetya Choubey</span></span>
          <ExternalLink className="contact-go" aria-hidden="true" />
        </a>
        <button type="button" className="copy-btn" onClick={copy} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={copied ? 'y' : 'n'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {copied ? <><Check /> Email copied</> : <><Copy /> Copy email address</>}
            </motion.span>
          </AnimatePresence>
        </button>
        <div className="prose" style={{ marginTop: 40 }}>
          <p style={{ fontSize: '1rem', textAlign: 'left' }}>Based in {cvData.location}. Response times vary; email is the most reliable way to reach me.</p>
        </div>
      </motion.div>
    </PageLayout>
  );
};

const NotFoundPage = () => (
  <PageLayout kicker="404" title="Page not found" intro="The page you were looking for doesn't exist or has moved.">
    <Link to="/" className="btn">Go to the home page <ArrowRight /></Link>
  </PageLayout>
);

// ─── Shell: persistent navbar/footer, page content fades in ──────────────────
// Pages swap instantly and the new one eases in. There is deliberately no exit
// animation: waiting for one is what could leave the screen blank when links
// were clicked quickly.
function Shell({ theme, toggleTheme }) {
  const location = useLocation();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((msg) => {
    setToast({ msg, id: Date.now() });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);
  const openSearch = useCallback(() => setCmdOpen(true), []);

  // New page starts at the top, without a visible scroll animation
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Keyboard shortcuts: ⌘K / Ctrl K toggles search, "/" opens it
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(o => !o); }
      else if (e.key === '/' && !typing) { e.preventDefault(); setCmdOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const focusMain = (e) => { e.preventDefault(); document.getElementById('main')?.focus(); };

  return (
    <>
      <a href="#main" className="skip" onClick={focusMain}>Skip to content</a>
      <Navbar theme={theme} toggleTheme={toggleTheme} onSearch={openSearch} />
      <main id="main" tabIndex={-1}>
        <motion.div key={location.pathname}
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
          transition={{ duration: 0.6, ease: EASE }}>
          <Routes location={location}>
            <Route path="/"          element={<HomePage onSearch={openSearch} />} />
            <Route path="/acadex"    element={<AcademicExperiencesPage />} />
            <Route path="/projects"  element={<ResearchPage />} />
            <Route path="/proofs"    element={<ProofsPage />} />
            <Route path="/events"    element={<EventsPage />} />
            <Route path="/openboard" element={<OpenBoardPage />} />
            <Route path="/contact"   element={<ContactPage />} />
            <Route path="*"          element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </main>
      <Footer />
      <BackToTop />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} theme={theme} toggleTheme={toggleTheme} notify={notify} />
      <div className="toast-wrap" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.div key={toast.id} className="toast" role="status"
              initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={SPRING}>
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Load the fonts once
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach((href, i) => {
      const pc = document.createElement('link');
      pc.rel = 'preconnect'; pc.href = href; if (i) pc.crossOrigin = 'anonymous';
      document.head.appendChild(pc);
    });
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = FONT_HREF;
    document.head.appendChild(l);
  }, []);

  return (
    <HashRouter>
      <MotionConfig reducedMotion="user">
        <style>{CSS}</style>
        <Shell theme={theme} toggleTheme={toggleTheme} />
      </MotionConfig>
    </HashRouter>
  );
}
