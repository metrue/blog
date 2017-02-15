#!/bin/bash

host='root@139.162.72.153'
ssh ${host} <<END
  docker rmi \$(docker images --filter "dangling=true" -q --no-trunc)
  rm -rf /tmp/minghe.me
  git clone git@github.com:metrue/metrue.github.io.git /tmp/minghe.me
  cd /tmp/minghe.me

	docker run --rm -p 80:80 -p 443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt \
    quay.io/letsencrypt/letsencrypt auth \
    --standalone -m h.minghe@gmail.com --agree-tos \
    -d minghe.me

  docker build -f devops/dockerfile.nginx -t seal .
  docker run -d -p 80:80 -v /etc/letsencrypt:/etc/letsencrypt seal
END
