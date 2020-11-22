const HashHelper = require('./src/helper/hash-helper')

const result = HashHelper.generateHash('123')

const b = require('bcrypt')

console.log(b.hashSync('123', 10))
const resultCompare = HashHelper.compareHash('123', result)

console.log(resultCompare)
// console.log()

// const fs = require('fs')
// const path = require('path')

// fs.stat(path.resolve(__dirname, './public/uploads/krs/193307010-sm2-1605502398473-IMG-20190924-WA0009.jpg'), (err, stats) => {
//   if (err) {
//     throw err
//   }
//   console.log(stats)

//   fs.unlink(path.resolve(__dirname, './public/uploads/krs/193307010-sm2-1605502398473-IMG-20190924-WA0009.jpg'), (err, stats) => {
//     if (err) return console.log(err)
//     console.log('berhasil dihapus')
//   })
// })

// const auth = require('./src/helper/auth-helper')
// const decode = auth.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOUE0iOjE5MzMwNzAxMCwiU1RBVFVTX01IUyI6IlRpZGFrIEFrdGlmIiwiaWF0IjoxNjA1NzU4NzI4fQ.txFS0eyWBKT9w_98UlCKRKoN4laum9rXBy9DyYJvrjU')

// console.log(decode)