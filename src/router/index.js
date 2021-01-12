import Vue from 'vue'
import VueRouter from 'vue-router'

const Swiper = () => import('../views/example/swiper.vue')
const ScrollTab = () => import('../views/example/scrollTab.vue')


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
]

export default new VueRouter({
  routes,
  mode: 'history'
})