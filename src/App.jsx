import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, MotionConfig, useScroll } from 'framer-motion';


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
const ArrowUpRight = (p) => (
  <svg {...p} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7"/><path d="M8 7h9v9"/>
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
    interests: "Academically, my interests are in algebraic topology and algebraic geometry, with a lot of categorical flavor.",
    ambition: "Apart from academics, I enjoy. I want to enjoy whatever I can, however I can, whenever I can. Things like football, music, mangas, cards and board games, table tennis, frisbee are just some of the things that bring me joy. I am recently exploring a lot of music, outside of my usual interests (Hip-Hop, and RnB), like indian classical, rock, soul, and I enjoy working on creative personal projects from time to time."
  },
  research: [{
    title: "Exploring Integrality and Genus of some specific Cayley Graphs",
    guide: "Guide: Prof. Ashish Upadhyay",
    description: "Cayley graphs are graphs which exhibit the nature of action of a group G on a set S, which is closed under inverses (typically generating set). A graph is said to be integral if each of the eigenvalues of its adjacency matrix is an integer. The genus of a graph is the minimum number of handles that must be added to a sphere to embed the graph on the resulting surface without any edge crossings. The goal was to work towards finding out the fields for which the 'generalised' Cayley graphs are integral and what genus do they have."
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
    description: "Samriddha and I started an independent initiative to let students come forward and speak their minds about topics they are passionate about, preferably to a general audience.",
    mission: "Openboard is a formal platform to be informal, and an informal platform to be formal. It is dedicated to ideas. Samriddha and I believed that curiosity should have an outlet beyond the classroom; a space where students can address a general audience on topics they genuinely care about.",
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


// ─── Type: Computer Modern (the LaTeX font) ──────────────────────────────────
// CMU Serif / CMU Typewriter, SIL Open Font License · served by jsDelivr from the
// `computer-modern` npm package. To self-host, download those woff2 files and point CM_BASE at them.
const CM_BASE = 'https://cdn.jsdelivr.net/npm/computer-modern@0.1.3/fonts/';

const PROFILE_PHOTO = 'profile.jpg';
// Which point of the photo sits in the centre of the circle (x% y%).
const PROFILE_PHOTO_POSITION = '50% 50%';
// Dark theme style key (kept for compatibility; one dark palette is defined in CSS).
const DARK_STYLE = 'navy';
// The circular reveal when switching light/dark. Set to false for an instant switch.
const THEME_REVEAL = true;


const CSS = `
  /* ── Computer Modern (CMU, SIL OFL) from jsDelivr ─── */
  @font-face { font-family:'CMU Serif'; font-style:normal; font-weight:400; font-display:swap; src:url(${CM_BASE}cmu-serif-500-roman.woff2) format('woff2'); }
  @font-face { font-family:'CMU Serif'; font-style:italic; font-weight:400; font-display:swap; src:url(${CM_BASE}cmu-serif-500-italic.woff2) format('woff2'); }
  @font-face { font-family:'CMU Serif'; font-style:normal; font-weight:700; font-display:swap; src:url(${CM_BASE}cmu-serif-700-roman.woff2) format('woff2'); }
  @font-face { font-family:'CMU Serif'; font-style:italic; font-weight:700; font-display:swap; src:url(${CM_BASE}cmu-serif-700-italic.woff2) format('woff2'); }
  @font-face { font-family:'CMU Typewriter Text'; font-style:normal; font-weight:400; font-display:swap; src:url(${CM_BASE}cmu-typewriter-text-500-roman.woff2) format('woff2'); }

  /* Classic LaTeX: white paper, black ink, hyperref-style dark-blue links */
  :root {
    --bg:          #FFFFFF;
    --surface:     #FAFAF8;
    --ink:         #000000;
    --ink2:        #1A1A1A;
    --ink3:        #5C5C5C;
    --accent:      #00008B;
    --accent-soft: rgba(0,0,139,0.06);
    --accent-line: rgba(0,0,139,0.40);
    --hover:       rgba(0,0,0,0.04);
    --line:        #E2E2E2;
    --line-strong: #BDBDBD;
    --on-ink:      #FFFFFF;
    --on-accent:   #FFFFFF;
    --pop-shadow:  0 24px 60px -24px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.06);

    --serif: 'CMU Serif', 'Latin Modern Roman', 'Computer Modern Serif', 'Computer Modern', 'Times New Roman', serif;
    --mono:  'CMU Typewriter Text', 'Latin Modern Mono', 'Courier New', monospace;
    --display: var(--serif);
    --text:    var(--serif);
    --ui:      var(--serif);

    --fs-ui:   0.9375rem;
    --fs-ui-s: 0.875rem;
    --fs-body: 1.125rem;
    --fs-lead: 1.25rem;
    --fs-h3:   1.1875rem;
    --fs-h1:   clamp(2rem, 1.6rem + 1.6vw, 2.6rem);
    --fs-hero: clamp(2.6rem, 1.8rem + 3.4vw, 4rem);
    --lh:      1.55;
    --measure: 66ch;
    --indent:  1.5em;

    --nav-h:  64px;
    --pop:    cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  /* Dark: a PDF viewer in night mode, soft grey paper with light-blue links */
  .dark {
    --bg:          #1E1E1E;
    --surface:     #252526;
    --ink:         #ECECEC;
    --ink2:        #D4D4D4;
    --ink3:        #9A9A9A;
    --accent:      #8AB4F8;
    --accent-soft: rgba(138,180,248,0.08);
    --accent-line: rgba(138,180,248,0.45);
    --hover:       rgba(255,255,255,0.05);
    --line:        #333333;
    --line-strong: #4A4A4A;
    --on-ink:      #1E1E1E;
    --on-accent:   #10141C;
    --pop-shadow:  0 24px 60px -20px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.3);
  }

  /* ── Base ─────────────────────────────────────────── */
  *, *::before, *::after { box-sizing:border-box; }
  html { -webkit-text-size-adjust:100%; scrollbar-gutter:stable; }
  body {
    margin:0; background:var(--bg); color:var(--ink);
    font-family:var(--serif); font-size:var(--fs-body); line-height:var(--lh); font-weight:400;
    font-kerning:normal; font-feature-settings:"kern" 1, "liga" 1;
    -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; text-rendering:optimizeLegibility;
    -webkit-tap-highlight-color:transparent;
  }
  h1,h2,h3,h4,p,figure { margin:0; }
  h1,h2,h3 { text-wrap:balance; font-weight:700; letter-spacing:0; }
  p { overflow-wrap:break-word; }
  button, input { font:inherit; color:inherit; }
  strong { font-weight:700; color:var(--ink); }
  em { font-style:italic; }
  ::selection { background:var(--accent); color:var(--on-accent); }
  :focus-visible { outline:1px solid var(--accent); outline-offset:3px; }
  main:focus { outline:none; }
  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  kbd {
    font-family:var(--mono); font-size:0.75rem; line-height:1.5; padding:0 5px;
    border:1px solid var(--line-strong); border-radius:2px; color:var(--ink2);
  }
  .sc { font-variant-caps:small-caps; letter-spacing:0.02em; }

  ::view-transition-old(root), ::view-transition-new(root) { animation:none; mix-blend-mode:normal; }
  html.theme-anim, html.theme-anim *, html.theme-anim *::before, html.theme-anim *::after {
    transition-property:background-color, border-color, color, fill, stroke !important; transition-duration:.45s !important;
  }

  .wrap { width:100%; max-width:1080px; margin:0 auto; padding:0 clamp(20px, 4vw, 40px); }

  .skip {
    position:fixed; left:16px; top:-60px; z-index:100; padding:6px 14px;
    background:var(--ink); color:var(--on-ink); font-size:var(--fs-ui); text-decoration:none;
  }
  .skip:focus { top:12px; }

  /* ── Links: underlined, and they pop on hover ────── */
  .lnk, .title-link, .btn, .nav-link, .footer-links a, .footer-links button, .pager-label,
  .contact-v, .copy-btn, .kbd-hint button, .toc-item, .chip, .m-label {
    text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:0.17em;
    text-decoration-color:var(--accent-line);
  }
  .lnk { color:var(--accent); }
  .lnk, .btn, .nav-link, .footer-links a, .footer-links button, .copy-btn, .kbd-hint button, .chip, .toc-item {
    display:inline-block; transform-origin:50% 70%;
  }
  .lnk:hover, .btn:hover, .nav-link:hover, .footer-links a:hover, .footer-links button:hover,
  .copy-btn:hover, .kbd-hint button:hover, .chip:hover, .toc-item:hover {
    color:var(--accent); text-decoration-color:var(--accent); transform:translateY(-1px) scale(1.07);
  }

  /* ── Buttons are just links now ──────────────────── */
  .btn {
    display:inline-flex; align-items:center; gap:6px; padding:0; border:0; background:none;
    color:var(--accent); font-size:var(--fs-body); cursor:pointer; white-space:nowrap;
  }
  .btn svg { width:0.85em; height:0.85em; }
  .btn-ghost { color:var(--ink); }

  .icon-btn {
    width:36px; height:36px; flex-shrink:0; display:inline-flex; align-items:center; justify-content:center;
    border:1px solid var(--line-strong); border-radius:2px; background:transparent; color:var(--ink2); cursor:pointer;
  }
  .icon-btn:hover { color:var(--accent); border-color:var(--accent-line); }

  /* ── Navbar: a running head with a rule under it ─── */
  .nav { position:sticky; top:0; z-index:50; background:var(--bg); border-bottom:1px solid var(--line-strong); }
  .nav-inner { height:var(--nav-h); display:flex; align-items:center; justify-content:space-between; gap:24px; }
  .brand {
    font-size:1.25rem; font-weight:400; line-height:1; font-variant-caps:small-caps; letter-spacing:0.03em;
    color:var(--ink); text-decoration:none; white-space:nowrap; display:inline-block;
  }
  .brand:hover { color:var(--accent); transform:translateY(-1px) scale(1.04); }
  .nav-links { display:flex; align-items:center; gap:4px 24px; }
  .nav-link {
    position:relative; padding:4px 0; font-size:1.0625rem; font-variant-caps:small-caps; letter-spacing:0.02em;
    color:var(--ink2); text-decoration-color:transparent;
  }
  .nav-link.active { color:var(--accent); text-decoration-color:var(--accent); }
  .nav-tip {
    position:absolute; top:calc(100% + 10px); left:50%; z-index:60; pointer-events:none; white-space:nowrap;
    padding:4px 10px; background:var(--surface); border:1px solid var(--line-strong); color:var(--ink2);
    font-size:0.875rem; font-style:italic; font-variant-caps:normal; letter-spacing:0; line-height:1.4;
    opacity:0; transform:translateX(-50%) scale(calc(1 / 1.07));
  }
  .nav-link:hover .nav-tip, .nav-link:focus-visible .nav-tip { opacity:1; }
  .nav-actions { display:flex; align-items:center; gap:8px; }
  .search-btn {
    display:inline-flex; align-items:center; gap:8px; height:36px; padding:0 6px 0 12px; border-radius:2px;
    border:1px solid var(--line-strong); background:transparent; color:var(--ink3); font-size:0.9375rem;
    font-variant-caps:small-caps; cursor:pointer;
  }
  .search-btn:hover { color:var(--ink); border-color:var(--accent-line); }
  .menu-btn { display:none; }
  .burger { position:relative; width:16px; height:10px; }
  .burger span { position:absolute; left:0; right:0; height:1px; background:currentColor; }
  .burger span:first-child { top:0; }
  .burger span:last-child  { top:9px; }
  .is-open .burger span:first-child { top:4.5px; transform:rotate(45deg); }
  .is-open .burger span:last-child  { top:4.5px; transform:rotate(-45deg); }

  .mobile-menu { position:fixed; top:var(--nav-h); left:0; right:0; bottom:0; z-index:49; background:var(--bg); overflow-y:auto; padding:8px 0 48px; }
  .m-link { display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:12px 0; text-decoration:none; }
  .m-label { font-size:1.375rem; line-height:1.3; color:var(--ink); text-decoration-color:transparent; }
  .m-desc  { font-style:italic; font-size:0.9375rem; color:var(--ink3); text-align:right; }
  .m-link.active .m-label { color:var(--accent); text-decoration-color:var(--accent); }

  @media (max-width: 1000px) {
    .nav-links { display:none; }
    .menu-btn { display:inline-flex; }
    .search-btn { width:36px; padding:0; justify-content:center; }
    .search-btn .search-label, .search-btn kbd { display:none; }
  }

  /* ── Spotlight-style search ──────────────────────── */
  .cmdk-backdrop {
    position:fixed; inset:0; z-index:80; display:flex; justify-content:center; align-items:flex-start;
    padding:14vh 16px 16px;
  }
  .cmdk {
    width:100%; max-width:580px; border-radius:6px; overflow:hidden;
    background:color-mix(in srgb, var(--surface) 88%, transparent);
    -webkit-backdrop-filter:blur(24px) saturate(1.4); backdrop-filter:blur(24px) saturate(1.4);
    border:1px solid var(--line-strong); box-shadow:var(--pop-shadow);
  }
  .cmdk-input-row { display:flex; align-items:center; gap:12px; padding:14px 18px; border-bottom:1px solid var(--line); color:var(--ink3); }
  .cmdk-input { flex:1; min-width:0; border:0; outline:none; background:transparent; font-size:1.1875rem; color:var(--ink); }
  .cmdk-input::placeholder { color:var(--ink3); font-style:italic; }
  .cmdk-list { position:relative; max-height:min(56vh, 420px); overflow-y:auto; padding:6px 8px 10px; overscroll-behavior:contain; }
  .cmdk-group { position:relative; z-index:1; padding:12px 12px 4px; font-size:var(--fs-ui-s); font-variant-caps:small-caps; letter-spacing:0.03em; color:var(--ink3); }
  .cmdk-item { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:baseline; gap:16px; padding:8px 12px; cursor:pointer; font-size:1rem; color:var(--ink); }
  .cmdk-item.active .cmdk-label { color:var(--on-accent); }
  .cmdk-item.active .cmdk-hint { color:color-mix(in srgb, var(--on-accent) 75%, transparent); }
  .cmdk-hl { position:absolute; top:0; left:8px; right:8px; z-index:0; border-radius:3px; background:var(--accent); pointer-events:none; }
  .cmdk-hint { max-width:55%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:var(--fs-ui-s); font-style:italic; color:var(--ink3); }
  .cmdk-empty { padding:28px 12px; text-align:center; font-style:italic; color:var(--ink3); }
  .cmdk-foot { display:flex; gap:18px; padding:8px 18px; border-top:1px solid var(--line); font-size:var(--fs-ui-s); color:var(--ink3); }
  @media (hover: none) { .cmdk-foot { display:none; } }

  /* ── Back-to-top with reading progress ───────────── */
  .to-top {
    position:fixed; right:clamp(16px, 3vw, 32px); bottom:calc(clamp(16px, 3vw, 32px) + env(safe-area-inset-bottom, 0px)); z-index:40;
    width:44px; height:44px; border-radius:50%; border:0; cursor:pointer; color:var(--ink2);
    display:flex; align-items:center; justify-content:center; background:var(--bg);
  }
  .to-top:hover { color:var(--accent); }
  .to-top .ring-svg { position:absolute; inset:0; width:44px; height:44px; transform:rotate(-90deg); }
  .ring-bg { fill:none; stroke:var(--line-strong); stroke-width:1; }
  .ring    { fill:none; stroke:var(--accent); stroke-width:1.25; }

  .toast-wrap { position:fixed; left:0; right:0; bottom:calc(28px + env(safe-area-inset-bottom, 0px)); z-index:90; display:flex; justify-content:center; pointer-events:none; }
  .toast { padding:8px 16px; border-radius:2px; background:var(--ink); color:var(--on-ink); font-size:var(--fs-ui); box-shadow:var(--pop-shadow); }

  /* ── Inner page layout ───────────────────────────── */
  main { display:block; min-height:calc(100vh - var(--nav-h)); }
  .page {
    display:grid; grid-template-columns:minmax(210px, 270px) minmax(0, 1fr); gap:clamp(40px, 6vw, 88px);
    align-items:start; padding-top:clamp(44px, 6vw, 76px); padding-bottom:24px;
  }
  .page-aside { align-self:stretch; }
  .page-aside-inner { position:sticky; top:calc(var(--nav-h) + 36px); }
  .kicker { font-size:var(--fs-ui); font-variant-caps:small-caps; letter-spacing:0.04em; color:var(--accent); margin-bottom:8px; }
  .page-title { font-size:var(--fs-h1); font-weight:700; line-height:1.15; color:var(--ink); }
  .page-intro { margin-top:14px; max-width:30ch; font-size:1rem; font-style:italic; line-height:1.5; color:var(--ink3); }

  .toc { margin-top:32px; display:flex; flex-direction:column; align-items:flex-start; counter-reset:toc; }
  .toc::before { content:'Contents'; font-weight:700; font-size:1.0625rem; color:var(--ink); margin-bottom:6px; }
  .toc-item {
    position:relative; text-align:left; background:none; border:0; padding:3px 0; font-size:var(--fs-ui);
    color:var(--ink2); cursor:pointer; text-decoration-color:transparent; transform-origin:0 70%;
  }
  .toc-item::before { counter-increment:toc; content:counter(toc); display:inline-block; width:1.6em; color:var(--ink3); }
  .toc-item.active { color:var(--accent); text-decoration-color:var(--accent-line); }
  .toc-bar { display:none; }

  .page-body { min-width:0; max-width:44rem; counter-reset:sec; }
  .sec { scroll-margin-top:calc(var(--nav-h) + 28px); }
  .sec + .sec { margin-top:56px; }
  .sec-title { font-size:1.4375rem; font-weight:700; line-height:1.3; color:var(--ink); padding-bottom:4px; }
  .sec-title { display:flex; gap:0.9em; }
  .sec-title::before { counter-increment:sec; content:counter(sec); flex:none; }
  .rule { display:none; }

  .entry { padding:22px 0 0; }
  .sec > .entry:first-of-type, .entries > :first-child .entry { padding-top:12px; }
  .entry-head { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:baseline; gap:2px 24px; }
  .entry-title { font-size:var(--fs-h3); font-weight:700; line-height:1.35; color:var(--ink); }
  .entry-date { font-size:var(--fs-ui); font-style:italic; color:var(--ink3); white-space:nowrap; font-variant-numeric:lining-nums; }
  .entry-sub { margin-top:1px; font-size:var(--fs-ui); font-style:italic; line-height:1.45; color:var(--ink2); }
  .tag { font-style:normal; font-variant-caps:small-caps; letter-spacing:0.03em; color:var(--accent); margin-right:0.6em; }
  .tag::after { content:'.'; }
  .entry-body { margin-top:8px; max-width:var(--measure); color:var(--ink2); }

  .title-link { color:inherit; display:inline; }
  .title-link:hover { color:var(--accent); text-decoration-color:var(--accent); }
  .entry-title:has(.title-link) { display:inline-block; transform-origin:0 70%; }
  .entry-title:has(.title-link:hover) { transform:translateY(-1px) scale(1.025); }

  .lead { font-style:italic; font-weight:400; font-size:var(--fs-lead); line-height:1.45; color:var(--ink); }
  .prose { max-width:var(--measure); color:var(--ink2); }
  .prose > * + * { margin-top:0.75em; }

  /* LaTeX paragraphs (parskip style): justified, hyphenated, no indents, even spacing */
  .prose > p:not(.lead), .entry-body > p:not(.status), .note p { text-align:justify; hyphens:auto; -webkit-hyphens:auto; text-indent:0; }
  .entry-body > * + * { margin-top:0.6em; }
  .entry-body > .status + p { margin-top:4px; }

  .actions { margin-top:22px; display:flex; flex-wrap:wrap; gap:12px 28px; }

  .pill { display:inline-block; margin-top:0; font-size:var(--fs-ui); color:var(--ink2); }
  .status { display:inline-flex; align-items:center; gap:8px; font-size:var(--fs-ui); font-variant-caps:small-caps; letter-spacing:0.03em; color:var(--accent); }
  .status-dot { width:5px; height:5px; background:currentColor; }
  .note { padding:18px 22px; border:1px solid var(--line-strong); background:transparent; }
  .note p { margin-top:8px; color:var(--ink2); max-width:56ch; }

  .filters { margin-top:28px; display:flex; flex-wrap:wrap; gap:4px 16px; }
  .chip {
    padding:2px 0; border:0; background:none; font-size:var(--fs-ui); color:var(--ink2); cursor:pointer;
    text-decoration-color:transparent;
  }
  .chip.active { color:var(--accent); text-decoration-color:var(--accent); }
  .chip-bg { display:none; }
  .chip-count { margin-left:0.25em; color:var(--ink3); font-variant-numeric:lining-nums; }
  .chip-count::before { content:'('; } .chip-count::after { content:')'; }

  .pager { margin-top:72px; padding-top:16px; border-top:1px solid var(--line-strong); display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .pager-link { display:flex; flex-direction:column; gap:2px; text-decoration:none; align-items:flex-start; }
  .pager-link.next { grid-column:2; align-items:flex-end; text-align:right; }
  .pager-dir { display:inline-flex; align-items:center; gap:6px; font-size:var(--fs-ui-s); font-variant-caps:small-caps; letter-spacing:0.03em; color:var(--ink3); }
  .pager-label { display:inline-block; font-size:1.125rem; color:var(--accent); transform-origin:0 70%; }
  .pager-link.next .pager-label { transform-origin:100% 70%; }
  .pager-link:hover .pager-label { text-decoration-color:var(--accent); transform:translateY(-1px) scale(1.07); }

  .contact-row {
    display:grid; grid-template-columns:28px minmax(0,1fr) auto; align-items:center; gap:14px;
    padding:12px 0; color:var(--ink); text-decoration:none;
  }
  .contact-icon { width:28px; height:28px; display:flex; align-items:center; justify-content:center; color:var(--ink3); }
  .contact-k { display:block; font-size:var(--fs-ui-s); font-variant-caps:small-caps; letter-spacing:0.03em; color:var(--ink3); }
  .contact-v { display:inline-block; font-size:1.1875rem; line-height:1.35; color:var(--accent); overflow-wrap:anywhere; transform-origin:0 70%; }
  .contact-row:hover .contact-v { text-decoration-color:var(--accent); transform:translateY(-1px) scale(1.04); }
  .contact-go { color:var(--ink3); }
  .contact-row:hover .contact-go, .contact-row:hover .contact-icon { color:var(--accent); }
  .copy-btn { margin-top:14px; background:none; border:0; padding:0; font-size:var(--fs-ui); color:var(--ink2); cursor:pointer; display:inline-flex; align-items:center; gap:8px; text-decoration-color:transparent; transform-origin:0 70%; }

  /* ── Home: a title page ──────────────────────────── */
  .home { counter-reset:sec; }
  .hero {
    display:grid; grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr); gap:56px; align-items:center;
    padding-top:clamp(40px, 8vw, 96px); padding-bottom:clamp(40px, 6vw, 72px);
  }
  .hero-name { font-size:var(--fs-hero); font-weight:400; line-height:1.08; color:var(--ink); }
  .hero-role { margin-top:16px; font-style:italic; font-size:1.3125rem; line-height:1.35; color:var(--accent); }
  .hero-lead { margin-top:10px; max-width:44ch; color:var(--ink2); }
  .hero-actions { margin-top:28px; display:flex; flex-wrap:wrap; align-items:center; gap:12px 32px; }
  .kbd-hint { margin-top:20px; font-size:var(--fs-ui-s); color:var(--ink3); }
  .kbd-hint button { background:none; border:0; padding:0; color:inherit; cursor:pointer; text-decoration-color:transparent; transform-origin:0 70%; }
  @media (hover: none), (pointer: coarse) { .kbd-hint { display:none; } }

  .portrait { justify-self:end; width:100%; max-width:300px; }
  .portrait-stage { position:relative; aspect-ratio:1; }
  .portrait-ring { position:absolute; inset:-10px; width:calc(100% + 20px); height:calc(100% + 20px); overflow:visible; }
  .portrait-ring circle { fill:none; stroke:var(--line-strong); stroke-width:1; }
  .portrait-frame { position:absolute; inset:0; border-radius:50%; overflow:hidden; background:var(--surface); -webkit-mask-image:-webkit-radial-gradient(white, black); }
  .portrait-frame img {
    position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:var(--photo-pos, 50% 50%); display:block;
  }
  .portrait-fallback {
    position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
    font-style:italic; font-size:clamp(3rem, 6vw, 4.5rem); color:var(--accent);
  }
  .portrait figcaption { margin-top:26px; text-align:center; font-size:var(--fs-ui); color:var(--ink2); }
  .portrait figcaption::before { content:'Figure 1: '; font-weight:700; color:var(--ink); }

  .split { display:grid; grid-template-columns:minmax(150px, 230px) minmax(0,1fr); gap:10px clamp(32px, 6vw, 88px); padding:36px 0; }
  .split-label { font-size:1.4375rem; font-weight:700; line-height:1.3; color:var(--ink); }
  .split-label { display:flex; gap:0.9em; }
  .split-label::before { counter-increment:sec; content:counter(sec); flex:none; }
  .split .entry:first-child { padding-top:0; }

  /* ── Footer ──────────────────────────────────────── */
  .footer { margin-top:64px; border-top:1px solid var(--line-strong); padding:24px 0 calc(40px + env(safe-area-inset-bottom, 0px)); }
  .footer-inner { display:flex; justify-content:space-between; align-items:flex-start; gap:16px 32px; flex-wrap:wrap; }
  .footer-name { font-size:1.125rem; font-variant-caps:small-caps; letter-spacing:0.03em; color:var(--ink); }
  .footer-note { margin-top:2px; font-size:var(--fs-ui-s); font-style:italic; color:var(--ink3); }
  .footer-links { display:flex; flex-wrap:wrap; gap:8px 22px; align-items:center; font-size:var(--fs-ui); }
  .footer-links a, .footer-links button { background:none; border:0; padding:0; cursor:pointer; color:var(--ink2); }

  /* ── Motion: kept deliberately small ─────────────────
     Colours fade; links pop; the Spotlight keeps its open/close
     and its gliding highlight; the theme switch keeps its reveal. */
  *, *::before, *::after {
    transition-property:color, background-color, border-color, text-decoration-color, fill, stroke !important;
    transition-duration:.2s !important; transition-timing-function:ease !important;
  }
  .lnk, .btn, .brand, .nav-link, .footer-links a, .footer-links button, .copy-btn, .kbd-hint button, .chip,
  .toc-item, .pager-label, .contact-v, .entry-title, .burger span {
    transition-property:color, text-decoration-color, border-color, transform, top !important;
    transition-duration:.22s !important; transition-timing-function:var(--pop) !important;
  }
  .nav-links .nav-tip { transition-property:opacity !important; transition-duration:.15s !important; }
  .cmdk-backdrop, .cmdk { transition:none !important; }
  .cmdk-hl { transition-property:transform, height !important; transition-duration:.28s !important; transition-timing-function:cubic-bezier(0.16, 1, 0.3, 1) !important; }
  @keyframes cmdkFadeIn  { from { background-color:rgba(10,8,6,0); } to { background-color:rgba(10,8,6,0.2); } }
  @keyframes cmdkFadeOut { from { background-color:rgba(10,8,6,0.2); } to { background-color:rgba(10,8,6,0); } }
  @keyframes cmdkIn  { from { opacity:0; transform:translateY(-6px) scale(0.97); } to { opacity:1; transform:none; } }
  @keyframes cmdkOut { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(-4px) scale(0.98); } }
  .cmdk-backdrop { animation:cmdkFadeIn .2s ease-out both; }
  .cmdk-backdrop.is-closing { animation:cmdkFadeOut .17s ease-in both; pointer-events:none; }
  .cmdk { animation:cmdkIn .3s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .is-closing .cmdk { animation:cmdkOut .17s ease-in both; }
  @keyframes pageIn { from { opacity:0; } to { opacity:1; } }
  .page-in { animation:pageIn .25s ease-out both; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
  }

  /* ── Responsive ──────────────────────────────────── */
  @media (max-width: 900px) {
    .page { grid-template-columns:1fr; gap:32px; }
    .page-aside-inner { position:static; }
    .page-intro { max-width:52ch; }
    .toc { margin-top:22px; }
    .filters { margin-top:20px; }
  }
  @media (max-width: 820px) {
    .hero { grid-template-columns:1fr; gap:40px; }
    .portrait { order:-1; justify-self:center; max-width:210px; margin-top:16px; }
    .portrait figcaption { display:none; }
  }
  @media (max-width: 640px) {
    :root { --fs-body:1.0625rem; --fs-h3:1.125rem; --nav-h:58px; }
    .brand { font-size:1.125rem; }
    .split { grid-template-columns:1fr; padding:30px 0; }
    .pager { grid-template-columns:1fr; }
    .pager-link.next { grid-column:1; }
    .entry-head { grid-template-columns:1fr; gap:0; }
    .contact-v { font-size:1.0625rem; }
    .prose > p:not(.lead), .entry-body > p:not(.status) { text-align:left; }
  }
`;

// ─── Motion vocabulary ────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1];

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
    if (!THEME_REVEAL) { setTheme(next); return; }
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
    {theme === 'light' ? <Moon /> : <Sun />}
  </button>
);

const ExtLink = ({ href, children, className = 'lnk' }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
);

const Button = ({ to, href, external = false, variant = 'primary', icon = 'arrow', children, ...rest }) => {
  const cls = `btn${variant === 'ghost' ? ' btn-ghost' : ''}`;
  const Icon = icon === 'external' ? ArrowUpRight : ArrowRight;
  const inner = <>{children}{icon && <Icon aria-hidden="true" />}</>;
  return to
    ? <Link to={to} className={cls} {...rest}>{inner}</Link>
    : <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>{inner}</a>;
};

const Rule = () => <span className="rule" aria-hidden="true" />;

// Plain wrapper (the scroll-reveal animation was removed for a calmer, print-like page)
const FadeIn = ({ as: Tag = 'div', delay, children, ...rest }) => <Tag {...rest}>{children}</Tag>;

const Entry = ({ title, href, tag, sub, date, children, delay = 0 }) => (
  <FadeIn as="article" className="entry" delay={delay}>
    <header className="entry-head">
      <h3 className="entry-title">
        {href
          ? <a href={href} target="_blank" rel="noopener noreferrer" className="title-link">{title}</a>
          : title}
      </h3>
      {date && <span className="entry-date">{date}</span>}
    </header>
    {(tag || sub) && (
      <p className="entry-sub">
        {tag && <span className="tag">{tag}</span>}
        {sub}
      </p>
    )}
    {children && <div className="entry-body">{children}</div>}
  </FadeIn>
);

const Section = ({ id, title, children }) => (
  <section id={id} className="sec" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} className="sec-title">{title}</h2>
    <Rule />
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
    <FadeIn as="nav" className="pager" aria-label="Previous and next page">
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
    </FadeIn>
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
                  {active === s.id && <span className="toc-bar" />}
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
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (open) { setMounted(true); setClosing(false); return; }
    if (!mounted) return;
    setClosing(true);
    const t = window.setTimeout(() => { setMounted(false); setClosing(false); }, 220);
    return () => window.clearTimeout(t);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const el = returnFocus.current;
      if (el && el.isConnected && el.focus && !el.closest('.cmdk')) el.focus();
      else if (document.activeElement && document.activeElement.closest && document.activeElement.closest('.cmdk')) document.activeElement.blur();
    };
  }, [open]);
  useEffect(() => { setIdx(0); }, [q]);

  // One highlight element that glides to the selected row. (A shared layoutId
  // here used to stop the palette from ever finishing its close animation,
  // leaving an invisible search box that swallowed the next "/".)
  const [hl, setHl] = useState(null);
  useLayoutEffect(() => {
    const el = listRef.current && listRef.current.querySelector(`[data-idx="${idx}"]`);
    if (!el) { setHl(null); return; }
    setHl({ top: el.offsetTop, height: el.offsetHeight });
    el.scrollIntoView({ block: 'nearest' });
  }, [idx, q, open, mounted]);

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
    mounted && (
        <div className={`cmdk-backdrop${closing ? ' is-closing' : ''}`}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <div className="cmdk" role="dialog" aria-modal="true" aria-label="Quick navigation">
            <div className="cmdk-input-row">
              <Search aria-hidden="true" />
              <input autoFocus readOnly={closing} className="cmdk-input" value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKeyDown}
                placeholder="Jump to a page or action…" aria-label="Search pages and actions"
                role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-activedescendant={results[idx] ? `cmdk-${idx}` : undefined} />
              <kbd>Esc</kbd>
            </div>
            <div className="cmdk-list" id="cmdk-list" role="listbox" ref={listRef}>
              {hl && <div className="cmdk-hl" aria-hidden="true" style={{ transform: `translateY(${hl.top}px)`, height: hl.height }} />}
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
          </div>
        </div>
    )
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ theme, toggleTheme, onSearch }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
          <nav className="nav-links" aria-label="Main">
            {navPages.map(({ label, path, desc }) => {
              const active = pathname === path;
              return (
                <Link key={path} to={path} className={`nav-link${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}>
                  {label}
                  <span className="nav-tip" aria-hidden="true">{cap(desc)}</span>
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

      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <nav className="wrap" aria-label="Main">
            {[{ label: 'Home', path: '/', desc: 'start here' }, ...navPages].map(({ label, path, desc }) => (
              <Link key={path} to={path} className={`m-link${pathname === path ? ' active' : ''}`} aria-current={pathname === path ? 'page' : undefined}>
                <span className="m-label">{label}</span>
                <span className="m-desc">{cap(desc)}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

const BackToTop = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useEffect(() => scrollY.on('change', v => setShow(v > 520)), [scrollY]);
  if (!show) return null;
  return (
    <button type="button" className="to-top" aria-label="Back to top" onClick={() => smoothScrollTo(0)}>
      <svg className="ring-svg" viewBox="0 0 48 48" aria-hidden="true">
        <circle className="ring-bg" cx="24" cy="24" r="22.5" />
        <motion.circle className="ring" cx="24" cy="24" r="22.5" style={{ pathLength: scrollYProgress }} />
      </svg>
      <ArrowUp aria-hidden="true" />
    </button>
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
// Home page section: label on the left, content on the right, rule drawn above
const Split = ({ id, label, children }) => (
  <section className="wrap split-sec" aria-labelledby={`${id}-title`}>
    <Rule />
    <FadeIn className="split">
      <h2 id={`${id}-title`} className="split-label">{label}</h2>
      <div>{children}</div>
    </FadeIn>
  </section>
);

 // the intro plays once per visit, not on every return to Home

const HeroName = () => (
  <h1 className="hero-name au d1">
    {cvData.name.split(' ').map(word => <span key={word} style={{ display: 'block' }}>{word}</span>)}
  </h1>
);

const Portrait = () => {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="portrait au d3">
      <div className="portrait-stage">
        <svg className="portrait-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="49.5" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="portrait-frame" style={{ '--photo-pos': PROFILE_PHOTO_POSITION }}>
          {!failed
            ? <img src={PROFILE_PHOTO} alt={`${cvData.name}, smiling with arms crossed in front of bougainvillea`}
                width="1000" height="1000" decoding="async" onError={() => setFailed(true)} />
            : <div className="portrait-fallback" aria-label={`${cvData.name} (photo not found)`}>AC</div>}
        </div>
      </div>
      <figcaption>Currently: <Link to="/projects" className="lnk">homotopical algebra</Link></figcaption>
    </figure>
  );
};

const HomePage = ({ onSearch }) => {

  return (
    <div className="home">
      <section className="wrap hero">
        <div>
          <HeroName />
          <p className="hero-role au d2">Idle category theorist (aspiring)</p>
          <p className="hero-lead au d3">
            Math undergrad at <ExtLink href="https://maths.iiserb.ac.in/">IISER Bhopal</ExtLink>. An informal introduction to my formal (academic) self.
          </p>
          <div className="hero-actions au d4">
            <Button to="/projects">See my work</Button>
            <Button to="/contact" variant="ghost" icon={null}>Get in touch</Button>
          </div>
          <p className="kbd-hint au d5">
            <button type="button" onClick={onSearch}>Press <kbd>/</kbd> to jump anywhere</button>
          </p>
        </div>
        <Portrait />
      </section>

      <Split id="about" label="About">
        <div className="prose">
          <p className="lead">{cvData.profile.intro}</p>
          <p>{cvData.profile.interests}</p>
          <p>{cvData.profile.ambition}</p>
        </div>
      </Split>

      <Split id="edu" label="Education">
        {cvData.education.map(edu => (
          <Entry key={edu.institution} title={edu.institution} sub={edu.degree} date={edu.duration}>
            {edu.grades?.length > 0 && <div>{edu.grades.map(g => <span key={g} className="pill">{g}</span>)}</div>}
          </Entry>
        ))}
      </Split>

      <Split id="resp" label="Positions of responsibility">
        {cvData.responsibilities.map((r, i) => (
          <Entry key={r.role} delay={i * 80} title={r.role} sub={r.institution} date={r.duration}>
            <p>{r.description}</p>
          </Entry>
        ))}
      </Split>
    </div>
  );
};

// ─── Academic Experiences ─────────────────────────────────────────────────────
const AcademicExperiencesPage = () => (
  <PageLayout kicker="AcadEx" title="Where I've learned" intro={pageDesc('/acadex')}
    sections={[{ id: 'internships', label: 'Research internships' }, { id: 'schools', label: 'Summer schools' }]}>
    <Section id="internships" title="Research internships">
      {cvData.academicExperiences.internships.map((exp, i) => (
        <Entry key={exp.duration} delay={i * 80} title={exp.title} sub={exp.institution} date={exp.duration}><p>{exp.description}</p></Entry>
      ))}
    </Section>
    <Section id="schools" title="Summer schools">
      {cvData.academicExperiences.summerSchools.map((exp, i) => (
        <Entry key={exp.institution} delay={i * 80} title={exp.title} sub={exp.institution} date={exp.duration}><p>{exp.description}</p></Entry>
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
              <button key={t} type="button" className={`chip${on ? ' active' : ''}`} aria-pressed={on} onClick={() => setFilter(t)}>
                {on && <span className="chip-bg" />}
                {t}<span className="chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      }>
      <div className="entries">
        {shown.map(ev => (
          <div key={ev.title}>
            <Entry title={ev.title} href={titleHref(ev)} tag={ev.tag}>
              <p>{renderDescription(ev)}</p>
            </Entry>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

// ─── Proofs (under construction) ──────────────────────────────────────────────
const ProofsPage = () => (
  <PageLayout kicker="Proofs" title="Proofs" intro="Some of the abstract nonsense which really made sense.">
    <div className="note">
      <p className="status" style={{ marginTop: 0 }}><span className="status-dot" aria-hidden="true" />Under construction</p>
      <p>Nothing here yet. In the meantime, have a look at <Link to="/projects" className="lnk">Projects</Link> or <Link to="/events" className="lnk">Events</Link>.</p>
    </div>
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
      <div>
        <div className="prose" style={{ marginTop: 28 }}>
          <p className="lead">A space for students to speak about what they care about, to a general audience.</p>
          <p>{cvData.openboard.mission}</p>
        </div>
        <div className="actions">
          <Button href={cvData.openboard.website} external icon="external">Visit OpenBoard</Button>
        </div>
      </div>
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
      <div className="note" style={{ marginTop: 28 }}>
        <p className="status" style={{ marginTop: 0 }}><span className="status-dot" aria-hidden="true" />Currently on hold</p>
        <p>Due to academic commitments, we are currently on hold. We would like your help to bring it back. Reach out if you have ideas.</p>
        <div className="actions" style={{ marginTop: 20 }}>
          <Button href={`mailto:${cvData.contact.email}`}>Reach out</Button>
        </div>
      </div>
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
      <div>
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
          {copied ? <><Check /> Email copied</> : <><Copy /> Copy email address</>}
        </button>
        <div className="prose" style={{ marginTop: 40 }}>
          <p style={{ fontSize: '1rem' }}>Based in {cvData.location}. Response times vary; email is the most reliable way to reach me.</p>
        </div>
      </div>
    </PageLayout>
  );
};

const NotFoundPage = () => (
  <PageLayout kicker="404" title="Page not found" intro="The page you were looking for doesn't exist or has moved.">
    <Button to="/">Go to the home page</Button>
  </PageLayout>
);

// ─── Shell: persistent navbar/footer around the current page ─────────────────
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
        <div key={location.pathname} className="page-in">
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
        </div>
      </main>
      <Footer />
      <BackToTop />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} theme={theme} toggleTheme={toggleTheme} notify={notify} />
      <div className="toast-wrap" aria-live="polite">
        {toast && <div className="toast" role="status">{toast.msg}</div>}
      </div>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Hyphenation (for justified LaTeX-style paragraphs) needs a document language
  useEffect(() => {
    if (!document.documentElement.lang) document.documentElement.lang = 'en';
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
