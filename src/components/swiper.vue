<template>
  <div class="swiper">
      <div class="swiper-container">
        <div class="swiper-wrap" ref="swiperwrap" @transitionend='checkBorder'>
          <slot></slot>
        </div>
        <div class='pagination' v-if="pagination">
          <span 
            class='indicator' 
            v-for="(item,index) in indCount" :key='index'
            :class="{'picked':currentIndex===index}"
            @click='pickItem(index)'
            ></span>
        </div>
        <div class="swiperbtn" v-if="btn">
          <div class="pre-btn" @click="preItem"></div>
          <div class="next-btn" @click="nextItem"></div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'dsq-swiper',
  data() {
    return {
      count: 0,
      currentIndex: 0,
      timer: null,
      onceTimer: null,
      width: 0,
      indCount: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 3000
    },
    delay: {
      type: Number,
      default: 300
    },
    pagination: {
      type: Boolean,
      default: true
    },
    btn: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.getCount();
    this.autoPlay();
  },
  methods: {
    getCount() {
      let items = this.$refs.swiperwrap.children;
      this.count = items.length;
      this.indCount = items.length;
      if(this.loop) {
        this.count ++;
        let first = items[0].cloneNode(true);
        this.$refs.swiperwrap.appendChild(first)
      }
      this.$refs.swiperwrap.style.width = this.count * 100 + '%'
      for (let index = 0; index < this.count; index++) {
        const element = this.$refs.swiperwrap.children[index];
        element.style.width = 1 / this.count * 100 + '%'
      }
      this.width = items[0].clientWidth;
    },
    play(dis) {
      let container = this.$refs.swiperwrap;
      container.style.transform = 'translateX(-' + dis + 'px)'
    },
    addAnimation() {
      let container = this.$refs.swiperwrap;
      container.style.transition = 'all ' + this.delay/1000 + 's ease-in-out'
    },
    removeAnimation() {
      let container = this.$refs.swiperwrap;
      container.style.transition = 'none'
    },
    autoPlay() {
      this.timer = setInterval(() => {
        this.currentIndex ++;
        this.addAnimation();
        this.play(this.currentIndex * this.width)
      }, this.speed)
    },
    checkBorder() {
      if(this.currentIndex >= this.count - 1) {
        this.currentIndex = 0;
        this.removeAnimation();
        this.play(0);
      }
    },
    pickItem(index) {
      clearInterval(this.onceTimer)
      clearInterval(this.timer);
      this.currentIndex = index;
      this.addAnimation();
      this.play(this.currentIndex * this.width)
      this.onceTimer = setTimeout(this.autoPlay, this.speed)
    },
    preItem() {
      clearInterval(this.onceTimer)
      clearInterval(this.timer);
      this.currentIndex --;
      if(this.currentIndex <= 0) {
        this.currentIndex = 0;
      }
      this.addAnimation();
      this.play(this.currentIndex * this.width);
      this.onceTimer = setTimeout(this.autoPlay, this.speed)
    },
    nextItem() {
      clearInterval(this.onceTimer)
      clearInterval(this.timer);
      this.currentIndex ++;
      if(this.currentIndex >= this.indCount) {
        this.currentIndex = this.indCount - 1;
      }
      this.addAnimation();
      this.play(this.currentIndex * this.width);
      this.onceTimer = setTimeout(this.autoPlay, this.speed)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@css/components/swiper.scss';
</style>