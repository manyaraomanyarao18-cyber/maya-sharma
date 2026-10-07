/**
 * MAYA SHARMA // SOFTWARE & ROBOTICS ENGINEER PORTFOLIO
 * Complete Interactive Logic Script
 * Supports Workshop Prompts 1 through 15
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. SOUND EFFECTS SYNTHESIZER (8-Bit Retro Audio via Web Audio API)
  // Generates genuine 8-bit sound effects directly in the browser without external files
  // ==========================================================================
  let audioCtx = null;
  let sfxEnabled = true;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function play8BitTone(freq, type = 'square', duration = 0.08, gainVal = 0.08) {
    if (!sfxEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  // Preset 8-bit sound triggers
  const sfx = {
    click: () => play8BitTone(520, 'square', 0.05, 0.05),
    nav: () => {
      play8BitTone(440, 'square', 0.04, 0.04);
      setTimeout(() => play8BitTone(660, 'square', 0.06, 0.04), 40);
    },
    success: () => {
      play8BitTone(440, 'triangle', 0.08, 0.08);
      setTimeout(() => play8BitTone(554, 'triangle', 0.08, 0.08), 80);
      setTimeout(() => play8BitTone(659, 'triangle', 0.12, 0.08), 160);
    },
    botMessage: () => {
      play8BitTone(700, 'sine', 0.06, 0.06);
      setTimeout(() => play8BitTone(880, 'sine', 0.08, 0.06), 60);
    },
    error: () => {
      play8BitTone(220, 'sawtooth', 0.15, 0.08);
    }
  };

  // SFX Toggle button handler
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      const sfxText = document.getElementById('sfx-text');
      const sfxIcon = document.getElementById('sfx-icon');
      if (sfxEnabled) {
        sfxToggleBtn.classList.add('active');
        if (sfxText) sfxText.textContent = 'SFX: ON';
        if (sfxIcon) sfxIcon.textContent = '🔊';
        sfx.click();
      } else {
        sfxToggleBtn.classList.remove('active');
        if (sfxText) sfxText.textContent = 'SFX: OFF';
        if (sfxIcon) sfxIcon.textContent = '🔇';
      }
    });
  }

  // ==========================================================================
  // 2. WORKSHOP STEP 2: NIGHT MODE TOGGLE & OS THEME DETECTION
  // Uses CSS media queries to detect default theme + manual interactive toggle
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const themeText = document.getElementById('theme-text');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      if (themeText) themeText.textContent = 'NIGHT MODE';
      if (themeIcon) themeIcon.textContent = '🌙';
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      if (themeText) themeText.textContent = 'DAY MODE';
      if (themeIcon) themeIcon.textContent = '☀️';
    }
  }

  // Check saved theme in localStorage, fallback to system browser media query
  const savedTheme = localStorage.getItem('maya_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    applyTheme(savedTheme === 'dark');
  } else {
    applyTheme(systemPrefersDark);
  }

  // Listen to OS theme changes if user has not set a manual preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('maya_portfolio_theme')) {
      applyTheme(e.matches);
    }
  });

  function toggleThemeAction() {
    sfx.click();
    const isCurrentlyDark = document.body.classList.contains('theme-dark');
    const newTheme = !isCurrentlyDark;
    applyTheme(newTheme);
    localStorage.setItem('maya_portfolio_theme', newTheme ? 'dark' : 'light');
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleThemeAction);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleThemeAction);

  // CRT Scanline Shader Toggle
  const crtToggle = document.getElementById('crt-toggle');
  if (crtToggle) {
    crtToggle.addEventListener('click', () => {
      sfx.click();
      document.body.classList.toggle('crt-active');
      const isActive = document.body.classList.contains('crt-active');
      crtToggle.classList.toggle('active', isActive);
      const crtText = document.getElementById('crt-text');
      if (crtText) crtText.textContent = isActive ? 'CRT: ON' : 'CRT: OFF';
    });
  }

  // ==========================================================================
  // 3. WORKSHOP STEP 3: VERTICAL NAVIGATION & MOBILE DRAWER
  // Links: Home, About, Skills, Timeline, Projects, Highlights, Testimonials, Chat, Contact
  // Handles active section highlight on scroll and mobile hamburger drawer
  // ==========================================================================
  const verticalNav = document.getElementById('vertical-nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile drawer
  function toggleMobileMenu() {
    sfx.click();
    const isOpen = verticalNav.classList.toggle('open');
    if (navBackdrop) navBackdrop.classList.toggle('active', isOpen);
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  if (navBackdrop) navBackdrop.addEventListener('click', toggleMobileMenu);

  // Close mobile drawer on navigation click and play sound
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      sfx.nav();
      if (window.innerWidth <= 992) {
        if (verticalNav) verticalNav.classList.remove('open');
        if (navBackdrop) navBackdrop.classList.remove('active');
        if (mobileMenuBtn) {
          mobileMenuBtn.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Track active section with IntersectionObserver
  const sections = document.querySelectorAll('main section');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ==========================================================================
  // 4. HERO SECTION: SCENE SWITCHER
  // Switches background image among provided workshop pixel art renders
  // ==========================================================================
  const sceneButtons = document.querySelectorAll('.scene-btn');
  const heroImgDisplay = document.getElementById('hero-img-display');

  sceneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.click();
      sceneButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const sceneSrc = btn.getAttribute('data-scene');
      if (heroImgDisplay && sceneSrc) {
        heroImgDisplay.style.opacity = '0.3';
        setTimeout(() => {
          heroImgDisplay.src = sceneSrc;
          heroImgDisplay.style.opacity = '1';
        }, 150);
      }
    });
  });

  // ==========================================================================
  // 5. WORKSHOP STEP 7: PROJECTS DATA & MODAL SPECIFICATIONS
  // Comment explaining connection to thumbnails & specifications
  // ==========================================================================
  const projectDatabase = {
    nova: {
      title: "PROJECT NOVA // AUTONOMOUS ROVER v2.4",
      badge: "ROBOTICS + AI + SLAM",
      summary: "Autonomous mobile robot designed for exploratory mapping in GPS-denied environments.",
      image: "lab_holographic_tech.jpg",
      specs: [
        { label: "Computing Architecture", value: "Raspberry Pi 5 (8GB) + STM32F401 Motor Controller" },
        { label: "Sensors Integrated", value: "RPLiDAR A1 360° 12m, Intel RealSense D435i Stereo Depth, MPU6050 IMU" },
        { label: "Middleware & Frameworks", value: "ROS2 Humble, Nav2 Navigation Stack, OpenCV 4.8" },
        { label: "Localization Algorithm", value: "Cartographer 2D SLAM with Extended Kalman Filter (EKF)" },
        { label: "Drive Configuration", value: "4-Wheel Independent Differential Drive with High-Torque Planetary Steppers" },
        { label: "Battery Telemetry", value: "3S 5200mAh LiPo with custom I2C Fuel Gauge & Voltage Cutoff" }
      ],
      description: `Project Nova was engineered to test autonomous path planning through dynamic obstacles. The robot creates high-resolution occupancy grid maps in real time using 2D LiDAR scans and computes smooth trajectory paths using the Nav2 DWBF local planner. Firmware communicates over custom ROS2 Micro-XRCE-DDS serial bridge running on the STM32 microcontroller.`
    },
    arm: {
      title: "6-DOF ROBOTIC ARM // INVERSE KINEMATICS",
      badge: "MECHATRONICS + EMBEDDED C++",
      summary: "Precision desktop manipulator arm with closed-loop stepper actuators and custom 3D-printed harmonic drives.",
      image: "hero_cinematic_projects.jpg",
      specs: [
        { label: "Degrees of Freedom", value: "6 Revolute Joints with End-Effector Parallel Gripper" },
        { label: "Repeatability Precision", value: "±0.25mm Repeatability across 450mm reach radius" },
        { label: "Actuation", value: "NEMA 17 & NEMA 23 Steppers with TMC2209 SilentStepStick Drivers" },
        { label: "Firmware", value: "Custom Bare-Metal C++ on STM32 Nucleo (168MHz)" },
        { label: "Kinematics Engine", value: "Analytical Inverse Kinematics with S-Curve Velocity Profiling" },
        { label: "CAD & Fabrication", value: "Modeled in Autodesk Fusion 360; 3D Printed in Carbon-Fiber PETG" }
      ],
      description: `The 6-DOF robotic manipulator was designed for desktop assembly and pick-and-place automation. It features an onboard analytical solver that converts desired Cartesian coordinate targets (X, Y, Z, Roll, Pitch, Yaw) into smooth joint angles in under 1.2 milliseconds.`
    },
    bench: {
      title: "BENCHSYNC // SMART LAB INSTRUMENTATION HUB",
      badge: "FULL-STACK IOT + REAL-TIME DASHBOARD",
      summary: "Connected lab environment station streaming safety metrics, temperature, and power consumption to a WebSockets interface.",
      image: "lab_sunset_workspace.jpg",
      specs: [
        { label: "IoT Edge Node", value: "Dual-Core ESP32-WROOM-32 running FreeRTOS" },
        { label: "Sensor Array", value: "MQ-135 (Air Quality), SGP30 (VOC/eCO2), DS18B20 (Thermal), INA219 (Current)" },
        { label: "Data Pipeline", value: "MQTT Broker (Mosquitto) with Node.js Server & WebSockets" },
        { label: "Dashboard Stack", value: "HTML5 Canvas, Chart.js, Express, Tailwind-inspired Dark Theme" },
        { label: "Alert Latency", value: "<150ms Emergency shutdown signal via relay trigger" }
      ],
      description: `BenchSync monitors solder station air quality and current draw. When hazardous VOC fumes exceed permissible thresholds, the ESP32 automatically activates an active carbon fume extractor and flashes an LED HUD warning while streaming live metrics to lab workstations.`
    },
    holovision: {
      title: "HOLOVISION // TELEMETRY & 3D POINT CLOUD CONSOLE",
      badge: "WEBGL + TELEMETRY HUD",
      summary: "Browser-based 3D diagnostics console visualizing robot point clouds, joint orientations, and hardware telemetry.",
      image: "hero_project_nova.jpg",
      specs: [
        { label: "Graphics Engine", value: "WebGL 2.0 with Three.js Particle Cloud Buffers" },
        { label: "Streaming Protocol", value: "WebSocket Binary Stream (Protobuf serialization)" },
        { label: "Rendering Performance", value: "Solid 60 FPS with 150,000 active LiDAR point cloud points" },
        { label: "HUD Aesthetic", value: "16-Bit Cyberpunk Neon Theme with CRT Scanlines" }
      ],
      description: `HoloVision connects directly to ROS2 via rosbridge_server. Operators can rotate, pan, and zoom through the robot's real-time sensor field in 3D, monitoring motor current draw, CPU thermals, and battery charge levels simultaneously.`
    }
  };

  // Expose modal openers to global window scope
  window.openProjectModal = function(projectId) {
    sfx.click();
    const proj = projectDatabase[projectId];
    if (!proj) return;

    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (modalTitle) modalTitle.textContent = proj.title;

    let specsHtml = proj.specs.map(s => `
      <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); padding: 0.6rem 0.8rem; border-radius: 4px; display: flex; flex-direction: column;">
        <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-cyan);">${s.label}</span>
        <span style="font-size: 0.88rem; color: var(--text-main); font-weight: 500;">${s.value}</span>
      </div>
    `).join('');

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="width: 100%; aspect-ratio: 16/9; max-height: 320px; overflow: hidden; border-radius: 6px; border: 1px solid var(--border-glow);">
            <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-family: var(--font-pixel); font-size: 0.6rem; background: var(--accent-purple); color: #fff; padding: 4px 8px; border-radius: 2px;">${proj.badge}</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-green);">STATUS: HARDWARE VERIFIED</span>
          </div>
          <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.6;">${proj.description}</p>
          <h4 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--text-main); margin-top: 0.5rem; letter-spacing: 0.5px;">ENGINEERING SPECIFICATIONS</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
            ${specsHtml}
          </div>
        </div>
      `;
    }

    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
  };

  window.closeProjectModal = function(e) {
    if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-close-btn')) return;
    sfx.click();
    const modal = document.getElementById('project-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  // Fullscreen Image Viewer Modal
  window.expandImage = function(src, title) {
    sfx.click();
    const modal = document.getElementById('image-modal');
    const imgEl = document.getElementById('image-modal-src');
    const titleEl = document.getElementById('image-modal-title');

    if (imgEl) imgEl.src = src;
    if (titleEl) titleEl.textContent = title || 'LAB ARCHIVE ASSET';

    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
  };

  window.closeImageModal = function() {
    sfx.click();
    const modal = document.getElementById('image-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeProjectModal();
      window.closeImageModal();
    }
  });

  // ==========================================================================
  // 6. WORKSHOP STEP 10: AI CHAT INTERFACE INTEGRATION
  // Simulated responses for Maya-AI v2.6 persona.
  // Comments below demonstrate where an API (e.g. OpenAI / Gemini) is integrated.
  // ==========================================================================
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-user-input');

  const knowledgeBase = [
    {
      keywords: ['skill', 'language', 'program', 'stack', 'c++', 'python'],
      answer: "My core programming languages are Modern C++ (C++17/20 for real-time robotic firmware) and Python (for ROS2, PyTorch, and OpenCV vision pipelines). I also work extensively with TypeScript/JavaScript for telemetry dashboards and Embedded C for microcontrollers."
    },
    {
      keywords: ['nova', 'rover', 'robot', 'slam', 'lidar'],
      answer: "Project Nova is my flagship autonomous rover! It runs ROS2 Humble on a Raspberry Pi 5, navigates with 2D LiDAR SLAM, uses an Extended Kalman Filter with an MPU6050 IMU, and features a custom STM32 motor controller."
    },
    {
      keywords: ['internship', 'hire', 'job', 'available', 'work', 'open'],
      answer: "Yes, I am actively open to robotics software engineering internships, research fellowships, and full-stack software development roles! Feel free to transmit a note in the Contact section below or email me directly at maya.sharma.eng@university.edu."
    },
    {
      keywords: ['education', 'degree', 'college', 'university', 'study'],
      answer: "I am pursuing my B.Tech in Computer Science & Engineering with a specialization in Autonomous Robotics. I lead the collegiate Robotics Guild and have won several hackathons including the National Smart Systems Hackathon."
    },
    {
      keywords: ['arm', 'kinematics', 'manipulator', 'cad'],
      answer: "The 6-DOF Robotic Manipulator is built with custom 3D-printed harmonic drives and closed-loop steppers, utilizing analytical inverse kinematics calculated in under 1.2ms on an STM32 Nucleo microcontroller."
    },
    {
      keywords: ['iot', 'bench', 'benchsync', 'electronics'],
      answer: "BenchSync is an IoT lab workbench hub powered by an ESP32. It continuously streams air toxicity, solder fumes, temperature, and power metrics to a live WebSockets dashboard to maintain lab safety standards."
    }
  ];

  function getBotResponse(userPrompt) {
    const lower = userPrompt.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some(kw => lower.includes(kw))) {
        return item.answer;
      }
    }
    return "Thanks for your question! I specialize in Autonomous Mobile Robotics (ROS2/LiDAR SLAM), high-performance C++ & Python development, and full-stack IoT systems. Check out my Projects section or feel free to send me a direct email!";
  }

  function appendChatMessage(sender, text, isBot = false) {
    if (!chatMessages) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`;

    bubble.innerHTML = `
      <div class="bubble-sender">
        <span class="sender-avatar">${isBot ? '🤖' : '👨‍💻'}</span>
        <span class="sender-name">${sender}</span>
        <span class="sender-time">${timeStr}</span>
      </div>
      <div class="bubble-content">${text}</div>
    `;

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (isBot) {
      sfx.botMessage();
    }
  }

  /**
   * NOTE FOR WORKSHOP PARTICIPANTS:
   * To connect to a live OpenAI API endpoint instead of the simulated bot:
   * 
   * async function callOpenAI(userText) {
   *   const response = await fetch('https://api.openai.com/v1/chat/completions', {
   *     method: 'POST',
   *     headers: {
   *       'Content-Type': 'application/json',
   *       'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
   *     },
   *     body: JSON.stringify({
   *       model: 'gpt-4o-mini',
   *       messages: [
   *         { role: 'system', content: 'You are Maya Sharma, a talented Software & Robotics engineer.' },
   *         { role: 'user', content: userText }
   *       ]
   *     })
   *   });
   *   const data = await response.json();
   *   return data.choices[0].message.content;
   * }
   */
  window.handleChatSubmit = function(e) {
    e.preventDefault();
    if (!chatInput) return;

    const userText = chatInput.value.trim();
    if (!userText) return;

    sfx.click();
    appendChatMessage('GUEST', userText, false);
    chatInput.value = '';

    // Show simulated typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bot-bubble typing-bubble';
    typingBubble.innerHTML = `
      <div class="bubble-sender">
        <span class="sender-avatar">🤖</span>
        <span class="sender-name">MAYA-AI</span>
      </div>
      <div class="bubble-content">
        <span class="typing-dots"><span></span><span></span><span></span></span>
      </div>
    `;
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate network delay for natural conversation feel
    setTimeout(() => {
      if (typingBubble.parentNode) {
        typingBubble.parentNode.removeChild(typingBubble);
      }
      const answer = getBotResponse(userText);
      appendChatMessage('MAYA-AI', answer, true);
    }, 700);
  };

  window.sendQuickPrompt = function(promptText) {
    if (chatInput) {
      chatInput.value = promptText;
      window.handleChatSubmit(new Event('submit'));
    }
  };

  // ==========================================================================
  // 7. WORKSHOP STEP 11: CONTACT FORM WITH EMAIL API FUNCTIONALITY
  // Validates inputs, shows success confirmation, and includes Resend API documentation
  // ==========================================================================
  window.handleContactSubmit = function(e) {
    e.preventDefault();
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('contact-feedback');
    const submitBtn = document.getElementById('btn-submit-contact');

    if (!form) return;

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const topic = document.getElementById('contact-topic').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      sfx.error();
      if (feedback) {
        feedback.style.display = 'block';
        feedback.className = 'form-feedback-banner error';
        feedback.textContent = '⚠️ Please complete all required transmission fields.';
      }
      return;
    }

    // Set loading state on button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>ENCRYPTING & SENDING...</span> <span>⏳</span>`;
    }

    /**
     * NOTE FOR WORKSHOP PARTICIPANTS:
     * To integrate with an email sending service such as Resend API or EmailJS:
     * 
     * await fetch('https://api.resend.com/emails', {
     *   method: 'POST',
     *   headers: {
     *     'Authorization': 'Bearer re_your_api_key',
     *     'Content-Type': 'application/json'
     *   },
     *   body: JSON.stringify({
     *     from: 'portfolio@yourdomain.dev',
     *     to: 'maya.sharma.eng@university.edu',
     *     subject: `[Portfolio Inquiry] ${topic} from ${name}`,
     *     text: `From: ${name} (${email})\nTopic: ${topic}\n\nMessage:\n${message}`
     *   })
     * });
     */

    setTimeout(() => {
      sfx.success();
      if (feedback) {
        feedback.style.display = 'block';
        feedback.className = 'form-feedback-banner success';
        feedback.innerHTML = `
          <span>✅ Transmission acknowledged! Thank you, <strong>${name}</strong>. Maya will reply to <em>${email}</em> within 24 hours.</span>
        `;
      }

      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>TRANSMIT MESSAGE</span> <span>⚡→</span>`;
      }

      // Hide success message after 7 seconds
      setTimeout(() => {
        if (feedback) feedback.style.display = 'none';
      }, 7000);
    }, 900);
  };
});
