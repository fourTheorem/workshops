@ECHO OFF
setlocal
set thisdir=%cd%
for %%I in ("%thisdir%\..") do set "WORKDIR=%%~fI"
echo %WORKDIR%

set "drive=%WORKDIR:~0,1%"
set WORKDIR=%WORKDIR:~2%
set "WORKDIR=%WORKDIR:\=/%"

if %drive%==A set "drive=a"
if %drive%==B set "drive=b"
if %drive%==C set "drive=c"
if %drive%==D set "drive=d"
if %drive%==E set "drive=e"
if %drive%==F set "drive=f"

set "WORKDIR=/%drive%%WORKDIR%"
echo %WORKDIR%

docker run -d --env-file=run.env --name workshop -p "127.0.0.1:8888:8888" -v "%WORKDIR%:/home/dev/work" pelger/aiasaservice
sleep 10
docker logs workshop
docker exec -ti workshop /bin/bash

