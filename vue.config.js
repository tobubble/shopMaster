module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        views: '@/views',
        assets: '@/assets',
        components: '@/components',
        common: '@/common',
        plugin: '@/plugin',
        network: '@/network'
      }
    }
  },
  chainWebpack: config => {
    // process.env.NODE_ENV 指的是当前打包的时候是 production 还是 development 
    config.when(process.env.NODE_ENV === 'production', config => {

      // 
      config.entry('app').clear().add('./src/main-deve.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      // 插件
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-deve.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
  }
}