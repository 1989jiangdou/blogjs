const {Schema} = require('./config')

const ArticleSchema = new Schema({
    title: String,
    content: String,
    author: String,
    tips: String
}, { versionKey: false, timestamps: {
    // 默认系统的时间，自动插入
    createdAt: 'created'
}})

module.exports = ArticleSchema