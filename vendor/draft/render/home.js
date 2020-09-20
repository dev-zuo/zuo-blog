
const path = require('path')
const fs = require('fs')

function render(config, globalScript) {
  let {indexConfig, title, footer} = config

  // 生成linkList
  let linkList = ''
  indexConfig.linkList.forEach(item => {
    linkList += `
      <a href="${item.href}" ${item.target ? ('target="' + item.target + '"') : ''}>${item.name}</a>
    `
  });

  let htmlStr = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">

        <meta name="application name" content="index.html">
        <meta name="author" content="${indexConfig.author}">
        <meta name="description" content="${indexConfig.description}">
        <meta name="keywords" content="${indexConfig.keywords}">

        <title>${title}</title>
        <link rel="shortcut icon" href="/images/favicon.ico">
        ${config._isGlobalCssFileExists ? '<link rel="stylesheet" href="/lib/global.css">' : ''}
        <style>
          body {
            margin: 0;
          }
          article {
            position: absolute;
            top: 33%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .title {
            font-size:2rem;
            font-weight:lighter;
            text-align:center;
            width: 300px;
            color: #333;
          }
          .link {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
          }
          .link a, .footer_content a{
            text-decoration: none;
            color: #25b864;
            font-weight: normal;
          }
          .img-div {
            text-align:center;margin-bottom:10px;
          }
          .footer_content {
            position: fixed;
            bottom: 15px;
            display: flex;
            flex-wrap:wrap;
            width: 100%;
            box-sizing: border-box;
            padding: 0 9%;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
          }
        </style>
        ${config.headFragment || ''}
      </head>
      <body>
        <article>
          <div class="img-div">
            <img src="/images/logo.png" width="50" height="50">
          </div>
          <div class="title">${title}</div>
          <div class="link">
            ${linkList}
          </div>
        </article>
        <footer>
          <div class="footer_content">
            <div class="footer_right">${footer.left}</div>
            <div>${footer.right}</div>
          </div>
        </footer>
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