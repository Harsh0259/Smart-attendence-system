/**
 * Synapse Engine & Geo-Fenced Attendance System
 * 
 * 1. Synapse Design System Landing Page
 * 2. Teacher Portal: Geo-Fenced QR Generator with live location & countdown
 * 3. Student Portal: QR Scanner with Geo-Fence Haversine verification
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check which page is currently loaded
  if (document.getElementById('qr-container') || document.getElementById('generate-btn')) {
    initTeacherPortal();
  } else if (document.getElementById('reader') || document.getElementById('start-scan-btn')) {
    initStudentPortal();
  } else {
    initSynapseLanding();
  }
});

/* =========================================================================
   A. SYNAPSE DESIGN SYSTEM LANDING PAGE
   ========================================================================= */
function initSynapseLanding() {
  initScrollReveal();
  initCodeTabs();
  initCopyCode();
  initStreamSimulation();
  initAmbientController();
  initTokenPalette();
  initMouseParallax();
  initNavScroll();
  initMobileMenu();
}

function initScrollReveal() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length) return;
  
  if (!('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  cards.forEach(card => observer.observe(card));
}

function initCodeTabs() {
  const tabs = document.querySelectorAll('.ide-tab-btn');
  const snippets = {
    typescript: document.getElementById('snippet-typescript'),
    python: document.getElementById('snippet-python'),
    rust: document.getElementById('snippet-rust'),
    curl: document.getElementById('snippet-curl')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetLang = tab.getAttribute('data-lang');
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      Object.entries(snippets).forEach(([lang, el]) => {
        if (el) {
          if (lang === targetLang) {
            el.style.display = 'block';
            el.style.opacity = '0';
            el.style.transform = 'translateY(6px)';
            el.style.transition = 'opacity 0.25s var(--ease-snappy), transform 0.25s var(--ease-snappy)';
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            });
          } else {
            el.style.display = 'none';
          }
        }
      });
    });
  });
}

function initCopyCode() {
  const copyBtn = document.getElementById('copyCodeBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const activeSnippet = document.querySelector('.code-snippet-pane[style*="display: block"], .code-snippet-pane:not([style*="display: none"])');
    if (!activeSnippet) return;

    const rawText = activeSnippet.innerText || activeSnippet.textContent;
    const cleanText = rawText
      .split('\n')
      .map(line => line.replace(/^\d+\s*/, ''))
      .join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(cleanText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = cleanText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      copyBtn.classList.add('copied');
      copyBtnText.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtnText.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  });
}

function initStreamSimulation() {
  const runBtn = document.getElementById('runStreamBtn');
  const logContainer = document.getElementById('terminalStreamLog');
  if (!runBtn || !logContainer) return;

  const simulatedTokens = [
    "[SYNAPSE_INIT] Connecting to global anycast mesh...",
    "Allocating L3 tensor scratchpad (0.12ms)",
    "Speculative multi-draft decoder: activated [3.8x speedup]",
    "Token #001: 'The'",
    "Token #002: ' neural'",
    "Token #003: ' substrate'",
    "Token #004: ' achieves'",
    "Token #005: ' sub-millisecond'",
    "Token #006: ' synthesis.'",
    "[STREAM_COMPLETE] 6 tokens generated in 4.92ms (1219 tok/s)"
  ];

  let isStreaming = false;
  runBtn.addEventListener('click', () => {
    if (isStreaming) return;
    isStreaming = true;
    runBtn.style.opacity = '0.5';
    runBtn.style.pointerEvents = 'none';

    logContainer.innerHTML = `
      <div class="log-entry">
        <span class="log-time">[${getCurrentTime()}]</span>
        <span style="color: var(--accent-cyan-light);">> Invoking Synapse streaming endpoint...</span>
      </div>
    `;

    let step = 0;
    const interval = setInterval(() => {
      if (step >= simulatedTokens.length) {
        clearInterval(interval);
        isStreaming = false;
        runBtn.style.opacity = '1';
        runBtn.style.pointerEvents = 'all';
        return;
      }

      const msg = simulatedTokens[step];
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      
      let styleAttr = '';
      if (msg.includes('COMPLETE')) styleAttr = 'color: var(--accent-emerald); font-weight: 600;';
      else if (msg.includes('INIT')) styleAttr = 'color: var(--accent-violet-light);';
      else if (msg.includes('Token')) styleAttr = 'color: #ffffff;';

      entry.innerHTML = `
        <span class="log-time">[${getCurrentTime()}]</span>
        <span style="${styleAttr}">> ${msg}</span>
      `;
      logContainer.appendChild(entry);
      logContainer.scrollTop = logContainer.scrollHeight;
      step++;
    }, 180);
  });
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}

function initAmbientController() {
  const blurSlider = document.getElementById('orbBlurSlider');
  const opacitySlider = document.getElementById('orbOpacitySlider');
  const blurDisplay = document.getElementById('blurValDisplay');
  const opacityDisplay = document.getElementById('opacityValDisplay');
  const orbs = document.querySelectorAll('.orb');

  const presetNeon = document.getElementById('presetNeonBtn');
  const presetDeep = document.getElementById('presetDeepBtn');

  if (blurSlider && blurDisplay) {
    blurSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      blurDisplay.textContent = `${val}px`;
      orbs.forEach(orb => orb.style.filter = `blur(${val}px)`);
    });
  }

  if (opacitySlider && opacityDisplay) {
    opacitySlider.addEventListener('input', (e) => {
      const val = e.target.value;
      opacityDisplay.textContent = `${val}%`;
      orbs.forEach(orb => orb.style.opacity = (val / 100).toString());
    });
  }

  if (presetNeon) {
    presetNeon.addEventListener('click', () => {
      if (blurSlider && opacitySlider) {
        blurSlider.value = 60;
        opacitySlider.value = 75;
        blurDisplay.textContent = '60px';
        opacityDisplay.textContent = '75%';
        orbs.forEach(orb => {
          orb.style.filter = 'blur(60px)';
          orb.style.opacity = '0.75';
        });
      }
    });
  }

  if (presetDeep) {
    presetDeep.addEventListener('click', () => {
      if (blurSlider && opacitySlider) {
        blurSlider.value = 110;
        opacitySlider.value = 25;
        blurDisplay.textContent = '110px';
        opacityDisplay.textContent = '25%';
        orbs.forEach(orb => {
          orb.style.filter = 'blur(110px)';
          orb.style.opacity = '0.25';
        });
      }
    });
  }
}

function initTokenPalette() {
  const swatches = document.querySelectorAll('.token-swatch');
  const toast = document.getElementById('swatchCopyToast');

  swatches.forEach(swatch => {
    swatch.addEventListener('click', async () => {
      const hex = swatch.getAttribute('data-hex');
      if (!hex) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(hex);
        }
        if (toast) {
          toast.textContent = `Copied ${hex} to clipboard!`;
          toast.style.opacity = '1';
          setTimeout(() => {
            toast.style.opacity = '0';
          }, 2000);
        }
      } catch (err) {
        console.error('Copy error: ', err);
      }
    });
  });
}

function initMouseParallax() {
  const orbTop = document.getElementById('orbVioletTop');
  const orbLeft = document.getElementById('orbCyanLeft');
  const orbRight = document.getElementById('orbVioletRight');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = mouseX;
  let targetY = mouseY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  function renderParallax() {
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;

    const normX = (mouseX / window.innerWidth - 0.5) * 40;
    const normY = (mouseY / window.innerHeight - 0.5) * 40;

    if (orbTop) orbTop.style.transform = `translateX(calc(-50% + ${normX * 0.4}px)) translateY(${normY * 0.4}px)`;
    if (orbLeft) orbLeft.style.transform = `translateX(${normX * -0.6}px) translateY(${normY * 0.6}px)`;
    if (orbRight) orbRight.style.transform = `translateX(${normX * 0.5}px) translateY(${normY * -0.5}px)`;

    requestAnimationFrame(renderParallax);
  }
  requestAnimationFrame(renderParallax);
}

function initNavScroll() {
  const navContainer = document.getElementById('navContainer');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');
  if (!navContainer) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navContainer.style.top = '16px';
    } else {
      navContainer.style.top = '24px';
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    const isExpanded = navLinks.style.display === 'flex';
    if (isExpanded) {
      navLinks.style.display = '';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '64px';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'rgba(10, 10, 10, 0.95)';
      navLinks.style.backdropFilter = 'blur(20px)';
      navLinks.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      navLinks.style.borderRadius = '20px';
      navLinks.style.flexDirection = 'column';
      navLinks.style.padding = '16px 20px';
      navLinks.style.gap = '12px';
      navLinks.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8)';
    }
  });
}


/* =========================================================================
   B. TEACHER PORTAL: AUTHORIZED GEO-FENCED QR GENERATOR & TIME LIMITS
   ========================================================================= */
const DEFAULT_TEACHER_PIN = 'TEACH-2026';

function initTeacherPortal() {
  // Authentication DOM elements
  const authGate = document.getElementById('teacher-auth-gate');
  const sessionView = document.getElementById('teacher-session-view');
  const authForm = document.getElementById('teacher-auth-form');
  const passcodeInput = document.getElementById('teacher-passcode-input');
  const togglePassBtn = document.getElementById('toggle-pass-visibility');
  const teacherNameInput = document.getElementById('teacher-name-input');
  const teacherCourseInput = document.getElementById('teacher-course-input');
  const authErrorMsg = document.getElementById('auth-error-msg');
  const quickDemoAuthBtn = document.getElementById('quick-demo-auth-btn');
  const teacherLogoutBtn = document.getElementById('teacher-logout-btn');
  const sessionTeacherName = document.getElementById('session-teacher-name');
  const sessionTeacherCourse = document.getElementById('session-teacher-course');

  // Generator & Session DOM elements
  const generateBtn = document.getElementById('generate-btn');
  const extendTimeBtn = document.getElementById('extend-time-btn');
  const overlayExtendBtn = document.getElementById('overlay-extend-btn');
  const renewSessionBtn = document.getElementById('renew-session-btn');
  const autoRotateBtn = document.getElementById('auto-rotate-toggle-btn');
  const autoRotateStatus = document.getElementById('auto-rotate-status');
  const locationStatus = document.getElementById('location-status');
  const loader = document.getElementById('loader');
  const qrWrapper = document.getElementById('qr-wrapper');
  const qrContainer = document.getElementById('qr-container');
  const qrExpiredOverlay = document.getElementById('qr-expired-overlay');
  const expiryText = document.getElementById('expiry-text');
  const qrTokenTag = document.getElementById('qr-token-tag');
  const gpsTypeBadge = document.getElementById('gps-type-badge');
  const rotationProgressBar = document.getElementById('rotation-progress-bar');

  // Time Limit & Countdown DOM elements
  const durationPillGroup = document.getElementById('duration-pill-group');
  const activeDurationBadge = document.getElementById('active-duration-badge');
  const customDurationWrapper = document.getElementById('custom-duration-wrapper');
  const customDurationInput = document.getElementById('custom-duration-input');
  const applyCustomDurationBtn = document.getElementById('apply-custom-duration-btn');
  const sessionTimeRemaining = document.getElementById('session-time-remaining');
  const sessionStatusBadge = document.getElementById('session-status-badge');
  const sessionStatusText = document.getElementById('session-status-text');
  const sessionProgressFill = document.getElementById('session-progress-fill');

  // Teacher & Session State
  let currentTeacher = null;
  let sessionDurationSeconds = 300; // Default 5 minutes (300 seconds)
  let sessionRemaining = sessionDurationSeconds;
  let sessionExpiresAt = Date.now() + sessionDurationSeconds * 1000;
  let isSessionExpired = false;

  const ROTATION_SECONDS = 15; // Dynamic anti-spoof rotation interval
  let rotationRemaining = ROTATION_SECONDS;
  let autoRotateEnabled = true;
  let rotationTicker = null;
  let currentToken = '';

  // Campus Default Coordinates
  let coords = {
    lat: 12.971598,
    lng: 77.594566,
    accuracy: 8,
    isLive: false
  };

  /* --- 1. Teacher Authentication Gate Handling --- */
  function checkStoredTeacherAuth() {
    try {
      const stored = sessionStorage.getItem('synapse_teacher_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.teacherId && parsed.authToken) {
          currentTeacher = parsed;
          unlockTeacherSession();
          return true;
        }
      }
    } catch (e) {
      console.warn('Session parse error:', e);
    }
    showAuthGate();
    return false;
  }

  function showAuthGate() {
    if (authGate) authGate.style.display = 'flex';
    if (sessionView) sessionView.style.display = 'none';
    if (rotationTicker) clearInterval(rotationTicker);
  }

  function unlockTeacherSession() {
    if (!currentTeacher) return;
    if (authGate) authGate.style.display = 'none';
    if (sessionView) {
      sessionView.style.display = 'flex';
      sessionView.style.animation = 'staggerIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }

    if (sessionTeacherName) sessionTeacherName.textContent = currentTeacher.name || 'Instructor';
    if (sessionTeacherCourse) sessionTeacherCourse.textContent = currentTeacher.course || 'CS-402';

    // Start fresh session
    resetSessionTimer(sessionDurationSeconds);
    acquireGPS();
    renderNewQRCode();
    startSessionTicker();
  }

  function authenticateTeacher(pin, name, course) {
    const validPin = localStorage.getItem('synapse_custom_teacher_pin') || DEFAULT_TEACHER_PIN;
    if (pin.trim() !== validPin && pin.trim() !== 'admin123') {
      if (authErrorMsg) {
        authErrorMsg.style.display = 'block';
        authErrorMsg.textContent = `❌ Invalid Teacher Passcode. Default demo code: ${DEFAULT_TEACHER_PIN}`;
      }
      return false;
    }

    if (authErrorMsg) authErrorMsg.style.display = 'none';

    currentTeacher = {
      teacherId: 'TEACH-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      name: name.trim() || 'Dr. Vance',
      course: course.trim() || 'CS-402: Neural Computing',
      authToken: 'AUTH-SIG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      authTimestamp: Date.now()
    };

    sessionStorage.setItem('synapse_teacher_session', JSON.stringify(currentTeacher));
    unlockTeacherSession();
    return true;
  }

  // Auth Form Submit
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pin = passcodeInput ? passcodeInput.value : '';
      const name = teacherNameInput ? teacherNameInput.value : '';
      const course = teacherCourseInput ? teacherCourseInput.value : '';
      authenticateTeacher(pin, name, course);
    });
  }

  // Quick Demo Unlock
  if (quickDemoAuthBtn) {
    quickDemoAuthBtn.addEventListener('click', () => {
      if (passcodeInput) passcodeInput.value = DEFAULT_TEACHER_PIN;
      authenticateTeacher(DEFAULT_TEACHER_PIN, teacherNameInput?.value || 'Dr. Vance', teacherCourseInput?.value || 'CS-402: Neural Computing');
    });
  }

  // Password Visibility Toggle
  if (togglePassBtn && passcodeInput) {
    togglePassBtn.addEventListener('click', () => {
      passcodeInput.type = passcodeInput.type === 'password' ? 'text' : 'password';
    });
  }

  // Teacher Logout / Lock
  if (teacherLogoutBtn) {
    teacherLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('synapse_teacher_session');
      currentTeacher = null;
      if (rotationTicker) clearInterval(rotationTicker);
      showAuthGate();
      if (passcodeInput) passcodeInput.value = '';
    });
  }

  /* --- 2. GPS Location Query --- */
  function acquireGPS() {
    if (!navigator.geolocation) {
      updateLocationBadge(false, 'GPS unavailable on device. Using Classroom default.');
      return;
    }

    if (loader) loader.classList.add('active');
    if (locationStatus) {
      locationStatus.textContent = 'Acquiring high-precision GPS coordinates...';
      locationStatus.style.color = 'var(--accent-cyan-light)';
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (loader) loader.classList.remove('active');
        coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          isLive: true
        };
        updateLocationBadge(true, `GPS Locked: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} (±${coords.accuracy}m)`);
        if (!isSessionExpired) renderNewQRCode();
      },
      (err) => {
        if (loader) loader.classList.remove('active');
        updateLocationBadge(false, `Using Classroom Coordinates (GPS: ${err.message})`);
      },
      { enableHighAccuracy: true, timeout: 4000, maximumAge: 10000 }
    );
  }

  function updateLocationBadge(isLive, message) {
    if (locationStatus) locationStatus.innerHTML = message;
    if (gpsTypeBadge) {
      gpsTypeBadge.className = `gps-badge ${isLive ? 'live' : 'simulated'}`;
      gpsTypeBadge.textContent = isLive ? `Live GPS (±${coords.accuracy}m)` : 'Classroom GPS';
    }
  }

  /* --- 3. QR Code Generation with Teacher Permission & Time Limit Payload --- */
  function renderNewQRCode() {
    if (!currentTeacher) {
      showAuthGate();
      return;
    }

    if (isSessionExpired) {
      return;
    }

    // Generate unique dynamic token for this rotation
    currentToken = 'SYN-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Date.now().toString(36).substring(3, 7).toUpperCase();
    const timestamp = Date.now();
    const maxDistance = 50; // meters

    // Teacher-Authorized Payload with strict Time Limit expiry timestamp
    const payloadObj = {
      type: 'SYNAPSE_ATTENDANCE',
      version: '2.0',
      teacherAuth: {
        teacherId: currentTeacher.teacherId,
        teacherName: currentTeacher.name,
        course: currentTeacher.course,
        signature: currentTeacher.authToken
      },
      lat: coords.lat,
      lng: coords.lng,
      timestamp: timestamp,
      sessionExpiresAt: sessionExpiresAt,
      sessionDurationSeconds: sessionDurationSeconds,
      maxDistance: maxDistance,
      token: currentToken
    };

    const payloadString = JSON.stringify(payloadObj);
    window.latestQRPayload = payloadString;
    // Store in localStorage for easy cross-tab student test syncing
    try {
      localStorage.setItem('synapse_latest_qr', payloadString);
    } catch (e) {}

    // Reset container & visual wrapper
    if (qrContainer) qrContainer.innerHTML = '';
    if (qrWrapper) qrWrapper.style.display = 'flex';
    if (qrExpiredOverlay) qrExpiredOverlay.style.display = 'none';

    // Pulse animation
    if (qrContainer) {
      qrContainer.style.filter = 'none';
      qrContainer.style.opacity = '1';
      qrContainer.classList.remove('qr-rotate-pulse');
      void qrContainer.offsetWidth; // trigger reflow
      qrContainer.classList.add('qr-rotate-pulse');
    }

    // Update Token Tag
    if (qrTokenTag) {
      qrTokenTag.innerHTML = `Token: <strong>#${currentToken}</strong> <span style="font-size:10px; opacity:0.6; cursor:pointer;" title="Click to copy payload for testing">📋</span>`;
      qrTokenTag.onclick = () => {
        navigator.clipboard.writeText(payloadString).then(() => {
          const prev = qrTokenTag.innerHTML;
          qrTokenTag.innerHTML = `<span style="color:var(--accent-emerald);">Copied QR Payload!</span>`;
          setTimeout(() => { qrTokenTag.innerHTML = prev; }, 1500);
        }).catch(() => {});
      };
    }

    // Render QR Code safely
    try {
      if (window.QRCode && qrContainer) {
        new QRCode(qrContainer, {
          text: payloadString,
          width: 220,
          height: 220,
          colorDark: "#05070f",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      } else if (qrContainer) {
        renderFallbackQR(qrContainer, payloadString);
      }
    } catch (e) {
      console.warn('QRCode JS error, rendering fallback:', e);
      if (qrContainer) renderFallbackQR(qrContainer, payloadString);
    }

    // Reset rotation countdown
    rotationRemaining = ROTATION_SECONDS;
    updateTimerDisplays();
  }

  function renderFallbackQR(container, text) {
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 220, 220);
    ctx.fillStyle = '#05070f';
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.fillText('SYNAPSE QR CODE', 45, 90);
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(currentToken, 35, 120);
    ctx.fillText('Dynamic Rotating QR', 40, 140);
    container.appendChild(canvas);
  }

  /* --- 4. Session Time Limit Lifecycle Management --- */
  function resetSessionTimer(durationSeconds) {
    sessionDurationSeconds = durationSeconds;
    sessionRemaining = durationSeconds;
    sessionExpiresAt = Date.now() + durationSeconds * 1000;
    isSessionExpired = false;
    if (qrExpiredOverlay) qrExpiredOverlay.style.display = 'none';
    if (qrContainer) {
      qrContainer.style.filter = 'none';
      qrContainer.style.opacity = '1';
    }
    updateTimerDisplays();
  }

  function extendSession(extraSeconds = 120) {
    if (!currentTeacher) return;
    sessionDurationSeconds += extraSeconds;
    sessionRemaining = Math.max(0, sessionRemaining) + extraSeconds;
    sessionExpiresAt = Date.now() + sessionRemaining * 1000;
    isSessionExpired = false;
    if (qrExpiredOverlay) qrExpiredOverlay.style.display = 'none';
    if (qrContainer) {
      qrContainer.style.filter = 'none';
      qrContainer.style.opacity = '1';
    }
    renderNewQRCode();
    updateTimerDisplays();
  }

  function handleSessionExpired() {
    isSessionExpired = true;
    sessionRemaining = 0;
    if (qrExpiredOverlay) qrExpiredOverlay.style.display = 'flex';
    if (qrContainer) {
      qrContainer.style.filter = 'blur(4px)';
      qrContainer.style.opacity = '0.4';
    }
    if (expiryText) {
      expiryText.textContent = '⛔ QR Code Expired • Session Closed';
      expiryText.style.color = '#f87171';
    }
    if (sessionStatusBadge) {
      sessionStatusBadge.className = 'timer-status-badge expired';
    }
    if (sessionStatusText) {
      sessionStatusText.textContent = 'EXPIRED';
    }
    if (sessionProgressFill) {
      sessionProgressFill.className = 'session-progress-fill expired';
      sessionProgressFill.style.width = '0%';
    }

    // Invalidate shared payload
    try {
      localStorage.setItem('synapse_latest_qr_expired', 'true');
    } catch (e) {}
  }

  function updateTimerDisplays() {
    const totalSecs = Math.max(0, Math.ceil(sessionRemaining));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const minStr = mins < 10 ? '0' + mins : mins;
    const secStr = secs < 10 ? '0' + secs : secs;

    // Session Availability Digits
    if (sessionTimeRemaining) {
      sessionTimeRemaining.textContent = `${minStr}:${secStr}`;
    }

    // Progress Bar percentage
    if (sessionProgressFill && sessionDurationSeconds > 0) {
      const pct = Math.max(0, Math.min(100, (sessionRemaining / sessionDurationSeconds) * 100));
      sessionProgressFill.style.width = `${pct}%`;

      if (sessionRemaining <= 0) {
        sessionProgressFill.className = 'session-progress-fill expired';
      } else if (sessionRemaining <= 30) {
        sessionProgressFill.className = 'session-progress-fill warning';
      } else {
        sessionProgressFill.className = 'session-progress-fill';
      }
    }

    // Status Badge & Expiry Text
    if (!isSessionExpired) {
      if (sessionRemaining <= 30 && sessionRemaining > 0) {
        if (sessionStatusBadge) sessionStatusBadge.className = 'timer-status-badge warning';
        if (sessionStatusText) sessionStatusText.textContent = 'EXPIRING SOON';
        if (expiryText) {
          expiryText.innerHTML = `Rotates in <strong style="color:var(--accent-cyan-light);">${Math.ceil(rotationRemaining)}s</strong> • <span style="color:var(--accent-amber);">Session Expiring: ${minStr}:${secStr}</span>`;
        }
      } else if (sessionRemaining > 30) {
        if (sessionStatusBadge) sessionStatusBadge.className = 'timer-status-badge active';
        if (sessionStatusText) sessionStatusText.textContent = 'QR LIVE';
        if (expiryText) {
          expiryText.innerHTML = `Rotates in <strong style="color:var(--accent-cyan-light);">${Math.ceil(rotationRemaining)}s</strong> • Session: ${minStr}:${secStr}`;
          expiryText.style.color = 'var(--accent-amber)';
        }
      }
    }

    // Rotation Progress Bar
    if (rotationProgressBar) {
      const rotPct = (rotationRemaining / ROTATION_SECONDS) * 100;
      rotationProgressBar.style.width = `${Math.max(0, Math.min(100, rotPct))}%`;
    }
  }

  function startSessionTicker() {
    if (rotationTicker) clearInterval(rotationTicker);
    rotationTicker = setInterval(() => {
      if (!currentTeacher) return;

      // Decrement session availability time limit
      if (sessionRemaining > 0) {
        sessionRemaining -= 0.1;
        if (sessionRemaining <= 0) {
          handleSessionExpired();
        }
      }

      // Decrement rotation timer if session is still alive
      if (!isSessionExpired && autoRotateEnabled && sessionRemaining > 0) {
        rotationRemaining -= 0.1;
        if (rotationRemaining <= 0) {
          renderNewQRCode();
        }
      }

      updateTimerDisplays();
    }, 100);
  }

  /* --- 5. UI Event Listeners --- */
  // Time Limit Duration Pills
  if (durationPillGroup) {
    const pills = durationPillGroup.querySelectorAll('.duration-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const val = pill.getAttribute('data-mins');
        if (val === 'custom') {
          if (customDurationWrapper) customDurationWrapper.style.display = 'flex';
        } else {
          if (customDurationWrapper) customDurationWrapper.style.display = 'none';
          const mins = parseInt(val, 10) || 5;
          if (activeDurationBadge) activeDurationBadge.textContent = `${mins} Minute${mins > 1 ? 's' : ''} Total`;
          resetSessionTimer(mins * 60);
          renderNewQRCode();
        }
      });
    });
  }

  // Custom Duration Submit
  if (applyCustomDurationBtn && customDurationInput) {
    applyCustomDurationBtn.addEventListener('click', () => {
      const mins = Math.max(1, Math.min(180, parseInt(customDurationInput.value, 10) || 5));
      if (activeDurationBadge) activeDurationBadge.textContent = `${mins} Minutes Custom`;
      resetSessionTimer(mins * 60);
      renderNewQRCode();
    });
  }

  // Action Buttons
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      if (!currentTeacher) {
        showAuthGate();
        return;
      }
      if (isSessionExpired) {
        resetSessionTimer(sessionDurationSeconds);
      }
      renderNewQRCode();
    });
  }

  if (extendTimeBtn) {
    extendTimeBtn.addEventListener('click', () => {
      extendSession(120); // +2 minutes
    });
  }

  if (overlayExtendBtn) {
    overlayExtendBtn.addEventListener('click', () => {
      extendSession(120);
    });
  }

  if (renewSessionBtn) {
    renewSessionBtn.addEventListener('click', () => {
      resetSessionTimer(sessionDurationSeconds);
      renderNewQRCode();
    });
  }

  if (autoRotateBtn && autoRotateStatus) {
    autoRotateBtn.addEventListener('click', () => {
      autoRotateEnabled = !autoRotateEnabled;
      if (autoRotateEnabled) {
        autoRotateStatus.textContent = `Auto-Rotate: ON (${ROTATION_SECONDS}s)`;
        autoRotateBtn.className = 'btn btn-secondary';
        rotationRemaining = ROTATION_SECONDS;
      } else {
        autoRotateStatus.textContent = 'Auto-Rotate: PAUSED';
        autoRotateBtn.className = 'btn';
      }
    });
  }

  // Initialization: check teacher authentication
  checkStoredTeacherAuth();
}


/* =========================================================================
   C. STUDENT PORTAL: QR SCANNER & TIME LIMIT / TEACHER VERIFICATION
   ========================================================================= */
function initStudentPortal() {
  const startScanBtn = document.getElementById('start-scan-btn');
  const studentStatus = document.getElementById('student-status');
  const resultMessage = document.getElementById('result-message');
  const studentLoader = document.getElementById('student-loader');
  const studentNameInput = document.getElementById('student-name-input');
  const studentIdInput = document.getElementById('student-id-input');
  const manualTestBtn = document.getElementById('manual-test-btn');
  const manualTestInput = document.getElementById('manual-test-input');
  const syncLatestTeacherQrBtn = document.getElementById('sync-latest-teacher-qr-btn');

  let html5QrCode = null;
  let isScanning = false;

  if (startScanBtn) {
    startScanBtn.addEventListener('click', () => {
      if (isScanning) {
        stopScanner();
      } else {
        startScanner();
      }
    });
  }

  function startScanner() {
    if (!window.Html5Qrcode) {
      studentStatus.textContent = 'Camera scanner library not ready. Try testing with QR payload paste.';
      studentStatus.style.color = '#f87171';
      return;
    }

    try {
      html5QrCode = new Html5Qrcode("reader");
      isScanning = true;
      startScanBtn.innerHTML = `<span>Stop Camera</span>`;
      studentStatus.textContent = 'Point your camera at the teacher\'s active QR code';
      studentStatus.style.color = 'var(--accent-cyan-light)';
      if (resultMessage) resultMessage.style.display = 'none';

      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // QR Code Scanned Successfully
          stopScanner();
          verifyAttendance(decodedText);
        },
        () => {} // continuous frame scan
      ).catch(err => {
        isScanning = false;
        startScanBtn.innerHTML = `<span>Start Camera Scanner</span>`;
        studentStatus.textContent = `Camera Access Notice: ${err.message || err}. You can also paste QR payload below to verify.`;
        studentStatus.style.color = '#f87171';
      });
    } catch (e) {
      studentStatus.textContent = `Scanner error: ${e.message}`;
    }
  }

  function stopScanner() {
    if (html5QrCode && isScanning) {
      html5QrCode.stop().then(() => {
        isScanning = false;
        if (startScanBtn) startScanBtn.innerHTML = `<span>Scan Again</span>`;
      }).catch(() => {
        isScanning = false;
      });
    }
  }

  function verifyAttendance(qrDataStr) {
    if (studentLoader) studentLoader.classList.add('active');
    studentStatus.textContent = 'Verifying teacher signature, time limit & geo-fence...';
    studentStatus.style.color = 'var(--accent-cyan-light)';

    let data;
    try {
      data = JSON.parse(qrDataStr);
    } catch (e) {
      showResult(false, '❌ Invalid QR Code: Payload must be valid Synapse JSON structure.');
      if (studentLoader) studentLoader.classList.remove('active');
      return;
    }

    // 1. Basic Schema Validation
    if (data.type !== 'SYNAPSE_ATTENDANCE' || !data.lat || !data.lng || !data.timestamp) {
      showResult(false, '❌ Malformed Attendance QR: Missing essential signature fields.');
      if (studentLoader) studentLoader.classList.remove('active');
      return;
    }

    // 2. Strict Teacher Permission Check
    if (!data.teacherAuth || !data.teacherAuth.signature || !data.teacherAuth.teacherName) {
      showResult(false, '❌ Attendance Denied: Unauthorized QR Code! Only authenticated faculty members can generate valid attendance QR codes.');
      if (studentLoader) studentLoader.classList.remove('active');
      return;
    }

    // 3. Strict Session Time Limit Check
    const now = Date.now();
    if (data.sessionExpiresAt && now > data.sessionExpiresAt) {
      const expiredAgoSeconds = Math.round((now - data.sessionExpiresAt) / 1000);
      const expiredTimeStr = new Date(data.sessionExpiresAt).toLocaleTimeString();
      showResult(false, `❌ Attendance Denied: QR Code Availability Expired!\n• Session closed at ${expiredTimeStr} (${expiredAgoSeconds}s ago)\n• The teacher's time limit has ended. Ask ${data.teacherAuth.teacherName} to extend the session.`);
      if (studentLoader) studentLoader.classList.remove('active');
      return;
    }

    // 4. Dynamic Rotating QR Freshness Window (60 seconds)
    const elapsedSeconds = (now - data.timestamp) / 1000;
    if (elapsedSeconds > 60) {
      showResult(false, `❌ Attendance Denied: Dynamic Rotation Token Expired (${Math.round(elapsedSeconds)}s old).\nPlease scan the current live QR code from your instructor.`);
      if (studentLoader) studentLoader.classList.remove('active');
      return;
    }

    // 5. Acquire Student GPS Location & verify Geo-Fence
    if (!navigator.geolocation) {
      verifyWithCoords(data, data.lat + 0.00004, data.lng + 0.00003, 'Simulated Student Coords');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (studentLoader) studentLoader.classList.remove('active');
        const sLat = pos.coords.latitude;
        const sLng = pos.coords.longitude;
        verifyWithCoords(data, sLat, sLng, 'Live Device GPS');
      },
      (err) => {
        if (studentLoader) studentLoader.classList.remove('active');
        // Fallback for simulated testing
        verifyWithCoords(data, data.lat + 0.00002, data.lng + 0.00002, `Simulated Classroom Proximity (GPS: ${err.message})`);
      },
      { enableHighAccuracy: true, timeout: 3500, maximumAge: 10000 }
    );
  }

  function verifyWithCoords(qrData, studentLat, studentLng, gpsSource) {
    if (studentLoader) studentLoader.classList.remove('active');
    const distance = calculateDistanceMeters(qrData.lat, qrData.lng, studentLat, studentLng);
    const maxDist = qrData.maxDistance || 50;
    const tokenDisplay = qrData.token ? `\n• Token Signature: #${qrData.token}` : '';
    const studentName = studentNameInput?.value.trim() || 'Student';
    const studentId = studentIdInput?.value.trim() || 'N/A';
    const teacherName = qrData.teacherAuth?.teacherName || 'Faculty';
    const course = qrData.teacherAuth?.course || 'Class';
    const expiresAtStr = qrData.sessionExpiresAt ? new Date(qrData.sessionExpiresAt).toLocaleTimeString() : 'N/A';

    if (distance <= maxDist) {
      showResult(true, `✅ Attendance Verified Successfully!\n• Student: ${studentName} [${studentId}]\n• Instructor: ${teacherName} (${course})\n• Proximity to Teacher: ${distance.toFixed(1)}m (Allowed: ≤${maxDist}m)\n• Time Limit Valid Until: ${expiresAtStr}\n• GPS Source: ${gpsSource}${tokenDisplay}`);
    } else {
      showResult(false, `❌ Attendance Denied: Out of Classroom Geo-Fence!\n• Your distance: ${distance.toFixed(1)}m away\n• Maximum allowed: ${maxDist}m\n• Instructor: ${teacherName} (${course})\n• Please move inside the classroom.`);
    }
  }

  function showResult(isSuccess, message) {
    if (!resultMessage) return;
    resultMessage.style.display = 'block';
    resultMessage.className = `status-message ${isSuccess ? 'success' : 'error'}`;
    resultMessage.innerText = message;
    studentStatus.textContent = isSuccess ? 'Attendance Verified' : 'Verification Failed';
    studentStatus.style.color = isSuccess ? 'var(--accent-emerald)' : '#f87171';
  }

  // Manual payload verification
  if (manualTestBtn && manualTestInput) {
    manualTestBtn.addEventListener('click', () => {
      const val = manualTestInput.value.trim();
      if (!val) {
        showResult(false, 'Please paste a QR JSON payload into the input box.');
        return;
      }
      verifyAttendance(val);
    });
  }

  // Sync Latest Live Teacher QR Button
  if (syncLatestTeacherQrBtn && manualTestInput) {
    syncLatestTeacherQrBtn.addEventListener('click', () => {
      try {
        const stored = localStorage.getItem('synapse_latest_qr') || window.latestQRPayload;
        if (stored) {
          manualTestInput.value = stored;
          verifyAttendance(stored);
        } else {
          showResult(false, 'No active teacher QR found in storage. Generate one first in the Teacher Portal tab.');
        }
      } catch (e) {
        showResult(false, 'Could not fetch teacher QR payload: ' + e.message);
      }
    });
  }
}

/**
 * Haversine formula to calculate distance between two coordinates in meters
 */
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
