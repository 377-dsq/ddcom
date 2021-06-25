<template>
  <div class="waterfall" v-if="morePriList.length">
    <div class="header">{{morePriList.length}}</div>
    <waterfall :cols="2" :dataList="morePriList" class="goods-list" @loadmore="loadmore" @scroll="scroll">
      <div class="list-item" v-for="(item, index) in morePriList" :key="index">
        <img v-if="item.privilegeBaseInfo" class="img" :src="item.privilegeBaseInfo.picUrls.area" alt="">
        <div class="index">{{index}}</div>
        <div class="title" v-if="item.commodityInfo">{{ item.commodityInfo.title }}</div>
      </div>
    </waterfall>
  </div>
</template>

<script>
import waterfall from '@com/waterfall'

export default {
  name: 'eg-waterfall',
  components: {
    waterfall
  },
  data() {
    return {
      morePriList: []
    }
  },
  created() {
    console.log('cre');
    this.getList()
  },
  beforeMount() {
    console.log('mounte');
  },
  methods: {
    getList() {
      const url = 'https://m.leka.club/route0010/leka/goods/queryRecommendPrivilegeList.json'
      const body = {}
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'origin': 'https://m.leka.club'
        }, 
        body: JSON.stringify(body)
      }).then(res => res.json()).then(res => {
        const { data: { result_rows: { list } } } = res || {}
        this.morePriList.push(...list)
      }).catch(err => {
        console.log(err);
      })
    },
    loadmore() {
      console.log('loadmore');
      this.getList()
    },
    scroll() {
      // console.log('scroll');
    }
  }
  
}
</script>

<style>
.header{
  height: 3rem;
  line-height: 3rem;
}
.img{
  width: 1rem;
}
.title{
  height: .3rem;
}
</style>