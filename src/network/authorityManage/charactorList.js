import {request} from '../request'

// 获取角色列表
export function getCharactorList() {
  return request({
    url: 'roles',
    method: 'get'
  })
}

// 编辑提交角色
export function editCharactor(config) {
  return request({
    url: `roles/${config.id}`,
    method: 'put',
    data: {
      roleName: config.roleName,
      roleDesc: config.roleDesc? config.roleDesc: ''
    }
  })
}

// 删除角色
export function deleteCharactor(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete',
  })
}

// 添加角色
export function addCharactor(config) {
  return request({
    url: `roles`,
    method: 'post',
    data: {
      roleName: config.roleName,
      roleDesc: config.roleDesc ? config.roleDesc : '',
    }
  })
}

// 获取所有权限列表
export function getAuthorityTree() {
  return request({
    url: `rights/tree`,
    method: 'get',
  })
}

// 角色授权
export function setAuthority(config) {
  return request({
    url: `roles/${config.uid}/rights`,
    method: 'post',
    data: {
      rids: config.rids
    }
  })
}


