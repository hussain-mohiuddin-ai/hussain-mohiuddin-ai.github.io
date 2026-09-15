/**
 * ============================================================================
 * HUSSAIN MOHIUDDIN — AI ENGINEER PORTFOLIO INTERACTIVITY SCRIPT
 * Responsive UI, Theme Persistence, Typewriter, Filters, Terminal Sandbox, Form
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initNav();
  initTypewriter();
  initNeuralCanvas();
  initHeroImage();
  initProjectFilters();
  initTerminal();
  initContactForm();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   01. THEME TOGGLE & PERSISTENCE
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);
  } else if (!prefersDark.matches) {
    document.documentElement.setAttribute('data-theme', 'light');
    updateToggleIcon('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleIcon(newTheme);
    });
  }
}

function updateToggleIcon(theme) {
  const icon = document.getElementById('theme-icon') || document.querySelector('.theme-toggle-knob i');
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fa-solid fa-moon';
  } else {
    icon.className = 'fa-solid fa-bolt';
  }
}

/* --------------------------------------------------------------------------
   02. SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   03. NAVIGATION & SCROLL TRACKING
   -------------------------------------------------------------------------- */
function initNav() {
  const navbar = document.getElementById('navbar') || document.querySelector('.nav-wrap');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking any nav link
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section link observer
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));
}

/* --------------------------------------------------------------------------
   04. TYPEWRITER EFFECT IN HERO
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typewriterElem = document.getElementById('typewriter-text');
  if (!typewriterElem) return;

  const roles = [
    "OpenAI Whisper Speech-to-Text & Acoustic Analysis",
    "Ultralytics YOLOv8 & Euclidean Object Tracking",
    "Systematic Prompt Engineering (Claude, GPT-4o, Gemini)",
    "Deep Learning LSTM Neural Sequence Models (MIDI)",
    "Full-Stack Python Backend & Semantic Retrieval"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function typeStep() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typewriterElem.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 30;
    } else {
      typewriterElem.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 65;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of phrase
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 350; // Pause before new phrase
    }

    setTimeout(typeStep, typingSpeed);
  }

  typeStep();
}

/* --------------------------------------------------------------------------
   04b. NEURAL NETWORK CANVAS - Computational Mesh Background
   Respects: prefers-reduced-motion, theme changes, DPR, visibility, resize
   -------------------------------------------------------------------------- */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;
  if (!canvas.getContext) return;

  // Respect user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  let particles = [];
  let animationId = null;
  let isVisible = true;
  let isPageVisible = true;
  let mouse = { x: -1000, y: -1000, active: false };
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let time = 0;

  // Theme-aware palette - subtle, computational, not overwhelming
  function getPalette() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      return {
        node: '2, 132, 199',        // cyan-600
        node2: '5, 150, 105',       // emerald-600
        line: '2, 132, 199',
        glow: 'rgba(2, 132, 199, 0.12)'
      };
    }
    return {
      node: '56, 189, 248',        // cyan-400
      node2: '52, 211, 153',       // emerald-300
      line: '56, 189, 248',
      glow: 'rgba(56, 189, 248, 0.15)'
    };
  }

  function getConfig() {
    const w = hero.clientWidth || window.innerWidth;
    if (w < 640) return { count: 32, dist: 110, radius: 1.2, speed: 0.28 };
    if (w < 1024) return { count: 48, dist: 130, radius: 1.4, speed: 0.32 };
    return { count: 68, dist: 150, radius: 1.6, speed: 0.35 };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = hero.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    // Handle case where hero not yet laid out
    const cw = width || hero.clientWidth || window.innerWidth;
    const ch = height || hero.clientHeight || 700;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Recreate particles on significant resize
    createParticles();
  }

  function createParticles() {
    const cfg = getConfig();
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    particles = [];
    for (let i = 0; i < cfg.count; i++) {
      particles.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: (Math.random() - 0.5) * cfg.speed,
        vy: (Math.random() - 0.5) * cfg.speed,
        r: Math.random() * cfg.radius + 0.8,
        phase: Math.random() * Math.PI * 2,
        // Alternate cyan/emerald pulsing nodes for subtle variety
        kind: Math.random() > 0.72 ? 'emerald' : 'cyan'
      });
    }
  }

  function draw(now) {
    time = now * 0.001;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const cfg = getConfig();
    const palette = getPalette();

    ctx.clearRect(0, 0, cw, ch);

    // Subtle vignette / depth gradient - very low opacity so it doesn't compete
    const grad = ctx.createRadialGradient(cw * 0.35, ch * 0.45, 0, cw * 0.35, ch * 0.45, cw * 0.9);
    grad.addColorStop(0, palette.glow);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Gentle drift + subtle sinusoidal wobble for organic "neural" feel
      p.x += p.vx + Math.sin(time * 0.3 + p.phase) * 0.15;
      p.y += p.vy + Math.cos(time * 0.25 + p.phase) * 0.15;

      // Mouse attraction (subtle, only if mouse inside hero)
      if (mouse.active) {
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 170 && dm > 2) {
          const pull = (1 - dm / 170) * 0.04;
          p.vx += (dxm / dm) * pull;
          p.vy += (dym / dm) * pull;
          // limit velocity
          const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (sp > 0.9) { p.vx *= 0.9 / sp; p.vy *= 0.9 / sp; }
        }
      }

      // Bounce softly at edges
      if (p.x < 0 || p.x > cw) p.vx *= -1;
      if (p.y < 0 || p.y > ch) p.vy *= -1;
      p.x = Math.max(0, Math.min(cw, p.x));
      p.y = Math.max(0, Math.min(ch, p.y));

      // Friction to prevent velocity runaway
      p.vx *= 0.995;
      p.vy *= 0.995;
    }

    // Draw connections - sparse, elegant
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.dist) {
          const alpha = (1 - dist / cfg.dist) * 0.18;
          // Slightly stronger near mouse
          let extra = 0;
          if (mouse.active) {
            const mx = (a.x + b.x) / 2 - mouse.x;
            const my = (a.y + b.y) / 2 - mouse.y;
            const md = Math.sqrt(mx * mx + my * my);
            if (md < 120) extra = (1 - md / 120) * 0.12;
          }
          const usePalette = (a.kind === 'emerald' || b.kind === 'emerald') ? palette.node2 : palette.line;
          ctx.strokeStyle = 'rgba(' + usePalette + ',' + (alpha + extra) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      // Mouse tether line - subtle
      if (mouse.active) {
        const dxm = particles[i].x - mouse.x;
        const dym = particles[i].y - mouse.y;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 135) {
          const a = (1 - dm / 135) * 0.22;
          const col = particles[i].kind === 'emerald' ? palette.node2 : palette.line;
          ctx.strokeStyle = 'rgba(' + col + ',' + a + ')';
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes with soft glow and pulse
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const pulse = 0.7 + Math.sin(time * 1.2 + p.phase) * 0.3;
      const isEmerald = p.kind === 'emerald';
      const base = isEmerald ? palette.node2 : palette.node;

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + base + ',' + (0.08 * pulse) + ')';
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + base + ',' + (0.85 * pulse + 0.15) + ')';
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(p.x - p.r * 0.25, p.y - p.r * 0.25, p.r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + (0.35 * pulse) + ')';
      ctx.fill();
    }
  }

  function loop(now) {
    if (!isVisible || !isPageVisible) {
      animationId = requestAnimationFrame(loop);
      return;
    }
    draw(now);
    animationId = requestAnimationFrame(loop);
  }

  // Mouse tracking - map to canvas local coords (hero-relative)
  function handleMouseMove(e) {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= rect.width && mouse.y <= rect.height;
  }
  function handleMouseLeave() {
    mouse.active = false;
    mouse.x = -1000; mouse.y = -1000;
  }

  // Visibility handling - pause when hero not in viewport
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationId) {
        animationId = requestAnimationFrame(loop);
      }
    });
  }, { threshold: 0.01 });
  heroObserver.observe(hero);

  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  // Theme change observer - redraw immediately uses new palette, no need to recreate
  const themeObserver = new MutationObserver(() => {
    // next frame will pick up new palette
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Events
  hero.addEventListener('mousemove', handleMouseMove, { passive: true });
  hero.addEventListener('mouseleave', handleMouseLeave);
  hero.addEventListener('touchmove', (e) => {
    if (e.touches[0]) handleMouseMove(e.touches[0]);
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  }, { passive: true });

  // Init
  resize();
  // Defer start to next frame to avoid layout thrash
  animationId = requestAnimationFrame(loop);

  // Cleanup on page hide
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
    heroObserver.disconnect();
    themeObserver.disconnect();
  });
}

/* --------------------------------------------------------------------------
   04c. HERO IMAGE ROBUSTNESS - loading, fallback, reveal
   -------------------------------------------------------------------------- */
function initHeroImage() {
  const portrait = document.querySelector('.hero-portrait');
  if (!portrait) return;

  // If image already cached and complete
  if (portrait.complete && portrait.naturalWidth > 0) {
    portrait.style.opacity = '1';
    return;
  }

  portrait.style.opacity = '0';
  portrait.style.transition = 'opacity 0.5s ease';

  function reveal() {
    portrait.style.opacity = '1';
  }

  portrait.addEventListener('load', reveal, { once: true });
  portrait.addEventListener('error', () => {
    // First fallback already handled by inline onerror, but double-guard
    if (portrait.src.endsWith('profile.jpg')) return;
    const fallback = 'assets/profile.jpg';
    if (portrait.getAttribute('src') !== fallback) {
      portrait.src = fallback;
    } else {
      // Last resort - hide broken image and show gradient placeholder
      portrait.style.opacity = '0';
      const frame = portrait.closest('.hero-photo-frame');
      if (frame) frame.style.background = 'linear-gradient(135deg, #0B0F17 0%, #1F2937 100%)';
    }
  }, { once: true });

  // Timeout fallback for slow networks
  setTimeout(() => {
    if (!portrait.complete || portrait.naturalWidth === 0) {
      // still not loaded, keep showing but ensure opacity
      portrait.style.opacity = '1';
    }
  }, 3000);
}

/* --------------------------------------------------------------------------
   05. PROJECT FILTERING LOGIC
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   06. INTERACTIVE AI DEVELOPER TERMINAL SANDBOX
   -------------------------------------------------------------------------- */
function initTerminal() {
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output') || document.getElementById('terminal-body');
  const quickChips = document.querySelectorAll('.term-chip');

  if (!terminalForm || !terminalInput || !terminalOutput) return;

  const commands = {
    help: () => `Available commands:
  • <span class="t-accent">help</span>        - Display list of supported CLI commands
  • <span class="t-accent">bio</span>         - Output Hussain Mohiuddin's AI engineer background summary
  • <span class="t-accent">skills</span>      - List core AI, backend, speech, CV, & prompt tech stack
  • <span class="t-accent">projects</span>    - Display summary of featured AI repositories
  • <span class="t-accent">whisper</span>     - Deep-dive into Whisper ASR & acoustic pace pipeline
  • <span class="t-accent">echo</span>        - Deep-dive into Echo speech tool (alias of whisper)
  • <span class="t-accent">yolo</span>        - Details on YOLOv8 & Euclidean centroid object tracking
  • <span class="t-accent">experience</span>  - List industry and research work history
  • <span class="t-accent">certs</span>       - View verified certifications & leadership credentials
  • <span class="t-accent">contact</span>     - View direct email & social connectivity info
  • <span class="t-accent">whoami</span>      - Discover current visitor telemetry & session info
  • <span class="t-accent">clear</span>       - Clear the terminal screen`,

    bio: () => `<div class="t-output-box">
<strong>HUSSAIN MOHIUDDIN</strong> — AI Engineer & Prompt Optimization Specialist
Pursuing B.E. in Artificial Intelligence at Sir Syed University of Engineering and Technology (2023–2027).
Specialized in Python backend AI pipelines, OpenAI Whisper ASR, YOLOv8 computer vision tracking, and systematic LLM prompt evaluation across Claude, ChatGPT, and Gemini.
</div>`,

    skills: () => `<div class="t-output-box">
<strong>AI & DEEP LEARNING:</strong> Python, OpenAI Whisper, Ultralytics YOLOv8, PyTorch, TensorFlow, Keras, OpenCV, NLTK, Scikit-Learn
<strong>PROMPT OPTIMIZATION:</strong> Few-Shot In-Context Prompting, Chain-of-Thought (CoT), System Role Partitioning, Claude 3.5/Opus, GPT-4o, Google Gemini
<strong>ENGINEERING & CMS:</strong> FastAPI, REST APIs, Git, WordPress/CMS Custom Architecture, Vector Embeddings
</div>`,

    projects: () => `<div class="t-output-box">
1. <strong>Echo:</strong> AI Speech Transcription & Acoustic Pace Deduction (OpenAI Whisper)
2. <strong>YOLOv8 Dynamic Object Tracking:</strong> Deep Learning Centroid Distance Tracking
3. <strong>Deep Learning Music Generation:</strong> Multi-Track LSTM Neural Network (Keras + music21)
4. <strong>A-Forward Chatbot:</strong> Vector NLP TF-IDF & Cosine Similarity Conversational Engine
5. <strong>ScanPass Auth:</strong> Visual Perceptual Hashing Authentication Engine (Next.js + MongoDB)
6. <strong>Store Management System:</strong> High-Throughput C++ Console Architecture (STL Vectors)
</div>`,

    whisper: () => `<div class="t-output-box">
<strong>PROJECT SPOTLIGHT: ECHO ASR PIPELINE</strong>
• Model: OpenAI Whisper ASR
• Acoustic Metrics: Word-per-minute (WPM) cadence & speaking pace inference
• User Interface: Modular Python GUI with noise filtering & audio ingestion
• Status: Deployed & Open Source on GitHub
</div>`,

    echo: () => commands.whisper(),

    yolo: () => `<div class="t-output-box">
<strong>PROJECT SPOTLIGHT: OBJECT DETECTION & TRACKING</strong>
• Model: Ultralytics YOLOv8
• Tracking Algorithm: Euclidean distance centroid matching across consecutive frames
• Capabilities: Persistent unique ID assignment, multi-class bounding box regression
• Status: Open Source on GitHub (CodeAlpha Internship)
</div>`,

    experience: () => `<div class="t-output-box">
• <strong>FlyRank AI</strong> (July 2026–Present): Backend AI Engineering Intern
• <strong>CodeAlpha</strong> (July 2026–August 2026): Artificial Intelligence Intern (YOLOv8 & LSTM Networks)
• <strong>A-Forward</strong> (July 2026–September 2026): Facebook Marketing Agent (Meta Ads & Analytics)
• <strong>Digital Dunes</strong> (October 2023–March 2024): CMS Web Developer
</div>`,

    certs: () => `<div class="t-output-box">
• <strong>CodeAlpha:</strong> AI Engineering Internship Certificate & Letter of Recommendation (LOR)
• <strong>SSUET AI Week:</strong> Prompt Engineering Competition Award & AI Poster Recognition
• <strong>SMEC'26:</strong> Certificate of Achievement (Team Decoration) & CAC Member
</div>`,

    contact: () => `<div class="t-output-box">
• <strong>Email:</strong> mohiuddinhussain9@gmail.com
• <strong>WhatsApp:</strong> 03230299773 (https://wa.me/923230299773)
• <strong>LinkedIn:</strong> linkedin.com/in/hussain-mohiuddin-ai/
• <strong>GitHub:</strong> github.com/hussain-mohiuddin-ai
• <strong>Instagram:</strong> @hussain_mohiuddin_ai (https://www.instagram.com/hussain_mohiuddin_ai/)
• <strong>Location:</strong> Karachi, Pakistan
</div>`,

    whoami: () => `<div class="t-output-box">
<strong>SESSION IDENTITY:</strong> Guest AI Engineer / Recruiter
<strong>STATUS:</strong> Verified Access
<strong>HOST:</strong> hussain-mohiuddin-ai.github.io
<strong>LOCAL TIME:</strong> ${new Date().toLocaleString()}
</div>`,

    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Echo input line
    const inputLine = document.createElement('div');
    inputLine.className = 't-line';
    inputLine.innerHTML = `<span class="t-accent">hussain@ai:~$</span> <span>${escapeHtml(rawCmd)}</span>`;
    terminalOutput.appendChild(inputLine);

    if (commands[cmd]) {
      const output = commands[cmd]();
      if (output) {
        const outLine = document.createElement('div');
        outLine.className = 't-line';
        outLine.innerHTML = output;
        terminalOutput.appendChild(outLine);
      }
    } else {
      const errLine = document.createElement('div');
      errLine.className = 't-line t-system';
      errLine.innerHTML = `command not found: "${escapeHtml(rawCmd)}". Type <span class="t-accent">help</span> to inspect valid operations.`;
      terminalOutput.appendChild(errLine);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = terminalInput.value;
    if (val) {
      executeCommand(val);
      terminalInput.value = '';
    }
  });

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        terminalInput.value = cmd;
        executeCommand(cmd);
      }
    });
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/* --------------------------------------------------------------------------
   07. CONTACT FORM SUBMISSION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form') || document.getElementById('portfolio-contact-form');
  const statusElem = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit-btn') || document.getElementById('submit-btn');

  if (!form || !statusElem || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalBtnHtml = submitBtn.innerHTML;

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Transmitting...</span>';
    statusElem.className = 'form-status';
    statusElem.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        statusElem.className = 'form-status success';
        statusElem.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message transmitted successfully. I will get back to you shortly!';
        statusElem.style.display = 'block';
        form.reset();
      } else {
        const data = await response.json();
        const err = data.errors ? data.errors.map(e => e.message).join(', ') : 'Transmission failed. Please try again.';
        statusElem.className = 'form-status error';
        statusElem.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${err}`;
        statusElem.style.display = 'block';
      }
    } catch (err) {
      statusElem.className = 'form-status error';
      statusElem.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Network transmission error. Please reach out via email directly.';
      statusElem.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });
}

/* --------------------------------------------------------------------------
   08. SCROLL REVEAL INTERSECTION OBSERVER
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.08
  });

  reveals.forEach(el => revealObserver.observe(el));
}
