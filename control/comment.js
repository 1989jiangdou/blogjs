const {db} = require('../schema/config')
// 取用户schema,为了拿到操作users集合的实例对象
const UserShema = require('../schema/user')
const User = db.model('users', UserShema)
//通过db对象创建操作articles数据库的模型对象
const ArticleSchema = require('../schema/article')
const Article = db.model('articles', ArticleSchema)
//通过db对象创建操作comments数据库的模型对象
const CommentSchema = require('../schema/comment')
const Comment = db.model('comments', CommentSchema)
// 保存评论
exports.save = async ctx =>{
    let message = {
        status: 0,
        msg: '登录才能发表'
    }
    // 验证用户是否登录
    if(ctx.session.isNew) return ctx.body = message

    // 用户登录了
    const data = ctx.request.body
    data.from = ctx.session.uid
    const  _comment = new Comment(data)
    await  _comment
    .save()
    .then(data=>{
        message = {
            status: 1,
            msg: '发表成功'
        }
    })
    .catch(err =>{
        message = {
            status: 0,
            msg: err
        }
    })

    ctx.body = message

}