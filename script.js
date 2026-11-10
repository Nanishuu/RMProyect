// ===== CONFIG =====
const WHATSAPP_NUMBER = "584144533064";
const CONTACT_EMAIL = "contacto@rmsound.com"; // cambia por tu correo real

// ===== NAV =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ===== YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== SCROLL REVEAL (entrada/salida) =====
const animatedEls = document.querySelectorAll('[data-animate]');
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.remove('out-view');
      e.target.classList.add('in-view');
    } else {
      e.target.classList.remove('in-view');
      // solo marcar salida si ya había entrado
      if (e.target.dataset.revealed === '1') e.target.classList.add('out-view');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

animatedEls.forEach(el => {
  // stagger por data-delay
  const d = parseInt(el.dataset.delay || '0', 10);
  el.style.transitionDelay = (d * 0.12) + 's';
  revealIO.observe(el);
  // marcar como revelado cuando entra
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.dataset.revealed = '1'; });
  }, { threshold: 0.15 });
  obs.observe(el);
});

// ===== PARALLAX =====
const parallaxEls = document.querySelectorAll('[data-parallax]');
const isMobileMQ = window.matchMedia('(max-width: 768px)');
function updateParallax() {
  if (isMobileMQ.matches) {
    parallaxEls.forEach(el => { el.style.transform = ''; });
    return;
  }
  const sy = window.scrollY;
  parallaxEls.forEach(el => {
    const rate = parseFloat(el.dataset.speed || 0.3);
    el.style.transform = `translate3d(0, ${sy * rate}px, 0)`;
  });
}
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateParallax(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
updateParallax();

// ===== LED CANVAS (lite) =====
const canvas = document.getElementById('ledCanvas');
const ctx = canvas?.getContext('2d');

// Desactivar canvas en móviles y en usuarios que prefieren menos movimiento
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const useCanvas = canvas && ctx && !isMobile && !reduceMotion;

let canvasRunning = false;
let lastFrame = 0;
const FPS = 12; // limitar a ~12 fps para ahorrar CPU/RAM
const FRAME_INTERVAL = 1000 / FPS;

function resizeCanvas() {
  if (!canvas || !useCanvas) return;
  const r = canvas.parentElement.getBoundingClientRect();
  // dpr fijo a 1 para no multiplicar pixeles
  canvas.width = Math.max(1, Math.floor(r.width));
  canvas.height = Math.max(1, Math.floor(r.height));
  canvas.style.width = r.width + 'px';
  canvas.style.height = r.height + 'px';
}

function drawLed(t) {
  if (!canvasRunning) return;
  if (t - lastFrame < FRAME_INTERVAL) {
    requestAnimationFrame(drawLed);
    return;
  }
  lastFrame = t;
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, w, h);

  const cell = 26;
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const n = Math.sin(t * 0.0009 + x * 0.4 + y * 0.5) * 0.5 + 0.5;
      const bright = n * 0.5 + 0.06;
      const alpha = bright * 0.4;
      // color morado fijo, variando alpha (más barato que calcular RGB)
      ctx.fillStyle = `rgba(168,85,247,${alpha})`;
      ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
    }
  }

  // texto (sin shadow blur costoso, solo una vez)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = `900 ${Math.min(w, h) * 0.11}px Orbitron, sans-serif`;
  ctx.fillText('RMSOUND', w / 2, h / 2 - 8);
  ctx.fillStyle = 'rgba(192,132,252,0.9)';
  ctx.font = `500 ${Math.min(w, h) * 0.026}px Poppins, sans-serif`;
  ctx.fillText('SONIDO  •  PANTALLAS LED  •  ESCENARIOS  •  SHOWS', w / 2, h / 2 + 44);

  requestAnimationFrame(drawLed);
}

if (useCanvas) {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  // pausar cuando el hero no es visible
  const hero = document.getElementById('hero');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        if (!canvasRunning) { canvasRunning = true; requestAnimationFrame(drawLed); }
      } else {
        canvasRunning = false;
      }
    });
  }, { threshold: 0.1 });
  if (hero) io.observe(hero);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (!canvasRunning) { canvasRunning = true; requestAnimationFrame(drawLed); } });
  } else {
    canvasRunning = true; requestAnimationFrame(drawLed);
  }
} else if (canvas) {
  // ocultar canvas en mobile/reduced-motion, usar fondo CSS
  canvas.style.display = 'none';
}

// ===== QUOTE DATA =====
const QUOTE_ITEMS = [
  { cat: 'Sonido', items: [
    { id: 'linearray', name: 'Sistema Line Array (por módulo)' },
    { id: 'sub', name: 'Subwoofers' },
    { id: 'console', name: 'Consola de mezcla digital' },
    { id: 'mic', name: 'Micrófonos inalámbricos' },
    { id: 'monitor', name: 'Monitores de piso' },
    { id: 'djbooth', name: 'Cabina DJ / Booth' },
  ]},
  { cat: 'Iluminación', items: [
    { id: 'moving', name: 'Cabezas móviles LED' },
    { id: 'barled', name: 'Barras LED' },
    { id: 'smoke', name: 'Máquina de humo / hazer' },
    { id: 'spot', name: 'Seguidor (spotlight)' },
    { id: 'deco', name: 'Iluminación decorativa' },
  ]},
  { cat: 'Pantallas LED', items: [
    { id: 'ledin', name: 'Pantalla LED indoor (m²)' },
    { id: 'ledout', name: 'Pantalla LED outdoor (m²)' },
    { id: 'proc', name: 'Procesador de video' },
    { id: 'content', name: 'Gestión de contenido en vivo' },
  ]},
  { cat: 'Escenarios', items: [
    { id: 'stage', name: 'Tarima modular (m²)' },
    { id: 'trussin', name: 'Truss para pantalla indoor' },
    { id: 'trussout', name: 'Truss para pantalla outdoor' },
    { id: 'roof', name: 'Techado / carpa' },
    { id: 'backdrop', name: 'Backing / escenografía' },
  ]},
  { cat: 'Otros', items: [
    { id: 'gen', name: 'Generador eléctrico (kVA)' },
    { id: 'bath', name: 'Baños portátiles' },
    { id: 'trans', name: 'Transporte y logística' },
    { id: 'tech', name: 'Técnico operador en sitio' },
  ]},
];

const quoteItemsContainer = document.getElementById('quoteItems');
function renderQuoteItems() {
  if (!quoteItemsContainer) return;
  quoteItemsContainer.innerHTML = '';
  QUOTE_ITEMS.forEach(group => {
    const cat = document.createElement('div');
    cat.className = 'quote-category';
    cat.innerHTML = `<h4>${group.cat}</h4>`;
    group.items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'quote-item';
      row.innerHTML = `
        <label><input type="checkbox" data-id="${it.id}" data-name="${it.name}" /> ${it.name}</label>
        <input type="number" class="qty" min="1" value="1" disabled data-for="${it.id}" />
      `;
      cat.appendChild(row);
    });
    quoteItemsContainer.appendChild(cat);
  });

  // enable/disable qty
  quoteItemsContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const qty = quoteItemsContainer.querySelector(`.qty[data-for="${cb.dataset.id}"]`);
      if (qty) qty.disabled = !cb.checked;
      updateSummary();
    });
  });
  quoteItemsContainer.querySelectorAll('.qty').forEach(q => q.addEventListener('input', updateSummary));
}
renderQuoteItems();

function getSelectedItems() {
  const selected = [];
  quoteItemsContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
    const qty = quoteItemsContainer.querySelector(`.qty[data-for="${cb.dataset.id}"]`);
    selected.push({ id: cb.dataset.id, name: cb.dataset.name, qty: parseInt(qty?.value || '1', 10) || 1 });
  });
  return selected;
}

const ITEM_META = {
  linearray: { icon: 'fa-volume-high', color: '#a855f7' },
  sub: { icon: 'fa-drum', color: '#c084fc' },
  console: { icon: 'fa-sliders', color: '#7c3aed' },
  mic: { icon: 'fa-microphone', color: '#a855f7' },
  monitor: { icon: 'fa-headphones', color: '#c084fc' },
  djbooth: { icon: 'fa-compact-disc', color: '#00f5ff' },
  moving: { icon: 'fa-lightbulb', color: '#fbbf24' },
  barled: { icon: 'fa-grip-lines', color: '#00f5ff' },
  smoke: { icon: 'fa-smog', color: '#94a3b8' },
  spot: { icon: 'fa-bullseye', color: '#fbbf24' },
  deco: { icon: 'fa-wand-magic-sparkles', color: '#ff00ff' },
  ledin: { icon: 'fa-tv', color: '#00f5ff', led: true },
  ledout: { icon: 'fa-tv', color: '#00f5ff', led: true },
  proc: { icon: 'fa-microchip', color: '#7c3aed' },
  content: { icon: 'fa-film', color: '#a855f7' },
  stage: { icon: 'fa-layer-group', color: '#a855f7', platform: true },
  truss: { icon: 'fa-grip-vertical', color: '#c084fc' },
  trussin: { icon: 'fa-grip-vertical', color: '#c084fc', truss: true, panel: 'in' },
  trussout: { icon: 'fa-grip-vertical', color: '#c084fc', truss: true, panel: 'out' },
  roof: { icon: 'fa-umbrella', color: '#94a3b8' },
  backdrop: { icon: 'fa-image', color: '#ff00ff' },
  gen: { icon: 'fa-bolt', color: '#fbbf24' },
  bath: { icon: 'fa-restroom', color: '#94a3b8' },
  trans: { icon: 'fa-truck', color: '#94a3b8' },
  tech: { icon: 'fa-user-gear', color: '#00f5ff' },
};

function renderLedPanel(wall, stand, qty) {
  if (!wall) return;
  wall.innerHTML = '';
  const tiles = Math.min(Math.max(qty * 3, 0), 60);
  if (tiles === 0) {
    wall.style.display = 'none';
    if (stand) stand.classList.remove('active');
  } else {
    wall.style.display = 'grid';
    const cols = Math.max(2, Math.round(Math.sqrt(tiles * (16 / 9))));
    wall.style.gridTemplateColumns = `repeat(${cols}, 7px)`;
    for (let i = 0; i < tiles; i++) {
      const t = document.createElement('div');
      t.className = 'led-tile';
      wall.appendChild(t);
    }
    if (stand) stand.classList.add('active');
  }
}

function updatePreview() {
  const chips = document.getElementById('previewChips');
  const stageEl = document.getElementById('stageElements');
  const wallIn = document.getElementById('stageLedWallIn');
  const wallOut = document.getElementById('stageLedWallOut');
  const standIn = document.getElementById('stageLedStandIn');
  const standOut = document.getElementById('stageLedStandOut');
  if (!chips || !stageEl) return;
  const selected = getSelectedItems();
  chips.innerHTML = '';
  stageEl.innerHTML = '';
  if (wallIn) wallIn.innerHTML = '';
  if (wallOut) wallOut.innerHTML = '';
  let ledQtyIn = 0, ledQtyOut = 0;
  let trussInSelected = false, trussOutSelected = false;
  let platformSelected = false;
  selected.forEach(s => {
    const meta = ITEM_META[s.id] || { icon: 'fa-circle', color: '#a855f7' };
    // chip
    const chip = document.createElement('span');
    chip.className = 'preview-chip';
    chip.innerHTML = `<i class="fas ${meta.icon}"></i> ${s.name} <strong>x${s.qty}</strong>`;
    chips.appendChild(chip);
    // stage element (icono)
    if (meta.led) {
      if (s.id === 'ledin') ledQtyIn += (parseInt(s.qty, 10) || 1);
      else if (s.id === 'ledout') ledQtyOut += (parseInt(s.qty, 10) || 1);
    } else if (meta.truss) {
      if (s.id === 'trussin') trussInSelected = true;
      else if (s.id === 'trussout') trussOutSelected = true;
    } else if (meta.platform) {
      platformSelected = true;
    } else {
      const el = document.createElement('div');
      el.className = 'stage-el';
      el.style.color = meta.color;
      el.innerHTML = `<i class="fas ${meta.icon}"></i>`;
      stageEl.appendChild(el);
    }
  });
  // render panels indoor/outdoor por separado
  renderLedPanel(wallIn, standIn, ledQtyIn);
  renderLedPanel(wallOut, standOut, ledQtyOut);
  // truss por panel: marco alrededor de indoor/outdoor
  const frameIn = document.getElementById('trussFrameIn');
  const frameOut = document.getElementById('trussFrameOut');
  function setupFrame(frame, wall, activeFlag) {
    if (!frame) return;
    if (!activeFlag || wall.style.display === 'none') {
      frame.classList.remove('active');
      return;
    }
    frame.classList.add('active');
    requestAnimationFrame(() => {
      const stage = document.getElementById('stagePreview');
      if (!stage) return;
      const stageRect = stage.getBoundingClientRect();
      const r = wall.getBoundingClientRect();
      const left = r.left - stageRect.left - 8;
      const top = r.top - stageRect.top - 8;
      frame.style.left = left + 'px';
      frame.style.top = top + 'px';
      frame.style.width = (r.width + 16) + 'px';
      frame.style.height = (r.height + 16) + 'px';
    });
  }
  setupFrame(frameIn, wallIn, trussInSelected);
  setupFrame(frameOut, wallOut, trussOutSelected);

  // tarima modular debajo de los paneles
  const platform = document.getElementById('stagePlatform');
  if (platform) {
    if (!platformSelected) {
      platform.classList.remove('active');
    } else {
      platform.classList.add('active');
      requestAnimationFrame(() => {
        const stage = document.getElementById('stagePreview');
        if (!stage) return;
        const stageRect = stage.getBoundingClientRect();
        const rects = [];
        if (wallIn && wallIn.style.display !== 'none') rects.push(wallIn.getBoundingClientRect());
        if (wallOut && wallOut.style.display !== 'none') rects.push(wallOut.getBoundingClientRect());
        if (rects.length) {
          const left = Math.min(...rects.map(r => r.left)) - stageRect.left - 4;
          const right = Math.max(...rects.map(r => r.right)) - stageRect.left + 4;
          const bottom = Math.max(...rects.map(r => r.bottom)) - stageRect.top + 2;
          platform.style.left = left + 'px';
          platform.style.top = (bottom) + 'px';
          platform.style.width = (right - left) + 'px';
        } else {
          platform.style.left = '20%';
          platform.style.top = '90px';
          platform.style.width = '60%';
        }
      });
    }
  }
  // distribuir iconos en el escenario
  const els = stageEl.querySelectorAll('.stage-el');
  const n = els.length;
  els.forEach((el, i) => {
    const pct = (i + 1) / (n + 1) * 100;
    el.style.left = pct + '%';
    el.style.bottom = '30px';
    el.style.transform = 'translateX(-50%)';
  });
}

function updateSummary() {
  const list = document.getElementById('summaryList');
  if (!list) return;
  const selected = getSelectedItems();
  if (selected.length === 0) {
    list.innerHTML = '<p class="empty">Aún no has seleccionado productos.</p>';
  } else {
    list.innerHTML = selected.map(s => `
      <div class="summary-row"><span>${s.name}</span><span>x${s.qty}</span></div>
    `).join('');
  }
  updatePreview();
}

function buildQuoteText() {
  const name = document.getElementById('qName')?.value.trim() || '';
  const phone = document.getElementById('qPhone')?.value.trim() || '';
  const email = document.getElementById('qEmail')?.value.trim() || '';
  const type = document.getElementById('qType')?.value || '';
  const date = document.getElementById('qDate')?.value || '';
  const place = document.getElementById('qPlace')?.value.trim() || '';
  const notes = document.getElementById('qNotes')?.value.trim() || '';
  const selected = getSelectedItems();

  let text = '📋 COTIZACIÓN RMSOUND\n';
  text += '────────────────────\n';
  text += `Cliente: ${name || '-'}\n`;
  text += `Teléfono: ${phone || '-'}\n`;
  text += `Correo: ${email || '-'}\n`;
  text += `Tipo de evento: ${type || '-'}\n`;
  text += `Fecha: ${date || '-'}\n`;
  text += `Lugar: ${place || '-'}\n`;
  text += '────────────────────\n';
  text += 'Equipos y servicios:\n';
  if (selected.length === 0) text += '(ninguno seleccionado)\n';
  else selected.forEach(s => { text += `• ${s.name}  x${s.qty}\n`; });
  text += '────────────────────\n';
  if (notes) text += `Detalles: ${notes}\n`;
  text += '\nEnviado desde el sitio web de RMSOUND.';
  return text;
}

function validateQuote() {
  const name = document.getElementById('qName')?.value.trim() || '';
  const selected = getSelectedItems();
  if (!name) { alert('Por favor ingresa tu nombre o empresa.'); return false; }
  if (selected.length === 0) { alert('Selecciona al menos un equipo o servicio.'); return false; }
  return true;
}

document.getElementById('sendWhatsapp')?.addEventListener('click', () => {
  if (!validateQuote()) return;
  const text = buildQuoteText();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
});

document.getElementById('sendEmail')?.addEventListener('click', () => {
  if (!validateQuote()) return;
  const text = buildQuoteText();
  const subject = 'Cotización RMSOUND';
  const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  window.location.href = url;
});

document.getElementById('copyQuote')?.addEventListener('click', async () => {
  if (!validateQuote()) return;
  const text = buildQuoteText();
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById('copyQuote');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
    setTimeout(() => btn.innerHTML = orig, 1800);
  } catch (e) {
    alert('No se pudo copiar. Selecciona y copia manualmente.');
  }
});

// ===== SCROLLYTELLING =====

// 0) LOGO 3D EXTRUIDO: capas apiladas con translateZ (efecto 3D básico)
const logo3d = document.getElementById('logo3d');
const navLogo = document.getElementById('navLogo');
let logo3dInner = null;

function initLogo3d() {
  if (!logo3d) return;
  const inner = document.createElement('div');
  inner.className = 'logo-3d-inner';
  const LAYERS = 14;
  for (let i = 0; i < LAYERS; i++) {
    const s = document.createElement('span');
    s.className = 'logo-3d-layer';
    s.textContent = 'RM SOUND';
    const t = i / (LAYERS - 1); // 0 = atrás, 1 = frente
    s.style.setProperty('--z', (t * 26 - 26) + 'px'); // -26px → 0px
    if (i < LAYERS - 1) {
      // capas traseras: morado oscuro → morado claro (efecto extrusión)
      s.style.color = `hsl(266, 65%, ${Math.round(14 + t * 28)}%)`;
      s.style.textShadow = 'none';
      s.style.opacity = String(0.5 + t * 0.5);
    }
    inner.appendChild(s);
  }
  logo3d.appendChild(inner);
  logo3dInner = inner;
}
initLogo3d();

// El logo rota y viaja con el scroll; al final del hero se acopla al nav
function updateLogo3d() {
  if (!logo3d || !logo3dInner) return;
  const vh = window.innerHeight;
  const p = Math.min(1, Math.max(0, window.scrollY / vh));
  // easing in-out para un acople suave
  const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  // posición inicial (centro del hero) → posición del logo del nav
  let dx = 0, dy = 0;
  if (navLogo) {
    const r = navLogo.getBoundingClientRect();
    const startX = window.innerWidth / 2, startY = vh * 0.38;
    dx = (r.left + r.width / 2 - startX) * e;
    dy = (r.top + r.height / 2 - startY) * e;
  }
  const rotY = -150 * (1 - e); // se aplana al acoplarse
  const rotX = 18 * (1 - e);
  const scale = 1 - 0.74 * e;  // grande → tamaño del nav
  logo3dInner.style.transform =
    `translate(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px)) ` +
    `rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
  // crossfade con el logo del nav
  logo3d.style.opacity = p >= 0.985 ? '0' : '1';
  if (navLogo) {
    navLogo.style.opacity = e > 0.92 ? String(Math.min(1, (e - 0.92) / 0.08)) : '0';
  }
}

if (reduceMotion || !logo3dInner) {
  // sin animación: logo 3D oculto, logo del nav siempre visible
  if (logo3d) logo3d.style.display = 'none';
  if (navLogo) navLogo.style.opacity = '1';
}

// a) Barra de progreso + scrub del hero (fade al alejarte)
const progressFill = document.getElementById('progressFill');
const heroContent = document.querySelector('.hero-content');

function onScrolly() {
  // logo 3D: rotación y acople con el scroll
  if (!reduceMotion) updateLogo3d();
  // progreso de scroll 0-100%
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (progressFill) {
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressFill.style.width = pct + '%';
  }
  // hero: se desvanece y sube al hacer scroll
  if (heroContent && !reduceMotion) {
    const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    heroContent.style.opacity = String(Math.max(0, 1 - p * 1.15));
    heroContent.style.transform = `translate3d(0, ${p * -70}px, 0)`;
    heroContent.style.pointerEvents = p > 0.9 ? 'none' : '';
  }
}
let scrollyTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollyTicking) {
    requestAnimationFrame(() => { onScrolly(); scrollyTicking = false; });
    scrollyTicking = true;
  }
}, { passive: true });
onScrolly();

// b) Navegación por puntos: capítulo activo
const dots = document.querySelectorAll('.dots-nav a');
const dotIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = '#' + e.target.id;
    dots.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
['hero', 'about', 'process', 'services', 'gallery', 'quote', 'contact']
  .forEach(id => { const el = document.getElementById(id); if (el) dotIO.observe(el); });

// c) Pasos narrativos: activar paso + actualizar panel visual sticky
function swapPanel(panel, step) {
  const icon = panel.querySelector('.v-icon i');
  const title = panel.querySelector('.v-title');
  const text = panel.querySelector('.v-text');
  if (icon && step.dataset.vicon) icon.className = 'fas ' + step.dataset.vicon;
  if (title && step.dataset.vtitle) title.textContent = step.dataset.vtitle;
  if (text && step.dataset.vtext) text.textContent = step.dataset.vtext;
  // re-disparar animación de intercambio
  panel.querySelectorAll('.v-icon, .v-info').forEach(el => {
    el.classList.remove('swap');
    void el.offsetWidth; // force reflow
    el.classList.add('swap');
  });
}

const stepIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const step = e.target;
    const story = step.closest('.story');
    if (!story) return;
    if (e.isIntersecting) {
      // un solo paso activo por capítulo
      story.querySelectorAll('.story-step').forEach(s => s.classList.remove('is-active'));
      step.classList.add('is-active');
      const panel = story.querySelector('[data-panel]');
      if (panel) swapPanel(panel, step);
    }
  });
}, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
document.querySelectorAll('.story-step').forEach(s => stepIO.observe(s));

// d) Servicios: resaltar tarjeta cuando está centrada
const cardIO = new IntersectionObserver((entries) => {
  entries.forEach(e => e.target.classList.toggle('is-active', e.isIntersecting));
}, { threshold: 0.55 });
document.querySelectorAll('.service-card').forEach(c => cardIO.observe(c));

// e) Contadores animados (stats del hero)
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
  const dur = 1200;
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const countIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));