@ECHO OFF
docker run -d --env-file=run.env --name workshop -p "127.0.0.1:8888:8888" -v "${WORKDIR}:/home/dev/work" pelger/aiasaservice
sleep 10
docker logs workshop
docker exec -ti workshop /bin/bash




@echo OFF

set "variable=E:\myfiles\app1\data\file.csv"

set "drive=%variable:~0,1%"

set variable=%variable:~2%
set "variable=%variable:\=/%"

if %drive%==A set "drive=a"
if %drive%==B set "drive=b"
if %drive%==C set "drive=c"
if %drive%==D set "drive=d"
if %drive%==E set "drive=e"
if %drive%==F set "drive=f"
if %drive%==G set "drive=g"
if %drive%==H set "drive=h"
if %drive%==I set "drive=i"
if %drive%==J set "drive=j"
if %drive%==K set "drive=k"
if %drive%==L set "drive=l"
if %drive%==M set "drive=m"
if %drive%==N set "drive=n"
if %drive%==O set "drive=o"
if %drive%==P set "drive=p"
if %drive%==Q set "drive=q"


set "variable=/mnt/%drive%%variable%"

echo "%variable%"

@echo ON
