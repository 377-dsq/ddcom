<template>
  <div class="home">
    <swiper>
      <swiper-slider><img src="../../assets/img/index0.jpg" alt=""></swiper-slider>
      <swiper-slider><img src="../../assets/img/index1.jpg" alt=""></swiper-slider>
      <swiper-slider><img src="../../assets/img/index2.jpg" alt=""></swiper-slider>
      <swiper-slider><img src="../../assets/img/index3.jpg" alt=""></swiper-slider>
    </swiper>
  </div>
</template>

<script>

import Swiper from '@com/swiper'
import SwiperSlider from '@com/swiper-slider'

export default {
  name: 'home',
  components: {
    Swiper,
    SwiperSlider
  },
}
</script>

<style lang="scss" scoped>
.home{
  width: 500px;
  img{
    width: 100%;
  }
}
</style>