<template>
  <div class="eg-scroll-tab">
    <div class="header">
      <img src="../../assets/img/newyear.jpeg" alt="">
    </div>
    <scroll-tab :titleList='titleList' :startIndex='index'>
      <template v-slot:title='props'>
        <img :src="props.item.icon" alt="" class="icon">
        <div>{{props.item.name}}</div>
      </template>
      <template v-slot:body='props'>
        <div class="body-text">
          <img :src="props.item.icon" alt="" class="icon">
          <div>{{props.item.name}}</div>
          <div>{{props.item.desc}}</div>
        </div>
      </template>
    </scroll-tab>
  </div>
</template>

<script>
import ScrollTab from '@com/scrollTab'
export default {
  name: 'eg-scroll-tab',
  components: {
    ScrollTab
  },
  data() {
    return {
      index: 4,
      titleList: [
        {
          name: '美食',
          icon: require('../../assets/icon/firecracker.svg'),
          desc:'happy new year'
        },
        {
          name: '玩乐',
          icon: require('../../assets/icon/balloon.svg'),
          desc:'happy new year'
        },
        {
          name: '购物',
          desc:'happy new year',
          icon: require('../../assets/icon/fu.svg')
        },
        {
          name: '周边游',
          desc:'happy new year',
          icon: require('../../assets/icon/moneybag.svg')
        },
        {
          name: '丽人',
          desc:'happy new year',
          icon: require('../../assets/icon/candies.svg')
        },{
          name: '电影',
          desc:'happy new year',
          icon: require('../../assets/icon/couplet.svg')
        },{
          name: '培训',
          desc:'happy new year',
          icon: require('../../assets/icon/knot.svg')
        },{
          name: '家居',
          desc:'happy new year',
          icon: require('../../assets/icon/lantern.svg')
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.eg-scroll-tab{
  text-align: center;
  width: 100%;
  margin: 0 auto;
  font-size: .2rem;
  .header{
    overflow: hidden;
    height: 1.8rem;
    background: rgb(246, 246, 246);
    img {
      height: 100%;
    }
  }
  .icon {
    width: .5rem;
  }
  .body-text{
    height: 1.8rem;
    border: 1px solid #ccc;
    border-radius: .1rem;
    margin: .05rem .05rem;
    .icon{
      width: 1rem;
    }
  }
}
</style>
<style>
.scroll-header-wrap {
  border-bottom: 1px solid #ccc;
}
.header-item{
  width:.8rem;
  padding: .1rem 0;
}
.selected{
  color: #ff0022;
  font-weight: 600;
}
</style>