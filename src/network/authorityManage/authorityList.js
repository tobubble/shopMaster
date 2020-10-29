import {request} from '../request'

// 获取角色列表
export function getAuthorityList() {
  return request({
    url: 'rights/list',
    method: 'get'
  })
}