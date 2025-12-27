# 🐛 Debugging: Tracking No Funciona

## Problema Identificado

Los cambios al código React **no están compilados**. El navegador está usando código viejo.

## Solución

### Opción 1: Modo Desarrollo (Recomendado)
```bash
npm run dev
# o
yarn dev
```

Esto iniciará Vite en modo watch y recompilará automáticamente cuando hagas cambios.

### Opción 2: Build para Producción
```bash
npm run build
# o
yarn build
```

---

## Verificación

### 1. Abre la Consola del Navegador (F12)

Ve a la herramienta y genera código. Deberías ver:

**En la pestaña Network:**
- Request a `/api/usage/track`
- Method: POST
- Status: 200
- Response:
  ```json
  {
    "success": true,
    "message": "Usage tracked successfully",
    "debug": {
      "user_id": 1,       // o null si no estás autenticado
      "session_id": "...",
      "has_session": true
    }
  }
  ```

**En la pestaña Console:**
- NO debería haber errores de `useToolTracking is not defined`
- NO debería haber errores de `QueryClient`

### 2. Verifica los Logs del Servidor

En terminal, ejecuta:
```bash
tail -f storage/logs/laravel.log | grep "Usage Tracking"
```

Luego genera código en el navegador. Deberías ver:
```
[2025-12-25 XX:XX:XX] local.INFO: Usage Tracking Request {"has_session":true,"user_id":1,...}
```

### 3. Verifica la Base de Datos

```bash
php artisan tinker
>>> App\Models\ToolUsage::latest()->first();
```

Debería mostrar el registro más reciente que acabas de crear.

---

## Checklist de Debugging

- [ ] Vite está corriendo (`npm run dev`)
- [ ] No hay errores en la consola del navegador
- [ ] La request POST aparece en Network tab
- [ ] El log muestra "Usage Tracking Request"
- [ ] Se crea un registro en la base de datos

---

## Comandos Útiles

### Ver registros recientes
```bash
php artisan tinker --execute="
\$records = App\Models\ToolUsage::latest()->take(5)->get();
foreach (\$records as \$r) {
    echo 'ID: ' . \$r->id . ' | Action: ' . \$r->action . ' | Created: ' . \$r->created_at . PHP_EOL;
}
"
```

### Limpiar cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Verificar queue
```bash
# Ver driver
php artisan tinker --execute="echo config('queue.default');"

# Procesar jobs manualmente (si hay pendientes)
php artisan queue:work --once
```
