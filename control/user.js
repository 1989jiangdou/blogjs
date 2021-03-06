const {db} = require('../schema/config')
const UserSchema = require('../schema/user')
const crypto = require('../util/encrypt')
//通过db对象创建操作user数据库的模型对象
const User = db.model('users', UserSchema)
// 用户注册
exports.reg = async (ctx) => {
    const user = ctx.request.body
    const username = user.username
    const password = user.password
    // 假设格式符合，去数据库user先查询当前发过来的username是否存在
    await new Promise((res, rej)=>{
        User.find({username}, (err, data)=>{
            if(err) return rej(err)
            // 数据库查询没出错 还有可能没有数据
            if(data.length !== 0){
                //查询数据库——》用户名已存在
                return res('')
            }
            // 用户名不存在，存到数据库
            // 保存到数据库之前先加密，crypto是自定义的加密模块
            const _user = new User({
                username,
                password: crypto(password)
            })
            _user.save((err, data)=>{
                if(err){rej(err)} 
                else{res(data)}
            })

        })
    })
    .then(async data=>{
        if(data){
            //注册成功
           await ctx.render('isOk', {
                status: '注册成功'
            })
        }else{
            //用户名已存在
            await ctx.render('isOk', {
                status: '用户名已存在'
            })
        }
    })
    .catch(async err=>{
        await ctx.render('isOk', {
            status: '注册失败，请重试'
        })
    })
}
// 用户登录
exports.login = async (ctx) =>{
   const user = ctx.request.body
   const username = user.username
   const password = user.password 
   await new Promise((res, rej) => {
    User.find({username}, (err, data)=>{
        // 查找数据的过程失败了
        if(err) return rej(err)
        if(data.length === 0 ) return rej('用户名不存在')
        // 用户存在，把用户传过来的密码和数据库的进行比对
        if(data[0].password === crypto(password)){
            return res(data)
        }      
        res('')
    })
   })
   .then(async data =>{
       if(!data){
           return await ctx.render('isOk', {
               status: '密码不正确，登录失败'
           })
       }

       // 让用户在他的cookie里设置 username password 加密后的密码 权限
       ctx.cookies.set('username', username, {
           domain: 'localhost',
           path: '/',
           maxAge: 36e5,
           httpOnly: true, //true 不让客户端访问这个cookie
           overwrite: false,
           signed: false
       })
       // 用户在数据库的_id的 值
       ctx.cookies.set('uid', data[0]._id, {
            domain: 'localhost',
            path: '/',
            maxAge: 36e5,
            httpOnly: true, //true 不让客户端访问这个cookie
            overwrite: false,
            signed: false
       })
       ctx.session = {
           username,
           uid: data[0]._id,
           avatar: data[0].avatar
       }
       
      await ctx.render('isOk', {
        status: '登录成功'
        })
   })
   .catch(async err =>{
       await ctx.render('isOk', {
           status: '登录失败'
       })
   })
}

// 确定用户的状态，保持用户的状态
exports.keepLog = async (ctx, next) =>{
    if(ctx.session.isNew){// 用户没有登录session没有值为true
        if(ctx.cookies.get('username')){
            ctx.session = {
                username: ctx.cookies.get('username'),
                password: ctx.cookies.get('password')
            }
        }

    }
    await next()
}
// 用户退出中间件
exports.logout = async (ctx) =>{
    ctx.session = null,
    ctx.cookies.set('username', null, {
        maxAge: 0
    }),
    ctx.cookies.set('uid', null, {
        maxAge: 0
    })
    // 在后台做重定向到 根  前端重定向为 location.href = '/'
    ctx.redirect('/')
}