/**
 * AppzPlay — Script de Interactividad y Calculadora de Alquiler de SaaS
 */

// Datos de las aplicaciones en catálogo de alquiler
const appsData = {
  comidaya: {
    id: 'comidaya',
    title: 'ComidaYa — SaaS Gastronómico & Delivery',
    tagline: 'Tu propio canal de pedidos web sin comisiones abusivas',
    category: 'gastronomia',
    rentPrice: 19,
    setupTime: 'Menos de 24 horas',
    traditionalCost: 'USD $3,500 + $120/mes',
    icon: 'utensils',
    badge: 'Más Alquilado 🔥',
    features: [
      'Menú digital interactivo con código QR para mesas y redes',
      'Carrito de pedidos directo a WhatsApp o panel administrativo',
      'Pantalla de cocina KDS (Kitchen Display) en tiempo real',
      'Impresión de comandas térmicas automática (ESC/POS 80mm/58mm)',
      'Ahorro del 25% al 30% en comisiones de apps externas',
      'Incluye hosting en VPS ultrarrápido y certificado SSL'
    ],
    tech: 'Next.js 16 + React 19 + Prisma + PostgreSQL + Tailwind CSS',
    demoUrl: '#demo-comidaya',
    summary: 'Diseñado para restaurantes, dark kitchens, pizzerías, hamburgueserías y food trucks. Olvídate de pagar 30% a apps de terceros.'
  },
  turnoya: {
    id: 'turnoya',
    title: 'TurnoYa — Agenda & Reservas Inteligentes',
    tagline: 'Gestión automatizada de citas y turnos para profesionales',
    category: 'citas',
    rentPrice: 15,
    setupTime: 'Menos de 12 horas',
    traditionalCost: 'USD $2,800 + $90/mes',
    icon: 'calendar-check',
    badge: 'Popular ⭐',
    features: [
      'Portal web público de reservas disponible 24/7 para tus clientes',
      'Notificaciones y recordatorios automáticos por WhatsApp',
      'Gestión de múltiples profesionales, horarios y servicios',
      'Control de aforo, cancelaciones y reprogramaciones en 1 clic',
      'Panel de métricas: ingresos, horas pico y clientes recurrentes',
      'Subdominio seguro y mantenimiento en VPS incluido'
    ],
    tech: 'Next.js + Prisma ORM + Tailwind + Docker VPS',
    demoUrl: '#demo-turnoya',
    summary: 'Ideal para barberías, salones de belleza, spas, consultorios médicos, clínicas dentales y profesionales independientes.'
  },
  newsflow: {
    id: 'newsflow',
    title: 'NewsFlow AI — Generador de Noticias Automatizado',
    tagline: 'Tu sala de redacción potenciada por Inteligencia Artificial',
    category: 'ia',
    rentPrice: 25,
    setupTime: '24 horas',
    traditionalCost: 'USD $4,200 + $150/mes',
    icon: 'bot',
    badge: 'IA Avanzada ⚡',
    features: [
      'Monitoreo continuo de fuentes RSS, agencias y tendencias en vivo',
      'Reescritura y optimización SEO automática con modelos IA',
      'Publicación y programación automática en tu portal web',
      'Categorización de noticias, resúmenes y extracción de palabras clave',
      'Generación de imágenes o metadatos de alto impacto',
      'Infraestructura aislada con Gateway de seguridad AppzPlay'
    ],
    tech: 'FastAPI / Node + IA LLM + Traefik Shield + Tailwind',
    demoUrl: '#demo-newsflow',
    summary: 'La solución perfecta para medios de comunicación, blogs temáticos, portales regionales y creadores de contenido digital.'
  },
  spextractor: {
    id: 'spextractor',
    title: 'SpExtractor — Suite de Extracción & Procesamiento',
    tagline: 'Automatización de datos masivos y flujos de trabajo',
    category: 'ia',
    rentPrice: 22,
    setupTime: '24 horas',
    traditionalCost: 'USD $3,100 + $100/mes',
    icon: 'database',
    badge: 'Productividad 🚀',
    features: [
      'Extracción inteligente de información desde múltiples fuentes',
      'Exportación estructurada a Excel, JSON, CSV o API REST',
      'Procesamiento en segundo plano de alto rendimiento',
      'Alertas automáticas ante cambios de datos monitoreados',
      'Módulo de escritorio o integración en la nube privada'
    ],
    tech: 'Wails / Go + Java Core + Modern UI',
    demoUrl: '#demo-spextractor',
    summary: 'Diseñado para empresas y analistas que necesitan procesar listados, catálogos o registros sin digitación manual.'
  },
  customapp: {
    id: 'customapp',
    title: 'Tu Aplicación a Medida (Modelo de Alquiler)',
    tagline: '¿Necesitas algo único para tu nicho? La creamos y la alquilas.',
    category: 'custom',
    rentPrice: 35,
    setupTime: '3 a 7 días hábiles',
    traditionalCost: 'USD $6,000 - $15,000 upfront',
    icon: 'sparkles',
    badge: 'Bajo Demanda 💡',
    features: [
      'Sin costo astronómico de desarrollo inicial ($0 de inversión riesgosa)',
      'Desarrollo rápido adaptado al flujo de trabajo exacto de tu negocio',
      'Mantenimiento continuo, soporte directo y nuevas versiones incluidas',
      'Alojada en tu propio contenedor VPS aislado y seguro',
      'Si tu negocio escala, la app crece contigo sin costos sorpresas'
    ],
    tech: 'Fullstack Moderno + VPS Docker + Soporte Dedicado',
    demoUrl: '#demo-custom',
    summary: '¿Tienes una idea o necesidad específica para tu comunidad o rubro? No te endeudes mandándola a hacer: nosotros la desarrollamos y te la alquilamos a un precio justo.'
  }
};

// Configuración de WhatsApp
const WHATSAPP_PHONE = '573000000000'; // Puedes reemplazarlo con tu número oficial

function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, '_blank');
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCatalogFilters();
  initRentalCalculator();
  initFAQ();
  initModal();
});

// Menú Móvil
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const links = mobileMenu.querySelectorAll('a');
    links.forEach(l => {
      l.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }
}

// Filtro de catálogo
function initCatalogFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.app-card-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Calculadora Interactiva de Alquiler
function initRentalCalculator() {
  const appSelector = document.getElementById('calc-app-select');
  const customDomainCheck = document.getElementById('calc-domain');
  const vipSupportCheck = document.getElementById('calc-vip');
  const billingPeriod = document.getElementById('calc-period');

  const displayMonthlyRent = document.getElementById('calc-display-rent');
  const displayTradCost = document.getElementById('calc-display-trad');
  const displaySavings = document.getElementById('calc-display-savings');
  const calcAppName = document.getElementById('calc-selected-name');

  function updateCalculation() {
    if (!appSelector) return;
    const appId = appSelector.value;
    const app = appsData[appId] || appsData.comidaya;
    
    let baseMonthly = app.rentPrice;
    let addOns = 0;

    if (customDomainCheck && customDomainCheck.checked) {
      addOns += 3;
    }
    if (vipSupportCheck && vipSupportCheck.checked) {
      addOns += 7;
    }

    const isAnnual = billingPeriod && billingPeriod.value === 'annual';
    let finalMonthly = baseMonthly + addOns;

    if (isAnnual) {
      // 20% descuento por pago anual
      finalMonthly = Math.round(finalMonthly * 0.8);
    }

    const annualRentTotal = finalMonthly * 12;
    // Tradicional promedio: $3500 setup + ($120 * 12 = $1440) = $4940
    let tradTotalYear = 3500 + (120 * 12);
    if (appId === 'newsflow') tradTotalYear = 4200 + (150 * 12);
    if (appId === 'turnoya') tradTotalYear = 2800 + (90 * 12);
    if (appId === 'customapp') tradTotalYear = 7000 + (150 * 12);

    const savingsFirstYear = Math.max(0, tradTotalYear - annualRentTotal);

    if (displayMonthlyRent) displayMonthlyRent.textContent = `$${finalMonthly}`;
    if (calcAppName) calcAppName.textContent = app.title;
    if (displayTradCost) displayTradCost.textContent = `$${tradTotalYear.toLocaleString()}`;
    if (displaySavings) displaySavings.textContent = `$${savingsFirstYear.toLocaleString()}`;
  }

  if (appSelector) appSelector.addEventListener('change', updateCalculation);
  if (customDomainCheck) customDomainCheck.addEventListener('change', updateCalculation);
  if (vipSupportCheck) vipSupportCheck.addEventListener('change', updateCalculation);
  if (billingPeriod) billingPeriod.addEventListener('change', updateCalculation);

  updateCalculation();
}

// Modal de detalles y demo
function initModal() {
  const modal = document.getElementById('app-detail-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const actionButtons = document.querySelectorAll('.open-app-modal-btn');

  if (!modal) return;

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const appId = btn.getAttribute('data-app-id');
      const app = appsData[appId];
      if (!app) return;

      document.getElementById('modal-title').textContent = app.title;
      document.getElementById('modal-tagline').textContent = app.tagline;
      document.getElementById('modal-price').textContent = `$${app.rentPrice} USD/mes`;
      document.getElementById('modal-time').textContent = app.setupTime;
      document.getElementById('modal-tech').textContent = app.tech;
      document.getElementById('modal-trad').textContent = app.traditionalCost;

      const featuresContainer = document.getElementById('modal-features-list');
      featuresContainer.innerHTML = '';
      app.features.forEach(f => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2 text-slate-300 text-sm';
        li.innerHTML = `<span class="text-emerald-400 mt-0.5">✔</span> <span>${f}</span>`;
        featuresContainer.appendChild(li);
      });

      const rentBtn = document.getElementById('modal-rent-wa-btn');
      rentBtn.onclick = () => {
        openWhatsApp(`¡Hola AppzPlay! Quiero alquilar el servicio de ${app.title} ($${app.rentPrice}/mes). ¿Podemos coordinar la puesta en marcha para mi negocio?`);
      };

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });
}

// Preguntas Frecuentes
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = !answer.classList.contains('hidden');
        // Cerrar todos los demás
        faqItems.forEach(other => {
          other.querySelector('.faq-answer')?.classList.add('hidden');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          answer.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
}

// Toast Notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm animate-bounce';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}
