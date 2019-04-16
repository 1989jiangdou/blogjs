const {db} = require('../schema/config')
const ArticleSchema = require('../schema/article')
//通过db对象创建操作articles数据库的模型对象
const Article = db.model('articles', ArticleSchema)
// 返回文章发表页
exports.addPage = async ctx =>{
    await ctx.render('add-article', {
        title: '文章发表页',
        session: ctx.session
    })
}
// 文章的发表，保存到数据库
exports.add = async ctx =>{
    if(ctx.session.isNew){
        // true没有登录，不需要查数据库
        return ctx.body = {
            msg: '用户未登录',
            status: 0
        }
    }
    // 用户登录的情况
    // 这是用户在登录情况下 post发过来的数据
    const data = ctx.request.body
    // tips title content    author
    // data.author = ctx.session.username
    data.author = ctx.session.uid
    
    await new Promise((res, rej) =>{
        new Article(data).save((err, data)=>{
            if(err) return rej(err)
            res(data)
        })
    })
    .then(data =>{
        ctx.body = {
            msg: '发表成功',
            status: 1
        }
    })
    .catch(data =>{
        ctx.body = {
            msg: '发表失败',
            status: 0
        }
    })

}