# Seal

A tool to make blogging painless

### Usage

#### Prerequisite

You should setup github page first, if you don't know how to setup your page, check [Github Page](https://pages.github.com/), after that, you should have a repo like this <username>.github.com

#### Let's go

1. clone [Seal](https://github.com/***REMOVED***/Seal.git)

```
## set Seal as your blogging platform

git clone https://github.com/***REMOVED***/Seal.git <username>.github.com
git remote rm origin

git remote add origin git@github.com:<username>/<username>.github.io.git
```

2. start blogging

```
echo 'happy hacking' > posts/2012-12-12-HelloWorld.md
```

3. deploy your blog

```
npm run deploy
```

4. check your blog

```
open <your-github-id>.github.io
```

## Thanks

inspired by [vue-ghpages-blog]('https://github.com/viko16/vue-ghpages-blog') and [TinyBlog](https://github.com/YangHanqing/TinyBlog/tree/master/js)


## LICENSE

MIT
