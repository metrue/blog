const ejs = require('ejs')
const fs = require('fs-extra')
const path = require('path')
const injectScripts = require('html-inject-script')

const PUBLIC_DIR = './public'
const POST_DIR = './public/blog'

const renderToFile = (srcPath, destPath, data = {}) => {
  const src = fs.readFileSync(srcPath, { encoding: 'utf8' })
  const output = ejs.render(src, { data })
  fs.writeFileSync(destPath, output, { encoding: 'utf8' })
}

const getAllFiles = dir =>
  fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file)
    const isDirectory = fs.statSync(name).isDirectory()
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
  }, [])

const injectStyle = (src) => {
  const dst = `${src}.copy`
  fs.copySync(src, dst)

  const sSrc = fs.createReadStream(dst)
  const sDst = fs.createWriteStream(src)
  sSrc
    .pipe(injectScripts(['/extra.js']))
    .pipe(sDst)
  fs.removeSync(dst)
}

const postersList = [
  "小程序跳坑指南",
  "在Udacity 我们这样做前端开发", "Go 开发小记之 AES 加密", "Worth Going Index", "Go 开发小记之日志", "Go 开发小记之测试", "2017年终总结", "用一个 JavaScript 函数来实现 ChatOps", "我的第一个 Golang 项目 fx", "记一次大规模重构", "Bug和Feature", "离开和开始", "用代码来浅说CORS那些事儿", "YoYo自己打造一个评论服务", "Style in JS", "用开源工具构建一个类Dash工具", "基于Docker的无痛部署", "如何失败的做一个产品开发者", "细说Python的并发与并行", "听说你要开始写Python", "深入浅出Redux的异步Actions", "说说我所经历的公司", "闲聊网页Responsive设计的一些小点", "React项目中使用dagre-d3", "优雅的使用Node的child_process中的spawn和exec", "自己动手写一个vim插件吧", "善用Git-Hook-安全使用GitHub", "认识和使用Flux", "一行代码生成网站APP", "独自旅行", "XCodeGhost事件然后呢", "这次我们没有成功", "我曾经的情绪我曾经的歌", "在linode上搭建ShadowSocks服务实现科学上网", "韩国 JeJu 小记", "Slack:借着IRC的刀走在杀死Email的路上", "Git Submodule 的正确姿势", "Objective-C内存管理-1", "iOS如何导入XMPPFramework到iOS项目中", "2014年总结", "YIQIWAN.US 的诞生记", "Block in Ruby and Objective C", "一个想法到MVP的历程", "我要结婚啦", "在Rails之外使用ActiveRecord", "使用Opencart来搭建私家电商网站", "深入浅出Ruby中的Block", "让人理解自己是一件很难的事", "文字总是要继续的"];

function main () {
  const posts = getAllFiles(POST_DIR)
  .sort((a, b) => {
    const aSlices = a.replace('public/', '').split('/')
    const bSlices = b.replace('public/', '').split('/')
    const aName = aSlices[aSlices.length - 1].replace('.html', '')
    const bName = bSlices[bSlices.length - 1].replace('.html', '')

    const aIndex = postersList.indexOf(aName)
    const bIndex = postersList.indexOf(bName)
    if (aIndex < bIndex) {
      return -1
    }
    if (aIndex > bIndex) {
      return 1
    }

    return 0
  })
  .map(p => {
    injectStyle(p)

    const slices = p.replace('public/', '').split('/')
    const category = slices[1] || ''
    let tag = ''
    if (slices[2] && !slices[2].includes(path.basename(p))) {
      tag = slices[2]
    }

    return {
      path: p.replace('public/', ''),
      category,
      tag,
      title: path.parse(p).name
    }
  })
  renderToFile('index.ejs', `${PUBLIC_DIR}/index.html`, { posts })
}

main()
