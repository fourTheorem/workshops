@ECHO OFF
docker-compose up -d
SLEEP 10
docker logs $(docker ps -q -q)
docker exec -ti $(docker ps -q -q) /bin/bash
