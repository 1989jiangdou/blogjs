const Router = require('koa-router')
const router = new Router()
router.get('/', async ctx=>{
    await ctx.render('index', {
        title: '假装这是一个正经的title',
        // session: {
        //     role: 1
        // }
    })
})
// 主要用来处理用户登录 用户注册 
// router.get('/user/:fy', async ctx=>{
//     ctx.body = ctx.params.fy
// })
// 转化为正则
    router.get(/^\/user\/(reg|login)/, async ctx =>{
        // show 为 true显示注册，false显示登录

        const show = /^reg$/.test(ctx.path)
        await ctx.render('register', {show})
    })


// 对用户的动作： /user
// 登录  /user/login
// 注册  /user/reg
// 退出  /user/logout

// 新增用户 post > /user -->新增用户信息
// 删除用户 del > /user -->带上需要删除的用户的 id
// 修改用户资料
// 查询用户信息

module.exports = router