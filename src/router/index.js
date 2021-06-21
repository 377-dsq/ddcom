import Vue from 'vue'
import VueRouter from 'vue-router'

const Swiper = () => import('../views/example/swiper.vue')
const ScrollTab = () => import('../views/example/scrollTab.vue')
const Toast = () => import('../views/example/toast.vue')
const Waterfall = () => import('../views/example/waterfall.vue')

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
  {
    component: Waterfall,
    path: '/waterfall'
  },
]

export default new VueRouter({
  routes,
  mode: 'history'
})