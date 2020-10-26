import axios from 'axios'

export function request(config) {
  const instance1 = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    timeout: 6000,
    timeoutErrorMessage: '请求超时',
    method: 'post'
  })

  return instance1(config)
}