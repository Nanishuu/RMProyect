# RMSOUND Web

![RMSOUND](assets/img/reel1.jpg)

Sitio web estático para RMSOUND: sonido profesional para eventos, iluminación, pantallas LED, escenarios y producción integral. Diseño editorial moderno con scrollytelling por capítulos.

## Archivos
- `index.html` — estructura del sitio
- `styles.css` — estilos (negro/morado, luces neon, tipografía display, marquee)
- `script.js` — interactividad, scrollytelling, cotización
- `assets/img/` — imágenes descargadas de Instagram (@rmsound)

## Estructura de la página
1. **Hero** — tipografía display gigante ("Tu próximo show en vivo.") + marquee de servicios
2. **[ Métricas ]** — contadores animados (+10 años, 500+ eventos)
3. **[ Nosotros ]** — capítulo scrollytelling con pantalla LED sticky y pasos [001]–[004]
4. **[ Proceso ]** — capítulo scrollytelling (exploración → diseño → producción → show)
5. **[ Servicios ]** — tarjetas numeradas 01–06
6. **[ Galería ]** — eventos realizados
7. **[ Testimonios ]** — citas de clientes
8. **[ FAQ ]** — acordeones (uno abierto a la vez)
9. **[ Cotiza ]** — formulario con checklist, vista previa de montaje y envío (fondo blanco)
10. **CTA gigante** — "Hagámoslo ↗"
11. **[ Contacto ] + Footer** — cierre con display gigante "Shows de alto nivel"

Detalles scrollytelling: barra de progreso superior, navegación por puntos lateral, panel visual que cambia según el paso activo, scrub del hero, decoraciones laterales temáticas (solo desktop ≥1100px) y contadores animados. Todo respeta `prefers-reduced-motion`.

## Configuración
Edita en `script.js`:
- `WHATSAPP_NUMBER` (por defecto `584144533064`)
- `CONTACT_EMAIL` (por defecto `contacto@rmsound.com`, cámbialo por el correo real)

La sección de cotización genera un mensaje y lo envía por WhatsApp y correo (mailto). También permite copiar al portapapeles.

## Ejecutar
Abre `index.html` en el navegador, o sirve la carpeta con cualquier servidor estático.

## Despliegue
Sube la carpeta completa (incluyendo `assets/`) a tu hosting (Netlify, Vercel, GitHub Pages, etc.).
