import {request} from '../request'

// 获取用户列表数据
export function userList(config) {
  return request({
    url: 'users',
    method: 'get',
    params: {
      query: config.query ? config.query : '',
      pagenum: config.pagenum,
      pagesize: config.pagesize
    }
  })
}

// 修改用户的状态
export function changeUserState(uid, type) {
  return request({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}

// 删除用户请求
export function deleteUser(uid) {
  return request({
    url: `users/${uid}`,
    method: 'delete'
  })
}

// 编辑用户请求
export function editUser(config) {
  return request({
    url: `users/${config.id}`,
    method: 'put',
    data: {
      email: config.email,
      mobile: config.mobile
    }
  })
}

// 添加用户请求
export function addUser(config) {
  return request({
    url: `users`,
    method: 'post',
    data: {
      username: config.username,
      password: config.password,
      email: config.email? config.email : '' ,
      mobile: config.mobile ? config.mobile: '',
    }
  })
}

// 角色列表请求
export function charactorList() {
  return request({
    url: `roles`,
    method: 'get'
  })
}

// 分配角色请求
export function setCharactor(config) {
  return request({
    url: `users/${config.id}/role`,
    method: 'put',
    data: {
      rid: config.rid
    }
  })
}

