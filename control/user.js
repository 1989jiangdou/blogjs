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