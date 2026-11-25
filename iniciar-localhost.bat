@echo off
title Zenix Education - localhost
cd /d "%~dp0"

echo ==============================================
echo  Zenix Education - servidor local
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 goto sem_node

if exist node_modules goto iniciar
echo Instalando dependencias pela primeira vez, aguarde...
call npm install
if errorlevel 1 goto erro_npm

:iniciar
echo Iniciando o servidor... o navegador abre sozinho em alguns segundos.
echo Endereco: http://localhost:3000
echo.
echo Para ver as alteracoes basta salvar o arquivo, a pagina atualiza sozinha.
echo Para encerrar, feche esta janela ou pressione Ctrl+C.
echo.
start "" /b cmd /c "ping -n 9 127.0.0.1 >nul & start http://localhost:3000"
call npm run dev
goto fim

:sem_node
echo [ERRO] Node.js nao encontrado. Instale em https://nodejs.org e tente de novo.
goto fim

:erro_npm
echo [ERRO] Falha ao instalar as dependencias.

:fim
echo.
pause
