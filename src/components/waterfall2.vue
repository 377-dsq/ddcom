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
    cols: {
      type: Number,
      default: 2
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    width: Number
  },
  data() {
    return {
      root: null,
      colNodes: [],
      colWidth: 0,
    }
  },
  watch: {
    cols(nVal, oVal) {
      if (nVal === oVal) {
        return
      }
      this.init()
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.root = this.$refs.root
      this.clearColumn()
      this.createColumn()
      this.resize()
    },
    clearColumn() {
      this.colNodes.forEach(item => {
        item.remove()
      })
      this.colNodes = []
    },

    // 创建列
    createColumn() {
      const colNodes = []
      const cols = parseInt(this.cols)
      for (let index = 0; index < cols; index++) {
        const node = document.createElement('div')
        node.className = 'com-waterfall-cols'
        if (this.width) {
          node.style.width = this.width + 'px'
          this.colWidth = this.width
        } else {
          const width = Math.round(1 / cols * 100)
          node.style.width = width + '%';
          this.colWidth = width / 100 * this.html().clientWidth
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

    async resize() {
      if (this.isResizing) {
        return
      }
      this.isResizing = true
      const nodes = this.$slots.default
      for (let index = 0; index < nodes.length; index++) {
        const shortCol = this.getShortColumns()
        if (!shortCol) {
          return
        }
        await this.appendChild(shortCol, nodes[index].elm)
      }
      this.isResizing = false
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

    async appendChild(parent, node) {
      const imgs = node.getElementsByTagName('img')
      if (!imgs || !imgs.length) {
        parent.appendChild(node)
        return Promise.resolve()
      } else {
        for (let index = 0; index < imgs.length; index++) {
          const img = imgs[index];
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

    getImgHeight(img) {
      return new Promise((resolve) => {
        const src = img.getAttribute('src')
        const image = new Image()
        image.src= src
        if (image.complete) {
          if (img.width) {
            img.style.height = img.width / image.width * image.height
            resolve()
          } else {
            img.style.height = image.height
            resolve()
          }
        } else {
          image.onload = () => {
            if (img.width) {
              img.style.height = img.width / image.width * image.height
              resolve()
            } else {
              img.style.height = image.height
              resolve()
            }
          }
          image.onerror = () => {
            resolve()
          }
        }
        
        
      })
      
    }
  } 
}
</script>

<style>
.com-waterfall{
  width: 100%;
  position: relative;
  overflow-y: scroll;
}
.com-waterfall-cols{
  float: left;
  margin: 0;
  padding: 0;
}
.slot-box{
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

</style>