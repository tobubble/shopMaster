import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载
const Login = () => import('views/login/Login')
const authorityList = () => import('views/authority/authorityList')
const characterList = () => import('views/authority/characterList')
const dataSta = () => import('views/dataSta/dataSta')
const classifyParams = () => import('views/goods/classifyParams')
const goodsClassify = () => import('views/goods/goodsClassify')
const goodsList = () => import('views/goods/goodsList')
const Home = () => import('views/home/Home')
const orderList = () => import('views/orderManage/orderList')
const userList = () => import('views/userManage/userList')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {path: '', redirect: '/userList'},
      {path: '/authorityList', component: authorityList},
      {path: '/characterList', component: characterList},
      {path: '/dataSta', component: dataSta},
      {path: '/classifyParams', component: classifyParams},
      {path: '/goodsClassify', component: goodsClassify},
      {path: '/goodsList', component: goodsList},
      {path: '/orderList', component: orderList},
      {path: '/userList', component: userList},
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局导航守卫，防止没有令牌就进入到其他的页面而不通过 login 页面登录跳转
router.beforeEach((to, from, next) => {
  // 当前要去的页面不是  login  ， 判断是否携带 token 
  if(to.fullPath !== '/login' && !window.sessionStorage.token) {
    Vue.prototype.$message.error('请从登录页面进入')
    next({name: 'login'})
  } else {
    next()
  }
})

export default router
