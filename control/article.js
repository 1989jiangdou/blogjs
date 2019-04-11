const {db} = require('../schema/config')
const ArticleSchema = require('../schema/article')
//通过db对象创建操作articles数据库的模型对象
const Article = db.model('articles', ArticleSchema)
exports.addPage = async ctx =>{
    await ctx.render('add-article', {
        title: '文章发表页',
        session: ctx.session
    })
}