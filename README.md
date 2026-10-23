# ⚡ AppzPlay — Plataforma Web de Alquiler de Software SaaS

Sitio web oficial One-Page de **AppzPlay** (`https://appzplay.online/`), diseñado con una estética moderna **Dark Cyber-Glassmorphism** y optimizado para el **modelo 100% de Alquiler / Suscripción** de aplicaciones para la comunidad y negocios locales.

---

## 🎯 Modelo de Negocio: "En vez de comprar, se alquila todo"

* **$0 Inversión Inicial:** Sin anticipos de desarrollo tradicionales de \$3,000 - \$8,000 USD.
* **Cuotas mensuales accesibles para la comunidad:** Alquiler desde \$15 a \$25 USD/mes.
* **Todo Incluido:** Alojamiento en VPS de alto rendimiento, subdominio/dominio, SSL automático, copias de seguridad diarias y soporte continuo.
* **Entrega rápida:** Puesta en marcha en menos de 24 horas.
* **Sin contratos forzosos:** Cancelación o cambio de app cuando el cliente lo desee.

---

## 📂 Aplicaciones Destacadas en el Catálogo

1. **ComidaYa ($19 USD/mes):** SaaS para restaurantes, dark kitchens y comida rápida. Pedidos QR, pantalla de cocina KDS y tickets ESC/POS sin pagar comisiones a apps de delivery.
2. **TurnoYa ($15 USD/mes):** Sistema de reservas y citas online con recordatorios automáticos por WhatsApp para salones, barberías, spas y consultorios.
3. **NewsFlow AI ($25 USD/mes):** Automatización inteligente de noticias y redacción asistida por Inteligencia Artificial para blogs y portales de medios.
4. **SpExtractor ($22 USD/mes):** Procesamiento y extracción masiva de datos estructurados para catálogos y empresas.
5. **App a Medida en Alquiler (Desde $35 USD/mes):** Desarrollo de soluciones personalizadas bajo el mismo modelo de cuota mensual, sin riesgo de capital.

---

## 🛠️ Tecnologías y Características del Sitio

- **One-Page Ultrarrápido:** Carga instantánea (&lt;100ms) sin dependencias pesadas de framework.
- **Tailwind CSS + Glassmorphism:** Efectos neón, fondos de malla cibernética, tarjetas traslúcidas con desenfoque de fondo y diseño 100% responsivo para móviles y escritorio.
- **Calculadora Interactiva de Alquiler:** El usuario calcula en tiempo real su cuota mensual y visualiza cuánto dinero se ahorra en el año frente a comprar software tradicional.
- **Filtros Dinámicos del Catálogo:** Filtrado instantáneo por categoría (Gastronomía, Turnos, IA, A Medida).
- **Modal Interactivo "Ficha & Demo":** Ventana emergente con especificaciones técnicas, beneficios y botón directo a WhatsApp.
- **Preguntas Frecuentes (FAQ):** Acordeón interactivo para resolver dudas y derribar objeciones.
- **Botón Flotante de WhatsApp:** Con mensaje personalizado prellenado.

---

## 🚀 Despliegue en tu VPS

### Opción 1: En Coolify (Recomendado)
1. En tu panel de **Coolify**, crea un nuevo recurso: **Service** o **Application**.
2. Conecta este repositorio o selecciona **Docker Compose**.
3. El archivo `docker-compose.yml` ya incluye la red `coolify` y las etiquetas de **Traefik** para apuntar automáticamente a `appzplay.online` con certificado SSL Let's Encrypt automático.
4. Haz clic en **Deploy**. ¡Listo en segundos!

### Opción 2: Docker Compose Directo en el VPS (Standalone)
Si no usas Coolify y quieres levantarlo directamente en tu servidor Linux:
```bash
# Copia la carpeta al servidor y ejecuta:
docker compose -f docker-compose.standalone.yml up -d --build
```

### Opción 3: Servidor Web Nginx / Caddy Nativo
Copia el contenido (`index.html`, `css/`, `js/`, `assets/`) al directorio `/var/www/appzplay` de tu VPS y apunta tu configuración de Nginx al archivo `index.html`.

---

## ⚙️ Cómo Personalizar tu Número de WhatsApp

En el archivo `js/main.js`, en la línea **101**:
```javascript
const WHATSAPP_PHONE = '573000000000'; // <- Coloca aquí tu número con código de país (sin el signo + ni espacios)
```
Ejemplo para Colombia: `'573101234567'`, México: `'5215512345678'`, etc.

---

## 📁 Estructura del Proyecto

```text
appzplay/
├── css/
│   └── styles.css                 # Estilos personalizados, gradientes y efectos glassmorphism
├── js/
│   └── main.js                    # Calculadora de alquiler, filtros, modal y WhatsApp
├── assets/                        # Imágenes, logotipos e iconos
├── index.html                     # Landing page One-Page completa
├── nginx.conf                     # Configuración de Nginx con compresión gzip y caché
├── Dockerfile                     # Contenedor ligero Alpine Nginx para producción
├── docker-compose.yml             # Despliegue listo para Coolify / Traefik
├── docker-compose.standalone.yml  # Despliegue listo para Docker puro en VPS
└── README.md                      # Documentación del proyecto
```
