import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import Toast from './plugins/toast/index';
require('./directives/index')

Vue.prototype.$toast = Toast;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
