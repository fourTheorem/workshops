#!/bin/bash
set -o vi
cd /home/dev
source .env/bin/activate
bash /home/dev/checkbucket.sh ${MY_BUCKET_NAME}
cd /home/dev/work
jupyter lab --ip=0.0.0.0 --no-browser --allow-root
