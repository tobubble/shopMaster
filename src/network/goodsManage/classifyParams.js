import {request} from '../request'

// 获取商品分类数据
export function getGoodsClassify() {
  return request({
    url: 'categories',
    method: 'get'
  })
}

// 根据分类id查询参数列表
export function getParamsById(config) {
  return request({
    url: `categories/${config.id}/attributes`,
    method: 'get',
    params: {
      sel: config.sel
    }
  })
}

// 编辑属性
export function editParams(config) {
  return request({
    url: `categories/${config.id}/attributes/${config.attrId}`,
    method: 'put',
    data: {
      attr_name: config.attr_name,
      attr_sel: config.attr_sel,
      attr_vals: config.attr_vals,
    }
  })
}

// 添加参数
export function addParams(config) {
  return request({
    url: `categories/${config.id}/attributes`,
    method: 'post',
    data: {
      attr_name: config.attr_name,
      attr_sel: config.attr_sel,
    }
  })
}

// 删除参数
export function deleteParams(config) {
  return request({
    url: `categories/${config.id}/attributes/${config.attrId}`,
    method: 'delete',
  })
}

// 修改属性名称
export function editParamsName(config) {
  return request({
    url: `categories/${config.id}/attributes/${config.attrId}`,
    method: 'put',
    data: {
      attr_name: config.attr_name,
      attr_sel: config.attr_sel,
    }
  })
}