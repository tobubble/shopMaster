const productionPlugins = []
// // 判断当前的环境是开发环境还是生产环境
if(process.env.NODE_ENV === 'production') {
  productionPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": productionPlugins
}
