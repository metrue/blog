# Cici

Yet another static website generator built on top of Vue 2 and Webpack, with a nice comment system

### Usage

* from docker

build your own posts
```
  docker run -p 80:80 \
    -v <your posts directory>:/opt/cici/posts \
    ***REMOVED***/cici
```
build output to your own local **public** directory
```
  docker run -p 80:80 \
    -v <your posts directory>:/opt/cici/posts \
    -v <your public directory>:/opt/cici/public \
    ***REMOVED***/cici
```

* from source code

```
$ git clone https://github.com/***REMOVED***/Cici
$ vim posts/<your-new-post.md>
$ npm run develop
```

Your static website is ready on http://localhost:8080, it's easy, right?

## Showcase

* [小聊电台](https://asmalltalk.com)
* [minghe.me](https://minghe.me)

## LICENSE

MIT

## Screenshot
<img src="https://raw.githubusercontent.com/***REMOVED***/Cici/master/screenshots/home.png" width="260px" />
