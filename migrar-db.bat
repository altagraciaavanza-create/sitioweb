@echo off
setlocal enabledelayedexpansion
title Alta Gracia Avanza - Migrar base de datos

REM Se ubica en la carpeta donde esta este .bat, sin importar desde donde se lo ejecute.
cd /d "%~dp0"

echo ============================================
echo   Alta Gracia Avanza - Migrar base de datos
echo ============================================
echo.
echo Esto aplica los cambios pendientes de estructura
echo (tablas nuevas, columnas nuevas, etc.) a tu base
echo de datos de Supabase. Es seguro correrlo varias
echo veces: si no hay nada pendiente, no hace nada.
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
    echo credenciales de Supabase antes de migrar.
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

REM La migracion "0001_add_team_whatsapp" se aplico una vez a mano y quedo
REM sin registrar en la tabla de control de Drizzle. La marcamos como
REM aplicada (sin tocar ninguna tabla del sitio) antes de seguir; si ya
REM estaba marcada, esto no hace nada.
call npm run db:fix-migration-tracking -- 0001_add_team_whatsapp > migracion-log.txt 2>&1

REM Por el mismo motivo, algunas columnas de "site_settings" (contacto,
REM redes sociales) quedaron mezcladas dentro de la migracion 0000 en vez
REM de ser una migracion nueva, y esa nunca se vuelve a mirar. Las agrega
REM si faltan; si ya estan, no hace nada.
call npm run db:repair-schema >> migracion-log.txt 2>&1

echo Aplicando migraciones pendientes...
echo ^(esto puede tardar unos segundos, no cierres la ventana^)
echo.

REM Usamos nuestro propio script (scripts/migrate.ts) en vez de
REM "drizzle-kit migrate": esa herramienta usa un spinner de consola que en
REM Windows a veces se cuelga y tapa el error real. Este script hace lo
REM mismo pero con un try/catch simple que muestra cualquier error de punta
REM a punta.
call npm run db:migrate:direct >> migracion-log.txt 2>&1
set MIGRATE_EXIT=%errorlevel%

type migracion-log.txt

echo.
if %MIGRATE_EXIT% neq 0 (
    echo ============================================
    echo   [ERROR] Fallo la migracion.
    echo ============================================
    echo.
    echo El detalle completo tambien quedo guardado en:
    echo %cd%\migracion-log.txt
    echo Podes copiar ese archivo y pasarmelo para que lo revise.
    echo.
    pause
    exit /b 1
)

echo ============================================
echo   Listo! La base de datos esta actualizada.
echo ============================================
echo.
pause
