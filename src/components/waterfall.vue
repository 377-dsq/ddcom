<template>
  <div class="com-waterfall" ref="root">
    <div class="slot-box">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'com-waterfall',
  props: {
    // 列数
    cols: { 
      type: Number,
      default: 2
    },
    // 数据列表
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 每一列的宽度
    width: Number,
    // 距离底部多远进行上拉刷新
    reachBottomDistance: {
      type: Number,
      default: 100
    },

    // 滚动节流间隔事件，ms
    interval: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      root: null, // 组件根元素
      colNodes: [], // 每一列的元素
      canLoad: true, // 是否可以加载更多
      renderIndex: 0 // 已渲染的元素索引
    }
  },
  watch: {
    cols(nVal, oVal) {
      if (nVal === oVal) {
        return
      }
      this.init()
    },
    dataList(nVal, oVal) {
      if (!nVal.length || nVal.length < oVal.length) {
        this.clearItem()
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.createColItem()
        }, 200)
      })
    }
  },
  mounted() {
    this.init()
    this.scrollEvent()
  },

  methods: {
    init() {
      this.root = this.$refs.root
      this.canLoad = true
      this.renderIndex = 0
      this.clearColumn()
      this.createColumn()
      this.$nextTick(() => {
        setTimeout(() => {
          this.createColItem()
        }, 200)
      })
    },

    // 清除列
    clearColumn() {
      this.colNodes.forEach(item => {
        item.remove()
      })
      this.colNodes = []
    },

    // 清除列中元素
    clearItem() {
      if (!this.colNodes || !this.colNodes.length) {
        return
      }
      this.colNodes.forEach(item => {
        item.innerHTML = ''
      })
      this.renderIndex = 0
      this.canLoad = true
    },

    // 创建列
    createColumn() {
      const colNodes = []
      for (let index = 0; index < this.cols; index++) {
        const node = document.createElement('div')
        node.className = 'com-waterfall-cols'
        if (this.width) {
          node.style.width = this.width + 'px'
        } else {
          const width = Math.round((1 / this.cols) * 100)
          node.style.width = width + '%'
        }
        if (!this.root) {
          this.root = this.$refs.root
        }
        this.root && this.root.appendChild(node)
        colNodes.push(node)
      }
      this.colNodes = colNodes
    },

    html() {
      return document.documentElement
    },

    // 创建列中元素
    async createColItem() {

      if (this.isRendering || !this.$slots.default || !this.$slots.default.length) {
        return
      }
      this.isRendering = true
      const nodes = this.$slots.default.splice(this.renderIndex)
      for (let index = 0; index < nodes.length; index++) {
        const shortCol = this.getShortColumns()
        if (!shortCol) {
          return
        }

        await this.appendChild(shortCol, nodes[index].elm)
        this.renderIndex++
      }
      this.isRendering = false
      this._loadMore()
    },

    // 获取更矮的一列
    getShortColumns() {
      const length = this.colNodes.length
      if (!length) {
        return
      }
      let shortNode = this.colNodes[0]
      for (let index = 1; index < length; index++) {
        const height = this.colNodes[index].offsetHeight
        if (height < shortNode.offsetHeight) {
          shortNode = this.colNodes[index]
        }
      }
      return shortNode
    },

    // 将每个item放入列中
    async appendChild(parent, node) {
      if (!node || !(node instanceof HTMLElement)) {
        return
      }

      const imgs = node.getElementsByTagName('img')
      if (!imgs || !imgs.length) {
        parent.appendChild(node)
        return Promise.resolve()
      } else {
        for (let index = 0; index < imgs.length; index++) {
          const img = imgs[index]
          if (!img) {
            return
          }
          if (!img.height) {
            await this.getImgHeight(img)
          }
        }
        parent.appendChild(node)
        return Promise.resolve()
      }
    },

    // 获取图片高度
    getImgHeight(img) {
      return new Promise(resolve => {
        const src = img.getAttribute('src') || img.getAttribute('lazy-load-src')
        if (!src) {
          return
        }
        const image = new Image()
        image.src = src
        if (image.complete) {
          if (img.width) {
            img.style.height = ((img.width / image.width) * image.height).toFixed(2) + 'px'
            resolve()
          } else {
            img.style.height = image.height.toFixed(2) + 'px'
            resolve()
          }
        } else {
          image.onload = () => {
            if (img.width) {
              img.style.height = ((img.width / image.width) * image.height).toFixed(2) + 'px'
              resolve()
            } else {
              img.style.height = image.height.toFixed(2) + 'px'
              resolve()
            }
          }
          image.onerror = () => {
            resolve()
          }
        }
      })
    },

    scrollEvent() {
      const _this = this
      window.onscroll = _this.loadMore
      document.addEventListener('touchmove', _this.loadMore, false)
    },


    // 滚动事件，节流
    loadMore() {
      this.$emit('scroll')
      if (this.timer) {
        return 
      } 
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timer = null
        this._loadMore()
      }, this.interval);
    },

    // 上拉加载更多
    _loadMore() {
      const height = window.innerHeight
      const bottom = this.root.getBoundingClientRect().bottom
      if (bottom < height + this.reachBottomDistance && this.canLoad) {
        this.canLoad = false
        this.$emit('loadmore')
      } else if (bottom >= height + this.reachBottomDistance) {
        this.canLoad = true
      }
    }
  }
}
</script>

<style>
.com-waterfall {
  width: 100%;
  position: relative;
  overflow-y: scroll;
}
.com-waterfall-cols {
  float: left;
  margin: 0;
  padding: 0;
}
.slot-box {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
