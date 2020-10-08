#!/bin/bash
WORKDIR=$(dirname $PWD)

docker run -d \
 --env-file=run.env \
 --name workshop \
 -p "127.0.0.1:8888:8888" \
 -v "${WORKDIR}:/home/dev/work" \
 pelger/aiasaservice

sleep 10
docker logs workshop
docker exec -ti workshop /bin/bash
