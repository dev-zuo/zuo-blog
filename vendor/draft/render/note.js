
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

  // 分类的链接
  let categoryHref = '/blog/category.html#' + articleConfig.category.toLowerCase()
  articleConfig.isCategory && (categoryHref = '')

  
  let h1StartIndex = articleHtml.indexOf('<h1 id="')
  let h1EndIndex = articleHtml.indexOf('</h1>')
  let h1Title = ''
  if (h1StartIndex !== -1 && h1EndIndex !== '-1') {
    h1Title = articleHtml.substring(h1StartIndex, h1EndIndex + 5)
  }

  // 放在文章标题上面的一栏，显示时间、作者，对于文章配置
  let articleTop = !articleConfig.createDate ? '' : `
    <div class="article-top">
      <div class="flex">
        这篇文章发布于 ${articleConfig.createDate}，归类于 <a href="${categoryHref}" class="hidden">${articleConfig.category}</a>
        <!-- ，阅读 11 次，今日 1 次 <div class="top-comment">4 条评论</div> -->
        <div id="readAndComment" class="flex"></div>
      </div> 
      <div class="flex keywords" style="flex-wrap: nowrap;">
        <div style="flex-shrink:0; align-self: flex-start;">标签：</div>
        <div class="flex" style="flex-wrap: wrap;">${articleConfig.keywords.split(',').map(item => '<span>' + item + '</span>').join('，')}</div>
      </div>
    </div>
    ${config.articleTopHtml || ''}
  `

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
        ${config.headFragment || ''}
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
            ${h1Title || ''}
            ${articleTop}
            ${h1Title ? articleHtml.replace(h1Title, '') : articleHtml}
            
            ${(!articleConfig.isCategory && config.commentTopHtml) ? config.commentTopHtml : ''}
            <!-- 评论系统占位 -->
            <div id="commentDiv"></div>
          </article>

          <aside>
            <div class="aside-wrap">
              ${config.asideTopHtml || ''}
              <div class="top ${articleConfig.isCategory ? 'category' : ''}">
                ${asideHtml}
              <div>
            </div>
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
        ${config.bodyFragment || ''}
      </body>
    </html>
  `

  return htmlStr
}

module.exports = render