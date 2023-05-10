#!/bin/bash

echo "스크립트 시작"
cd /home/susong/pongserv
echo "작업 디렉토리 이동 완료"
git pull
echo "git pull 완료"
docker-compose down 
echo "docker-compose down 완료"
docker-compose build --no-cache && docker-compose up -d
echo "docker-compose build 완료"

echo "스크립트 종료"
docker ps
