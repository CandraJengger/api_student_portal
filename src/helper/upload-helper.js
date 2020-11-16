const path = require('path')
const fs = require('fs')

const upload = ({ file, filename, dir }) => {
  file.mv(path.resolve(__dirname, `../../public/uploads/${dir}/${filename}`), (error, result) => {
    if (error) {
      throw error
    }
    console.log('File Uploaded')
  })
}

const removeFromDir = (pathFile) => {
  fs.stat(path.resolve(__dirname, `../../public/uploads/${pathFile}`), (error, stats) => {
    if (error) {
      console.log(error)
      return
    }
    console.log(stats)

    fs.unlink(path.resolve(__dirname, `../../public/uploads/${pathFile}`), error => {
      if (error) {
        console.log(error)
        return
      }
      console.log('Delete successfully')
    })
  })
}

module.exports = {
  upload,
  removeFromDir
}