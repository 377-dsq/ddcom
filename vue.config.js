const path = require('path')
const { config } = require('process')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@css', resolve('src/assets/css'))
      .set('@img', resolve('src/assets/img'))
  }
}