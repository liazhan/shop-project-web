// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//引入iview
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);

//引入axios
import axios from 'axios'
Vue.prototype.$axios = axios

//引入缓存good-storage
import storage from 'good-storage'
Vue.prototype.$storage = storage

//全局变量-会员服务访问地址
Vue.prototype.$memberUrl = 'http://127.0.0.1/liazhan-member/'
//全局变量-图片地址前缀
Vue.prototype.$picUrl = 'http://q9u97hqms.bkt.clouddn.com/'

Vue.config.productionTip = false

router.beforeEach((to,from,next)=>{
  //路由发生变化修改页面title
  if(to.meta.title){
    document.title = to.meta.title;
  }
  next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
