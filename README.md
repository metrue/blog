<img src="https://raw.githubusercontent.com/***REMOVED***/Seal/master/screenshots/home.png" alt="home" style="width: 300px;"/>
<img src="https://raw.githubusercontent.com/***REMOVED***/Seal/master/screenshots/post.png" alt="home" style="width: 300px;"/>

# Seal

Yet another static website generator built on top of Vue 2 and Webpack

### Usage

* update the config.json with your personal information
* start write something in markdown
* then build your site

```
  npm run build # to generate your site in your defined directory
  npm run serve # to watch your site live
```

and you can also build and run it with docker like this.

```
  docker build -f devops/dockerfile.nginx -t seal .
  docker run -d -p 80:80 seal
```

then you can checkout your site at http://localhost now, normally I would like to deploy it to VPS use a small script.

```
## deploy.sh

host='root@<your host ip>'
ssh ${host} <<END
  docker rmi \$(docker images --filter "dangling=true" -q --no-trunc)
  rm -rf /tmp/asmalltalk.com
  git clone git@github.com:***REMOVED***/asmalltalk.com.git /tmp/asmalltalk.com
  cd /tmp/asmalltalk.com
  docker build -f devops/dockerfile.nginx -t seal .
  docker run -d -p 80:80 seal
END
```

then put it into npm script, hit <code> npm run deploy </code> to do the deployment. That's it, have fun.

## LICENSE

MIT
