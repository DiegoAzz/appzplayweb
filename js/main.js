/**
 * AppzPlay — Script Dinámico para Landing Page y Calculadora de Alquiler Web + Servicios
 */

let siteContent = null;
let selectedServices = new Set();

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  await fetchContent();
  initMobileMenu();
  initDynamicUI();
  initRentalCalculator();
  initFAQ();
});

// Cargar contenido desde la API o usar datos por defecto
async function fetchContent() {
  try {
    const res = await fetch('/api/content');
    if (res.ok) {
      siteContent = await res.json();
    }
  } catch (e) {
    console.warn('Usando configuración local por defecto');
  }

  // Fallback si la API no estuviera disponible
  if (!siteContent || !siteContent.general) {
    siteContent = getDefaultFallbackContent();
  }
}

function openWhatsApp(customText) {
  const phone = (siteContent && siteContent.general && siteContent.general.whatsappPhone) || '573000000000';
  const defaultMsg = '¡Hola AppzPlay! Me interesa alquilar una página web para mi negocio y conocer los servicios adicionales.';
  const msg = encodeURIComponent(customText || defaultMsg);
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

// Menú Móvil
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(l => {
      l.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }
}

// Renderizado Dinámico de la UI
function initDynamicUI() {
  if (!siteContent) return;

  const g = siteContent.general || {};
  const h = siteContent.hero || {};

  // Textos Generales
  const brandNameEls = document.querySelectorAll('.dyn-brand-name');
  brandNameEls.forEach(el => el.textContent = g.siteName || 'AppzPlay');

  const brandTaglineEls = document.querySelectorAll('.dyn-brand-tagline');
  brandTaglineEls.forEach(el => el.textContent = g.siteTagline || 'Páginas Web & Servicios en Alquiler');

  const statusEl = document.getElementById('dyn-server-status');
  if (statusEl) statusEl.textContent = g.serverStatusText || 'VPS 100% Operativo';

  const annBarEl = document.getElementById('dyn-announcement-bar');
  if (annBarEl && g.announcementText) {
    annBarEl.innerHTML = `
      <span class="flex h-2 w-2 rounded-full bg-cyan-400"></span>
      <span>${g.announcementText}</span>
      <span class="text-xs bg-cyan-500/20 px-2 py-0.5 rounded-md text-cyan-200">${g.announcementBadge || '100% Accesible'}</span>
    `;
  }

  // Hero
  const heroL1 = document.getElementById('dyn-hero-l1');
  const heroL2 = document.getElementById('dyn-hero-l2');
  const heroL3 = document.getElementById('dyn-hero-l3');
  const heroSub = document.getElementById('dyn-hero-sub');
  if (heroL1) heroL1.textContent = h.titleLine1 || 'Tu Página Web Profesional';
  if (heroL2) heroL2.textContent = h.titleLine2 || 'en Alquiler Mensual';
  if (heroL3) heroL3.textContent = h.titleLine3 || 'y Servicios a tu Medida.';
  if (heroSub) heroSub.textContent = h.subtitle || '';

  // Menús (Solo los activos)
  renderNavMenus();

  // Planes de Páginas Web Base
  renderWebPlans();

  // Servicios Adicionales (Solo los ACTIVOS)
  renderServicesCatalog();

  // FAQs
  renderFaqAccordion();

  lucide.createIcons();
}

// Menús de Navegación
function renderNavMenus() {
  const desktopNav = document.getElementById('dyn-desktop-menu');
  const mobileNav = document.getElementById('dyn-mobile-menu-links');
  if (!desktopNav) return;

  desktopNav.innerHTML = '';
  if (mobileNav) mobileNav.innerHTML = '';

  const activeMenus = (siteContent.menu || []).filter(m => m.enabled);
  activeMenus.forEach(m => {
    // Desktop
    const a = document.createElement('a');
    a.href = m.url;
    a.className = 'hover:text-cyan-400 transition-colors';
    a.textContent = m.label;
    desktopNav.appendChild(a);

    // Mobile
    if (mobileNav) {
      const mobA = document.createElement('a');
      mobA.href = m.url;
      mobA.className = 'block text-slate-300 hover:text-cyan-400 font-medium';
      mobA.textContent = m.label;
      mobileNav.appendChild(mobA);
    }
  });
}

// Render Planes Web
function renderWebPlans() {
  const container = document.getElementById('dyn-web-plans-container');
  if (!container) return;

  container.innerHTML = '';
  (siteContent.webPlans || []).forEach(plan => {
    const card = document.createElement('div');
    card.className = `glass-card rounded-3xl p-8 flex flex-col justify-between relative ${plan.featured ? 'border-cyan-400/50 bg-gradient-to-b from-slate-900/90 via-cyan-950/30 to-slate-900/90 glow-cyan-border' : ''}`;
    
    if (plan.featured) {
      card.innerHTML += `
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-[11px] font-black uppercase tracking-wider text-white shadow-lg">
          Más Elegido por Negocios 🔥
        </div>
      `;
    }

    let featuresHtml = '';
    (plan.features || []).forEach(f => {
      featuresHtml += `
        <li class="flex items-start gap-2.5">
          <span class="text-cyan-400 font-bold">✔</span>
          <span class="text-slate-300 text-xs sm:text-sm">${f}</span>
        </li>
      `;
    });

    card.innerHTML += `
      <div>
        <div class="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">${plan.name}</div>
        <h3 class="text-2xl font-black text-white">${plan.subtitle || 'Página Web en Alquiler'}</h3>
        <div class="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
          ${plan.setup || '$0 costo de diseño'}
        </div>

        <div class="my-6">
          <span class="text-4xl sm:text-5xl font-extrabold text-white">$${plan.price}</span>
          <span class="text-xs text-slate-400">USD / mes</span>
        </div>

        <ul class="space-y-3 pt-4 border-t border-white/10">
          ${featuresHtml}
        </ul>
      </div>

      <button onclick="openWhatsApp('¡Hola! Quiero alquilar el servicio de ${plan.name} ($${plan.price} USD/mes) para mi negocio.')" class="mt-8 w-full py-3.5 rounded-xl font-bold text-xs transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${plan.featured ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'}">
        <i data-lucide="message-circle" class="w-4 h-4"></i>
        <span>Alquilar esta Página Web</span>
      </button>
    `;

    container.appendChild(card);
  });
}

// Render Servicios Adicionales (Solo los ACTIVOS)
function renderServicesCatalog() {
  const container = document.getElementById('dyn-services-container');
  if (!container) return;

  container.innerHTML = '';
  // Filtramos solo los que están enabled = true
  const activeServices = (siteContent.services || []).filter(s => s.enabled);

  if (activeServices.length === 0) {
    container.innerHTML = `
      <div class="col-span-3 text-center py-12 text-slate-400">
        Próximamente más servicios adicionales disponibles.
      </div>
    `;
    return;
  }

  activeServices.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'glass-card rounded-3xl p-7 flex flex-col justify-between';

    let featuresHtml = '';
    (svc.features || []).forEach(f => {
      featuresHtml += `
        <li class="flex items-center gap-2 text-xs text-slate-300">
          <span class="text-emerald-400 font-bold">✔</span>
          <span>${f}</span>
        </li>
      `;
    });

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            ${svc.badge || 'Servicio Adicional'}
          </span>
          <span class="text-xs font-bold text-emerald-400">
            + $${svc.monthlyPrice} USD/mes
          </span>
        </div>

        <h3 class="text-xl font-bold text-white">${svc.title}</h3>
        <p class="text-xs text-slate-400 mt-2 leading-relaxed">${svc.description}</p>

        <ul class="mt-4 space-y-2 pt-3 border-t border-white/5">
          ${featuresHtml}
        </ul>
      </div>

      <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div>
          <span class="text-[11px] text-slate-400 block">Cuota Adicional:</span>
          <span class="text-xl font-extrabold text-white">+$${svc.monthlyPrice} <span class="text-[10px] text-slate-400">USD/mes</span></span>
        </div>
        <button onclick="openWhatsApp('¡Hola! Me gustaría agregar el módulo de ${svc.title} (+$${svc.monthlyPrice}/mes) a mi página web.')" class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20 flex items-center gap-1.5">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          <span>Agregar a mi Alquiler</span>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Calculadora Interactiva de Cuota (Página Web + Servicios Adicionales)
function initRentalCalculator() {
  const webSelect = document.getElementById('calc-web-select');
  const servicesCheckboxes = document.getElementById('calc-addons-container');
  const displayTotal = document.getElementById('calc-total-display');
  const displayDetail = document.getElementById('calc-detail-display');
  const waCalcBtn = document.getElementById('calc-wa-action');

  if (!webSelect || !servicesCheckboxes) return;

  // Llenar select de páginas web
  webSelect.innerHTML = '';
  (siteContent.webPlans || []).forEach((wp, idx) => {
    const opt = document.createElement('option');
    opt.value = wp.price;
    opt.dataset.name = wp.name;
    opt.textContent = `${wp.name} — $${wp.price} USD/mes`;
    webSelect.appendChild(opt);
  });

  // Llenar checkboxes de servicios adicionales activos
  servicesCheckboxes.innerHTML = '';
  const activeServices = (siteContent.services || []).filter(s => s.enabled);
  activeServices.forEach((svc, idx) => {
    const label = document.createElement('label');
    label.className = 'flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer hover:border-cyan-500/30 transition-colors';
    label.innerHTML = `
      <div class="flex items-center gap-3">
        <input type="checkbox" class="calc-addon-cb w-4 h-4 rounded text-cyan-500 bg-slate-800" data-price="${svc.monthlyPrice}" data-title="${svc.title}">
        <span class="text-xs sm:text-sm text-slate-300">${svc.title}</span>
      </div>
      <span class="text-xs font-bold text-cyan-400">+ $${svc.monthlyPrice}/mes</span>
    `;
    servicesCheckboxes.appendChild(label);
  });

  function recalculate() {
    const basePrice = Number(webSelect.value) || 15;
    const selectedOption = webSelect.options[webSelect.selectedIndex];
    const baseName = selectedOption ? selectedOption.dataset.name : 'Página Web';

    let addonsTotal = 0;
    const addedTitles = [];

    document.querySelectorAll('.calc-addon-cb:checked').forEach(cb => {
      const p = Number(cb.getAttribute('data-price')) || 0;
      addonsTotal += p;
      addedTitles.push(cb.getAttribute('data-title'));
    });

    const totalMonth = basePrice + addonsTotal;

    if (displayTotal) displayTotal.textContent = `$${totalMonth}`;
    if (displayDetail) {
      if (addedTitles.length === 0) {
        displayDetail.textContent = `${baseName} ($${basePrice}/mes)`;
      } else {
        displayDetail.textContent = `${baseName} + ${addedTitles.length} servicio(s) adicional(es)`;
      }
    }

    if (waCalcBtn) {
      waCalcBtn.onclick = () => {
        let text = `¡Hola AppzPlay! Calculé mi plan en la web: Deseo alquilar ${baseName} ($${basePrice}/mes)`;
        if (addedTitles.length > 0) {
          text += ` con los módulos adicionales: ${addedTitles.join(', ')}. Total estimado: $${totalMonth} USD/mes. ¿Podemos coordinar la puesta en marcha?`;
        } else {
          text += `. Total: $${totalMonth} USD/mes. ¿Cómo empezamos?`;
        }
        openWhatsApp(text);
      };
    }
  }

  webSelect.addEventListener('change', recalculate);
  document.querySelectorAll('.calc-addon-cb').forEach(cb => cb.addEventListener('change', recalculate));
  recalculate();
}

// FAQs
function renderFaqAccordion() {
  const container = document.getElementById('dyn-faq-container');
  if (!container) return;

  container.innerHTML = '';
  (siteContent.faq || []).forEach(f => {
    const item = document.createElement('div');
    item.className = 'faq-item glass-card-static rounded-2xl border-white/10 p-5';
    item.innerHTML = `
      <button class="faq-question w-full flex items-center justify-between text-left font-bold text-white text-base">
        <span>${f.question}</span>
        <i data-lucide="chevron-down" class="faq-icon w-5 h-5 text-cyan-400 transition-transform duration-300"></i>
      </button>
      <div class="faq-answer hidden mt-3 text-sm text-slate-300 border-t border-white/10 pt-3 leading-relaxed">
        ${f.answer}
      </div>
    `;
    container.appendChild(item);
  });
}

function initFAQ() {
  document.addEventListener('click', (e) => {
    const qBtn = e.target.closest('.faq-question');
    if (!qBtn) return;
    const parent = qBtn.closest('.faq-item');
    const answer = parent.querySelector('.faq-answer');
    const icon = parent.querySelector('.faq-icon');

    const isOpen = !answer.classList.contains('hidden');
    // Cerrar los otros
    document.querySelectorAll('.faq-item').forEach(other => {
      other.querySelector('.faq-answer')?.classList.add('hidden');
      const oIcon = other.querySelector('.faq-icon');
      if (oIcon) oIcon.style.transform = 'rotate(0deg)';
    });

    if (!isOpen) {
      answer.classList.remove('hidden');
      if (icon) icon.style.transform = 'rotate(180deg)';
    }
  });
}

// Fallback inicial
function getDefaultFallbackContent() {
  return {
    general: {
      siteName: "AppzPlay",
      siteTagline: "Páginas Web & Servicios en Alquiler",
      whatsappPhone: "573000000000",
      serverStatusText: "VPS 100% Operativo",
      announcementText: "🚀 Tu Página Web Lista Sin Costo Inicial: Paga solo una cuota mensual accesible",
      announcementBadge: "Modelo de Alquiler"
    },
    menu: [
      { id: "m1", label: "Páginas Web en Alquiler", url: "#web-alquiler", enabled: true },
      { id: "m2", label: "Servicios Adicionales", url: "#servicios-adicionales", enabled: true },
      { id: "m3", label: "¿Por qué Alquilar?", url: "#por-que-alquilar", enabled: true },
      { id: "m4", label: "Calculadora de Cuota", url: "#calculadora", enabled: true },
      { id: "m5", label: "Preguntas Frecuentes", url: "#faq", enabled: true }
    ],
    hero: {
      titleLine1: "Tu Página Web Profesional",
      titleLine2: "en Alquiler Mensual",
      titleLine3: "y Servicios a tu Medida.",
      subtitle: "No pagues $1,500 o $3,000 USD de golpe. Te creamos tu sitio web profesional por una cuota mensual mínima y fija. Y si necesitas más, sumas servicios adicionales (pedidos, citas, IA) cuando tu negocio lo requiera.",
      ctaTextPrimary: "Alquilar mi Página Web",
      ctaTextSecondary: "Ver Servicios Adicionales"
    },
    webPlans: [
      {
        id: "web-landing",
        name: "Página Web Esencial",
        subtitle: "Ideal para presencia profesional y captar clientes",
        price: 15,
        period: "USD / mes",
        setup: "$0 costo de diseño",
        featured: false,
        features: [
          "Diseño web One-Page moderno y adaptado a móviles",
          "Alojamiento VPS de alta velocidad y SSL gratis",
          "Botón de WhatsApp y llamadas a la acción",
          "Mantenimiento continuo y cambios mensuales incluidos",
          "Sin permanencia obligatoria, cancela cuando quieras"
        ]
      },
      {
        id: "web-pro",
        name: "Página Web Comercial Pro",
        subtitle: "Para negocios que quieren dominar su mercado",
        price: 25,
        period: "USD / mes",
        setup: "$0 costo de diseño",
        featured: true,
        features: [
          "Sitio web completo multi-sección con diseño a medida",
          "Dominio propio .com incluido",
          "Optimización de velocidad y SEO en Google",
          "Formularios de contacto y cotización interactivos",
          "VPS dedicado y copias de seguridad automáticas diarias",
          "Soporte prioritario 7 días a la semana"
        ]
      }
    ],
    services: [
      {
        id: "comidaya",
        title: "Módulo ComidaYa (Restaurantes & Delivery)",
        monthlyPrice: 19,
        badge: "Gastronomía 🔥",
        description: "Menú digital QR interactivo, pedidos a WhatsApp, pantalla de cocina KDS y tickets térmicos sin pagar comisiones de apps externas.",
        enabled: true,
        features: ["Menú QR mesas y redes", "KDS cocina en vivo", "Tickets térmicos ESC/POS", "0% comisiones de venta"]
      },
      {
        id: "turnoya",
        title: "Módulo TurnoYa (Citas & Reservas)",
        monthlyPrice: 15,
        badge: "Para Profesionales ⭐",
        description: "Tus clientes reservan citas online 24/7 con recordatorios automáticos por WhatsApp para barberías, clínicas y spas.",
        enabled: true,
        features: ["Reservas online 24/7", "Recordatorios WhatsApp", "Gestión de especialistas", "Panel de ingresos"]
      },
      {
        id: "newsflow",
        title: "Módulo NewsFlow AI (Noticias IA)",
        monthlyPrice: 25,
        badge: "Full IA ⚡",
        description: "Monitorea noticias y redacta artículos automáticos optimizados para SEO sin necesidad de redactores manuales.",
        enabled: true,
        features: ["Monitoreo de fuentes 24/7", "Reescritura IA", "Publicación programada", "Contenido continuo"]
      }
    ],
    faq: []
  };
}
