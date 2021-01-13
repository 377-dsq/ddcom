import Vue from 'vue'
import Toast from '@com/toast.vue';  // 引入组件

const TOAST = Vue.extend(Toast)

let instance
const initInstance = () => {
  instance = new TOAST
  instance.$mount()
}
function showMsg(message, type, duration) {
  duration = duration && parseInt(duration) && parseInt(duration) > 0 ? parseInt(duration) : 3000
  const typeList = ['info', 'warning', 'success', 'error']
  type = typeList.includes(type)? type : 'info'
  instance || initInstance()
  const toast = Object.assign(instance, {
    message,
    type,
    duration,
  })
  toast.show()
  return this
}

export default {
  info(msg, duration) {
    showMsg(msg, 'info', duration)
  },
  success(msg, duration) {
    showMsg(msg, 'success', duration)
  },
  warning(msg, duration) {
    showMsg(msg, 'warning', duration)
  },
  error(msg, duration) {
    showMsg(msg, 'error', duration)
  },
}