#!/bin/bash
docker-compose up -d
sleep 5
docker logs $(docker ps -q -q)
docker exec -ti $(docker ps -q -q) /bin/bash
