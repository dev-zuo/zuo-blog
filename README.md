# zuo-blog
> 基于Node.js的轻量级静态博客生成框架，类似于hexo

![version-v0.2.0](https://img.shields.io/badge/version-v0.2.0-yellow.svg) ![build-passing](https://img.shields.io/badge/build-passing-green.svg) ![license-MIT](https://img.shields.io/badge/license-MIT-green.svg) 

npm package

[![NPM](https://nodei.co/npm/zuo-blog.png)](https://npmjs.org/package/zuo-blog)

## 全局安装
```bash
npm install zuo-blog -g
```

## 目录结构要求
按照如下目录结构，写对应的md文章
```bash
├── src # 写博客文章的目录
│   ├── _config.json # 全局配置文件
│   ├── global.js # 全局js
│   ├── global.css # 全局css 
│   ├── images # 图片目录
│   │   ├── blog # 专门放博客图片的目录
│   │   └── favicon.ico # 站点icon
│   └── notes # 博客文章，按年月分目录
│       ├── 2016
│       │   ├── 10 # 每个月份目录下放当月写的文章及当前月的配置文件
│       │   │   ├── _info.json # 配置文件记录了当前目录下每篇文章的配置、seo参数等
│       │   │   ├── xxx1.md # 博客文章
│       │   │   └── xxx2.md
│       │   ├── 11
│       │   └── 12
│       ├── ...
│       └── 2020 # 2020年目录
│           ├── 1 # 2020年1月目录
│           │   ├──  _info.json
│           │   └──  xx45.md
│           └── 2 
└── README.md # 说明文档
```

## 使用方法
假设你已经按照上面的目录格式，准备好了md及配置文件，并放到了zuo11.com目录下，使用如下命令生成博客系统
```bash
cd zuo11.com  # 进入zuo11.com目录，确保该目录下包含src，src下面有notes，images目录
zuoblog init # 开始生成，在当前目录(zuo11.com)生成dist目录，可直接部署到nginx
```

在线示例：[zuo11.com](http://www.zuo11.com)

## 更新记录
v0.5.0 (2020/10/14)
1. A 新增 在当前构建目录生成 notesData.json，里面包含所有的页面信息
2. A 新增 嵌入代码全局参数，用于在页面指定位置嵌入广告。asideTopHtml(侧边栏顶部)、articleTopHtml(文章顶部)、commentTopHtml(评论顶部)、noteInnerAdHtml(分类文章内部)
3. F 修复 侧边栏id生成问题，使用 marked 插件生成ID方法
4. O 优化 优化分类页展示效果

v0.4.0 (2020/09/20)
1. A 新增 head、body代码片段引入功能

v0.3.0 (2020/03/08)
1. A 新增 应监管要求，网站底部增加备案信息

v0.2.0 (2020/03/02)
1. A 新增 用户可以自定义全局的global.css以及全局的global.js
2. F 修复 v0.1.0 分类页面笔记未按时间排序的问题，修复右侧大纲没有当前分类文章总数的问题
3. F 修复 v0.1.0 右侧菜单高度问题
4. O 优化 将通用js放到一个js里引入

v0.1.0 (2020/02/20)
1. 完成基本功能, 第一个测试版本
2. 完成默认的内置渲染样式

## 开发思路

最开始这个项目名叫peach，后面为了保持了npm包一致，改名为zuo-blog，详情参见[peach 开发思路及文档](docs/README.md)

