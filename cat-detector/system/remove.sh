#!/bin/bash
. checkenv.sh

SERVICES=(ui-service crawler-service analysis-service resources)

function remove () {
  for SERVICE in "${SERVICES[@]}"
  do
    echo ----------[ removing $SERVICE ]----------
    cd $SERVICE
    serverless remove
    cd ..
  done
}

remove

