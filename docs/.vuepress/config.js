module.exports = {
  base: '/zuo-blog/',
  title: 'zuo-blog',
  description: '静态博客生成工具',
  themeConfig: {
    sidebar: [
      {
        title: '指南',   // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          '/',
          '/config.md'
        ]
      }
      // {
      //   title: '配置',
      //   collapsable: false, // 可选的, 默认值是 true,
      //   children: ['/config.md' ],
      // }
    ],
    nav: [
      { text: '指南', link: '/' },
      { text: '配置', link: '/config.md' },
      { text: 'Github', link: 'https://www.github.com/zuoxiaobai/zuo-blog' }
    ]
  }
}