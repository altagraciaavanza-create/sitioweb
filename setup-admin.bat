@echo off
setlocal

echo ============================================
echo  Alta Gracia Avanza - Setup de base de datos
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] No se encontro Node.js. Instalalo desde https://nodejs.org y volve a intentar.
    pause
    exit /b 1
)

if not exist node_modules (
    echo [ERROR] No existe la carpeta node_modules.
    echo Corre primero start.bat para instalar las dependencias.
    pause
    exit /b 1
)

if not exist .env.local (
    echo [ERROR] No existe .env.local con las credenciales de Supabase.
    pause
    exit /b 1
)

echo [1/2] Aplicando migraciones a la base de datos...
call npm run db:migrate
if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la migracion. Revisa el mensaje de arriba.
    pause
    exit /b 1
)

echo.
echo [2/2] Creando/actualizando el usuario admin...
call npm run db:seed-admin -- altagraciaavanza@gmail.com admin123**
if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la creacion del usuario admin. Revisa el mensaje de arriba.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  Listo! Ya podes entrar a /admin/login
echo  Usuario:     altagraciaavanza@gmail.com
echo  Contrasena:  admin123**
echo ============================================
echo.
pause
