@echo off
echo ====================================
echo   Tests Unitaires - Ollama Interface
echo ====================================
echo.

:menu
echo Choisissez une option :
echo 1. Lancer tous les tests
echo 2. Lancer les tests en mode watch
echo 3. Generer un rapport de couverture
echo 4. Quitter
echo.
set /p choice="Votre choix (1-4) : "

if "%choice%"=="1" goto run_tests
if "%choice%"=="2" goto watch_tests
if "%choice%"=="3" goto coverage
if "%choice%"=="4" goto end
echo Choix invalide, reessayez.
goto menu

:run_tests
echo.
echo Execution des tests...
echo.
call npm test
pause
goto menu

:watch_tests
echo.
echo Mode watch active (Ctrl+C pour arreter)...
echo.
call npm run test:watch
pause
goto menu

:coverage
echo.
echo Generation du rapport de couverture...
echo.
call npm run test:coverage
echo.
echo Le rapport a ete genere dans : coverage/lcov-report/index.html
echo.
pause
goto menu

:end
echo Au revoir !
exit