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
  }
}