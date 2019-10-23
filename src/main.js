import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor /* { default global options } */)

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$axios = axios
// 配置全局的基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
// 请求拦截器
axios.interceptors.request.use(function (config) {
  // console.log(config)
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  response = response.data
  if (response.meta.status === 401) {
    response.meta.msg = '尊敬的用户，您的登陆状态已过期，请重新登录'
    localStorage.removeItem('token')
    router.push('/login')
  }

  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

Vue.filter('time', function (value) {
  return moment(value * 1000).format('YYYY年MM月DD日 HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
