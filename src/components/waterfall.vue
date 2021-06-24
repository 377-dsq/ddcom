<template>
  <div 
    class="com-waterfall"
    :style="{ height: height }"
    ref="vueWaterfall"
    id="vueWaterfall"
    :class="isTransition && 'is-transition'"
  >
    <div class="slot-box">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    col: {
      type: Number,
      default: 2
    },
    width: Number,
    height: {
      type: String
      // default:'100vh',    取消height默认值
    },
    dataList: {
      type: Array,
      default: () => []
    },
    gutterWidth: {
      type: Number,
      default: 10
    },
    isTransition: {
      type: Boolean,
      default: true
    },
    lazyDistance: {
      type: Number,
      default: 300
    },
    loadDistance: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      root: null,
      columns: [],
      loadmore: true,
      timeout: null,
      lazyTimeout: null,
      lastScrollTop: 0,
      timer: null,
      loadedIndex: 0,
      columnWidth: 0,
      isresizing: false,
      clientHeight: document.documentElement.clientHeight || document.body.clientHeight,
      clientWidth: document.documentElement.clientWidth || document.body.clientWidth
    }
  },
  computed: {
    trueLazyDistance() {
      return (this.clientWidth / 375) * this.lazyDistance
    },
    max() {
      return (this.clientWidth / 375) * this.loadDistance
    }
  },
  watch: {
    col() {
      this.$nextTick(() => {
        this.init()
      })
    },
    dataList(newVal, oldVal) {
      this.$nextTick(() => {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (this.isresizing) {
            return
          }
          if (newVal.length < this.loadedIndex) {
            this.loadedIndex = 0
          }
          if (newVal.length > oldVal.length || newVal.length > this.loadedIndex) {
            if (newVal.length === oldVal.length) {
              this.resize(this.loadedIndex > 0 ? this.loadedIndex : null)
              return
            }
            this.resize(oldVal.length > 0 ? oldVal.length : null)
          }
        }, 300)
      })
    }
  },

  destroyed() {
    this.root && (this.root.onscroll = null)
    this.root && (this.root.onresize = null)
    window.onscroll = null
    window.onresize = null
  },
  mounted() {
    this.__listenRouterChange()
    this.$nextTick(() => {
      this.init()
      var self = this
      if (this.height) {
        this.root.onscroll = function() {
          self.__emitLoadMore()
        }
        this.root.addEventListener('touchmove', function() {
          self.__emitLoadMore()
        })
      } else {

        window.onscroll = function() {
          self.__emitLoadMore()
        }
        document.addEventListener('touchmove', function() {
          self.__emitLoadMore()
        })
      }
    })
  },
  methods: {
    // 监听路由是否发生变化
    __listenRouterChange() {
      // 重写pushState与replaceState事件函数
      var _wr = function(type) {
        // 记录原生事件
        var orig = history[type]
        return function() {
          // 触发原生事件
          var rv = orig.apply(this, arguments)
          // 自定义事件
          var e = new Event(type)
          e.arguments = arguments
          // 触发自定义事件
          window.dispatchEvent(e)
          return rv
        }
      }
      const events = ['replaceState', 'pushState']
      events.forEach(event => {
        window.addEventListener(event, () => {
          this.routeChanged = true
        })
        // 重写history
        window.history[event] = _wr(event)
      })
      window.addEventListener('popstate', () => {
        this.routeChanged = true
      })
    },

    init() {
      //initialize
      this.root = this.$refs.vueWaterfall
      this.clearColumn()
      var col = parseInt(this.col)
      for (var i = 0; i < col; i++) {
        let odiv = document.createElement('div')
        odiv.className = 'vue-waterfall-column'
        if (this.width) {
          odiv.style.width = this.width + 'px'
          if (i != 0) {
            odiv.style.marginLeft = this.gutterWidth + 'px'
          }
          this.columnWidth = this.width
        } else {
          odiv.style.width = 100 / parseInt(col) + '%'
          this.columnWidth = (100 / parseInt(col) / 100) * document.documentElement.clientWidth
        }
        if (!this.root) {
          this.root = this.$refs.vueWaterfall
        }
        this.root && this.root.appendChild(odiv)
        this.columns.push(odiv)
      }
      this.resize()
    },

    async resize(index, elements) {
      //resize and render
      this.isresizing = true
      this.routeChanged = false // 重置routeChanged
      var self = this
      if (!this.$slots.default) {
        this.isresizing = false
        return
      }
      
      if (!index && index != 0 && !elements) {
        elements = this.$slots.default
        this.loadedIndex = 0
        this.clear()
      } else if (!elements) {
        this.loadedIndex = index
        elements = this.$slots.default.splice(index)
      }

      for (var j = 0; j < elements.length; j++) {
        if (this.routeChanged) {
          console.warn('路由发生变化，<vue-waterfall>组件停止渲染')
          break
        }
        if (elements[j].elm && self.checkImg(elements[j].elm)) {
          var imgs = elements[j].elm.getElementsByTagName('img')
          var newImg = new Image()
          // let originSrc = imgs[0].getAttribute('src') || imgs[0].getAttribute('lazy-src') || imgs[0].getAttribute('bonelazy');
          // newImg.src = originSrc
          if (newImg.complete) {
            await self.append(elements[j].elm)
            self.lazyLoad(imgs)
          } else {
            await new Promise((resolve) => {
              newImg.onload = async function() {
                await self.append(elements[j].elm)
                self.lazyLoad(imgs)
                resolve()
              }
              newImg.onerror = async function() {
                await self.append(elements[j].elm)
                self.lazyLoad(imgs)
                resolve()
              }
            })
          }
        } else {
          await self.append(elements[j].elm)
        }
        self.loadedIndex++
      }
      this.isresizing = false
      self.$emit('finish')
    },

    clear() {
      this.columns.forEach(item => {
        item.innerHTML = ''
      })
    },

    checkImg(dom) {
      //check has image
      if (!dom) {
        return false
      }
      if (dom.getElementsByTagName && dom.getElementsByTagName('img').length) {
        return true
      } else {
        return false
      }
    },

    async append(dom) {
      //append dom element
      var self = this
      if (this.columns.length > 0) {
        let min = this.columns[0]
        for (var i = 1; i < this.columns.length; i++) {
          if ((await self.__getHeight(min)) > (await self.__getHeight(self.columns[i]))) {
            min = self.columns[i]
          }
        }
        await this.__setDomImageHeight(dom)
        min && min.appendChild(dom)
      }
    },

    async __getHeight(dom) {
      return dom.offsetHeight
    },

    async __setDomImageHeight(dom) {
      if (!dom.getElementsByTagName) {
        return
      }
      var imgs = dom.getElementsByTagName('img')
      for (var i = 0; i < imgs.length; i++) {
        var lazySrc = imgs[i].getAttribute('lazy-src')
        if (!imgs[i].getAttribute('src') && lazySrc) {
          var newImg = new Image()
          newImg.src = lazySrc
          if (newImg.complete) {
            var trueWidth = imgs[i].offsetWidth || this.columnWidth
            var imgColumnHeight = (newImg.height * trueWidth) / newImg.width
            if (imgs[i].offsetWidth) {
              imgs[i].style.height = imgColumnHeight + 'px'
            }
          } else {
            await new Promise((resolve) => {
              newImg.onload = function() {
                var trueWidth = imgs[i].offsetWidth || this.columnWidth
                var imgColumnHeight = (newImg.height * trueWidth) / newImg.width
                if (imgs[i].offsetWidth) {
                  imgs[i].style.height = imgColumnHeight + 'px'
                }
                resolve()
              }
              newImg.onerror = function() {
                resolve()
              }
            })
          }
        } else {
          return
        }
      }
    },

    lazyLoad(imgs) {
      if (!imgs) {
        if (!this.root) {
          this.root = this.$refs.vueWaterfall
        }
        imgs = this.root && this.root.getElementsByTagName('img')
      }

      if (!imgs || imgs.length < 0) {
        return
      }
      for (var index = 0; index < imgs.length; index++) {
        if (imgs[index].className.match('animation') && imgs[index].getAttribute('src')) {
          continue
        } else if (imgs[index].className.match('animation') && !imgs[index].getAttribute('src')) {
          imgs[index].src = imgs[index].getAttribute('lazy-src') || imgs[index].getAttribute('bonelazy')
          imgs[index].removeAttribute('lazy-src')
        } else if (imgs[index].getAttribute('src') && !imgs[index].className.match('animation')) {
          imgs[index].className = imgs[index].className + ' animation'
        } else if (
          !imgs[index].getAttribute('src') &&
          imgs[index].getBoundingClientRect().top < this.clientHeight + this.trueLazyDistance
        ) {
          imgs[index].src = imgs[index].getAttribute('lazy-src') || imgs[index].getAttribute('bonelazy')
          imgs[index].className = imgs[index].className + ' animation'
          imgs[index].removeAttribute('lazy-src')
        }
      }
    },

    clearColumn() {
      this.columns.forEach(item => {
        item.remove()
      })
      this.columns = []
    },

    __emitLoadMore() {
      if (!this.root) {
        return
      }
      var self = this
      const scrollTop = this.height
        ? this.root.scrollTop
        : document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = this.height ? this.root.scrollHeight : document.documentElement.offsetHeight
      var diff = scrollHeight - scrollTop - self.clientHeight
      self.$emit('scroll', {
        scrollHeight: scrollHeight,
        scrollTop: scrollTop,
        clientHeight: self.clientHeight,
        diff: diff,
        time: Date.now()
      })

      if (diff < self.max && self.loadmore && scrollHeight > self.clientHeight) {
        self.lastScrollTop = scrollTop
        self.loadmore = false

        self.$emit('loadmore')
      } else if (diff >= self.max) {
        self.loadmore = true
      }
      clearTimeout(self.lazyTimeout)
      self.lazyTimeout = setTimeout(function() {
        // self.lazyLoad()
      }, 14)
    },
  }
}
</script>

<style>
.com-waterfall {
  width: 100%;
  overflow-y: auto;
  position: relative;
}
.slot-box {
  position: absolute;
  top: 100%;
  left: 100%;
  width: 0;
  height: 0;
  overflow: hidden;
}
.vue-waterfall-column {
  float: left;
}
.is-transition img {
  opacity: 0;
}
.is-transition img.animation {
  animation: 0.4s lazy-animation linear;
  animation-fill-mode: forwards;
}
@keyframes lazy-animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>