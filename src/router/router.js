import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios'

import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import Goods from '@/components/goods/Goods'
import AddGood from '@/components/goods/AddGood'
import EditGood from '@/components/goods/EditGood'
import Params from '@/components/goods/Params'
import Categories from '@/components/goods/Categories'
import Orders from '@/components/orders/Orders'
import Reports from '@/components/reports/Reports'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/login', component: Login
    },
    {
      path: '/home', 
      component: Home, 
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/users', component: Users},
        {path: '/rights', component: Rights},
        {path: '/roles', component: Roles},
        {path: '/goods', component: Goods},
        {path: '/addgood', component: AddGood},
        {path: '/editgoods/:id', component: EditGood, props: route => ({ id: route.params.id })},
        {path: '/params', component: Params},
        {path: '/categories', component: Categories},
        {path: '/orders', component: Orders},
        {path: '/reports', component: Reports},
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to: 将要访问的路径
  // from: 代表从哪个路径跳转而来
  // next: 是一个函数，表示放行
  //       next()  放行
  //       next('/login')  强制跳转
  if(to.path === '/login') return next();
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token');
  Axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })
  if(!tokenStr) return next('/login');
  next();
})

export default router