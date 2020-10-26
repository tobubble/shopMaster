import {request} from '../request'

export function userLogin(config) {
  return request({
    url: 'login',
    method: 'post',
    data: {
      username: config.username,
      password: config.password,
    }
  })
}