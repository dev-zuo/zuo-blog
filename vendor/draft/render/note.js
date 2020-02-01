
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
        <script>
          let asideDiv = document.getElementsByTagName('aside')[0]
          asideDiv.onclick = (e) => {
            let id = e.target.dataset.id
            if (!id) return
            // 移除所有的active
            let nodes = document.getElementsByClassName('ul-span')
            for (let i = 0, len = nodes.length; i < len; i++) {
              nodes[i].classList.remove('active')
            }
            e.target.classList.add('active')
            document.getElementById(id).scrollIntoView(true)
            document.documentElement.scrollBy(0, -70)
          }

          let headersArr = []

          // 通过category.html#web进入页面时, 由于顶部fixed会有遮挡，fix方案
          window.onload = () => {
            // 如果是category，且有hash值，向上滚动 -70
            let { pathname, hash } = location
            pathname.includes('category.html') && hash && document.documentElement.scrollBy(0, -70)

            // 将每个标题的高度，存到数组里，当滚动时，自动focus右侧大纲
            let nodes = document.getElementsByClassName('ul-span')
            for (let i = 0, len = nodes.length; i < len; i++) {
              // console.log(nodes.dataset)
              let id = nodes[i].dataset.id
              headersArr.push({id: id, offsetTop: document.getElementById(id).offsetTop})
            }
            // console.log(headersArr)

            window.onscroll = () => {
              focusAsideSpan()
              // debounce(focusAsideSpan)
            }
          }

          // 效果不好，没有实时滚动的感觉，关闭防抖
          // function debounce(method, context) {
          //   clearTimeout(method.tId)
          //   method.tId = setTimeout(function() {
          //     method.call(context)
          //   }, 100)
          // }
          
          function focusAsideSpan() {
            let scrollTop = document.documentElement.scrollTop
            let curNode
            for (let i = 0, len = headersArr.length; i < len; i++) {
              if (headersArr[i].offsetTop - scrollTop >= 0) {
                // 移除所有的active
                let nodes = document.getElementsByClassName('ul-span')
                for (let j = 0, len = nodes.length; j < len; j++) {
                  if (headersArr[i].id === nodes[j].dataset.id) {
                    nodes[j].classList.remove('active')
                    nodes[j].classList.add('active')
                  } else {
                    nodes[j].classList.remove('active')
                  }
                }
                return
              }
            }
            // 如果走到这里，说明滚到底部了
            // 移除所有的active
            let nodes = document.getElementsByClassName('ul-span')
            for (let i = 0, len = nodes.length; i < len; i++) {
              nodes[i].classList.remove('active')
            }
            nodes[nodes.length - 1].classList.add('active')
          }


          function gotoIndex() {
            window.location.href = "/"
          }

          ${globalScript}

        </script>
      </body>
    </html>
  `

  return htmlStr
}

module.exports = render