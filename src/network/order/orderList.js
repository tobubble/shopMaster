import {request} from '../request'

// 获取商品分类数据
export function getOrderList(config) {
  return request({
    url: 'orders',
    method: 'get',
    params: {
      query: config.query,
      pagenum: config.pagenum,
      pagesize: config.pagesize
    }
  })
}