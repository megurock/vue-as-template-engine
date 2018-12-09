const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const Prerenderer = require('@prerenderer/prerenderer')
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer')
const src = 'dist'
const dist = 'prerendered'

/**
 * Parse directory and return list of html files
 */
function createHtmlFileList(dir, fileList = []) {
  fs.readdirSync(dir).forEach((fileName) => {
    const fullPath = path.join(dir, fileName)
    const stats = fs.statSync(fullPath)
    if (stats.isFile() && (/\.html/).test(fileName)) {
      fileList.push(fullPath)
    } else if (stats.isDirectory()) {
      return createHtmlFileList(fullPath, fileList)
    }
  })
  return fileList.map((filePath) => {
    const relativePath = path.relative(src, filePath)
    return '/' + relativePath.split(path.sep).join('/')
  })
}

/**
 * 
 */
function postProcessHtml(html) {
  // Remove <script> tags for prerendering
  return html
    .replace(/\s*<script[^<]*<\/script>\s*/igm, '')
    .trim()
}

/**
 * 
 */
async function main() {
  const renderTargets = createHtmlFileList(src)
  const prerenderer = new Prerenderer({
    staticDir: path.join(__dirname, src),
    renderer: new PuppeteerRenderer()
  })
  //
  await prerenderer.initialize()
  const renderedFiles = await prerenderer.renderRoutes(renderTargets)
  renderedFiles.forEach(renderedFile => {
    try {
      const dir = path.dirname(renderedFile.route)
      const fileName = path.basename(renderedFile.route)
      const outputDir = path.join(__dirname, dist, dir)
      const outputFile = `${outputDir}/${fileName}`
      const html = postProcessHtml(renderedFile.html)
      
      console.log(`Prerender ${outputFile}`)
      mkdirp.sync(outputDir)
      fs.writeFileSync(outputFile, postProcessHtml(html))
    } catch(error) {
      console.log(error)
    }
  })
  prerenderer.destroy()
}
//
main()