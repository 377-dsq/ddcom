<template>
  <transition name="toast-fade">
    <div class="toast" v-show="showToast">
      <img :src="img" class="icon" alt="">
      <span class="text">{{message}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'toast',
  data() {
    return {
      showToast:  false,
      message: 'a message',
      type: 'info',
      duration: 3000
    }
  },
  computed: {
    img() {
      let imglink = ''
      switch (this.type) {
        case 'info':
          imglink = require('@res/icon/hint-b.svg')
          break;
        case 'warn':
          imglink = require('@res/icon/hint-y.svg')
          break;
        case 'success':
          imglink = require('@res/icon/hint-g.svg')
          break;
        case 'error':
          imglink = require('@res/icon/hint-r.svg')
          break;
        default:
          imglink = require('@res/icon/hint-b.svg')
          break;
      }
      return imglink
    }
  },
  beforeDestroy() {
    this.$el && document.body.removeChild(this.$el)
  },
  methods: {
    show() {
      if (timer) {
        timer = null
      }
      document.body.appendChild(this.$el)
      this.showToast = true
      let timer = setTimeout(() => {
        this.showToast = false
      }, this.duration);
    }
  }
};
</script>

<style scoped lang="scss">
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  background: #333;
  border-radius: .1rem;
  font-size: .15rem;
  padding: .1rem .2rem;
  color: #ffffff;
  display: flex;
  &.toast-fade-enter-active {
    animation: toast-fadein 0.3s;
  }
  &.toast-fade-leave-active {
    animation: toast-fadeout .3s;
  }
  .icon{
    width: .2rem;
    height: .2rem;
    margin-right: .06rem;
    vertical-align: bottom;
  }
}
@keyframes toast-fadein {
  0% {opacity: 0;}
  100% {opacity: 1;}
}
@keyframes toast-fadeout {
  0% {opacity: 1;}
  100% {opacity: 0;}
}
</style>