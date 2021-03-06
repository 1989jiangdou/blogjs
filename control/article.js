const {db} = require('../schema/config')
const ArticleSchema = require('../schema/article')
// 取用户schema,为了拿到操作users集合的实例对象
const UserShema = require('../schema/user')
const User = db.model('users', UserShema)
//通过db对象创建操作articles数据库的模型对象
const Article = db.model('articles', ArticleSchema)
//通过db对象创建操作comments数据库的模型对象
const CommentSchema = require('../schema/comment')
const Comment = db.model('comments', CommentSchema)

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
    data.commentNum = 0
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
// 获取文章列表页
exports.getList = async ctx =>{
    // 查询每篇文章对应的作者的头像
    // id ctx.params.id
    let page = ctx.params.id || 1
    page--
    
    const maxNum = await Article.estimatedDocumentCount((err, num) => err? console.log(err) : num)
    
    const artList = await Article
      .find()
      .sort('-created')
      .skip(2 * page)
      .limit(2)
      //拿到了5条数据
      .populate({
        path: "author",
        select: '_id username avatar'
      }) // mongoose 用于连表查询
      .then(data => data)
      .catch(err => console.log(err))   
    
    await ctx.render('index', {
        session: ctx.session,
        title: '博客首页',
        artList,
        maxNum
    })
}

// 获取文章详情页
exports.details = async ctx =>{
    // 取动态路由的id
    const _id = ctx.params.id

    // 查找文章本身数据
    const article = await Article
    .findById(_id)
    .populate('author', 'username')
    .then(data => data)

    // 查找跟当前文章关联的所有评论
    const comment = await Comment
    .find({article: _id})
    .sort('-created')
    .populate('from', 'username avatar')
    .then(data => data)
    .catch(err => console.log(err))

    await ctx.render('article', {
        title: article.title,
        comment,
        article,
        session: ctx.session
    })
    
}
