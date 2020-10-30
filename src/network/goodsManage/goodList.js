import {request} from '../request'

// 获取角色列表
export function getGoodsList(config) {
  return request({
    url: 'goods',
    method: 'get',
    params: {
      query: config.query? config.query: '',
      pagenum: config.pagenum,
      pagesize: config.pagesize
    }
  })
}

// 编辑商品
export function eidtGoods(config) {
  return request({
    url: `goods/${config.id}`,
    method: 'put',
    data: {
      goods_name: config.goods_name,
      goods_price: config.goods_price,
      goods_number: config.goods_number,
      goods_weight: config.goods_weight,
      goods_cat: '1,2,3'
    }
  })
}

// 删除商品
export function deleteGoods(id) {
  return request({
    url: `goods/${id}`,
    method: 'delete',
  })
}