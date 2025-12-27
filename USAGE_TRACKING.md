# 📊 Sistema de Tracking de Uso - Flujo Completo

Este documento explica el flujo completo del sistema de tracking de uso de herramientas en Utilizen.

## 🎯 Objetivo

Trackear todas las interacciones de los usuarios con las herramientas para:
- **Analytics**: Entender qué herramientas son más populares
- **User Behavior**: Ver cómo los usuarios interactúan con las herramientas
- **Session Tracking**: Seguir el journey completo de un usuario
- **Premium Conversion**: Identificar usuarios activos para convertir a premium

---

## 📁 Arquitectura del Sistema

```
Frontend (React)
    ↓
React Query Mutation
    ↓
API Endpoint (/api/usage/track)
    ↓
Controller (UsageTrackingController)
    ↓
Job Queue (TrackToolUsage)
    ↓
Database (tool_usage table)
```

---

## 🔄 Flujo Completo - Paso a Paso

### **1️⃣ FRONTEND - Usuario Interactúa con la Herramienta**

**Archivo:** `resources/js/pages/tools/ReactComponentGenerator.tsx`

```typescript
// Al montar el componente - trackea VIEW
useEffect(() => {
    track({ toolId: tool.id, action: 'view' });
}, []);

// Cuando genera código - trackea GENERATE con metadata
const handleGenerate = () => {
    // ... lógica de generación ...

    track({
        toolId: tool.id,
        action: 'generate',
        metadata: {
            componentType: config.componentType,
            hooksCount: config.hooks.length,
            propsCount: config.propTypes.length,
        },
    });
};
```

**Componente de Output:**
```typescript
// Cuando copia código - trackea COPY
<CodeOutput
    onCopy={() => track({ toolId: tool.id, action: 'copy' })}
    onDownload={() => track({ toolId: tool.id, action: 'download' })}
/>
```

---

### **2️⃣ HOOK - React Query Mutation**

**Archivo:** `resources/js/hooks/use-tool-tracking.ts`

```typescript
export function useToolTracking() {
    const mutation = useMutation({
        mutationFn: trackUsage,  // ← Función que hace el fetch
        onError: (error) => {
            console.error('Failed to track usage:', error);
        },
    });

    return {
        track: mutation.mutate,           // Fire-and-forget
        trackAsync: mutation.mutateAsync,  // Con Promise
        isTracking: mutation.isPending,    // Estado de loading
    };
}
```

**Función de tracking:**
```typescript
async function trackUsage(data: TrackingData): Promise<TrackingResponse> {
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const response = await fetch('/api/usage/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({
            tool_id: data.toolId,
            action: data.action,
            metadata: data.metadata,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to track usage');
    }

    return response.json();
}
```

**Lo que hace:**
- ✅ Obtiene el token CSRF para seguridad
- ✅ Envía la request POST a `/api/usage/track`
- ✅ Maneja errores silenciosamente (no interrumpe UX)
- ✅ Usa React Query para retry automático

---

### **3️⃣ API ROUTE - Endpoint de Tracking**

**Archivo:** `routes/api.php`

```php
// ⚠️ IMPORTANTE: Usa middleware 'web' para tener acceso a sesiones
Route::post('/usage/track', [UsageTrackingController::class, 'track'])
    ->middleware('web')  // ← Clave para capturar user_id y session
    ->name('api.usage.track');
```

**¿Por qué middleware 'web'?**
- ✅ Habilita sesiones (StartSession)
- ✅ Acceso a usuario autenticado via `auth()->user()`
- ✅ Cookies encriptadas
- ✅ CSRF protection
- ✅ Session ID consistente

Sin esto, `user_id` siempre sería `NULL`.

---

### **4️⃣ CONTROLLER - Validación y Dispatch**

**Archivo:** `app/Http/Controllers/Api/UsageTrackingController.php`

```php
public function track(Request $request): JsonResponse
{
    // 1. Validar input
    $validated = $request->validate([
        'tool_id' => 'required|exists:tools,id',
        'action' => 'required|in:view,generate,copy,download',
        'metadata' => 'nullable|array',
    ]);

    // 2. Debug logging (temporal)
    \Log::info('Usage Tracking Request', [
        'has_session' => $request->hasSession(),
        'user_id' => $request->user()?->id,
        'user_email' => $request->user()?->email,
        'session_id' => $request->session()->getId(),
    ]);

    // 3. Obtener o crear session ID personalizado
    if ($request->hasSession()) {
        $sessionId = $request->session()->get('session_id', function () use ($request) {
            $sessionId = Str::uuid()->toString();
            $request->session()->put('session_id', $sessionId);
            return $sessionId;
        });
    } else {
        // Fallback para tests sin sesión
        $sessionId = Str::uuid()->toString();
    }

    // 4. Dispatch job a la queue
    TrackToolUsage::dispatch(
        toolId: $validated['tool_id'],
        userId: $request->user()?->id,      // ← NULL si no autenticado
        sessionId: $sessionId,               // ← Consistente por sesión
        action: $validated['action'],
        metadata: $validated['metadata'] ?? [],
        ipAddress: $request->ip(),
        userAgent: $request->userAgent()
    );

    // 5. Respuesta inmediata (job se procesa en background)
    return response()->json([
        'success' => true,
        'message' => 'Usage tracked successfully',
        'debug' => [
            'user_id' => $request->user()?->id,
            'session_id' => $sessionId,
            'has_session' => $request->hasSession(),
        ],
    ]);
}
```

**Lo que hace:**
- ✅ Valida que tool_id exista y action sea válida
- ✅ Captura el user_id si está autenticado
- ✅ Crea/obtiene session_id consistente
- ✅ Captura IP y User Agent
- ✅ Envía todo a un job asíncrono
- ✅ Responde inmediatamente al frontend

---

### **5️⃣ JOB QUEUE - Procesamiento Asíncrono**

**Archivo:** `app/Jobs/TrackToolUsage.php`

```php
class TrackToolUsage implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private int $toolId,
        private ?int $userId,        // ← Puede ser NULL
        private string $sessionId,
        private string $action,
        private array $metadata = [],
        private ?string $ipAddress = null,
        private ?string $userAgent = null
    ) {}

    public function handle(): void
    {
        // 1. Crear registro en tool_usage
        ToolUsage::create([
            'tool_id' => $this->toolId,
            'user_id' => $this->userId,
            'session_id' => $this->sessionId,
            'action' => $this->action,
            'metadata' => $this->metadata,
            'ip_address' => $this->ipAddress,
            'user_agent' => $this->userAgent,
        ]);

        // 2. Solo incrementar usage_count para action 'generate'
        if ($this->action === 'generate') {
            $tool = Tool::find($this->toolId);
            $tool?->incrementUsage();

            // 3. Limpiar cache
            Cache::forget("tool_stats:{$this->toolId}:7days");
            Cache::forget('tools.popular');
        }
    }
}
```

**¿Por qué un Job?**
- ✅ No bloquea la respuesta al usuario
- ✅ Puede reintentar si falla
- ✅ Se procesa en background
- ✅ No afecta la performance del frontend

---

### **6️⃣ DATABASE - Almacenamiento**

**Migración:** `database/migrations/2025_12_24_222237_create_tool_usage_table.php`

```php
Schema::create('tool_usage', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tool_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
    $table->string('session_id');
    $table->string('action', 50);  // 'view', 'generate', 'copy', 'download'
    $table->json('metadata')->nullable();
    $table->string('ip_address', 45)->nullable();
    $table->text('user_agent')->nullable();
    $table->timestamp('created_at')->useCurrent();

    $table->index('tool_id');
    $table->index('created_at');
    $table->index('action');
});
```

**Modelo:** `app/Models/ToolUsage.php`

```php
class ToolUsage extends Model
{
    public const UPDATED_AT = null;  // Solo created_at

    protected $fillable = [
        'tool_id',
        'user_id',
        'session_id',
        'action',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'created_at' => 'datetime',
        ];
    }
}
```

---

## 📊 Tipos de Acciones

| Acción | Cuándo se Trackea | Incrementa usage_count |
|--------|-------------------|------------------------|
| `view` | Al abrir la herramienta | ❌ No |
| `generate` | Al generar/ejecutar | ✅ Sí |
| `copy` | Al copiar resultado | ❌ No |
| `download` | Al descargar resultado | ❌ No |

---

## 👤 Usuario Autenticado vs Guest

### **Usuario Autenticado:**
```json
{
  "user_id": 1,
  "session_id": "abc-123-def-456",
  "action": "generate"
}
```

### **Usuario Guest:**
```json
{
  "user_id": null,
  "session_id": "xyz-789-uvw-012",
  "action": "view"
}
```

**Ambos mantienen el mismo `session_id` durante toda su sesión.**

---

## 🔍 Ejemplo de Journey Completo

```sql
-- Usuario con ID 1 interactúa con la herramienta
SELECT * FROM tool_usage WHERE user_id = 1 ORDER BY created_at;

| id | tool_id | user_id | session_id | action   | metadata                    | created_at          |
|----|---------|---------|------------|----------|-----------------------------|--------------------|
| 45 | 1       | 1       | abc-123... | view     | null                        | 2025-12-25 14:30:00|
| 46 | 1       | 1       | abc-123... | generate | {"componentType":"functional"} | 2025-12-25 14:30:15|
| 47 | 1       | 1       | abc-123... | copy     | null                        | 2025-12-25 14:30:20|
| 48 | 1       | 1       | abc-123... | generate | {"hooksCount":3}            | 2025-12-25 14:31:00|
| 49 | 1       | 1       | abc-123... | download | null                        | 2025-12-25 14:31:05|
```

**Insights:**
- Usuario vio la herramienta
- Generó código 2 veces (experimentando)
- Copió el código
- Descargó el resultado final
- Todo en la misma sesión (abc-123...)

---

## 🧪 Testing

### **Tests Disponibles:**

```bash
# Tests básicos
php artisan test --filter=UsageTrackingTest

# Tests de autenticación
php artisan test --filter=UsageTrackingAuthTest

# Test de flujo completo end-to-end
php artisan test --filter=UsageTrackingFlowTest

# Todos los tests de tracking
php artisan test --filter=UsageTracking
```

**Total:** 15 tests con 65 assertions ✅

---

## 🛠️ Debugging

### **Ver logs en tiempo real:**
```bash
tail -f storage/logs/laravel.log | grep "Usage Tracking"
```

### **Ver últimos registros:**
```bash
php artisan tinker
>>> App\Models\ToolUsage::latest()->take(10)->get(['id','tool_id','user_id','action','created_at']);
```

### **Limpiar registros de prueba:**
```bash
php artisan tinker
>>> App\Models\ToolUsage::truncate();
```

### **Procesar jobs pendientes:**
```bash
php artisan queue:work --stop-when-empty
```

---

## 📈 Queries Útiles para Analytics

### **Herramientas más usadas:**
```php
DB::table('tool_usage')
    ->select('tool_id', DB::raw('COUNT(*) as total_actions'))
    ->groupBy('tool_id')
    ->orderByDesc('total_actions')
    ->get();
```

### **Usuarios más activos:**
```php
DB::table('tool_usage')
    ->whereNotNull('user_id')
    ->select('user_id', DB::raw('COUNT(*) as actions'))
    ->groupBy('user_id')
    ->orderByDesc('actions')
    ->limit(10)
    ->get();
```

### **Tasa de conversión (view → generate):**
```php
$views = ToolUsage::where('action', 'view')->count();
$generates = ToolUsage::where('action', 'generate')->count();
$conversionRate = ($generates / $views) * 100;
```

### **Journey de una sesión:**
```php
ToolUsage::where('session_id', 'abc-123-def')
    ->orderBy('created_at')
    ->get(['action', 'metadata', 'created_at']);
```

---

## ⚠️ Notas Importantes

1. **Middleware `web` es OBLIGATORIO** en la ruta API para capturar user_id
2. **Jobs se procesan asíncronamente** - verificar con `queue:work`
3. **Solo action `generate` incrementa usage_count** en la tabla tools
4. **session_id es consistente** durante toda la sesión del usuario
5. **Tracking falla silenciosamente** - no interrumpe UX si hay error

---

## 🚀 Próximos Pasos

- [ ] Remover logs de debug del controller en producción
- [ ] Agregar dashboard de analytics
- [ ] Implementar tracking en otras herramientas
- [ ] Agregar eventos de tiempo (tiempo en página, tiempo hasta generar)
- [ ] Implementar heatmaps de interacción

---

## 📚 Archivos Clave

| Tipo | Archivo | Propósito |
|------|---------|-----------|
| Hook | `resources/js/hooks/use-tool-tracking.ts` | React Query mutation |
| Component | `resources/js/components/tools/code-output.tsx` | Botones copy/download |
| Page | `resources/js/pages/tools/ReactComponentGenerator.tsx` | Implementación |
| Route | `routes/api.php` | Endpoint con middleware web |
| Controller | `app/Http/Controllers/Api/UsageTrackingController.php` | Validación y dispatch |
| Job | `app/Jobs/TrackToolUsage.php` | Procesamiento asíncrono |
| Model | `app/Models/ToolUsage.php` | Eloquent model |
| Migration | `database/migrations/2025_12_24_222237_create_tool_usage_table.php` | Schema |

---

**Última actualización:** 2025-12-25
**Tests pasando:** 15/15 ✅
**Coverage:** Flujo completo end-to-end
