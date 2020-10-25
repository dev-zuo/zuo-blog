
## peach 开发思路及文档
之前用jquery+jsp+servlet+mysql写了一套个人博客系统，用在zuo11.com上，从16年10月左右上线到17年2月，发布了大概46篇笔记博文。之后工作就基本没更新过了，直到现在才打算好好整一下这快。方便后面积累。

### 重写
前端jsp+jquery，后端java+mysql，有几个不满意的地方:

- 技术栈陈旧，基本不想继续在原来的代码上维护了
- 页面都是服务端渲染，每次访问文章都会去数据库查询文章，然后展示
- 每次写文章，都是在线的UEditor编辑器，不支持markdown语法，生成的文章内容比较乱
- 分类展示效果不好，访客记录不够完善
- 评论系统使用的第三方畅言，可控性较差。

理想的改动是和hexo类似，直接写md笔记，然后放入固定的目录，生成静态链接的博客文章
#### 从最基础的开始
将markdown文件，生成一个静态网页，用node实现。 找到一个不错的开源代码marked.js，可以直接使用。

- 把src这个目录专门用来做开发目录。
``` js
cd src;
npm init; // 初始化package.json
入口 index.js开始处理逻辑
```
读取notes目录的md文件，直接用markedjs转成html元素再套入html模板，生成html静态文件即可
``` js

// index.js peach entrance

let marked = require('./lib/marked') // import marked.js

// 读取notes目录的笔记，然后转换为html元素，再写到静态html文件里
let fs = require('fs')
fs.readFile('./notes/testmd.md', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  // 这里加入了基本的html框架，加入了代码高亮prismjs
  let htmlStr = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <link href="../lib/prismjs/prism_default.css" rel="stylesheet" />
    </head>
    <body>
      ${marked(data.toString())}
      <script src="../lib/prismjs/prism_default.js"></script>
    </body>
  </html>
  `
  fs.writeFile('./notes/testmd.html', htmlStr, () => {
    console.log('写入文件成功');
  })
})
```
#### 博客页面结构规划
基础ok后，需要规划下博客的页面结构，样式等。回到初衷，我心里我的博客应该是怎么样的？
- 博客并不是知识系统化的一个地方，这需要一个单独用一个仓库去整理，博客只需要挂一个链接到该地址即可
- 博客主要针对某个问题展开，可以是遇到某个坑的总结、某个开源项目源码分析、学到新知识点后的总结、工作中的一些所见所想等。
- 主要以SEO为入口，其他开发者可能会遇到的问题，百度、google会搜索什么问题，然后结合自己遇到的问题去总结归纳。
- 项目/demo展示(五子棋、扫雷、模仿某些效果，样式等)



