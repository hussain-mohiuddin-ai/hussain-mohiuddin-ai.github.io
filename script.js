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
• <strong>LinkedIn:</strong> linkedin.com/in/hussain-mohiuddin-ai/
• <strong>GitHub:</strong> github.com/hussain-mohiuddin-ai
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
