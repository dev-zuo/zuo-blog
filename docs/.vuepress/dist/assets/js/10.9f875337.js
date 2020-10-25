(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{365:function(t,s,a){"use strict";a.r(s);var n=a(42),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"peach-开发思路及文档"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#peach-开发思路及文档"}},[t._v("#")]),t._v(" peach 开发思路及文档")]),t._v(" "),a("p",[t._v("之前用jquery+jsp+servlet+mysql写了一套个人博客系统，用在zuo11.com上，从16年10月左右上线到17年2月，发布了大概46篇笔记博文。之后工作就基本没更新过了，直到现在才打算好好整一下这快。方便后面积累。")]),t._v(" "),a("h3",{attrs:{id:"重写"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#重写"}},[t._v("#")]),t._v(" 重写")]),t._v(" "),a("p",[t._v("前端jsp+jquery，后端java+mysql，有几个不满意的地方:")]),t._v(" "),a("ul",[a("li",[t._v("技术栈陈旧，基本不想继续在原来的代码上维护了")]),t._v(" "),a("li",[t._v("页面都是服务端渲染，每次访问文章都会去数据库查询文章，然后展示")]),t._v(" "),a("li",[t._v("每次写文章，都是在线的UEditor编辑器，不支持markdown语法，生成的文章内容比较乱")]),t._v(" "),a("li",[t._v("分类展示效果不好，访客记录不够完善")]),t._v(" "),a("li",[t._v("评论系统使用的第三方畅言，可控性较差。")])]),t._v(" "),a("p",[t._v("理想的改动是和hexo类似，直接写md笔记，然后放入固定的目录，生成静态链接的博客文章")]),t._v(" "),a("h4",{attrs:{id:"从最基础的开始"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#从最基础的开始"}},[t._v("#")]),t._v(" 从最基础的开始")]),t._v(" "),a("p",[t._v("将markdown文件，生成一个静态网页，用node实现。 找到一个不错的开源代码marked.js，可以直接使用。")]),t._v(" "),a("ul",[a("li",[t._v("把src这个目录专门用来做开发目录。")])]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("cd src"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\nnpm init"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 初始化package.json")]),t._v("\n入口 index"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("js开始处理逻辑\n")])])]),a("p",[t._v("读取notes目录的md文件，直接用markedjs转成html元素再套入html模板，生成html静态文件即可")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// index.js peach entrance")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" marked "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./lib/marked'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// import marked.js")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 读取notes目录的笔记，然后转换为html元素，再写到静态html文件里")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" fs "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'fs'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nfs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("readFile")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./notes/testmd.md'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("err"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" data")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("err"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("err"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 这里加入了基本的html框架，加入了代码高亮prismjs")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" htmlStr "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token template-string"}},[a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('<!DOCTYPE html>\n  <html lang="en">\n    <head>\n      <meta charset="UTF-8">\n      <title>Title</title>\n      <link href="../lib/prismjs/prism_default.css" rel="stylesheet" />\n    </head>\n    <body>\n      ')]),a("span",{pre:!0,attrs:{class:"token interpolation"}},[a("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("marked")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("data"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("toString")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('\n      <script src="../lib/prismjs/prism_default.js"><\/script>\n    </body>\n  </html>\n  ')]),a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),t._v("\n  fs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("writeFile")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./notes/testmd.html'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" htmlStr"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'写入文件成功'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h4",{attrs:{id:"博客页面结构规划"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#博客页面结构规划"}},[t._v("#")]),t._v(" 博客页面结构规划")]),t._v(" "),a("p",[t._v("基础ok后，需要规划下博客的页面结构，样式等。回到初衷，我心里我的博客应该是怎么样的？")]),t._v(" "),a("ul",[a("li",[t._v("博客并不是知识系统化的一个地方，这需要一个单独用一个仓库去整理，博客只需要挂一个链接到该地址即可")]),t._v(" "),a("li",[t._v("博客主要针对某个问题展开，可以是遇到某个坑的总结、某个开源项目源码分析、学到新知识点后的总结、工作中的一些所见所想等。")]),t._v(" "),a("li",[t._v("主要以SEO为入口，其他开发者可能会遇到的问题，百度、google会搜索什么问题，然后结合自己遇到的问题去总结归纳。")]),t._v(" "),a("li",[t._v("项目/demo展示(五子棋、扫雷、模仿某些效果，样式等)")])])])}),[],!1,null,null,null);s.default=e.exports}}]);