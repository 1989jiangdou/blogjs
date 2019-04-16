const {Schema} = require('./config')
const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: ObjectId,
        ref: 'users'
    }, //关联users的表
    tips: String
}, { versionKey: false, timestamps: {
    // 默认系统的时间，自动插入
    createdAt: 'created'
}})

module.exports = ArticleSchema