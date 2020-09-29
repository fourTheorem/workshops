#!/bin/bash
set -o vi
cd /home/dev/work/sessions
npm install
cd /home/dev
source .env/bin/activate
cd /home/dev/work
jupyter lab --ip=0.0.0.0 --no-browser --allow-root
