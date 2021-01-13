import Vue from 'vue'
import VueRouter from 'vue-router'

const Swiper = () => import('../views/example/swiper.vue')
const ScrollTab = () => import('../views/example/scrollTab.vue')
const Toast = () => import('../views/example/toast.vue')



Vue.use(VueRouter)

const routes = [
  {
    component: Swiper,
    path: '/swiper'
  },
  {
    component: ScrollTab,
    path: '/scroll-tab'
  },
  {
    component: Toast,
    path: '/toast'
  },
]

export default new VueRouter({
  routes,
  mode: 'history'
})