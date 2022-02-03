const path = require('path')
const fs = require('fs')

/**
 * node 在操作文件夹时会比较麻烦，需要自己封装方法，将网上的方法修改了下路径方面的问题
 * https://segmentfault.com/a/1190000020040889
 */
class FSExtend {
  /**
   * 删除文件夹
   */
  static deleteFolder(delPath) {
    // console.log('pre delPath', delPath)
    // delPath = path.join(__dirname, delPath) // 这个是当前文件的路径
    // process.cwd()  当前命令执行时所在的目录
    delPath = path.join(process.cwd(), delPath)
    // console.log('delPath', delPath)

    try {
        if (fs.existsSync(delPath)) {
            const delFn = function (address) {
                const files = fs.readdirSync(address)
                for (let i = 0; i < files.length; i++) {
                    const dirPath = path.join(address, files[i])
                    if (fs.statSync(dirPath).isDirectory()) {
                        delFn(dirPath)
                    } else {
                        FSExtend.deleteFile(dirPath)
                    }
                }
                /**
                * @des 只能删空文件夹
                */
                fs.rmdirSync(address);
            }
            delFn(delPath);
        } else {
            // console.log('需要删除的文件不存在，不用删除', delPath);
        }
    } catch (error) {
        console.log('del folder error', error);
    }
  }

  /**
   * @description 删除文件
   * @param { delPath：String } （需要删除文件的地址）
   */
  static deleteFile(delPath) {
    try {
        /**
         * @des 判断文件或文件夹是否存在
         */
        if (fs.existsSync(delPath)) {
            fs.unlinkSync(delPath);
        } else {
            console.log('inexistence path：', delPath);
        }
    } catch (error) {
        console.log('del error', error);
    }
  }

  /**
   * @description 负责文件夹
   */
  static copyFolder(copiedPath, resultPath) {
    // copiedPath = path.join(process.cwd(), copiedPath)
    // resultPath = path.join(process.cwd(), resultPath)

    function createDir (dirPath) {
        fs.mkdirSync(dirPath)        
    }

    if (fs.existsSync(copiedPath)) {
        // 如果 resultPath 存在，就不再创建
        if (!fs.existsSync(resultPath)) {
            createDir(resultPath)
        }

        /**
         * @des 方式一：利用子进程操作命令行方式
         */
        // child_process.spawn('cp', ['-r', copiedPath, resultPath])

        /**
         * @des 方式二：
         */
        const files = fs.readdirSync(copiedPath, { withFileTypes: true });
        for (let i = 0; i < files.length; i++) {
            const cf = files[i]
            const ccp = path.join(copiedPath, cf.name)
            const crp = path.join(resultPath, cf.name)  
            if (cf.isFile()) {
                /**
                 * @des 创建文件,使用流的形式可以读写大文件
                 */
                const readStream = fs.createReadStream(ccp)
                const writeStream = fs.createWriteStream(crp)
                readStream.pipe(writeStream)
            } else {
                try {
                    /**
                     * @des 判断读(R_OK | W_OK)写权限
                     */
                    fs.accessSync(path.join(crp, '..'), fs.constants.W_OK)
                    FSExtend.copyFolder(ccp, crp)
                } catch (error) {
                    console.log('folder write error:', error);
                }

            }
        }
    } else {
        console.log('do not exist path: ', copiedPath);
    }
  }
}

module.exports = FSExtend