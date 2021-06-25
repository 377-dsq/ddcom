<template>
  <div class="waterfall" v-if="list.length">
    <div class="header" @click="change">{{list.length}}</div>
    <waterfall :cols="cols" :dataList="list" class="goods-list" @loadmore="loadmore" @scroll="scroll">
      <div class="list-item" v-for="(item, index) in list" :key="index">
        <div class="index">{{index}}</div>
        <img v-if="item.privilegeBaseInfo" class="img" :src="item.privilegeBaseInfo.picUrls.area" alt="">
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
      list: [],
      cols: 2
    }
  },
  created() {
    this.getList()
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
        }, 
        body: JSON.stringify(body)
      }).then(res => res.json()).then(res => {
        const { data: { result_rows: { list } } } = res || {}
        this.list.push(...list)
      }).catch(err => {
        console.log(err);
      })
    },
    change() {
      this.list = this.list.splice(3)
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
  /* height: 3rem;
  line-height: 3rem; */
}
.list-item{
  margin: 0 .05rem;
  margin-bottom: .1rem;
  border: .01rem solid #999;
  background: #eee;
  border-radius: .08rem;
  padding: .1rem;
}
.img{
  width: 1rem;
}
.title{
  line-height: 1.5;
}
</style>