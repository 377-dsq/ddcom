import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/home.vue')

Vue.use(VueRouter)

const routes = [
  {
    component: Home,
    path: '/'
  }
]

export default new VueRouter({
  routes,
  mode: 'history'
})