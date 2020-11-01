import {request} from '../request'

// 获取商品分类数据
export function getDataReport(config) {
  return request({
    url: 'reports/type/1',
    method: 'get'
  })
}