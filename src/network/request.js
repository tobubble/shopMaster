import axios from 'axios'
import Vue from 'vue'

export function request(config) {
  const instance1 = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    // baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000,
    method: 'post'
  })

  instance1.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })

  instance1.interceptors.response.use(config => {
    return config
  }, error => {
    if(error.message.includes('timeout')) {
      console.log('错误回调', error)
      Vue.prototype.$message.error("网络请求超时，请检查网络")
    }
    return Promise.reject(error)
  })

  return instance1(config)
}