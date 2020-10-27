import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 清除浏览器基本样式
import 'assets/css/base.css'
// 导入 elementUi 
import 'plugin/elementUi'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

