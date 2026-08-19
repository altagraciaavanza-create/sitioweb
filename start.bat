@echo off
setlocal enabledelayedexpansion
title Alta Gracia Avanza - Servidor local

REM Se ubica en la carpeta donde está este .bat, sin importar desde dónde se lo ejecute.
cd /d "%~dp0"

echo ============================================
echo   Alta Gracia Avanza - Iniciando proyecto
echo ============================================
echo.

REM --- Verificar que Node.js este instalado -------------------------------
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] No se encontro Node.js instalado.
    echo Descargalo desde https://nodejs.org ^(version 20 o superior^) e instalalo.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo Node.js detectado: %NODE_VERSION%
echo.

REM --- Verificar/crear .env.local ------------------------------------------
if not exist ".env.local" (
    if exist ".env.local.example" (
        copy ".env.local.example" ".env.local" >nul
        echo [AVISO] Se creo .env.local a partir de .env.local.example.
        echo          Completa las credenciales de Supabase antes de usar el panel admin
        echo          ^(el sitio publico funciona igual sin esto, con contenido de ejemplo^).
        echo.
    )
)

REM --- Instalar dependencias si hace falta ----------------------------------
if not exist "node_modules" (
    echo Instalando dependencias por primera vez, esto puede tardar unos minutos...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Fallo la instalacion de dependencias.
        pause
        exit /b 1
    )
    echo.
) else (
    echo Dependencias ya instaladas, verificando...
    call npm install --no-audit --no-fund >nul 2>nul
    echo.
)

REM --- Iniciar el servidor de desarrollo ------------------------------------
echo Iniciando el servidor de desarrollo...
echo Cuando aparezca "Ready", abri http://localhost:3000 en el navegador.
echo Panel de administracion: http://localhost:3000/admin/login
echo.
echo Para detener el servidor, cerra esta ventana o presiona Ctrl+C.
echo.

call npm run dev

pause
