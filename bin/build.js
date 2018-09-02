const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

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

function main() {
  const posts = getAllFiles(POST_DIR).map(p => {
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
      title: path.parse(p).name,
    }
  })
  renderToFile('index.ejs', `${PUBLIC_DIR}/index.html`, { posts })
}

main()
