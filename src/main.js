import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 清除浏览器基本样式
import 'assets/css/base.css'
// 导入 elementUi 
import 'plugin/elementUi'

Vue.config.productionTip = false

Vue.filter("dateFormat", originVal => {
  originVal *= 1000
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  // const y = dt.getFullYear()
  const hh = (dt.getHours()+ '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

