
class DefaultDraft {

  constructor() {
    this.category = {},
    this.fileData = [],
    this.count = 0
  }

  // 根据元数据，生成静态博客系统
  init(notesData) {
    // console.log(notesData)
    Object.assign(this, notesData)
    // console.log(this.category, this.fileData, this.count)
  }
}

module.exports = DefaultDraft