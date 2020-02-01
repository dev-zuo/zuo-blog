# zuo-blog
基于Node.js的轻量级静态博客生成框架，类似于hexo

## 安装
```bash
npm install zuo-blog -g
```

## 目录结构要求
按照如下目录结构，写对应的md文章
```bash
├── src # 写博客文章的目录
│   ├── _config.json # 全局配置文件
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

## 生成静态页
假设你已经按照上面的目录格式，准备好了md及配置文件，并放到了zuo11.com目录下，使用如下命令生成博客系统
```bash
cd zuo11.com  # 进入zuo11.com目录，确保该目录下包含src，src下面有notes，images目录
zuoblog init # 开始生成，在当前目录(zuo11.com)生成dist目录，可直接部署到nginx
```

## 示例
在线示例：[zuo11.com](http://www.zuo11.com)

github地址：https://github.com/zuoxiaobai/zuo11.com