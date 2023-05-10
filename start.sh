#bin/bash

cd /home/susong/pongserv/backend
git pull
docker-compose build --no-cache && docker-compose up -d