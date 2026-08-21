@echo off
setlocal enabledelayedexpansion
title Alta Gracia Avanza - Crear formularios de Participa

REM Se ubica en la carpeta donde esta este .bat, sin importar desde donde se lo ejecute.
cd /d "%~dp0"

echo ============================================
echo   Alta Gracia Avanza - Formularios de Participa
echo ============================================
echo.
echo Esto crea (una sola vez) los formularios para cada
echo tarjeta de /participa que todavia no tenga uno, y
echo los deja asignados. Es seguro correrlo varias veces:
echo si un formulario ya existe, no lo duplica.
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

REM --- Verificar que exista .env.local con las credenciales -----------------
if not exist ".env.local" (
    echo [ERROR] No existe el archivo .env.local todavia.
    echo Corre primero start.bat para crearlo, y completa las
    echo credenciales de Supabase antes de continuar.
    echo.
    pause
    exit /b 1
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
)

echo Creando formularios y asignandolos...
echo.

call npm run db:seed-participation-forms > seed-participacion-log.txt 2>&1
set SEED_EXIT=%errorlevel%

type seed-participacion-log.txt

echo.
if %SEED_EXIT% neq 0 (
    echo ============================================
    echo   [ERROR] Algo fallo.
    echo ============================================
    echo.
    echo El detalle completo tambien quedo guardado en:
    echo %cd%\seed-participacion-log.txt
    echo.
    pause
    exit /b 1
)

echo ============================================
echo   Listo! Entra a /admin/participation para revisar.
echo ============================================
echo.
pause
