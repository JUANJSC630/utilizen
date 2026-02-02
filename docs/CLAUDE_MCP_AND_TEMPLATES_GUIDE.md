# Guía de MCP y Claude Code Templates - UtiliZen

> **Documento de Referencia**
> Última actualización: Febrero 2026
> Stack: Laravel 12 + Inertia.js v2 + React 19 + Tailwind v4

---

## Tabla de Contenidos

1. [¿Qué es MCP?](#qué-es-mcp)
2. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
3. [MCP Servers Recomendados](#mcp-servers-recomendados)
4. [Laravel MCP (Crear tu propio servidor)](#laravel-mcp)
5. [Claude Code Templates (aitmpl.com)](#claude-code-templates)
6. [Claude Code Skills](#claude-code-skills)
7. [Configuración Recomendada](#configuración-recomendada)
8. [Casos de Uso para UtiliZen](#casos-de-uso-para-utilizen)

---

## ¿Qué es MCP?

**MCP (Model Context Protocol)** es el estándar abierto de Anthropic que permite a Claude conectarse con fuentes de datos externas y herramientas de forma segura.

### ¿Cómo funciona?

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│ Claude Code │ ←→  │ MCP Server  │ ←→  │ Base de Datos   │
│             │     │             │     │ APIs            │
│             │     │             │     │ Archivos        │
│             │     │             │     │ Git/GitHub      │
└─────────────┘     └─────────────┘     └─────────────────┘
```

### Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| **Contexto Enriquecido** | Claude accede a datos en tiempo real de tu proyecto |
| **Automatización** | Ejecuta tareas en tu entorno de desarrollo |
| **Integración** | Conecta con bases de datos, APIs, Git, y más |
| **Seguridad** | Control granular sobre qué puede acceder Claude |

---

## Estado Actual del Proyecto

UtiliZen ya tiene configurado **Laravel Boost MCP**:

**`.mcp.json`:**
```json
{
  "mcpServers": {
    "laravel-boost": {
      "command": "php",
      "args": ["artisan", "boost:mcp"]
    }
  }
}
```

### ¿Qué proporciona Laravel Boost MCP?

| Herramienta | Función |
|-------------|---------|
| `search-docs` | Busca documentación de Laravel, Inertia, Tailwind, etc. |
| `tinker` | Ejecuta código PHP para debugging |
| `database-query` | Consultas SQL directas a la base de datos |
| `browser-logs` | Lee logs del navegador |
| `get-absolute-url` | Genera URLs correctas para el proyecto |
| `list-artisan-commands` | Lista comandos artisan disponibles |

---

## MCP Servers Recomendados

### Para Desarrollo Web (Laravel + React)

#### 1. GitHub MCP
**Función:** Gestionar PRs, issues, commits, CI/CD

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

**Beneficios para UtiliZen:**
- Revisar PRs automáticamente
- Crear issues desde Claude
- Ver estado de CI/CD
- Gestionar releases

#### 2. PostgreSQL / SQLite MCP
**Función:** Consultas a base de datos con lenguaje natural

```bash
# Para PostgreSQL
claude mcp add --transport stdio postgres -- npx -y @bytebase/dbhub \
  --dsn "postgresql://user:pass@localhost:5432/utilizen"

# Para SQLite (tu caso)
claude mcp add --transport stdio sqlite -- npx -y @bytebase/dbhub \
  --dsn "sqlite:///path/to/database.sqlite"
```

**Beneficios para UtiliZen:**
- "Muéstrame las herramientas más usadas"
- "¿Cuántos usuarios se registraron esta semana?"
- "Lista los tools premium"
- Debugging de queries

#### 3. Playwright MCP
**Función:** Automatización de navegador, testing E2E

```bash
claude mcp add --transport stdio playwright -- npx -y @playwright/mcp@latest
```

**Beneficios para UtiliZen:**
- Testing E2E automatizado
- Screenshots de páginas
- Verificar UI en diferentes resoluciones
- Debugging visual

#### 4. Sentry MCP
**Función:** Monitoreo de errores en producción

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**Beneficios para UtiliZen:**
- Ver errores en tiempo real
- Analizar stack traces
- Priorizar bugs
- Debugging de producción

#### 5. Filesystem MCP
**Función:** Operaciones de archivos seguras

```bash
claude mcp add --transport stdio filesystem -- npx -y @modelcontextprotocol/server-filesystem \
  --allowed-directories "/Users/juanjsc/Herd/utilizen"
```

**Beneficios para UtiliZen:**
- Búsqueda avanzada de archivos
- Análisis de estructura del proyecto
- Operaciones batch en archivos

### Tabla Resumen

| MCP Server | Uso Principal | Prioridad |
|------------|---------------|-----------|
| Laravel Boost | Docs, Tinker, Queries | ✅ Ya instalado |
| GitHub | PRs, Issues, CI/CD | Alta |
| Database (SQLite) | Queries en lenguaje natural | Alta |
| Playwright | Testing E2E | Media |
| Sentry | Errores de producción | Media |
| Filesystem | Operaciones de archivos | Baja (Claude ya lo tiene) |

---

## Laravel MCP

El paquete `laravel/mcp` te permite **crear tu propio MCP server** para exponer funcionalidades específicas de tu aplicación a Claude.

### Instalación

```bash
composer require laravel/mcp
php artisan vendor:publish --tag=ai-routes
```

Esto crea `routes/ai.php` para registrar tus servidores MCP.

### ¿Para qué sirve?

Crear herramientas personalizadas que Claude puede usar:

| Componente | Descripción | Ejemplo |
|------------|-------------|---------|
| **Tools** | Funciones que Claude puede ejecutar | Generar componente React, validar código |
| **Resources** | Datos que compartes con Claude | Lista de herramientas, configuración |
| **Prompts** | Plantillas reutilizables | Prompt para generar tests |

### Ejemplo: Tool para generar componentes

```bash
php artisan make:mcp-server ToolGeneratorServer
php artisan make:mcp-tool GenerateReactComponentTool
```

```php
// app/MCP/Tools/GenerateReactComponentTool.php
class GenerateReactComponentTool extends Tool
{
    public function __construct()
    {
        parent::__construct(
            name: 'generate-react-component',
            description: 'Generates a React component based on specifications'
        );
    }

    public function handle(string $componentName, string $type = 'functional'): string
    {
        // Lógica para generar el componente
        return "Component {$componentName} generated successfully";
    }
}
```

### Ideas de Tools para UtiliZen

| Tool | Función |
|------|---------|
| `analyze-tool-usage` | Analiza estadísticas de uso de herramientas |
| `generate-tool-seo` | Genera meta_title y meta_description optimizados |
| `validate-tool-component` | Valida que un componente de herramienta está correcto |
| `export-analytics` | Exporta datos de analytics en formato específico |

### Testing

```bash
php artisan mcp:inspector
```

Abre un inspector interactivo para probar tus tools, resources y prompts.

---

## Claude Code Templates

[aitmpl.com](https://www.aitmpl.com/skills) es un repositorio de templates y configuraciones para Claude Code.

### Instalación del CLI

```bash
npm install -g claude-code-templates
```

### Categorías Disponibles

| Categoría | Descripción | Ejemplos |
|-----------|-------------|----------|
| 🎨 **Skills** | Habilidades específicas | PDF processing, code review |
| 🤖 **Agents** | Personas especializadas | Frontend developer, security auditor |
| ⚡ **Commands** | Comandos personalizados | /deploy, /test, /review |
| ⚙️ **Settings** | Configuraciones | CLAUDE.md optimizados |
| 🪝 **Hooks** | Automatizaciones | Pre-commit, post-push |
| 🔌 **MCPs** | Servidores MCP | Database, APIs |

### Templates Recomendados para UtiliZen

#### 1. Neon - Complete Postgres Template
**Para:** Integración con base de datos
```bash
# Desde aitmpl.com, buscar "Neon"
```

#### 2. ClaudeKit - AI Agents & Skills
**Para:** Agentes especializados para desarrollo
```bash
# Desde aitmpl.com, buscar "ClaudeKit"
```

#### 3. React Templates
**Para:** Configuraciones optimizadas para React
- CLAUDE.md con best practices de React
- Hooks para linting y formatting
- Commands para testing

#### 4. aitmpl-downloader Skill
**Para:** Descargar templates directamente desde Claude
```bash
# Instalar el skill y luego usar:
# "Download the React component generator template from aitmpl"
```

### Cómo Explorar Templates

1. Visitar [aitmpl.com/skills](https://www.aitmpl.com/skills)
2. Filtrar por categoría (Agents, Commands, MCPs, etc.)
3. Buscar por framework (React, Laravel, etc.)
4. Ver analytics del template (uso, popularidad)

---

## Claude Code Skills

Los **Skills** son carpetas con instrucciones que Claude carga dinámicamente para tareas específicas.

### Estructura de un Skill

```
my-skill/
└── SKILL.md
```

**SKILL.md:**
```yaml
---
name: utilizen-component-generator
description: Generates React components following UtiliZen conventions and best practices
---

# UtiliZen Component Generator

## When to Use
Use this skill when creating new tool components for UtiliZen.

## Guidelines
1. Use TypeScript with strict types
2. Follow the existing component structure in resources/js/pages/tools/
3. Include proper SEO meta tags
4. Add usage tracking with trackToolUsage()

## Component Template
[Template code here...]

## Examples
- "Create a new JSON formatter tool"
- "Generate a regex tester component"
```

### Instalación de Skills

**Personales:** `~/.claude/skills/`
**Por proyecto:** `.claude/skills/`

### Skills Recomendados para UtiliZen

| Skill | Función | Fuente |
|-------|---------|--------|
| **PDF Skill** | Procesar y extraer datos de PDFs | [anthropics/skills](https://github.com/anthropics/skills) |
| **Code Review Skill** | Revisar código con best practices | Community |
| **Testing Skill** | Generar tests automáticamente | Community |
| **Documentation Skill** | Generar documentación | Community |

### Crear Skill Personalizado para UtiliZen

```bash
mkdir -p .claude/skills/utilizen-tools
```

**`.claude/skills/utilizen-tools/SKILL.md`:**
```yaml
---
name: utilizen-tools
description: Creates new developer tools for UtiliZen following project conventions
---

# UtiliZen Tools Creator

## Purpose
Generate new developer tools that follow UtiliZen's architecture and conventions.

## File Structure for New Tools
1. Database: Create migration and seed for Tool model
2. Backend: No controller needed (uses generic ToolController)
3. Frontend: Create component in resources/js/pages/tools/
4. SEO: Add meta_title, meta_description, keywords to seed

## Component Requirements
- TypeScript with proper interfaces
- Tailwind CSS for styling (dark mode support)
- Usage tracking with trackToolUsage()
- Responsive design
- Accessibility (a11y) compliance

## Database Fields
- name: Tool display name
- slug: URL-friendly identifier
- description: Brief description
- component_name: React component name (PascalCase)
- category: generators | validators | converters | analyzers | utilities
- is_active: boolean
- is_premium: boolean
- meta_title: SEO title (optional)
- meta_description: SEO description (optional)
- keywords: SEO keywords (optional)

## Example Usage
"Create a new tool called 'JSON Formatter' in the utilities category"
```

---

## Configuración Recomendada

### Paso 1: Agregar MCP Servers Útiles

Actualizar `.mcp.json`:

```json
{
  "mcpServers": {
    "laravel-boost": {
      "command": "php",
      "args": ["artisan", "boost:mcp"]
    },
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

### Paso 2: Instalar Claude Code Templates CLI

```bash
npm install -g claude-code-templates
```

### Paso 3: Crear Skill Personalizado

```bash
mkdir -p .claude/skills/utilizen-tools
# Crear SKILL.md con las convenciones del proyecto
```

### Paso 4: Actualizar CLAUDE.md (opcional)

Agregar sección sobre MCP y Skills disponibles:

```markdown
## MCP Servers Available
- **laravel-boost**: Documentation search, tinker, database queries
- **github**: PR management, issues, CI/CD
- **playwright**: E2E testing, screenshots

## Custom Skills
- **utilizen-tools**: Create new developer tools following project conventions
```

---

## Casos de Uso para UtiliZen

### 1. Crear Nueva Herramienta Rápidamente

```
User: "Crea una nueva herramienta llamada 'Base64 Encoder/Decoder' en la categoría utilities"

Claude (usando skill utilizen-tools):
1. Crea migración para agregar el tool
2. Crea seeder con datos SEO
3. Genera componente React en resources/js/pages/tools/Base64EncoderDecoder.tsx
4. Incluye tracking de uso
5. Soporta dark mode
```

### 2. Analizar Uso de Herramientas

```
User: "¿Cuáles son las herramientas más usadas esta semana?"

Claude (usando Laravel Boost MCP → database-query):
- Ejecuta query a tool_usages
- Agrupa por tool_id
- Ordena por count
- Presenta resultados
```

### 3. Debugging de Errores

```
User: "Hay un error en el React Component Generator, ¿puedes investigar?"

Claude (usando Sentry MCP + Laravel Boost):
- Consulta errores recientes en Sentry
- Lee logs del navegador
- Analiza stack trace
- Sugiere fix
```

### 4. Testing E2E

```
User: "Verifica que todas las herramientas públicas cargan correctamente"

Claude (usando Playwright MCP):
- Navega a cada /tools/{slug}
- Verifica que no hay errores
- Toma screenshots
- Reporta resultados
```

### 5. Optimización SEO

```
User: "Genera meta descriptions optimizadas para todas las herramientas que no tienen"

Claude (usando database-query + skill):
- Consulta tools sin meta_description
- Genera descripciones SEO-friendly basadas en el nombre y descripción
- Crea migración o seed para actualizar
```

---

## Recursos Adicionales

### Documentación Oficial

- [Claude Code MCP Docs](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Laravel MCP Package](https://laravel.com/docs/12.x/mcp)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)

### Marketplaces de MCP Servers

- [mcp.so](https://mcp.so/) - 17,500+ servers
- [mcpservers.org](https://mcpservers.org/) - Curated directory
- [GitHub MCP Servers](https://github.com/modelcontextprotocol/servers)

### Claude Code Templates

- [aitmpl.com](https://www.aitmpl.com/skills) - 400+ components
- [aitmpl docs](https://docs.aitmpl.com/)
- [SkillsMP](https://skillsmp.com/) - 96,000+ skills

### Skills

- [Anthropic Skills Repository](https://github.com/anthropics/skills)
- [Community Skills](https://github.com/alirezarezvani/claude-skills)
- [Skills Guide](https://support.claude.com/en/articles/12512198-creating-custom-skills)

---

## Próximos Pasos Recomendados

1. **Inmediato:**
   - [ ] Configurar GitHub MCP para gestión de PRs
   - [ ] Crear skill `utilizen-tools` para generar herramientas

2. **Corto plazo:**
   - [ ] Instalar Playwright MCP para testing E2E
   - [ ] Crear tools personalizados con Laravel MCP

3. **Futuro:**
   - [ ] Configurar Sentry MCP cuando el proyecto esté en producción
   - [ ] Explorar templates de aitmpl.com para optimizar flujo de trabajo
   - [ ] Crear más skills personalizados según necesidades
