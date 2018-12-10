const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const glob = require('glob')
const Prerenderer = require('@prerenderer/prerenderer')
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer')
//
const src = 'dist'
const dist = 'prerendered'
const includes = `./${src}/**/*.html`
const excludes = [] // Specify files to ignore

/**
 *
 */
function createHtmlFileList(dir, fileList = []) {
  return glob.sync(includes, {
    'ignore': excludes,
  }).map((str) => {
    return str.replace(new RegExp(`\\./${src}`), '')
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
      fs.writeFileSync(outputFile, html)
    } catch(error) {
      console.log(error)
    }
  })
  prerenderer.destroy()
}
//
main()