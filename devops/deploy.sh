#!/bin/bash

target='root@139.162.23.110'
ssh ${target} <<END
  docker rmi \$(docker images --filter "dangling=true" -q --no-trunc)
  rm -rf /tmp/minghe.me
  git clone https://github.com/***REMOVED***/***REMOVED***.github.io.git /tmp/minghe.me
  cd /tmp/minghe.me

  docker rm \$(docker stop \$(docker ps -a -q --filter ancestor=seal  --format="{{.ID}}"))

  docker run --rm -p 80:80 -p 443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt \
    quay.io/letsencrypt/letsencrypt auth \
    --standalone -m h.minghe@gmail.com --agree-tos \
    -d minghe.me

  docker run --rm -p 80:80 -p 443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt \
    quay.io/letsencrypt/letsencrypt renew \
    --standalone

   docker run -p 80:80 -p 443:443 -v /tmp/minghe.me/posts:/opt/cici/posts  -v /tmp/minghe.me/devops/nginx.conf:/etc/nginx/nginx.conf ***REMOVED***/cici
END
