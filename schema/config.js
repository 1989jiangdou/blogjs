//连接数据库 导出db Schema
const mongoose = require('mongoose')
const db = mongoose.createConnection('mongodb://localhost:27017/blogproject', {useNewUrlParser: true})
const Schema = mongoose.Schema
//用原生es6的promise代替mongoose自实现的promise
mongoose.Promise = global.Promise
db.on('error', ()=>{
    console.log('数据库连接失败')
})
db.on('open',()=>{
    console.log('数据库连接成功')
})

module.exports = {
    db,
    Schema
}

