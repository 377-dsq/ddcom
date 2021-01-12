<template>
  <div class="scroll-tab" ref="tabContainer">
    <!-- 头部部分 -->
    
    <div :class="['scroll-header-wrap', {'scroll-fixed': isFixed}]" ref="header">
      <div class="header-item"
        v-for="(item,index) in titleList" :key="index"
        @click="scrollToPos(index)"
        :class="{'selected': index === selectedTitleIndex}"
        ref="tabs"
      >
        <slot :item='item' name='title'></slot>
      </div>
    </div>

    
    <!-- 当头部吸顶时，头部占位的div -->
    <div class="scroll-header-replace" v-show="isFixed" ref="headerPlace"></div>
    <!-- 滚动体 -->
    <div class="content">
      <div class="content-item" v-for="(item,index) in list" :key="index" ref="items">
        <slot :item='item' name='body'></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scroll-tab',
  props: {
    titleList: {
      type: Array,
      default() {
        return []
      }
    },
    bodyList: {
      type: Array,
      default() {
        return []
      }
    },
    startIndex: {
      type:Number,
      default:0
    },

    // 头部区域吸顶时，头部距离顶部的高度
    topheight: {
      type:Number,
      default:0
    },

    // 滚动元素
    scrollel: Object
  },
  data() {
    return {
      selectedTitleIndex: 0, // 选中的index
      isFixed: false,  // 是否吸顶
      list: [],  // 滚动体部分的list
      el: {}  // 滚动元素
    }
  },
  watch: {
    selectedTitleIndex(newV, oldV) {
      if (newV !== oldV) {
        this.tabsSlideTo(newV)
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      // header吸顶的时候设置header的占位
      let height = this.$refs.header.offsetHeight
      this.$refs.headerPlace.style.height = height + 'px'

      // 若起始值不是第0个，则滚动到对应位置
      if (this.selectedTitleIndex !== 0) {
        this.pageScrollTo(this.selectedTitleIndex)
      }
    })
    this.el = this.scrollel || window
    this.el.addEventListener('scroll', this.fixedHeader, false)
    this.el.addEventListener('scroll', this.anchor, false)
  },
  methods: {
    init() {
      // bodyList和titleList一致的时候可以只传titleList
      this.list = !this.bodyList || this.bodyList.length == 0 ? this.titleList : this.bodyList
      this.selectedTitleIndex = this.startIndex
    },

    // 滚动到指定的选中的item
    scrollToPos(index) {
      this.selectedTitleIndex = index
      this.pageScrollTo(index)
    },

    // 横向滚动到中间位置
    tabsSlideTo(index) {
      let wrap = this.$refs.header
      let tab = this.$refs.tabs[index]
      let distance =
          tab.offsetLeft - wrap.offsetLeft + tab.offsetWidth / 2 - 375 / 2
        this.animate(wrap, wrap.scrollLeft, distance > 0 ? distance : 0)
    },

    // 纵向滚动到指定的位置
    pageScrollTo(index) {
      let offTop = this.$refs.items[index]?.offsetTop
      let top = offTop + this.$refs.tabContainer.offsetTop - this.$refs.header.offsetHeight - this.topheight
      let el = document.documentElement
      this.el.removeEventListener('scroll', this.anchor, false)
      this.animate(el, el.scrollTop, top, 'col')
    },

    // 实现平滑滚动动画
    animate(element, current, target, dir = 'row') {
      let rate = Math.abs(current - target) / 10
      let speed = rate > 1 ? Math.ceil(rate) : 5
      clearInterval(element.timer)
      let scrollDir, client, scroll
      if (dir === 'row') {
        scrollDir = 'scrollLeft'
        client = 'clientWidth'
        scroll = 'scrollWidth'
      } else {
        scrollDir = 'scrollTop'
        client = 'clientHeight'
        scroll = 'scrollHeight'
      }
      element.timer = setInterval(() => {
        current = element[scrollDir]
        if (Math.abs(current - target) <= speed || target + element[client] >= element[scroll]) {
          element[scrollDir] = target
          clearInterval(element.timer)
          if (dir == 'col') {
            setTimeout(() => {
              this.el.addEventListener('scroll', this.anchor, false)
            }, 500);
          }
          return
        }
        if (current >= target) {
          element[scrollDir] = current - speed
        } else {
          element[scrollDir] = current + speed
        }
      }, 16)
    },

    // 吸顶效果
    fixedHeader() {
      if (!this.$refs.header) {
        return
      }
      //吸顶
      let el = this.$refs.header
      let top = this.$refs.tabContainer.getBoundingClientRect().top
      if (top <= this.topheight) {
        el.style.top = this.topheight + 'px'
        this.isFixed = true
      } else if (top > this.topheight) {
        this.isFixed = false
      }
    },

    // 元素滚动到视口，则选中该index
    anchor() {
      let scrollItems = this.$refs.items
      let height = this.$refs.header?.offsetHeight + this.topheight
      scrollItems.forEach((item, index) => {
        let top = item.getBoundingClientRect().top
        let bottom = item.getBoundingClientRect().bottom
        if (top <= height + 5 && bottom > height) {
          this.selectedTitleIndex = index
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-tab{
  position: relative;
  .scroll-header-wrap{
    width: 100%;
    position: relative;
    overflow-x: auto;
    background: #ffffff;
    &::-webkit-scrollbar {
      display: none;
    }
    &:-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
    white-space: nowrap;
    .header-item{
      display: inline-block;
    }
  }
  .scroll-fixed{
    position: fixed;
    top: 0;
  }
  .scroll-header-replace{
    width: 100%;
    background: #ffffff;
  }
}
</style>