const Koa = require('koa')
const views = require('koa-views')
const static = require('koa-static')
const router = require('./routers/router')
const logger = require('koa-logger')
const koaBody = require('koa-body')
const {join} = require('path')
const session = require('koa-session')

// 生产koa实例
const app = new Koa()
// 注册日志模块
// app.use(logger())

app.keys = ['我是风雨'];
// 注册session模块
const CONFIG = {
    key: 'sid',
    maxAge: 35e5,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false
}
app.use(session(CONFIG, app))
app.use(koaBody())
// 配置静态资源目录
app.use(static(join(__dirname, 'public')))
// 配置视图模板
app.use(views(join(__dirname, 'views'),{
    extension: 'pug'
}))

//注册路由信息
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)