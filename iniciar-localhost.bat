@echo off
title Zenix Education - localhost
cd /d "%~dp0"

echo ==============================================
echo  Zenix Education - servidor local
echo ==============================================
echo.

where node >nul 2>nul
if errorlevel 1 goto sem_node

for /f "tokens=1 delims=." %%v in ('node -v') do set NODEMAJOR=%%v
set NODEMAJOR=%NODEMAJOR:v=%
if %NODEMAJOR% LSS 20 goto node_antigo

netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
if not errorlevel 1 goto porta_ocupada

if exist node_modules goto iniciar
echo Instalando dependencias pela primeira vez, aguarde...
call npm install
if errorlevel 1 goto erro_npm

:iniciar
echo Iniciando o servidor... o navegador abre sozinho quando estiver pronto.
echo Endereco: http://localhost:3000
echo.
echo Para ver as alteracoes basta salvar o arquivo, a pagina atualiza sozinha.
echo Para encerrar, feche esta janela ou pressione Ctrl+C.
echo.
start "" /b powershell -NoProfile -Command "for($i=0;$i -lt 120;$i++){ try { Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 3 | Out-Null; Start-Process http://localhost:3000; break } catch { Start-Sleep -Seconds 1 } }"
call npm run dev -- -p 3000
echo.
echo [AVISO] O servidor foi encerrado. Se apareceu algum erro acima, copie a mensagem.
goto fim

:porta_ocupada
echo [AVISO] A porta 3000 ja esta em uso. Provavelmente o servidor ja esta rodando
echo em outra janela. Abrindo http://localhost:3000 no navegador.
echo Se a pagina nao for a do Zenix, feche o outro programa que usa a porta 3000.
start "" http://localhost:3000
goto fim

:node_antigo
echo [ERRO] Sua versao do Node.js e muito antiga (v%NODEMAJOR%). Este projeto
echo precisa do Node.js 20 ou mais novo. Baixe em https://nodejs.org
goto fim

:sem_node
echo [ERRO] Node.js nao encontrado. Instale em https://nodejs.org e tente de novo.
goto fim

:erro_npm
echo [ERRO] Falha ao instalar as dependencias. Veja a mensagem acima.

:fim
echo.
pause
