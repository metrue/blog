#!/bin/bash

host='root@139.162.72.153'
ssh ${host} <<END
  docker rmi \$(docker images --filter "dangling=true" -q --no-trunc)
  rm -rf /tmp/asmalltalk.com
  git clone git@github.com:metrue/metrue.github.io.git /tmp/minghe.me
  cd /tmp/minghe.me
  docker build -f devops/dockerfile.nginx -t seal .
  docker run -d -p 80:80 seal
END
