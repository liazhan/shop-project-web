import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import regist from '@/components/regist'
import login from '@/components/login'

Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta:{
        title: '首页'
      }
    },
    {
      path: '/regist',
      name: 'regist',
      component: regist,
      meta:{
        title: '注册'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta:{
        title: '登陆'
      }
    },
  ]
})
