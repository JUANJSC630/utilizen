# Guía de Implementación SEO Completo - UtiliZen

> **Documento de Referencia Permanente**
> Última actualización: Diciembre 2025
> Stack: Laravel 12 + Inertia.js v2 + React 19 + Tailwind v4

---

## Resumen Ejecutivo

Implementación completa de SEO técnico para UtiliZen usando paquetes probados de Laravel:
- **artesaos/seotools**: Meta tags dinámicos, Open Graph, Twitter Cards, JSON-LD
- **spatie/laravel-sitemap**: Generación automática de sitemap XML
- **Google Analytics 4**: Tracking de visitas y conversiones
- **Google Search Console**: Monitoreo de indexación y Core Web Vitals

**Estado Actual**: SEO básico (40% completo)
- ✅ Meta tags básicos en PublicLayout
- ✅ Campos SEO en modelo Tool (meta_title, meta_description, keywords)
- ❌ Sin structured data, canonical tags, sitemap dinámico

**Objetivo**: SEO técnico completo para alcanzar 50,000 visitas/mes

---

## Tabla de Contenidos

1. [Fase 1: Instalación de Paquetes](#fase-1-instalación-de-paquetes-y-configuración-base)
2. [Fase 2: Servicio SEO Centralizado](#fase-2-servicio-seo-centralizado)
3. [Fase 3: Integración con Inertia.js](#fase-3-integración-con-inertiajs)
4. [Fase 4: Actualizar Controladores](#fase-4-actualizar-controladores)
5. [Fase 5: Sitemap XML Dinámico](#fase-5-sitemap-xml-dinámico)
6. [Fase 6: Canonical Tags y Robots Meta](#fase-6-canonical-tags-y-robots-meta)
7. [Fase 7: Google Analytics 4](#fase-7-google-analytics-4-integration)
8. [Fase 8: Google Search Console](#fase-8-configuración-de-google-search-console)
9. [Fase 9: Testing Completo](#fase-9-testing-completo)
10. [Fase 10: Core Web Vitals](#fase-10-core-web-vitals-optimization)
11. [Archivos a Modificar](#archivos-críticos-a-modificar)
12. [Secuencia de Implementación](#secuencia-de-implementación)
13. [Checklist de Validación](#checklist-de-validación-manual)
14. [Resultados Esperados](#resultados-esperados)
15. [Mantenimiento Continuo](#mantenimiento-continuo)
16. [Herramientas Recomendadas](#herramientas-recomendadas)

---

## Fase 1: Instalación de Paquetes y Configuración Base

### 1.1 Instalar Paquetes

```bash
composer require artesaos/seotools "^1.3"
composer require spatie/laravel-sitemap "^7.2"
php artisan vendor:publish --provider="Artesaos\SEOTools\Providers\SEOToolsServiceProvider"
```

**Paquetes seleccionados:**
- **artesaos/seotools**: Estándar de la industria para meta tags, Open Graph, Twitter Cards y JSON-LD en Laravel
- **spatie/laravel-sitemap**: Generador de sitemap XML probado en producción con excelente performance

### 1.2 Configurar Variables de Entorno

Agregar a `.env.example` y `.env`:

```env
# SEO Configuration
SEO_SITE_NAME="UtiliZen"
SEO_DEFAULT_TITLE="UtiliZen - Professional Developer Tools"
SEO_DEFAULT_DESCRIPTION="Professional online tools for web developers. Create React components, validate props, and more."
SEO_DEFAULT_KEYWORDS="react tools, developer tools, component generator, web development"
SEO_SITE_URL="${APP_URL}"
SEO_DEFAULT_IMAGE="${APP_URL}/og-image.png"

# Google Analytics 4
VITE_GOOGLE_ANALYTICS_ID=

# Google Search Console
GOOGLE_SEARCH_CONSOLE_VERIFICATION=
```

---

## Fase 2: Servicio SEO Centralizado

### 2.1 Crear SeoService

**Archivo**: `app/Services/SeoService.php`

Este servicio centraliza toda la lógica SEO de la aplicación.

**Métodos principales**:
- `setDefaults()`: SEO global + JSON-LD Organization schema
- `setHomePage()`: Homepage específico + JSON-LD WebSite schema con SearchAction
- `setToolsIndex()`: Página de índice de herramientas
- `setToolPage(Tool $tool)`: SEO específico por herramienta usando campos DB + JSON-LD SoftwareApplication
- `setStaticPage(string $title, string $description)`: Páginas estáticas
- `setNoIndex()`: Para páginas auth/dashboard

**Patrón de implementación para páginas de herramientas**:

```php
<?php

namespace App\Services;

use App\Models\Tool;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\TwitterCard;
use Artesaos\SEOTools\Facades\JsonLd;

class SeoService
{
    public function setDefaults(): void
    {
        SEOMeta::setTitle(config('seotools.meta.defaults.title'));
        SEOMeta::setDescription(config('seotools.meta.defaults.description'));
        SEOMeta::setCanonical(url()->current());
        SEOMeta::addKeyword(config('seotools.meta.defaults.keywords'));

        OpenGraph::setTitle(config('seotools.meta.defaults.title'));
        OpenGraph::setDescription(config('seotools.meta.defaults.description'));
        OpenGraph::setUrl(url()->current());
        OpenGraph::setType('website');
        OpenGraph::addImage(config('seotools.meta.defaults.image'));

        TwitterCard::setType('summary_large_image');
        TwitterCard::setTitle(config('seotools.meta.defaults.title'));
        TwitterCard::setDescription(config('seotools.meta.defaults.description'));
        TwitterCard::setImage(config('seotools.meta.defaults.image'));

        // JSON-LD Organization Schema
        JsonLd::setType('Organization');
        JsonLd::setTitle(config('app.name'));
        JsonLd::setDescription(config('seotools.meta.defaults.description'));
        JsonLd::setUrl(config('app.url'));
        JsonLd::addValue('logo', config('seotools.meta.defaults.image'));
    }

    public function setToolPage(Tool $tool): void
    {
        // Meta tags básicos
        SEOMeta::setTitle($tool->meta_title ?? "{$tool->name} - UtiliZen");
        SEOMeta::setDescription($tool->meta_description ?? $tool->description);
        SEOMeta::setCanonical(route('tools.show', $tool->slug));

        if ($tool->keywords) {
            SEOMeta::addKeyword($tool->keywords);
        }

        // Open Graph
        OpenGraph::setTitle($tool->meta_title ?? $tool->name);
        OpenGraph::setDescription($tool->meta_description ?? $tool->description);
        OpenGraph::setUrl(route('tools.show', $tool->slug));
        OpenGraph::setType('website');
        OpenGraph::addImage(config('seotools.meta.defaults.image'));

        // Twitter Card
        TwitterCard::setType('summary_large_image');
        TwitterCard::setTitle($tool->meta_title ?? $tool->name);
        TwitterCard::setDescription($tool->meta_description ?? $tool->description);
        TwitterCard::setImage(config('seotools.meta.defaults.image'));

        // JSON-LD Structured Data
        JsonLd::setType('SoftwareApplication');
        JsonLd::setTitle($tool->name);
        JsonLd::setDescription($tool->description);
        JsonLd::addValue('applicationCategory', 'DeveloperApplication');
        JsonLd::addValue('operatingSystem', 'Web');
        JsonLd::addValue('offers', [
            '@type' => 'Offer',
            'price' => $tool->is_premium ? '9.00' : '0',
            'priceCurrency' => 'USD',
        ]);
    }

    public function setHomePage(): void
    {
        SEOMeta::setTitle('UtiliZen - Professional Developer Tools');
        SEOMeta::setDescription('Professional online tools for web developers. Create React components, validate props, analyze performance, and more.');
        SEOMeta::setCanonical(route('home'));

        OpenGraph::setTitle('UtiliZen - Professional Developer Tools');
        OpenGraph::setDescription('Professional online tools for web developers.');
        OpenGraph::setUrl(route('home'));
        OpenGraph::addImage(config('seotools.meta.defaults.image'));

        // JSON-LD WebSite Schema with SearchAction
        JsonLd::setType('WebSite');
        JsonLd::setTitle('UtiliZen');
        JsonLd::setUrl(config('app.url'));
        JsonLd::addValue('potentialAction', [
            '@type' => 'SearchAction',
            'target' => config('app.url') . '/tools?search={search_term_string}',
            'query-input' => 'required name=search_term_string',
        ]);
    }

    public function setNoIndex(): void
    {
        SEOMeta::addMeta('robots', 'noindex,nofollow');
    }
}
```

---

## Fase 3: Integración con Inertia.js

### 3.1 Modificar HandleInertiaRequests Middleware

**Archivo**: `app/Http/Middleware/HandleInertiaRequests.php`

**Cambios**:
- Inyectar SeoService vía constructor
- Llamar `setDefaults()` en método `share()`
- Compartir props SEO básicos (title, description, canonical, image)

```php
<?php

namespace App\Http\Middleware;

use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function __construct(private SeoService $seoService)
    {
    }

    public function share(Request $request): array
    {
        // Establecer SEO defaults globales
        $this->seoService->setDefaults();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => $this->getRandomQuote(),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => $request->cookie('sidebar_open', true),
            'seo' => [
                'title' => config('seotools.meta.defaults.title'),
                'description' => config('seotools.meta.defaults.description'),
                'canonical' => $request->url(),
                'image' => config('seotools.meta.defaults.image'),
            ],
        ];
    }

    // ... resto del código existente
}
```

### 3.2 Actualizar Blade Template Principal

**Archivo**: `resources/views/app.blade.php`

**Agregar antes de `@inertiaHead`**:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- SEO Meta Tags (Open Graph, Twitter, JSON-LD) --}}
    {!! SEO::generate() !!}

    {{-- Google Search Console Verification --}}
    @if(config('services.google.search_console_verification'))
        <meta name="google-site-verification" content="{{ config('services.google.search_console_verification') }}" />
    @endif

    {{-- Inertia Head (permite override desde componentes React) --}}
    @inertiaHead

    {{-- Dark mode initialization script --}}
    <script>
        // ... existing dark mode script
    </script>

    {{-- Existing styles --}}
    <style>
        /* ... existing styles */
    </style>

    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    {{-- Vite --}}
    @vite(['resources/js/app.tsx', 'resources/css/app.css'])
</head>
<body>
    @inertia
</body>
</html>
```

### 3.3 Actualizar PublicLayout React

**Archivo**: `resources/js/layouts/public-layout.tsx`

**Cambios**: Usar props SEO compartidos vía Inertia

```tsx
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function PublicLayout({ children, title, description }: PublicLayoutProps) {
    const { seo } = usePage().props as any;

    return (
        <div className="dark bg-[var(--bg-primary)] min-h-screen">
            <Head>
                <title>{title || seo.title}</title>
                <meta name="description" content={description || seo.description} />
                <link rel="canonical" href={seo.canonical} />
            </Head>

            {/* Header */}
            <PublicHeader />

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
```

---

## Fase 4: Actualizar Controladores

### 4.1 HomeController

**Archivo**: `app/Http/Controllers/Web/HomeController.php`

```php
<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private SeoService $seoService)
    {
    }

    public function index(): Response
    {
        // Configurar SEO específico de la homepage
        $this->seoService->setHomePage();

        // ... existing code para featured tools, stats, etc.

        return Inertia::render('welcome', [
            // ... existing props
        ]);
    }
}
```

### 4.2 ToolController

**Archivo**: `app/Http/Controllers/Web/ToolController.php`

```php
<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Tool;
use App\Services\SeoService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ToolController extends Controller
{
    public function __construct(private SeoService $seoService)
    {
    }

    public function show(string $slug): Response
    {
        $tool = Cache::remember("tool:{$slug}", 3600, fn() =>
            Tool::where('slug', $slug)->where('is_active', true)->firstOrFail()
        );

        // Configurar SEO específico de la herramienta
        $this->seoService->setToolPage($tool);

        // Incrementar view count
        $tool->increment('view_count');

        // ... existing code

        return Inertia::render("tools/{$tool->component_name}", [
            'tool' => $tool,
            // ... existing props
        ]);
    }
}
```

---

## Fase 5: Sitemap XML Dinámico

### 5.1 Crear Comando de Generación

**Archivo**: `app/Console/Commands/GenerateSitemap.php`

```bash
php artisan make:command GenerateSitemap
```

**Implementación completa**:

```php
<?php

namespace App\Console\Commands;

use App\Models\Tool;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate the sitemap for the application';

    public function handle(): int
    {
        $this->info('Generating sitemap...');

        Sitemap::create()
            // Homepage
            ->add(Url::create('/')
                ->setPriority(1.0)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY))

            // Tools index
            ->add(Url::create('/tools')
                ->setPriority(0.9)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY))

            // Pricing
            ->add(Url::create('/pricing')
                ->setPriority(0.7)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY))

            // Static pages
            ->add(Url::create('/about')
                ->setPriority(0.6)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY))
            ->add(Url::create('/privacy')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))
            ->add(Url::create('/terms')
                ->setPriority(0.5)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_YEARLY))

            // All active tools
            ->add(Tool::where('is_active', true)->get()->map(fn(Tool $tool) =>
                Url::create(route('tools.show', $tool->slug))
                    ->setPriority(0.8)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setLastModificationDate($tool->updated_at)
            ))

            // Write to public directory
            ->writeToFile(public_path('sitemap.xml'));

        $this->info('Sitemap generated successfully at public/sitemap.xml');

        return Command::SUCCESS;
    }
}
```

### 5.2 Programar Regeneración Automática

**Archivo**: `routes/console.php`

```php
<?php

use Illuminate\Support\Facades\Schedule;

// Regenerar sitemap diariamente a las 2am
Schedule::command('sitemap:generate')->dailyAt('02:00');
```

### 5.3 Actualizar robots.txt

**Archivo**: `public/robots.txt`

```txt
User-agent: *
Disallow: /dashboard
Disallow: /settings
Disallow: /api/
Disallow: /*.json$

# Allow all tools
Allow: /tools

Sitemap: https://utilizen.test/sitemap.xml
```

**Nota**: Cambiar `utilizen.test` por tu dominio de producción.

---

## Fase 6: Canonical Tags y Robots Meta

### 6.1 Middleware para Páginas Auth (noindex)

**Crear middleware**:

```bash
php artisan make:middleware NoIndexAuthPages
```

**Archivo**: `app/Http/Middleware/NoIndexAuthPages.php`

```php
<?php

namespace App\Http\Middleware;

use App\Services\SeoService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NoIndexAuthPages
{
    public function handle(Request $request, Closure $next): Response
    {
        $authRoutes = [
            'login',
            'register',
            'password.',
            'verification.',
            'two-factor.',
            'dashboard',
            'settings.',
        ];

        foreach ($authRoutes as $route) {
            if ($request->routeIs($route . '*')) {
                app(SeoService::class)->setNoIndex();
                break;
            }
        }

        return $next($request);
    }
}
```

**Registrar en**: `bootstrap/app.php`

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \App\Http\Middleware\HandleAppearance::class,
            \App\Http\Middleware\NoIndexAuthPages::class, // ← Agregar aquí
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

---

## Fase 7: Google Analytics 4 Integration

### 7.1 Crear Componente GA4

**Archivo**: `resources/js/components/analytics/google-analytics.tsx`

```tsx
import { useEffect } from 'react';
import { router } from '@inertiajs/react';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export default function GoogleAnalytics() {
    const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

    useEffect(() => {
        if (!gaId) return;

        // Cargar script de GA4
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script.async = true;
        document.head.appendChild(script);

        // Inicializar dataLayer
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', gaId);

        // Track navegación de Inertia (SPA)
        const removeListener = router.on('navigate', (event) => {
            gtag('config', gaId, {
                page_path: event.detail.page.url,
            });
        });

        return () => removeListener();
    }, [gaId]);

    return null;
}
```

### 7.2 Integrar en App

**Archivo**: `resources/js/app.tsx`

```tsx
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GoogleAnalytics from '@/components/analytics/google-analytics';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient();

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <GoogleAnalytics />
                <App {...props} />
            </QueryClientProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
```

### 7.3 Utilidad para Eventos Personalizados

**Archivo**: `resources/js/utils/analytics.ts`

```ts
/**
 * Track custom events in Google Analytics
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
};

/**
 * Track tool usage
 */
export const trackToolUsage = (toolName: string, toolCategory: string) => {
    trackEvent('tool_used', {
        tool_name: toolName,
        tool_category: toolCategory,
    });
};

/**
 * Track conversion events
 */
export const trackConversion = (conversionType: string, value?: number) => {
    trackEvent('conversion', {
        conversion_type: conversionType,
        value: value,
    });
};
```

**Ejemplo de uso en una página de herramienta**:

```tsx
import { trackToolUsage } from '@/utils/analytics';

export default function ReactComponentGenerator({ tool }) {
    const handleGenerate = () => {
        // ... lógica de generación

        // Track el uso de la herramienta
        trackToolUsage(tool.name, tool.category);
    };

    return (
        // ... componente
    );
}
```

---

## Fase 8: Configuración de Google Search Console

### 8.1 Agregar Configuración

**Archivo**: `config/services.php`

```php
<?php

return [
    // ... existing services

    'google' => [
        'search_console_verification' => env('GOOGLE_SEARCH_CONSOLE_VERIFICATION'),
    ],
];
```

### 8.2 Pasos de Verificación

1. **Ir a Google Search Console**: https://search.google.com/search-console
2. **Agregar propiedad**: Usar URL de producción (ejemplo: `https://utilizen.com`)
3. **Método de verificación**: Seleccionar "Etiqueta HTML"
4. **Copiar código**: Copiar el valor del atributo `content` de la meta tag
5. **Agregar a .env**: `GOOGLE_SEARCH_CONSOLE_VERIFICATION=abc123xyz...`
6. **Verificar**: La etiqueta ya está en `app.blade.php` (Fase 3.2), solo hacer click en "Verificar"
7. **Enviar sitemap**: Ir a Sitemaps → Agregar `sitemap.xml`

### 8.3 Configuración Post-Verificación

**URLs a inspeccionar primero**:
- Homepage: `/`
- Herramientas principales: `/tools/react-component-generator`
- Pricing: `/pricing`

**Monitorear**:
- Index Coverage (objetivo: >95%)
- Core Web Vitals
- Mobile Usability
- Manual Actions (debe estar vacío)

---

## Fase 9: Testing Completo

### 9.1 Crear Tests de SEO

**Estructura de directorios**:

```bash
mkdir -p tests/Feature/Seo
```

**Tests a crear**:

#### 1. MetaTagsTest.php

```bash
php artisan make:test --pest Feature/Seo/MetaTagsTest
```

```php
<?php

use App\Models\Tool;

it('sets correct meta tags on homepage', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertSee('UtiliZen - Professional Developer Tools', false);
    $response->assertSee('Professional online tools for web developers', false);
});

it('sets tool-specific meta tags', function () {
    $tool = Tool::factory()->create([
        'slug' => 'test-tool',
        'meta_title' => 'Custom Tool Title',
        'meta_description' => 'Custom description for SEO',
    ]);

    $response = $this->get("/tools/{$tool->slug}");

    $response->assertOk();
    $response->assertSee('Custom Tool Title', false);
    $response->assertSee('Custom description for SEO', false);
});

it('sets noindex on auth pages', function () {
    $response = $this->get('/login');

    $response->assertOk();
    $response->assertSee('noindex,nofollow', false);
});

it('sets canonical URLs correctly', function () {
    $tool = Tool::factory()->create(['slug' => 'test-tool']);

    $response = $this->get("/tools/{$tool->slug}");

    $response->assertSee('<link rel="canonical"', false);
    $response->assertSee("/tools/{$tool->slug}", false);
});
```

#### 2. SitemapTest.php

```bash
php artisan make:test --pest Feature/Seo/SitemapTest
```

```php
<?php

use App\Models\Tool;

it('generates sitemap with all active tools', function () {
    Tool::factory()->count(5)->create(['is_active' => true]);
    Tool::factory()->create(['is_active' => false]);

    $this->artisan('sitemap:generate')->assertSuccessful();

    expect(file_exists(public_path('sitemap.xml')))->toBeTrue();

    $sitemap = file_get_contents(public_path('sitemap.xml'));
    expect($sitemap)->toContain('https://utilizen.test/');
    expect($sitemap)->toContain('/tools/');
});

it('excludes inactive tools from sitemap', function () {
    $inactiveTool = Tool::factory()->create([
        'slug' => 'inactive-tool',
        'is_active' => false,
    ]);

    $this->artisan('sitemap:generate')->assertSuccessful();

    $sitemap = file_get_contents(public_path('sitemap.xml'));
    expect($sitemap)->not->toContain('inactive-tool');
});

it('includes correct priorities', function () {
    $this->artisan('sitemap:generate')->assertSuccessful();

    $sitemap = simplexml_load_file(public_path('sitemap.xml'));
    $urls = $sitemap->url;

    // Homepage should have priority 1.0
    $homePriority = (string) $urls[0]->priority;
    expect($homePriority)->toBe('1.0');
});
```

#### 3. StructuredDataTest.php

```bash
php artisan make:test --pest Feature/Seo/StructuredDataTest
```

```php
<?php

use App\Models\Tool;

it('includes organization schema on all pages', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertSee('"@type":"Organization"', false);
    $response->assertSee('"name":"UtiliZen"', false);
});

it('includes website schema with search action on homepage', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertSee('"@type":"WebSite"', false);
    $response->assertSee('"@type":"SearchAction"', false);
});

it('includes software application schema on tool pages', function () {
    $tool = Tool::factory()->create(['slug' => 'test-tool']);

    $response = $this->get("/tools/{$tool->slug}");

    $response->assertOk();
    $response->assertSee('"@type":"SoftwareApplication"', false);
    $response->assertSee('"applicationCategory":"DeveloperApplication"', false);
});
```

### 9.2 Ejecutar Tests

```bash
# Ejecutar todos los tests de SEO
php artisan test --filter=Seo

# Ejecutar un test específico
php artisan test tests/Feature/Seo/MetaTagsTest.php

# Con cobertura de código
php artisan test --filter=Seo --coverage
```

---

## Fase 10: Core Web Vitals Optimization

### 10.1 Componente de Imagen Optimizada

**Archivo**: `resources/js/components/optimized-image.tsx`

```tsx
interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    className?: string;
}

export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    className = '',
}: OptimizedImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={className}
            style={{
                aspectRatio: width && height ? `${width}/${height}` : undefined,
            }}
        />
    );
}
```

**Uso**:

```tsx
import OptimizedImage from '@/components/optimized-image';

<OptimizedImage
    src="/images/hero-image.png"
    alt="UtiliZen Developer Tools"
    width={800}
    height={600}
    priority={true}
/>
```

### 10.2 Monitoreo de Web Vitals

**Instalar paquete**:

```bash
npm install web-vitals
```

**Archivo**: `resources/js/utils/web-vitals.ts`

```ts
import { onCLS, onINP, onLCP } from 'web-vitals';
import { trackEvent } from './analytics';

/**
 * Report Web Vitals to Google Analytics
 */
export const reportWebVitals = () => {
    // Cumulative Layout Shift
    onCLS((metric) => {
        trackEvent('web_vitals', {
            metric_name: 'CLS',
            metric_value: metric.value,
            metric_id: metric.id,
            metric_delta: metric.delta,
        });
    });

    // Interaction to Next Paint
    onINP((metric) => {
        trackEvent('web_vitals', {
            metric_name: 'INP',
            metric_value: metric.value,
            metric_id: metric.id,
            metric_delta: metric.delta,
        });
    });

    // Largest Contentful Paint
    onLCP((metric) => {
        trackEvent('web_vitals', {
            metric_name: 'LCP',
            metric_value: metric.value,
            metric_id: metric.id,
            metric_delta: metric.delta,
        });
    });
};
```

**Integrar en app.tsx**:

```tsx
import { reportWebVitals } from '@/utils/web-vitals';

createInertiaApp({
    // ... existing config
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <GoogleAnalytics />
                <App {...props} />
            </QueryClientProvider>
        );

        // Report Web Vitals
        reportWebVitals();
    },
});
```

### 10.3 Optimizaciones Adicionales

**1. Code Splitting para rutas**:

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('@/components/heavy-component'));

<Suspense fallback={<div>Loading...</div>}>
    <HeavyComponent />
</Suspense>
```

**2. Skeleton Loaders para deferred props**:

```tsx
import { usePage } from '@inertiajs/react';

export default function ToolsPage({ tools }) {
    const { deferredData } = usePage().props;

    return (
        <div>
            {!deferredData ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-48 bg-gray-200 rounded" />
                    <div className="h-48 bg-gray-200 rounded" />
                </div>
            ) : (
                <DataComponent data={deferredData} />
            )}
        </div>
    );
}
```

---

## Archivos Críticos a Modificar

### Nuevos Archivos (11)

1. **`app/Services/SeoService.php`** - Lógica SEO centralizada
2. **`app/Console/Commands/GenerateSitemap.php`** - Generador de sitemap
3. **`app/Http/Middleware/NoIndexAuthPages.php`** - Middleware noindex
4. **`resources/js/components/analytics/google-analytics.tsx`** - Componente GA4
5. **`resources/js/utils/analytics.ts`** - Tracking de eventos
6. **`resources/js/utils/web-vitals.ts`** - Monitoreo de performance
7. **`resources/js/components/optimized-image.tsx`** - Optimización de imágenes
8. **`tests/Feature/Seo/MetaTagsTest.php`** - Tests de meta tags
9. **`tests/Feature/Seo/SitemapTest.php`** - Tests de sitemap
10. **`tests/Feature/Seo/StructuredDataTest.php`** - Tests de structured data
11. **`tests/Feature/Seo/CanonicalTagsTest.php`** - Tests de canonical

### Archivos Existentes a Modificar (12)

1. **`composer.json`** - Agregar paquetes artesaos/seotools y spatie/laravel-sitemap
2. **`.env.example`** - Variables SEO y GA4
3. **`config/services.php`** - Config de Google Search Console
4. **`app/Http/Middleware/HandleInertiaRequests.php`** - Compartir props SEO
5. **`resources/views/app.blade.php`** - Agregar SEO::generate()
6. **`resources/js/layouts/public-layout.tsx`** - Usar props SEO
7. **`app/Http/Controllers/Web/HomeController.php`** - setHomePage()
8. **`app/Http/Controllers/Web/ToolController.php`** - setToolPage()
9. **`public/robots.txt`** - Agregar sitemap y disallow rules
10. **`routes/console.php`** - Schedule sitemap regeneration
11. **`bootstrap/app.php`** - Registrar middleware NoIndexAuthPages
12. **`resources/js/app.tsx`** - Agregar componente GA4 y Web Vitals

---

## Secuencia de Implementación

### Día 1: Base
1. ✅ Instalar paquetes (`composer require`)
2. ✅ Publicar configuraciones
3. ✅ Crear SeoService con métodos principales
4. ✅ Agregar variables de entorno
5. ✅ Ejecutar tests existentes para verificar que no rompimos nada

### Día 2: Meta Tags
1. ✅ Modificar HandleInertiaRequests (inyectar SeoService)
2. ✅ Actualizar app.blade.php (agregar SEO::generate())
3. ✅ Actualizar PublicLayout (usar props SEO)
4. ✅ Modificar HomeController y ToolController
5. ✅ Probar manualmente en navegador
6. ✅ Ejecutar: `php artisan test`

### Día 3: Structured Data
1. ✅ Agregar métodos JSON-LD a SeoService
2. ✅ Organization schema (global)
3. ✅ WebSite schema con SearchAction (homepage)
4. ✅ SoftwareApplication schema (tool pages)
5. ✅ Validar en Google Rich Results Test
6. ✅ Crear tests de structured data

### Día 4: Sitemap
1. ✅ Crear comando GenerateSitemap
2. ✅ Probar: `php artisan sitemap:generate`
3. ✅ Verificar archivo generado en public/sitemap.xml
4. ✅ Programar regeneración diaria en routes/console.php
5. ✅ Actualizar robots.txt
6. ✅ Crear tests de sitemap

### Día 5: Canonical & Noindex
1. ✅ Crear middleware NoIndexAuthPages
2. ✅ Registrar middleware en bootstrap/app.php
3. ✅ Probar en páginas /login, /register, /dashboard
4. ✅ Verificar canonical URLs en todas las páginas
5. ✅ Ejecutar: `php artisan test --filter=Seo`

### Día 6: Analytics
1. ✅ Crear componente GoogleAnalytics.tsx
2. ✅ Integrar en app.tsx
3. ✅ Crear utils/analytics.ts
4. ✅ Agregar tracking a una herramienta de prueba
5. ✅ Verificar en GA4 Real-time reports

### Día 7: Search Console
1. ✅ Configurar propiedad en GSC
2. ✅ Agregar verificación a config/services.php
3. ✅ Verificar propiedad (meta tag method)
4. ✅ Enviar sitemap.xml
5. ✅ Inspeccionar URLs principales

### Día 8-9: Core Web Vitals
1. ✅ Crear componente OptimizedImage
2. ✅ Instalar y configurar web-vitals
3. ✅ Integrar reportWebVitals en app.tsx
4. ✅ Ejecutar PageSpeed Insights (baseline)
5. ✅ Aplicar optimizaciones (lazy loading, code splitting)
6. ✅ Re-ejecutar PageSpeed Insights
7. ✅ Documentar mejoras

### Día 10: Testing & Documentación
1. ✅ Ejecutar suite completa: `php artisan test`
2. ✅ Validación manual (checklist completo)
3. ✅ Corregir issues encontrados
4. ✅ Ejecutar `vendor/bin/pint` para formatear código
5. ✅ Documentar configuración final
6. ✅ Crear guía de mantenimiento

---

## Checklist de Validación Manual

### Meta Tags
- [ ] Ver código fuente de homepage
- [ ] Ver código fuente de /tools
- [ ] Ver código fuente de página de herramienta específica
- [ ] Verificar title tag único por página
- [ ] Verificar meta description única por página
- [ ] Confirmar Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] Confirmar Twitter Card tags
- [ ] Validar canonical URLs correctas
- [ ] Confirmar noindex,nofollow en /login, /register, /dashboard

### Structured Data
- [ ] Usar Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Validar JSON-LD en homepage (Organization + WebSite)
- [ ] Validar JSON-LD en tool page (SoftwareApplication)
- [ ] Verificar sintaxis correcta (sin errores)
- [ ] Confirmar propiedades requeridas presentes

### Sitemap
- [ ] Acceder a /sitemap.xml directamente
- [ ] Verificar XML válido (well-formed)
- [ ] Confirmar homepage incluida (priority 1.0)
- [ ] Confirmar /tools incluido (priority 0.9)
- [ ] Confirmar todas las herramientas activas incluidas
- [ ] Verificar lastmod dates correctas
- [ ] Validar en https://www.xml-sitemaps.com/validate-xml-sitemap.html

### Google Analytics
- [ ] Verificar que script GA4 carga en navegador
- [ ] Abrir consola de navegador, verificar sin errores
- [ ] Ir a GA4 dashboard → Realtime → ver visita actual
- [ ] Navegar entre páginas, confirmar tracking de navegación Inertia
- [ ] Probar evento custom (uso de herramienta)
- [ ] Verificar evento aparece en Realtime

### Core Web Vitals
- [ ] Ejecutar PageSpeed Insights en homepage
- [ ] Ejecutar PageSpeed Insights en /tools
- [ ] Ejecutar PageSpeed Insights en página de herramienta
- [ ] Verificar LCP < 2.5s (verde)
- [ ] Verificar INP < 200ms (verde)
- [ ] Verificar CLS < 0.1 (verde)
- [ ] Probar en mobile (PageSpeed Mobile)
- [ ] Objetivo general: Performance score > 90

### Search Console
- [ ] Verificar propiedad del sitio confirmada
- [ ] Confirmar sitemap enviado y procesado
- [ ] Usar URL Inspection en homepage
- [ ] Usar URL Inspection en página de herramienta
- [ ] Verificar "URL is on Google" (indexada)
- [ ] Revisar Coverage report (objetivo > 95% indexado)
- [ ] Verificar 0 errors en Mobile Usability

---

## Resultados Esperados

### Mejoras Técnicas

- ✅ **Meta tags completos** en todas las páginas públicas
- ✅ **Rich snippets** en resultados de búsqueda (Organization, WebSite, SoftwareApplication)
- ✅ **Sitemap indexado** con 95%+ de cobertura
- ✅ **URLs canónicas** previniendo contenido duplicado
- ✅ **Social sharing mejorado** con OG/Twitter cards
- ✅ **Analytics funcionando** con tracking de comportamiento
- ✅ **Core Web Vitals** scores > 90 (Good)

### KPIs de SEO

| Métrica | Objetivo | Actual | Herramienta |
|---------|----------|--------|-------------|
| Cobertura de índice | > 95% | - | Google Search Console |
| Errores de rastreo | < 5 | - | Google Search Console |
| LCP (Largest Contentful Paint) | < 2.5s | - | PageSpeed Insights |
| INP (Interaction to Next Paint) | < 200ms | - | PageSpeed Insights |
| CLS (Cumulative Layout Shift) | < 0.1 | - | PageSpeed Insights |
| Mobile Usability Errors | 0 | - | Google Search Console |
| Performance Score | > 90 | - | PageSpeed Insights |

### Proyección de Tráfico Orgánico

| Período | Visitas/mes | Fase | Acciones principales |
|---------|-------------|------|----------------------|
| **Mes 1-3** | 100-500 | Indexación inicial | Enviar sitemap, solicitar indexación, optimizar meta tags |
| **Mes 4-6** | 500-2,000 | Optimización de contenido | Mejorar descripciones, agregar keywords, crear contenido de blog |
| **Mes 7-12** | 2,000-10,000 | Scaling | Backlinks, guest posts, marketing de contenidos |
| **Año 2** | 10,000-50,000 | Autoridad establecida | Dominancia en keywords objetivo, featured snippets |

**Factores de éxito**:
- Contenido de calidad (herramientas funcionales)
- Actualizaciones regulares
- Experiencia de usuario excelente
- Backlinks de calidad
- Engagement en redes sociales

---

## Mantenimiento Continuo

### Diario (Automatizado)

- ✅ **Regeneración de sitemap** (2am vía Laravel Scheduler)
- ✅ **Cache warming** de herramientas populares
- ✅ **Monitoreo de uptime** (opcional: usar servicio como Pingdom)

**Comando para verificar**:
```bash
php artisan schedule:list
```

### Semanal

- [ ] **Revisar GSC Index Coverage**
  - Ir a Google Search Console → Index → Coverage
  - Verificar que no haya páginas válidas excluidas
  - Resolver errores de indexación

- [ ] **Verificar errores de rastreo**
  - GSC → Settings → Crawl Stats
  - Buscar 404s o errores 500

- [ ] **Monitorear Core Web Vitals**
  - GSC → Experience → Core Web Vitals
  - Identificar URLs con problemas
  - Priorizar optimizaciones

### Mensual

- [ ] **Auditar meta tags de herramientas nuevas**
  - Verificar que nuevas herramientas tengan meta_title y meta_description
  - Optimizar keywords basado en búsquedas reales

- [ ] **Analizar top landing pages**
  - GA4 → Reports → Engagement → Landing pages
  - Identificar páginas con alto bounce rate
  - Mejorar contenido/UX de underperformers

- [ ] **Optimizar páginas con bajo rendimiento**
  - Usar GA4 para identificar páginas con baja conversión
  - A/B testing de cambios

- [ ] **Revisar rankings de keywords**
  - GSC → Performance → Queries
  - Identificar keywords en posición 11-20 (oportunidad de mejora)
  - Optimizar contenido para mejorar ranking

### Trimestral

- [ ] **Auditoría SEO completa**
  - Usar herramienta como Screaming Frog (gratis hasta 500 URLs)
  - Verificar: títulos duplicados, meta descriptions faltantes, broken links
  - Generar reporte y plan de acción

- [ ] **Actualizar imágenes OG**
  - Revisar si imágenes OG siguen siendo relevantes
  - Crear nuevas imágenes para herramientas destacadas
  - A/B test de diferentes diseños

- [ ] **Revisar y actualizar keywords objetivo**
  - Análisis de tendencias de búsqueda (Google Trends)
  - Identificar nuevas oportunidades
  - Actualizar meta tags según findings

- [ ] **Análisis competitivo**
  - Identificar top 3 competidores
  - Analizar sus keywords (con Semrush/Ahrefs si disponible)
  - Identificar gaps de contenido
  - Plan de acción para diferenciación

---

## Herramientas Recomendadas

### Gratis (Esenciales)

| Herramienta | Propósito | URL |
|-------------|-----------|-----|
| **Google Analytics 4** | Tracking y análisis de tráfico | https://analytics.google.com |
| **Google Search Console** | Monitoreo de indexación y keywords | https://search.google.com/search-console |
| **PageSpeed Insights** | Core Web Vitals y performance | https://pagespeed.web.dev |
| **Google Rich Results Test** | Validar structured data | https://search.google.com/test/rich-results |
| **Mobile-Friendly Test** | Verificar mobile usability | https://search.google.com/test/mobile-friendly |
| **Screaming Frog SEO Spider** | Auditorías técnicas (gratis hasta 500 URLs) | https://www.screamingfrog.co.uk/seo-spider/ |

### Pagas (Opcionales para Crecimiento)

| Herramienta | Precio | Propósito | URL |
|-------------|--------|-----------|-----|
| **Semrush** | $129/mes | Análisis competitivo, keywords, backlinks, site audit | https://www.semrush.com |
| **Ahrefs** | $129/mes | Backlinks profundos, análisis SERP, content explorer | https://ahrefs.com |
| **SE Ranking** | $65/mes | Keyword tracking, competitor analysis, más económico | https://seranking.com |
| **Screaming Frog** | £209/año | Versión ilimitada para auditorías grandes | https://www.screamingfrog.co.uk |

**Recomendación para UtiliZen**:
- **Fase inicial (Mes 1-6)**: Solo herramientas gratuitas
- **Fase crecimiento (Mes 7-12)**: Agregar Semrush o Ahrefs si presupuesto lo permite
- **Alternativa**: Usar herramientas gratis + consultor SEO freelance ocasional

---

## Recursos de Referencia

### Documentación Oficial

- [Laravel SEO Tools (artesaos)](https://github.com/artesaos/seotools)
- [Spatie Laravel Sitemap](https://github.com/spatie/laravel-sitemap)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org)
- [Web Vitals](https://web.dev/vitals/)

### Guías SEO 2025

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

---

## Notas Finales

Este documento implementa SEO técnico completo siguiendo las mejores prácticas de 2025, usando paquetes probados en producción (artesaos/seotools + spatie/laravel-sitemap), y está optimizado para el stack Laravel 12 + Inertia.js v2 + React 19.

**Todas las implementaciones**:
- ✅ Siguen convenciones de Laravel Boost Guidelines
- ✅ Usan constructor property promotion (PHP 8)
- ✅ Incluyen type hints explícitos
- ✅ Están listas para escalar de 100 a 50,000 visitas mensuales
- ✅ Tienen tests automatizados (Pest)
- ✅ Son compatibles con Tailwind v4

**Próximos pasos sugeridos después de implementar SEO**:
1. Sistema de blog para content marketing
2. Backlink building strategy
3. Email marketing para retención
4. Premium tier marketing

---

**Última actualización**: {{ date }}
**Mantenido por**: Equipo UtiliZen
**Versión**: 1.0.0
