#!/bin/bash

# Script para reiniciar el servidor de desarrollo de forma limpia
# Uso: ./dev-restart.sh

echo "🔄 Reiniciando servidor de desarrollo..."

# Mata todos los procesos de Vite/Node
echo "⏹️  Deteniendo procesos existentes..."
pkill -f vite 2>/dev/null
pkill -f "php artisan serve" 2>/dev/null
pkill -f "php artisan queue" 2>/dev/null
pkill -f "php artisan pail" 2>/dev/null

# Espera un momento para asegurarse de que los procesos se detengan
sleep 2

# Limpia el puerto 5173 si está en uso
echo "🧹 Limpiando puerto 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Espera otro momento
sleep 1

# Inicia el servidor
echo "🚀 Iniciando servidor de desarrollo..."
composer run dev
