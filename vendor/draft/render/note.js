
/**
 * @description 渲染文章页面
 * @param {*} config 博客全局配置JSON
 * @param {*} globalScript 全局script
 * @param { Object } payload 数据
 * payload 属性 {
 *  articleHtml 文章内容html
 *  articleConfig 文章配置JSON
 *  asideHtml 侧边栏html
 *  topRightLinkHtml 顶部右侧链接，当屏幕小时，只保留最后一个
 * }
 */
function render(config, globalScript, payload) {
  let {title, footer} = config
  let { articleHtml, articleConfig, asideHtml, topRightLinkHtml } = payload

  // 放在文章标题上面的一栏，显示时间、作者，对于文章配置
  let articleTop = !articleConfig.createDate ? '' : `
    <div class="article-top">
      <div>${articleConfig.createDate}</div> 
      <div class="article-top-right">Author: ${articleConfig.author}</div>
    </div>
  `

  // 分类的链接
  let categoryHref = '/blog/category.html#' + articleConfig.category.toLowerCase()
  articleConfig.isCategory && (categoryHref = '')

  let htmlStr = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">

        <meta name="application name" content="${articleConfig.staticFileName}">
        <meta name="author" content="${articleConfig.author}">
        <meta name="description" content="${articleConfig.description}">
        <meta name="keywords" content="${articleConfig.keywords}">

        <title>${articleConfig.source.split('.md')[0]} - ${title}</title>
        <link rel="shortcut icon" href="/images/favicon.ico">
        <link href="/lib/prismjs/prism_default.css" rel="stylesheet" />
        <link href="/lib/notes.css" rel="stylesheet" />
        ${config._isGlobalCssFileExists ? '<link rel="stylesheet" href="/lib/global.css">' : ''}
      </head>
      <body>
        <header>
          <div>
            <img src="/images/logo.png" width="24" height="24" class="pointer" onclick="gotoIndex()" />
            <span class="pointer" onclick="gotoIndex()">${title}</span>
            <span class="hidden"> | </span>
            <a href="${categoryHref}" class="hidden">${articleConfig.category}</a>
          </div>
          <div>
            ${topRightLinkHtml}
          </div>
        </header>
        <section class="content">
          <article>
            ${articleTop}
            ${articleHtml}
          </article>
          <aside>
            <div>
              ${asideHtml}
            <div>
          </aside>
        </section>
        <footer>
          <div class="footer_content">
            <div class="footer_right">${footer.left}</div>
            <div>${footer.right}</div>
          </div>
        </footer>
        <script src="/lib/prismjs/prism_default.js"></script>
        <script src="/lib/notes.js"></script> 
        ${config._isGlobalJsFileExists ? '<script src="/lib/global.js"></script>' : ''}
        <script>
          ${globalScript}
        </script>
      </body>
    </html>
  `

  return htmlStr
}

module.exports = render