import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载
const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')

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
    component: Home
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
  if(to.name !== 'login' && !window.sessionStorage.token) {
    // 没有token
    next({name: 'login'})
    // 要去的页面是 login
  } else {
    next()
  }
})

export default router
