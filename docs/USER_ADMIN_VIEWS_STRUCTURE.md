# Estructura de Vistas: Usuarios vs Administradores

> **Documento de Planificación**
> Última actualización: Febrero 2026
> Estado: Propuesta de Reestructuración

---

## Tabla de Contenidos

1. [Análisis del Estado Actual](#análisis-del-estado-actual)
2. [Problemas Identificados](#problemas-identificados)
3. [Estructura Propuesta](#estructura-propuesta)
4. [Rutas y Navegación](#rutas-y-navegación)
5. [Base de Datos](#cambios-en-base-de-datos)
6. [Páginas a Crear](#páginas-a-crear)
7. [Resumen de Implementación](#resumen-de-implementación)

---

## Análisis del Estado Actual

### Estructura de Rutas Actual

```
PÚBLICAS (sin autenticación)
├── /                          → Homepage (welcome.tsx)
├── /tools                     → Lista de herramientas
├── /tools/{slug}              → Herramienta específica
├── /pricing                   → Precios
├── /blog                      → Coming soon
├── /docs                      → Coming soon
├── /about                     → Coming soon
├── /privacy                   → Coming soon
└── /terms                     → Coming soon

AUTENTICACIÓN
├── /login                     → Inicio de sesión
├── /register                  → Registro
├── /forgot-password           → Recuperar contraseña
├── /reset-password            → Restablecer contraseña
├── /verify-email              → Verificar email
└── /two-factor-challenge      → 2FA

AUTENTICADAS (requieren login)
├── /dashboard                 → Dashboard vacío (placeholder)
├── /settings/profile          → Editar perfil
├── /settings/password         → Cambiar contraseña
├── /settings/appearance       → Tema claro/oscuro
└── /settings/two-factor       → Configurar 2FA
```

### Modelo de Usuario Actual

```php
User {
    id
    name
    email
    email_verified_at
    password
    is_premium              // boolean
    premium_expires_at      // datetime
    api_calls_count         // integer
    api_calls_limit         // integer
    two_factor_secret       // (Fortify)
    two_factor_recovery_codes
    remember_token
    timestamps
}
```

### Navegación Actual

**Header Público (`public-header.tsx`):**
```
[UtiliZen Logo] -------- [Tools] [Pricing] [Dashboard] [🇺🇸🇪🇸]
```

**Sidebar Dashboard (`app-sidebar.tsx`):**
```
[Logo]
├── Dashboard
└── [User Menu]
    ├── Settings
    └── Logout
```

---

## Problemas Identificados

### 1. No hay sistema de roles
- ❌ No existe campo `role` o `is_admin` en la tabla users
- ❌ No hay forma de distinguir entre usuario normal y administrador
- ❌ No hay middleware de autorización para admin

### 2. Navegación confusa
- ❌ "Dashboard" aparece en el menú público (no tiene sentido para visitantes)
- ❌ Si no está logueado, el link lleva a login → luego a dashboard vacío
- ❌ No hay diferencia visual entre área de usuario y área de admin

### 3. Dashboard vacío
- ❌ El dashboard actual solo muestra placeholders
- ❌ No es útil ni para usuarios ni para admins
- ❌ No hay contenido relevante

### 4. Faltan páginas esenciales para usuarios
- ❌ No hay página de "Mi Plan" / "Suscripción"
- ❌ No hay gestión de métodos de pago
- ❌ No hay historial de facturación
- ❌ No hay historial de uso de herramientas
- ❌ No hay página de favoritos o herramientas guardadas

### 5. Faltan páginas de administración
- ❌ No hay gestión de usuarios
- ❌ No hay estadísticas del sitio
- ❌ No hay estadísticas de herramientas
- ❌ No hay gestión de herramientas (CRUD)
- ❌ No hay reportes de ventas/suscripciones

---

## Estructura Propuesta

### Visión General

```
┌─────────────────────────────────────────────────────────────────┐
│                        PÚBLICO                                   │
│  Homepage, Tools, Pricing, Blog, Docs, About, Privacy, Terms    │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│     ÁREA DE USUARIO     │     │    ÁREA DE ADMIN        │
│      /account/*         │     │       /admin/*          │
│                         │     │                         │
│ • Mi Perfil             │     │ • Dashboard Admin       │
│ • Mi Plan/Suscripción   │     │ • Gestión de Usuarios   │
│ • Métodos de Pago       │     │ • Gestión de Tools      │
│ • Historial de Uso      │     │ • Estadísticas          │
│ • Configuración         │     │ • Reportes de Ventas    │
│                         │     │ • SEO & Analytics       │
└─────────────────────────┘     └─────────────────────────┘
```

---

## Rutas y Navegación

### Nueva Estructura de Rutas

```
PÚBLICAS (sin cambios)
├── /                          → Homepage
├── /tools                     → Lista de herramientas
├── /tools/{slug}              → Herramienta específica
├── /pricing                   → Precios
├── /blog                      → Blog
├── /docs                      → Documentación
├── /about                     → Sobre nosotros
├── /privacy                   → Política de privacidad
└── /terms                     → Términos de servicio

AUTENTICACIÓN (sin cambios)
├── /login
├── /register
├── /forgot-password
├── /reset-password
├── /verify-email
└── /two-factor-challenge

ÁREA DE USUARIO (/account/*)
├── /account                   → Redirect a /account/overview
├── /account/overview          → Resumen de cuenta (nuevo dashboard de usuario)
├── /account/profile           → Editar perfil (mover de /settings/profile)
├── /account/security          → Contraseña + 2FA (combinar)
├── /account/subscription      → Mi plan actual, upgrade/downgrade
├── /account/billing           → Métodos de pago, historial de facturas
├── /account/usage             → Historial de uso de herramientas
├── /account/favorites         → Herramientas favoritas (opcional)
└── /account/preferences       → Tema, idioma, notificaciones

ÁREA DE ADMIN (/admin/*)  [Solo role = admin]
├── /admin                     → Redirect a /admin/dashboard
├── /admin/dashboard           → Dashboard con KPIs principales
├── /admin/users               → Lista de usuarios
├── /admin/users/{id}          → Detalle de usuario
├── /admin/tools               → CRUD de herramientas
├── /admin/tools/{id}          → Editar herramienta
├── /admin/subscriptions       → Gestión de suscripciones
├── /admin/analytics           → Estadísticas del sitio
│   ├── /admin/analytics/overview    → Resumen general
│   ├── /admin/analytics/tools       → Stats por herramienta
│   ├── /admin/analytics/users       → Stats de usuarios
│   └── /admin/analytics/revenue     → Ingresos y ventas
├── /admin/seo                 → Dashboard SEO
│   ├── /admin/seo/overview    → Estado general SEO
│   ├── /admin/seo/tools       → SEO por herramienta
│   └── /admin/seo/sitemap     → Gestión de sitemap
└── /admin/settings            → Configuración del sitio
```

### Nueva Navegación

**Header Público (visitante no logueado):**
```
[UtiliZen Logo] -------- [Tools] [Pricing] [Login] [Sign Up] [🇺🇸🇪🇸]
```

**Header Público (usuario logueado):**
```
[UtiliZen Logo] -------- [Tools] [Pricing] [👤 Mi Cuenta ▼] [🇺🇸🇪🇸]
                                                │
                                                ├── Mi Cuenta
                                                ├── Mi Plan
                                                ├── Configuración
                                                └── Cerrar Sesión
```

**Header Público (admin logueado):**
```
[UtiliZen Logo] -------- [Tools] [Pricing] [🛡️ Admin] [👤 Mi Cuenta ▼] [🇺🇸🇪🇸]
```

**Sidebar Área de Usuario (`/account/*`):**
```
[Logo]
├── 📊 Overview
├── 👤 Mi Perfil
├── 🔐 Seguridad
├── 💳 Mi Plan
├── 🧾 Facturación
├── 📈 Mi Uso
├── ⭐ Favoritos
└── ⚙️ Preferencias
```

**Sidebar Área de Admin (`/admin/*`):**
```
[Logo]
├── 📊 Dashboard
├── 👥 Usuarios
├── 🛠️ Herramientas
├── 💰 Suscripciones
├── 📈 Analytics
│   ├── Overview
│   ├── Por Herramienta
│   ├── Por Usuario
│   └── Ingresos
├── 🔍 SEO
│   ├── Overview
│   ├── Por Herramienta
│   └── Sitemap
└── ⚙️ Configuración
```

---

## Cambios en Base de Datos

### 1. Agregar campo `role` a users

```php
// Migration: add_role_to_users_table.php
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['user', 'admin'])->default('user')->after('email');
    $table->index('role');
});
```

### 2. Crear tabla de favoritos (opcional)

```php
// Migration: create_user_favorites_table.php
Schema::create('user_favorites', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('tool_id')->constrained()->onDelete('cascade');
    $table->timestamps();

    $table->unique(['user_id', 'tool_id']);
});
```

### 3. Crear tabla de configuración del sitio (opcional)

```php
// Migration: create_site_settings_table.php
Schema::create('site_settings', function (Blueprint $table) {
    $table->id();
    $table->string('key')->unique();
    $table->text('value')->nullable();
    $table->timestamps();
});
```

### Modelo User Actualizado

```php
class User extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',              // NUEVO
        'is_premium',
        'premium_expires_at',
        'api_calls_count',
        'api_calls_limit',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'premium_expires_at' => 'datetime',
            'is_premium' => 'boolean',
            'role' => 'string',  // NUEVO
        ];
    }

    // NUEVOS MÉTODOS
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function favorites()
    {
        return $this->belongsToMany(Tool::class, 'user_favorites')
            ->withTimestamps();
    }
}
```

---

## Páginas a Crear

### Área de Usuario (`/account/*`)

| Página | Archivo | Descripción |
|--------|---------|-------------|
| Overview | `account/overview.tsx` | Resumen: plan actual, uso reciente, accesos rápidos |
| Profile | `account/profile.tsx` | Editar nombre, email, avatar |
| Security | `account/security.tsx` | Contraseña + 2FA en una página |
| Subscription | `account/subscription.tsx` | Plan actual, botones upgrade/downgrade/cancel |
| Billing | `account/billing.tsx` | Métodos de pago, historial de facturas |
| Usage | `account/usage.tsx` | Historial de uso de herramientas con gráficos |
| Favorites | `account/favorites.tsx` | Lista de herramientas favoritas |
| Preferences | `account/preferences.tsx` | Tema, idioma, notificaciones |

### Área de Admin (`/admin/*`)

| Página | Archivo | Descripción |
|--------|---------|-------------|
| Dashboard | `admin/dashboard.tsx` | KPIs: usuarios, ingresos, uso, conversiones |
| Users List | `admin/users/index.tsx` | Tabla de usuarios con filtros y búsqueda |
| User Detail | `admin/users/[id].tsx` | Detalle de usuario, su uso, suscripción |
| Tools List | `admin/tools/index.tsx` | CRUD de herramientas |
| Tool Edit | `admin/tools/[id]/edit.tsx` | Editar herramienta (SEO, estado, etc.) |
| Tool Create | `admin/tools/create.tsx` | Crear nueva herramienta |
| Subscriptions | `admin/subscriptions/index.tsx` | Gestión de suscripciones activas |
| Analytics Overview | `admin/analytics/overview.tsx` | Gráficos generales del sitio |
| Analytics Tools | `admin/analytics/tools.tsx` | Stats por herramienta |
| Analytics Users | `admin/analytics/users.tsx` | Stats de usuarios |
| Analytics Revenue | `admin/analytics/revenue.tsx` | Ingresos, MRR, churn |
| SEO Overview | `admin/seo/overview.tsx` | Estado general SEO |
| SEO Tools | `admin/seo/tools.tsx` | SEO por herramienta |
| Settings | `admin/settings/index.tsx` | Configuración global del sitio |

---

## Resumen de Implementación

### Fase 1: Base (Prioridad Alta)

1. **Migración de roles**
   - Crear migración para agregar `role` a users
   - Actualizar modelo User con métodos `isAdmin()`, `isUser()`
   - Crear middleware `EnsureIsAdmin`

2. **Reestructurar navegación pública**
   - Cambiar header para mostrar Login/Sign Up si no está autenticado
   - Mostrar dropdown de usuario si está autenticado
   - Mostrar link a Admin si es admin

3. **Crear layout de Account**
   - Nuevo layout `account-layout.tsx` con sidebar
   - Rutas `/account/*`

4. **Migrar Settings a Account**
   - Mover `/settings/profile` → `/account/profile`
   - Combinar password + 2FA → `/account/security`
   - Crear `/account/overview` como nuevo "dashboard de usuario"

### Fase 2: Área de Usuario (Prioridad Media)

5. **Páginas de suscripción**
   - `/account/subscription` - Ver plan actual
   - `/account/billing` - Métodos de pago (preparado para Stripe)

6. **Páginas de uso**
   - `/account/usage` - Historial de uso con gráficos
   - `/account/favorites` - Herramientas favoritas

7. **Preferencias**
   - `/account/preferences` - Consolidar tema + idioma + notificaciones

### Fase 3: Área de Admin (Prioridad Media-Baja)

8. **Layout y Dashboard Admin**
   - Nuevo layout `admin-layout.tsx` con sidebar de admin
   - `/admin/dashboard` con KPIs

9. **Gestión de Usuarios**
   - `/admin/users` - CRUD de usuarios
   - Filtros, búsqueda, paginación

10. **Gestión de Herramientas**
    - `/admin/tools` - CRUD de herramientas
    - Editar SEO, estado, categoría

11. **Analytics y SEO**
    - Páginas de estadísticas
    - Dashboard SEO integrado

### Fase 4: Integración Stripe (Futuro)

12. **Stripe Billing**
    - Configurar Stripe
    - Checkout para upgrade
    - Portal de facturación
    - Webhooks

---

## Archivos a Crear/Modificar

### Crear (Backend)

| Archivo | Descripción |
|---------|-------------|
| `database/migrations/xxxx_add_role_to_users_table.php` | Migración de roles |
| `app/Http/Middleware/EnsureIsAdmin.php` | Middleware admin |
| `app/Http/Controllers/Account/*` | Controladores de cuenta |
| `app/Http/Controllers/Admin/*` | Controladores de admin |
| `routes/account.php` | Rutas de cuenta de usuario |
| `routes/admin.php` | Rutas de administración |

### Crear (Frontend)

| Archivo | Descripción |
|---------|-------------|
| `resources/js/layouts/account-layout.tsx` | Layout área usuario |
| `resources/js/layouts/admin-layout.tsx` | Layout área admin |
| `resources/js/pages/account/*.tsx` | Páginas de cuenta |
| `resources/js/pages/admin/*.tsx` | Páginas de admin |
| `resources/js/components/account-sidebar.tsx` | Sidebar de cuenta |
| `resources/js/components/admin-sidebar.tsx` | Sidebar de admin |

### Modificar

| Archivo | Cambios |
|---------|---------|
| `app/Models/User.php` | Agregar role, isAdmin(), isUser(), favorites() |
| `routes/web.php` | Incluir nuevas rutas |
| `bootstrap/app.php` | Registrar middleware EnsureIsAdmin |
| `resources/js/components/public-header.tsx` | Nueva navegación condicional |

---

## Wireframes Sugeridos

### Header Público - No Autenticado
```
┌────────────────────────────────────────────────────────────────────┐
│ [Logo] UtiliZen          Tools   Pricing   [Login] [Sign Up] [🌐] │
└────────────────────────────────────────────────────────────────────┘
```

### Header Público - Usuario Autenticado
```
┌────────────────────────────────────────────────────────────────────┐
│ [Logo] UtiliZen          Tools   Pricing        [👤 John ▼] [🌐]  │
└────────────────────────────────────────────────────────────────────┘
                                                    │
                                                    ├─ Mi Cuenta
                                                    ├─ Mi Plan
                                                    ├─ Configuración
                                                    └─ Cerrar Sesión
```

### Header Público - Admin Autenticado
```
┌────────────────────────────────────────────────────────────────────┐
│ [Logo] UtiliZen    Tools  Pricing  [🛡️ Admin]   [👤 Admin ▼] [🌐] │
└────────────────────────────────────────────────────────────────────┘
```

### Sidebar Área de Usuario
```
┌──────────────────────┐
│ [Logo] UtiliZen      │
├──────────────────────┤
│ 📊 Overview          │ ← Active
│ 👤 Mi Perfil         │
│ 🔐 Seguridad         │
│ 💳 Mi Plan           │
│ 🧾 Facturación       │
│ 📈 Mi Uso            │
│ ⭐ Favoritos         │
│ ⚙️ Preferencias      │
├──────────────────────┤
│ ← Volver al sitio    │
├──────────────────────┤
│ [👤 John Doe      ▼] │
│     Cerrar Sesión    │
└──────────────────────┘
```

### Sidebar Área de Admin
```
┌──────────────────────┐
│ [Logo] Admin Panel   │
├──────────────────────┤
│ 📊 Dashboard         │ ← Active
│ 👥 Usuarios          │
│ 🛠️ Herramientas      │
│ 💰 Suscripciones     │
│ 📈 Analytics      ▼  │
│    └─ Overview       │
│    └─ Por Tool       │
│    └─ Por Usuario    │
│    └─ Ingresos       │
│ 🔍 SEO            ▼  │
│    └─ Overview       │
│    └─ Por Tool       │
│    └─ Sitemap        │
│ ⚙️ Configuración     │
├──────────────────────┤
│ ← Volver al sitio    │
├──────────────────────┤
│ [🛡️ Admin User   ▼] │
│     Mi Cuenta        │
│     Cerrar Sesión    │
└──────────────────────┘
```

---

## Progreso de Implementación

### Fase 1: Base - ✅ COMPLETADA

| Tarea | Estado | Archivos |
|-------|--------|----------|
| Migración de roles | ✅ | `database/migrations/2026_02_02_164859_add_role_to_users_table.php` |
| Actualizar modelo User | ✅ | `app/Models/User.php` - `isAdmin()`, `isUser()`, role fillable/cast |
| Crear middleware EnsureIsAdmin | ✅ | `app/Http/Middleware/EnsureIsAdmin.php` |
| Registrar middleware | ✅ | `bootstrap/app.php` - alias 'admin' |
| Actualizar navegación pública | ✅ | `resources/js/components/public-header.tsx` |
| Compartir isAdmin en Inertia | ✅ | `app/Http/Middleware/HandleInertiaRequests.php` |

### Fase 2: Área de Usuario - ✅ COMPLETADA

| Tarea | Estado | Archivos |
|-------|--------|----------|
| Layout de Account | ✅ | `resources/js/layouts/account/layout.tsx` |
| Rutas de Account | ✅ | `routes/account.php` |
| AccountController | ✅ | `app/Http/Controllers/Account/AccountController.php` |
| Página Overview | ✅ | `resources/js/pages/account/overview.tsx` |
| Página Profile | ✅ | `resources/js/pages/account/profile.tsx` |
| Página Security | ✅ | `resources/js/pages/account/security.tsx` (password + 2FA) |
| Página Subscription | ✅ | `resources/js/pages/account/subscription.tsx` |
| Página Billing | ✅ | `resources/js/pages/account/billing.tsx` |
| Página Usage | ✅ | `resources/js/pages/account/usage.tsx` |
| Página Preferences | ✅ | `resources/js/pages/account/preferences.tsx` |

### Componentes UI Creados

| Componente | Archivo |
|------------|---------|
| Table | `resources/js/components/ui/table.tsx` |
| Progress | `resources/js/components/ui/progress.tsx` |
| Switch | `resources/js/components/ui/switch.tsx` |

### Fase 3: Área de Admin - ✅ COMPLETADA (Base)

| Tarea | Estado | Archivos |
|-------|--------|----------|
| Layout de Admin | ✅ | `resources/js/layouts/admin/layout.tsx` |
| Rutas de Admin | ✅ | `routes/admin.php` |
| Dashboard Admin | ✅ | `resources/js/pages/admin/dashboard.tsx` |
| AdminDashboardController | ✅ | `app/Http/Controllers/Admin/AdminDashboardController.php` |
| Gestión de Usuarios | ✅ | `resources/js/pages/admin/users/index.tsx`, `show.tsx` |
| UserController (Admin) | ✅ | `app/Http/Controllers/Admin/UserController.php` |
| Gestión de Tools | ✅ | `resources/js/pages/admin/tools/index.tsx`, `edit.tsx` |
| ToolAdminController | ✅ | `app/Http/Controllers/Admin/ToolAdminController.php` |
| Tests de Admin | ✅ | `tests/Feature/Admin/AdminAccessTest.php` |
| Analytics | 🔲 | `resources/js/pages/admin/analytics/*.tsx` |
| SEO Dashboard | 🔲 | `resources/js/pages/admin/seo/*.tsx` |

### Componentes UI Adicionales

| Componente | Archivo |
|------------|---------|
| Textarea | `resources/js/components/ui/textarea.tsx` |

### Fase 4: Integración Stripe - 🔲 PENDIENTE

| Tarea | Estado |
|-------|--------|
| Configurar Stripe | 🔲 |
| Checkout para upgrade | 🔲 |
| Portal de facturación | 🔲 |
| Webhooks | 🔲 |

---

## Rutas Implementadas

```bash
# Account Routes (all require auth + verified)
GET     /account                    → Redirect to /account/overview
GET     /account/overview           → AccountController@overview
GET     /account/profile            → ProfileController@edit
PATCH   /account/profile            → ProfileController@update
DELETE  /account/profile            → ProfileController@destroy
GET     /account/security           → Inertia render (2FA data)
PUT     /account/security/password  → PasswordController@update
GET     /account/subscription       → AccountController@subscription
GET     /account/billing            → AccountController@billing
GET     /account/usage              → AccountController@usage
GET     /account/preferences        → AccountController@preferences
PATCH   /account/preferences        → AccountController@updatePreferences

# Admin Routes (all require auth + verified + admin)
GET     /admin                      → Redirect to /admin/dashboard
GET     /admin/dashboard            → AdminDashboardController@index
GET     /admin/users                → UserController@index
GET     /admin/users/{user}         → UserController@show
PATCH   /admin/users/{user}         → UserController@update
DELETE  /admin/users/{user}         → UserController@destroy
GET     /admin/tools                → ToolAdminController@index
GET     /admin/tools/create         → ToolAdminController@create
POST    /admin/tools                → ToolAdminController@store
GET     /admin/tools/{tool}         → ToolAdminController@edit
PATCH   /admin/tools/{tool}         → ToolAdminController@update
DELETE  /admin/tools/{tool}         → ToolAdminController@destroy
```

---

## Próximos Pasos

1. ✅ ~~Revisar y aprobar esta propuesta de estructura~~
2. ✅ ~~Crear las migraciones de base de datos~~
3. ✅ ~~Implementar middleware y rutas~~
4. ✅ ~~Crear layouts y páginas de Account~~
5. ✅ ~~Crear área de administración (`/admin/*`)~~
6. 🔲 **SIGUIENTE:** Agregar Analytics y SEO Dashboard en admin
7. 🔲 Integrar Stripe para billing
