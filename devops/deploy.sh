#!/bin/bash

target='root@139.162.23.110'
ssh ${target} <<END
  docker rmi \$(docker images --filter "dangling=true" -q --no-trunc)
  rm -rf /tmp/minghe.me
  git clone git@github.com:***REMOVED***/***REMOVED***.github.io.git /tmp/minghe.me
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

  docker build -f devops/dockerfile.nginx -t seal .
  docker run -d -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt seal
END
