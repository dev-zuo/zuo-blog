
// 开启一个静态服务，指向当前路径下的 dist 目录

class DevServer {
  start(port = '8888') {
    const Koa = require('koa')
    const KoaStatic = require('koa-static')

    const path = require('path') 
    const distPathWhenExcude = path.join(process.cwd(), 'dist')

    const app = new Koa()
    app.use(new KoaStatic(distPathWhenExcude))
    app.listen(port, () => console.log(`Dev Server listening on ${port} port`))
  }
}

module.exports = DevServer