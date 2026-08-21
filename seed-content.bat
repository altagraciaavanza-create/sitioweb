@echo off
setlocal
cd /d "%~dp0"

echo ============================================
echo  Alta Gracia Avanza - Cargar contenido inicial
echo ============================================
echo  Carpeta: %cd%
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] No se encontro Node.js.
    pause
    exit /b 1
)

if not exist node_modules (
    echo [ERROR] No existe node_modules. Corre start.bat primero.
    pause
    exit /b 1
)

if not exist .env.local (
    echo [ERROR] No existe .env.local con las credenciales de Supabase.
    pause
    exit /b 1
)

echo Cargando menu, datos institucionales, ideas y novedades de ejemplo...
call npm run db:seed-content
if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la carga de contenido. Revisa el mensaje de arriba.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  Listo! Recarga localhost:3001 para verlo.
echo ============================================
echo.
pause
