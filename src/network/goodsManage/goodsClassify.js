import {request} from '../request'

// 获取商品分类数据列表
export function getGoodsClassify(config) {
  return request({
    url: 'categories',
    method: 'get',
    params: {
      type: config.type,
      pagenum: config.pagenum,
      pagesize: config.pagesize
    }
  })
}

// 请求添加商品的分类
export function addGoodsClassify(config) {
  return request({
    url: 'categories',
    method: 'post',
    data: {
      cat_pid: config.cat_pid,
      cat_name: config.cat_name,
      cat_level: config.cat_level
    }
  })
}

// 编辑分类名称
export function editGoodsClassify(config) {
  return request({
    url: `categories/${config.id}`,
    method: 'put',
    data: {
      cat_name: config.cat_name
    }
  })
}

// 删除分类
export function deleteGoodsClassify(id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}
