
const FSExtend = require('./utils/FSExtend')
const fs = require('fs')
const marked = require('marked')

class ZUOBlog {

  constructor() {
    this.notesPath = './src/notes' // notes目录 
    this.configPath = './src/_config.json'
    this.count = 0 // md文件数量
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

      this.config = JSON.parse(fs.readFileSync(this.configPath).toString())
      let {category, fileData, count, config} = this
      console.log('第一步: 基础数据生成成功 [OK]')
      return {category, fileData, count, config}
    } catch(e) {
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
    fs.mkdirSync('./dist/blog', {recursive: true})

    // 将当前src目录的images文件copy到dist目录
    FSExtend.copyFolder('./src/images', './dist/images')
  }

  // 开始遍历notes目录
  _startErgodicNotes() {
    // 遍历年份目录 ['2019', '2020' ]
    fs.readdirSync(this.notesPath).forEach(year => { 
      if (year.startsWith('.')) return // 过滤掉隐藏文件
      const yearPath = `${this.notesPath}/${year}` // './src/notes/2019'
      
      // 遍历该年份下月分目录[ '1', '2' ]
      fs.readdirSync(yearPath).forEach(month => {  
        if (month.startsWith('.')) return // 过滤掉隐藏文件
        const monthPath = `${yearPath}/${month}` // './src/notes/2019/1'
        const monthCfgPath = `${monthPath}/_info.json` // 配置文件

        // 如果配置文件存在
        if (fs.existsSync(monthCfgPath)) {  
          // if (year !== '2019') return  // 测试单个文件用
          // 根据配置文件遍历md文件
          JSON.parse(fs.readFileSync(monthCfgPath)).forEach(article => { 
            const articlePath = `${monthPath}/${article.source}` // './src/notes/2019/1/xxx.md'
            this._handlerMdFile(article, articlePath, year, month) 
          })
        }
      })
    })
  }

  // 处理md文件
  _handlerMdFile(article, articlePath, year, month) {
    // 读取文件内容，通过maked转换为html字符串
    const fileStr = fs.readFileSync(articlePath).toString() 
    let htmlStr = marked(fileStr)
    let headers = marked.lexer(fileStr).filter(item => item.type === 'heading')
    let outline = this._generateOutline(headers) // 根据文件内容生成大纲数据
    // console.log(JSON.stringify(outline, null, 2))

    // 为了解耦 可扩展增加主题，先收集数据，然后根据主题统一生成文件文件
    // generatorHtml(htmlStr, outline, `${year}/${month}`, article)
    // 将文件数据存到 fileData
    this.fileData.push({
      // fileStr,
      htmlStr,
      outline,
      config: { ...article, year, month }
    })

    // 收集数据到cateory对象
    this._handlerCategory(article, year, month)
    this.count++ // 文件数量+1
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

    // 2018/01/14  => 2018/1
    let dateArr = article.createDate.split('/')
    dateArr.pop() //['2018', '01']
    dateArr[1] = Number(dateArr[1]) // ['2018', 1]
    let dateStr = dateArr.join('/') // 2018/1

    this.category[categoryName].push({
      title: article.source.split('.md')[0],
      href: dateStr + '/' + article.staticFileName,
      time: article.createDate
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
            while(count--) {
              target = target.children.slice(-1)[0]
            }
          }
          !target.children && (target.children = [])
          target.children.push(item)
        }
      }
    } catch(e) {
      console.log(e)
      let text = '目录生成异常，请确保目录层级从H1到H6是正常顺序，对于没有H1或目录中间断层的情况需要修正'
      return [ { text } ]
    }
    return tree
  }

  // 打印log
  _showLog(...args) {
    console.log(...args)
  }
}

module.exports = ZUOBlog