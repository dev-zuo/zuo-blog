
const fs = require('fs')
const homeRender = require('./render/home')
const noteRender = require('./render/note')
const FSExtend = require('../utils/FSExtend')

class DefaultDraft {

  constructor() {
    this.category = {},
    this.fileData = [],
    this.count = 0,
    this.config = {}
  }

  // 根据元数据，生成静态博客系统
  init(notesData) {
    Object.assign(this, notesData)
    console.log('第二步: 开始渲染模板...')
    try {
      let globalScript = this._getGlobalScript(this.config)
      let topRightLinkHtml = this._getTopRightLinkHtml()

      // 将需要引入的文件拷贝到dist的lib目录
      FSExtend.copyFolder(__dirname + '/lib', './dist/lib')

      // 渲染一个简单的主页index.html
      let htmlStr = homeRender(this.config, globalScript)
      fs.writeFileSync(`./dist/index.html`, htmlStr)
      console.log('生成主页./dist/index.html成功 [OK]')

      // 生成note pages
      this._generateNotePage(topRightLinkHtml, globalScript)

      // 生成category page
      this._generateCategoryPage(topRightLinkHtml, globalScript)
      console.log(`渲染完成, 共生成 ${this.count + 2} 个静态页面 [OK]`)

      // 如果有global.js，拷贝到dist/lib目录
      if (this.config._isGlobalJsFileExists) {
        fs.writeFileSync('./dist/lib/global.js', fs.readFileSync('./src/global.js'))
      } 
      // 如果有global.css，拷贝到dist/lib目录
      if (this.config._isGlobalCssFileExists) {
        fs.writeFileSync('./dist/lib/global.css', fs.readFileSync('./src/global.css'))
      } 
    } catch(e) {
      console.error(e)
    }
  }

  /**
   * @description 获取全局script
   * @param {*} config 
   */
  _getGlobalScript(config) {
    let globalScript = ''

    // 如果有加百度统计，加入百度统计
    let baiduTongjiScript = !config.isAddBaiduTongji ? '' : `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?${config.baiduTongjiId}";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `
    globalScript += baiduTongjiScript

    return globalScript
  }

  /**
   * @description 获取顶部右侧链接HTML
   */
  _getTopRightLinkHtml() {
    let topRightLinkHtml = ''
    let topRightLinks = this.config.topRightLink
    if (topRightLinks) {
      let len = topRightLinks.length

      topRightLinks.forEach((item, index) => {
        let classStr = (index !== (len - 1)) ? 'hidden' : ''
        topRightLinkHtml += `
          <a href="${item.href}" target="_black" class="${classStr}">${item.name}</a>
        `
      })
    }
    return topRightLinkHtml
  }

  /**
   * 
   * @param {*} topRightLinkHtml 
   * @param {*} globalScript 
   */
  _generateNotePage(topRightLinkHtml, globalScript) {
    // console.log(fileData, this.fileData)
    this.fileData.forEach(item => {
      // 根据大纲数据(JSON)生成侧边栏html
      let asideHtml = this._getAsideHtml(item.outline) 
      let notePageHtml = noteRender(this.config, globalScript, {
        topRightLinkHtml,
        asideHtml,
        articleHtml: item.htmlStr,
        articleConfig: item.config
      })
      // 写入文件，当路径不存在时，先创建目录
      let monPath = `./dist/blog/${item.config.year}/${item.config.month}`
      !fs.existsSync(monPath) && fs.mkdirSync(monPath, {recursive: true})
      fs.writeFileSync(`${monPath}/${item.config.staticFileName}`, notePageHtml)
      console.log(`生成页面${monPath}/${item.config.staticFileName} 成功 [OK]`)
    })
  }

  /**
   * @description 根据大纲数据(JSON)生成侧边栏html
   * @param {*} outline 
   */
  _getAsideHtml(outline) {
    function handlerId(id) {
      // let newId = id.toLowerCase().replace(/\s/g, '-')
      // newId = newId.replace(/[\(\)\/\,\=\>\.\:\+]/g, '')
      // return newId

      // fix id 生成问题 marked. /lib/marked.esm.js Slugger generates header id
      let newId = id.toLowerCase()
      .trim()
      // remove html tags
      .replace(/<[!\/a-z].*?>/ig, '')
      // remove unwanted chars
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
      .replace(/\s/g, '-');
      return newId
    }
    let asideHtml = ''
    let backupOutline = JSON.parse(JSON.stringify(outline))
    for (let i = 0, len = outline.length; i < len; i++) {
      // 在第一层级 对于分类来说，需要将某个分类的数量加上去
      let showText = outline[i].text
      // outline[i].count && (showText = `${showText}（${outline[i].count}）`)
      outline[i].count && (showText = `${showText} ${outline[i].count}`)

      asideHtml += '<ul>'
      asideHtml += `<li><span class="ul-span" data-id="${handlerId(outline[i].text)}" style="padding-left:${outline[i].depth + 'em'}">${showText}<span></li>`
      if (outline[i].children) {
        asideHtml += getChildrenAsideHtml(outline[i].children)
      } 
      asideHtml += '</ul>'
    }

    function getChildrenAsideHtml(outline) {
      if (!outline || outline.length === 0) {
        return ''
      }
      let asideHtml = ''
      for (let i = 0, len = outline.length; i < len; i++) {
        asideHtml += '<ul>'
        asideHtml += `<li><span class="ul-span" data-id="${handlerId(outline[i].text)}" style="padding-left:${outline[i].depth + 'em'}">${outline[i].text}<span></li>`
        if (outline[i].children) {
          asideHtml += getChildrenAsideHtml(outline[i].children)
        } 
        asideHtml += '</ul>'
      }
      return asideHtml
    }
    return asideHtml
  }

  /**
   * @description 生成分类页面
   * @param {*} topRightLinkHtml 
   * @param {*} globalScript 
   */
  _generateCategoryPage(topRightLinkHtml, globalScript) {
    // 分类数据，如果有自定义排序，先排序
    this.config.categorySequence && this._customSequenceCateogy()

    let contentHtml = this._getCategoryContentHtml()
    let outline = Object.keys(this.category).map(item => {
      let cateogyData = this.category[item]
      return {
        "depth": 1, 
        "text": item,
        "count": cateogyData ? cateogyData.length : 0
      } 
    })

    // 根据大纲数据(JSON)生成侧边栏html
    let asideHtml = this._getAsideHtml(outline) 
    let articleConfig = {
      "title": '文章分类',
      "staticFileName": "category.html",
      "category": "分类",
      "author": this.config.indexConfig.author,
      "description": "文章分类 - " + this.config.title,
      "keywords": this.config.title + " 文章分类",
      "isCategory": true // 分类渲染时，分类链接为自己本身，而非hash
    }

    let categoryPageHtml = noteRender(this.config, globalScript, {
      topRightLinkHtml,
      asideHtml,
      articleConfig,
      articleHtml: contentHtml
    })

    fs.writeFileSync(`./dist/blog/category.html`, categoryPageHtml)
    console.log('生成分类页面./dist/blog/category.html成功 [OK]')
  }

  /**
   * @description 获取分类页面主区域内容
   */
  _getCategoryContentHtml() {
    let contentHtml = ''

    // console.log(this.category)

    for (let [key, value] of Object.entries(this.category)) {
      // console.log(key, value)
      if (!value) continue 

      contentHtml += `<span id="${key.toLowerCase()}">${key}(${value.length})</span>`
      // 文章内嵌广告
      if (value.length > 20 && this.config.noteInnerAdHtml)  {
        contentHtml += this.config.noteInnerAdHtml
      }
      contentHtml += `<ul class="category-ul">`

      // fix 列表排序问题
      value.sort((a, b) => {
        return b.time.split('/').join('') - a.time.split('/').join('')
      })
      
      value.forEach(item => {
        contentHtml += `<li><a href="${item.href}">${item.title}</a> (${item.time}) </li>`
      })
      contentHtml += `</ul>`
    }

    return contentHtml
  }

  // 分类, 自定义排序
  _customSequenceCateogy() {
    // 其实对象是不能遍历的，这些方法之所以能够让对象遍历，是因为他们都内置了将对象转化
    // 为数组的方法，但是，在将对象属性当作数组数值一一插入时，不是按照对象属性在对象中
    // 的排序，而是按照属性在对象中创建的时间

    // 深拷贝
    let copyCategory = JSON.parse(JSON.stringify(this.category))
    let newCategory = {}
    this.config.categorySequence.forEach(item => {
      newCategory[item] = copyCategory[item]
    })
    this.category = newCategory
  }
}

module.exports = DefaultDraft