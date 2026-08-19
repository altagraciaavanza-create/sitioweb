@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ================================================
echo  Alta Gracia Avanza - Publicar en GitHub
echo ================================================
echo  Carpeta: %cd%
echo.

where git >nul 2>nul
if errorlevel 1 (
    echo [ERROR] No se encontro Git instalado.
    echo Descargalo de https://git-scm.com/download/win e instalalo, despues volve a correr este archivo.
    pause
    exit /b 1
)

if not exist package.json (
    echo [ERROR] No estoy parado en la carpeta del proyecto ^(no encuentro package.json^).
    echo Este .bat tiene que estar dentro de web_altagraciaavanza.
    pause
    exit /b 1
)

if not exist .git (
    echo [1/5] Inicializando repositorio git...
    git init
) else (
    echo [1/5] Repositorio git ya existe, sigo...
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
    echo [2/5] Conectando con GitHub...
    git remote add origin https://github.com/altagraciaavanza-create/sitioweb.git
) else (
    echo [2/5] El remoto "origin" ya esta configurado, sigo...
)

echo [3/5] Agregando archivos...
git add -A

git diff --cached --quiet
if errorlevel 1 (
    echo [4/5] Creando commit...
    git commit -m "Sitio Alta Gracia Avanza: Etapa 1 + CMS"
) else (
    echo [4/5] No hay cambios nuevos para commitear, sigo...
)

echo [5/5] Subiendo a GitHub (rama main)...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ============================================================
    echo  Fallo el push. Motivos comunes:
    echo   - Se va a abrir una ventana para iniciar sesion en GitHub
    echo     ^(inicia sesion con la cuenta altagraciaavanza-create^).
    echo     Si eso paso, volve a correr este .bat despues de loguearte.
    echo   - Si el repo en GitHub ya tiene contenido ^(por ejemplo un
    echo     README creado desde la web^), puede rechazar el push. En
    echo     ese caso avisame y lo resolvemos.
    echo ============================================================
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  Listo! Tu codigo esta en:
echo  https://github.com/altagraciaavanza-create/sitioweb
echo ============================================================
echo.
pause
