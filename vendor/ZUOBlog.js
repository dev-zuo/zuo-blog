
const FSExtend = require('./utils/FSExtend')
const fs = require('fs')
const marked = require('marked')
const matter = require('gray-matter')

class ZUOBlog {

  constructor() {
    this.notesPath = './src/notes' // notes目录 
    this.configPath = './src/config.json'
    this.globalJsPath = './src/global.js'
    this.globalCssPath = './src/global.css'
    this.headFragment = './src/headFragment.html'
    this.bodyFragment = './src/bodyFragment.html'
    this.count = 0 // 有效 md 文件数量
    this.validFileList = []
    this.invalidNameFileList = [] // 第一次过滤：无效名称 - 文件列表（. 开头或非 md文件）
    this.invalidConfigFileList = [] // 第二次过滤：无效配置信息 - 文件列表（front matter 信息异常）
    this.category = {} // 分类信息
    this.fileData = [] // 处理后的文章数据，每条数据包含fileStr, htmlStr, outline, config
    this.config = {} // 配置文件
  }

  // 获取元数据
  getNotesData() {
    try {
      // 删除原来的dist目录，新建dist目录
      this._initFolder()

      // 开始遍历notes目录，并生成数据
      this._startErgodicNotes()

      // 生成基础数据OK，测试用，看数据是否异常
      // console.log(JSON.stringify(this.fileData, null, 2))
      // console.log(JSON.stringify(this.category, null, 2))
      // console.log(this.count)

      // 判断src目录下是否有global.js，如果有，在config里加入标记，后面生成页面时有标记就
      let isGlobalJsFileExists = fs.existsSync(this.globalJsPath)
      let isGlobalCssFileExists = fs.existsSync(this.globalCssPath)
      console.log('global.js 存在标记：', isGlobalJsFileExists)
      console.log('global.css 存在标记：', isGlobalCssFileExists)

      this.config = JSON.parse(fs.readFileSync(this.configPath).toString())
      this.config._isGlobalJsFileExists = isGlobalJsFileExists
      this.config._isGlobalCssFileExists = isGlobalCssFileExists

      // 引入head、body代码片段
      if (fs.existsSync(this.headFragment)) {
        this.config.headFragment = fs.readFileSync(this.headFragment).toString()
      }
      if (fs.existsSync(this.bodyFragment)) {
        this.config.bodyFragment = fs.readFileSync(this.bodyFragment).toString()
      }


      let { category, fileData, count, config, validFileList, invalidConfigFileList, invalidNameFileList } = this
      const notesData = { category, fileData, count, config, validFileList, invalidConfigFileList, invalidNameFileList }
      
      fs.writeFileSync('notesData.json', JSON.stringify(notesData, null, 2), (err) => {
        console.log(err)
      })
      console.log('第一步: 基础数据生成成功 [OK]')
      return notesData
    } catch (e) {
      console.error(e)
      return {}
    }
  }

  /**
   * 初始化目录，主要用于生成dist目录、删除原来旧的dist目录等
   */
  _initFolder() {
    // 删除当前目录的dist文件夹
    FSExtend.deleteFolder('./dist')

    // 新建dist目录，blog目录，类似于 mkdir -p dist/blog
    fs.mkdirSync('./dist/blog', { recursive: true })

    // 将当前src目录的images文件copy到dist目录
    FSExtend.copyFolder('./src/images', './dist/images')

    // 将当前 extraRootFiles 目录的文件copy到dist/目录
    // extraRootFiles 目录用于存放需要放到网站根目录的内容，比如 baidu、google 校验文件等
    FSExtend.copyFolder('./extraRootFiles', './dist/')
  }

  // 开始遍历notes目录
  _startErgodicNotes() {
    // 遍历年份目录 ['2019', '2020' ]
    fs.readdirSync(this.notesPath).forEach(year => {
      if (year.startsWith('.')) return // 过滤掉隐藏文件
      const yearPath = `${this.notesPath}/${year}` // './src/notes/2019'

      // 遍历该年份下月分目录[ '1', '2' ]
      fs.readdirSync(yearPath).forEach(async month => {
        if (month.startsWith('.')) return // 过滤掉隐藏文件
        const monthPath = `${yearPath}/${month}` // './src/notes/2019/1'

        // v0.7.0
        // const monthCfgPath = `${monthPath}/_info.json` // 配置文件
        // // 如果配置文件存在
        // if (fs.existsSync(monthCfgPath)) {  
        //   // if (year !== '2019') return  // 测试单个文件用
        //   // 根据配置文件遍历md文件
        //   JSON.parse(fs.readFileSync(monthCfgPath)).forEach(article => { 
        //     const articlePath = `${monthPath}/${article.source}` // './src/notes/2019/1/xxx.md'
        //     this._handlerMdFile(article, articlePath, year, month) 
        //   })
        // }

        // v1.0.0
        // 读取目录 src/notes/[year]/[month] 下的所有 md 文件
        let files = fs.readdirSync(monthPath, {
          withFileTypes: true // 不返回文件数组，返回文件 <fs.Dirent> 对象
        })
        // console.log(files);

        if (files && Array.isArray(files)) {
          files.forEach(async item => {
            const articlePath = `${monthPath}/${item.name}` // './src/notes/2019/1/xxx.md'

            // 隐藏文件不处理
            if (item.name.startsWith('.') || !item.name.includes('.md')) {
              console.log(`[Warn] ${articlePath} 不是 markdown 文件，不做处理`)
              this.invalidNameFileList.push(articlePath)
              return
            }

            this._handlerMdFile(articlePath, year, month)
          })
        }

      })
    })
  }

  // 处理md文件
  async _handlerMdFile(articlePath, year, month) {
    try {
      let fileBuffer = fs.readFileSync(articlePath);
      let fileText = fileBuffer.toString()

      // 读取 front matter 信息、支持 YAML/JSON
      let res = matter(fileText)
      let { data: articleConfig = {}, content } = res || {}
      // TODO，如果配置中文件名重复怎么处理
      // Enhance，没有设置静态文件名等，根据通用规则设置初始化文件信息
      if (JSON.stringify(articleConfig) === '{}') {
        console.log(`[Error]: ${articlePath} 缺少 front-matter 信息，请补充`)
        this.invalidConfigFileList.push(articlePath)
        return;
      }

      // {
      //   content: '\n# title\nwoshineirong ',
      //   data: { title: 'Blogging Like a Hacker', lang: 'en-US' },
      //   isEmpty: false,
      //   excerpt: ''
      // }

      let htmlStr = marked.parse(content)
      let headers = marked.lexer(content).filter(item => item.type === 'heading')

      // TODO 大纲优化
      let outline = this._generateOutline(headers) // 根据文件内容生成大纲数据
      // console.log(JSON.stringify(outline, null, 2))

      // 为了解耦 可扩展增加主题，先收集数据，然后根据主题统一生成文件文件
      // generatorHtml(htmlStr, outline, `${year}/${month}`, article)
      // 将文件数据存到 fileData
      this.fileData.push({
        htmlStr,
        outline,
        config: { ...articleConfig, year, month }
      })

      // 收集数据到cateory对象
      this._handlerCategory(articleConfig, year, month)
      this.validFileList.push(articlePath)
      this.count++ // 文件数量+1
    } catch (e) {
      console.log(e.messge)
    }
  }

  /**
   * @description 将article单篇文章信息整理到category分类数据里
   * @param { Object } article 配置 {source: 'md文件名', staticFileName: '1.html', category: 'web'}
   * @param {*} year 年  '2016' 或 '2019'
   * @param {*} month 月 '1' 或 '11' 
   */
  _handlerCategory(article, year, month) {
    // 如果 category.当前分类 没值，将category.当前分类 设置为[]
    let categoryName = article.category
    !this.category[categoryName] && (this.category[categoryName] = [])

    // // 2018/01/14  => 2018/1
    // let dateArr = article.createDate.split('/')
    // dateArr.pop() //['2018', '01']
    // dateArr[1] = Number(dateArr[1]) // ['2018', 1]
    // let dateStr = dateArr.join('/') // 2018/1

    // 原先是根据 createDate 来确定路径，现在根据文件路径来确定 url
    // 这样路径就定死了，createDate 仅用于页面显示创建日期
    year = Number(year)
    month = Number(month)

    this.category[categoryName].push({
      // title: article.source.split('.md')[0], // 原先从_info.json 取文件名，改为从 配置中取文件名
      title: article.title,
      href: `${year}/${month}/${article.staticFileName}`,
      time: article.createDate,
      description: article.description,
      keywords: article.keywords
    })
  }

  /**
   * @description 将md文件heading列表，转换为层级结构，用于生成大纲
   * @param {*} headers 原数据格式
   * [ { type: 'heading', depth: 1, text: '站点优化 页面打开较慢处理' },
   *  { type: 'heading', depth: 2, text: '代码托管' },
   *  { type: 'heading', depth: 2, text: '速度慢的原因分析' },
   *  { type: 'heading', depth: 3, text: '代码分析' },
   *  { type: 'heading', depth: 2, text: '速度测试' } ]
   * @returns  [ { text: 'xx', children: [ { text:'xxx', children:[...] } ] } ]
   */
  _generateOutline(headers) {
    let tree = []
    // 加try catch是为了如果中间出现跨越的层级问题，直接返回错误
    try {
      for (let i = 0, len = headers.length; i < len; i++) {
        let item = headers[i]
        // 如果是一级目录，直接挂载到tree下
        if (item.depth === 1) {
          tree.push(item)
        } else {
          let target
          // 如果是二级目录，挂载到当前tree最后一个元素的children上
          if (item.depth === 2) {
            target = tree.slice(-1)[0]
          } else {
            // 如果是3级+，遍历到最近一个层级的list
            let count = item.depth - 2
            target = tree.slice(-1)[0]
            while (count--) {
              target = target.children.slice(-1)[0]
            }
          }
          !target.children && (target.children = [])
          target.children.push(item)
        }
      }
    } catch (e) {
      console.log(e)
      let text = '目录生成异常，请确保目录层级从H1到H6是正常顺序，对于没有H1或目录中间断层的情况需要修正'
      return [{ text }]
    }
    return tree
  }

  // 打印log
  _showLog(...args) {
    console.log(...args)
  }
}

module.exports = ZUOBlog