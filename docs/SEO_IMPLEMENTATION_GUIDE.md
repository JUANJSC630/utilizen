# Guía de Implementación SEO - UtiliZen

> **Documento de Referencia**
> Última actualización: Febrero 2026
> Stack: Laravel 12 + Inertia.js v2 + React 19 + Tailwind v4

---

## Estado Actual

### Implementado (95% completo)

| Funcionalidad | Estado | Descripción |
|---------------|--------|-------------|
| Meta Tags Dinámicos | ✅ | Title, description, keywords en todas las páginas |
| Open Graph | ✅ | og:title, og:description, og:url, og:image, og:type |
| Twitter Cards | ✅ | summary_large_image con título, descripción e imagen |
| JSON-LD Structured Data | ✅ | Organization, WebSite con SearchAction, SoftwareApplication |
| Canonical URLs | ✅ | URLs canónicas automáticas en todas las páginas |
| Sitemap XML | ✅ | Generación automática con todas las herramientas activas |
| NoIndex Auth Pages | ✅ | /login, /register, /dashboard tienen noindex,nofollow |
| Google Analytics 4 | ✅ | Componente listo (requiere configurar GA_ID) |
| Robots.txt | ✅ | Configurado con disallow y referencia al sitemap |
| Tests | ✅ | 18 tests de SEO (meta tags + sitemap) |

### Pendiente (configuración manual)

| Tarea | Estado | Descripción |
|-------|--------|-------------|
| Configurar GA4 ID | ⏳ | Agregar `VITE_GOOGLE_ANALYTICS_ID` en .env |
| Google Search Console | ⏳ | Verificar propiedad y enviar sitemap |
| Imagen OG | ⏳ | Crear `/public/og-image.png` (1200x630px) |
| Core Web Vitals | ⏳ | Monitorear y optimizar después del deploy |

---

## Paquetes Instalados

```json
{
  "artesaos/seotools": "^1.3",
  "spatie/laravel-sitemap": "^7.3"
}
```

---

## Archivos Creados

### Backend (PHP)

| Archivo | Propósito |
|---------|-----------|
| `app/Services/SeoService.php` | Servicio centralizado para toda la lógica SEO |
| `app/Console/Commands/GenerateSitemap.php` | Comando `php artisan sitemap:generate` |
| `app/Http/Middleware/NoIndexAuthPages.php` | Middleware para noindex en páginas de auth |
| `config/seotools.php` | Configuración del paquete seotools |
| `tests/Feature/Seo/MetaTagsTest.php` | Tests de meta tags, OG, Twitter, JSON-LD |
| `tests/Feature/Seo/SitemapTest.php` | Tests de generación de sitemap |

### Frontend (TypeScript/React)

| Archivo | Propósito |
|---------|-----------|
| `resources/js/components/analytics/google-analytics.tsx` | Componente GA4 con tracking de navegación Inertia |
| `resources/js/utils/analytics.ts` | Utilidades: trackEvent, trackToolUsage, trackConversion |

---

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `composer.json` | Agregados paquetes seotools y sitemap |
| `.env.example` | Variables SEO y GA4 |
| `config/services.php` | Configuración Google Search Console |
| `app/Http/Middleware/HandleInertiaRequests.php` | Inyecta SeoService, llama setDefaults() |
| `resources/views/app.blade.php` | Agregado `SEOTools::generate()` |
| `app/Http/Controllers/Web/HomeController.php` | Llama `setHomePage()` |
| `app/Http/Controllers/Web/ToolController.php` | Llama `setToolsIndex()` y `setToolPage()` |
| `bootstrap/app.php` | Registrado middleware NoIndexAuthPages |
| `routes/console.php` | Programado sitemap:generate diario a las 2am |
| `public/robots.txt` | Reglas de disallow y URL del sitemap |
| `resources/js/app.tsx` | Integrado componente GoogleAnalytics |

---

## Cómo Funciona

### 1. SeoService

El servicio `app/Services/SeoService.php` centraliza toda la lógica SEO:

```php
// En cualquier controlador
public function __construct(private SeoService $seoService) {}

public function index(): Response
{
    $this->seoService->setHomePage(); // Configura SEO para homepage
    return Inertia::render('welcome', [...]);
}

public function show(string $slug): Response
{
    $tool = Tool::where('slug', $slug)->firstOrFail();
    $this->seoService->setToolPage($tool); // SEO específico del tool
    return Inertia::render("tools/{$tool->component_name}", [...]);
}
```

**Métodos disponibles:**

| Método | Uso |
|--------|-----|
| `setDefaults()` | SEO global (llamado automáticamente en middleware) |
| `setHomePage()` | Homepage con WebSite schema + SearchAction |
| `setToolsIndex()` | Página /tools con CollectionPage schema |
| `setToolPage(Tool $tool)` | Página de herramienta con SoftwareApplication schema |
| `setStaticPage($title, $description)` | Páginas estáticas (about, privacy, etc.) |
| `setNoIndex()` | Agrega noindex,nofollow (llamado automáticamente en auth) |

### 2. JSON-LD Structured Data

Cada tipo de página tiene su propio schema:

**Homepage (`/`):**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "UtiliZen",
  "url": "https://utilizen.test",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://utilizen.test/tools?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Tool Page (`/tools/react-component-generator`):**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "React Component Generator",
  "description": "...",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### 3. Sitemap

El sitemap se genera con el comando:

```bash
php artisan sitemap:generate
```

**Se regenera automáticamente** cada día a las 2:00 AM (configurado en `routes/console.php`).

**Contenido del sitemap:**
- Homepage (priority 1.0, daily)
- /tools (priority 0.9, daily)
- /pricing (priority 0.7, monthly)
- /about, /privacy, /terms (priority 0.5-0.6)
- Todas las herramientas activas (priority 0.8, weekly)

### 4. Google Analytics 4

El componente `GoogleAnalytics` se carga automáticamente en `app.tsx` y:
- Carga el script de GA4 solo si `VITE_GOOGLE_ANALYTICS_ID` está configurado
- Trackea automáticamente la navegación SPA de Inertia
- Proporciona utilidades para eventos custom

**Uso de tracking custom:**
```tsx
import { trackToolUsage, trackConversion } from '@/utils/analytics';

// Cuando el usuario usa una herramienta
trackToolUsage('React Component Generator', 'generators');

// Cuando hay una conversión
trackConversion('signup', 0);
trackConversion('premium_upgrade', 9.00);
```

---

## Variables de Entorno

Agregar a tu archivo `.env`:

```env
# SEO Configuration (opcional - tienen valores por defecto)
SEO_SITE_NAME="UtiliZen"
SEO_DEFAULT_TITLE="UtiliZen - Professional Developer Tools"
SEO_DEFAULT_DESCRIPTION="Professional online tools for web developers. Create React components, validate props, and more."

# Google Analytics 4 (requerido para analytics)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Google Search Console (requerido para verificación)
GOOGLE_SEARCH_CONSOLE_VERIFICATION=tu-codigo-de-verificacion
```

---

## Tests

Ejecutar tests de SEO:

```bash
# Todos los tests de SEO
php artisan test tests/Feature/Seo/

# Solo meta tags
php artisan test tests/Feature/Seo/MetaTagsTest.php

# Solo sitemap
php artisan test tests/Feature/Seo/SitemapTest.php
```

**Tests incluidos (18 total):**

**MetaTagsTest (11 tests):**
- Meta tags correctos en homepage
- Meta tags específicos por herramienta
- NoIndex en páginas de auth (/login, /register, /dashboard)
- Canonical URLs correctas
- Open Graph tags
- Twitter Card tags
- JSON-LD WebSite schema en homepage
- JSON-LD SoftwareApplication schema en tools
- Fallback a name/description cuando meta_title/meta_description son null

**SitemapTest (7 tests):**
- Genera sitemap con homepage
- Incluye todas las herramientas activas
- Excluye herramientas inactivas
- Prioridades correctas
- Incluye páginas estáticas
- XML válido

---

## Verificación Manual

### 1. Ver Meta Tags en el Navegador

```bash
# Abrir en navegador y ver código fuente (Ctrl+U / Cmd+U)
https://utilizen.test/
https://utilizen.test/tools/react-component-generator
https://utilizen.test/login
```

**Buscar en el código fuente:**
- `<title>` - Título de la página
- `<meta name="description"` - Descripción
- `<link rel="canonical"` - URL canónica
- `<meta property="og:` - Open Graph tags
- `<meta name="twitter:` - Twitter Card tags
- `<script type="application/ld+json">` - JSON-LD
- `<meta name="robots" content="noindex,nofollow"` - Solo en auth pages

### 2. Validar Structured Data

1. Ir a [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Ingresar URL del sitio
3. Verificar que no haya errores en Organization, WebSite, SoftwareApplication

### 3. Verificar Sitemap

```bash
# Ver sitemap generado
cat public/sitemap.xml

# O en navegador
https://utilizen.test/sitemap.xml
```

### 4. Verificar Robots.txt

```bash
https://utilizen.test/robots.txt
```

Debe mostrar:
```
User-agent: *
Disallow: /dashboard
Disallow: /settings
Disallow: /api/
Disallow: /*.json$

Allow: /tools

Sitemap: https://utilizen.test/sitemap.xml
```

---

## Próximos Pasos (Manual)

### 1. Crear Imagen OG

Crear una imagen de 1200x630 píxeles y guardarla en:
```
public/og-image.png
```

Esta imagen aparecerá cuando compartan links en redes sociales.

### 2. Configurar Google Analytics 4

1. Ir a [Google Analytics](https://analytics.google.com)
2. Crear una propiedad GA4
3. Obtener el Measurement ID (formato: `G-XXXXXXXXXX`)
4. Agregar a `.env`:
   ```env
   VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```
5. Ejecutar `yarn run build`

### 3. Configurar Google Search Console

1. Ir a [Google Search Console](https://search.google.com/search-console)
2. Agregar propiedad con la URL del sitio
3. Seleccionar método "Etiqueta HTML"
4. Copiar el código de verificación
5. Agregar a `.env`:
   ```env
   GOOGLE_SEARCH_CONSOLE_VERIFICATION=tu-codigo
   ```
6. Click en "Verificar" en Search Console
7. Ir a Sitemaps → Agregar `sitemap.xml`

### 4. Rebuild Frontend

Después de configurar las variables de entorno:

```bash
yarn run build
```

### 5. Monitorear Core Web Vitals

Después del deploy a producción:
1. Esperar 28 días para datos en Search Console
2. Revisar Experience → Core Web Vitals
3. Usar [PageSpeed Insights](https://pagespeed.web.dev) para análisis inmediato

---

## Mantenimiento

### Automático

- **Sitemap**: Se regenera diariamente a las 2:00 AM
- **Meta tags**: Se actualizan dinámicamente desde la base de datos

### Manual (Recomendado mensualmente)

1. Revisar Google Search Console:
   - Index Coverage (objetivo: >95%)
   - Core Web Vitals
   - Mobile Usability

2. Actualizar meta_title y meta_description de herramientas populares

3. Verificar que nuevas herramientas tengan SEO completo

---

## Troubleshooting

### "Class SEOTools not found"

```bash
php artisan view:clear
composer dump-autoload
```

### Sitemap no se genera

```bash
# Verificar que el comando existe
php artisan list | grep sitemap

# Ejecutar manualmente
php artisan sitemap:generate
```

### GA4 no trackea

1. Verificar que `VITE_GOOGLE_ANALYTICS_ID` está en `.env`
2. Ejecutar `yarn run build`
3. Verificar en consola del navegador que no hay errores
4. Verificar en GA4 → Realtime que hay visitas

### JSON-LD no aparece

Verificar que el controlador llama al método correcto del SeoService:
```php
$this->seoService->setHomePage();     // Para homepage
$this->seoService->setToolPage($tool); // Para herramientas
```

---

## Referencias

- [artesaos/seotools](https://github.com/artesaos/seotools)
- [spatie/laravel-sitemap](https://github.com/spatie/laravel-sitemap)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org)
- [Open Graph Protocol](https://ogp.me)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
