import {request} from '../request'

// 获取商品分类数据
export function getGoodsClassify() {
  return request({
    url: 'categories',
    method: 'get'
  })
}

// 获取动态参数列表
export function getManyParams(id) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel: 'many'
    }
  })
}

// 获取紧要参数列表
export function getOnlyParams(id) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel: 'only'
    }
  })
}

// 添加商品请求
export function addGoods(config) {
  return request({
    url: `goods`,
    method: 'post',
    data: {
      goods_name: config.goods_name,
      goods_cat: config.goods_cat,
      goods_price: config.goods_price,
      goods_number: config.goods_number,
      goods_weight: config.goods_weight,
      goods_introduce: config.goods_introduce?config.goods_introduce : '',
      pics: config.pics?config.pics: '',
      attrs: config.attrs?config.attrs: '',
    }
  })
}

