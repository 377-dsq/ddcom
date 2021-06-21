<template>
  <div class="waterfall">
    <waterfall :col="2" :gutterWidth="0" :data="morePriList" class="goods-list">
      <div class="list-item" v-for="(item, index) in morePriList" :key="index">
        <img :src="item.commodityInfo.img" alt="">
      </div>
    </waterfall>
  </div>
</template>

<script>
import waterfall from '@com/scrollTab'

export default {
  name: 'waterfall',
  components: {
    waterfall
  },
  data() {
    return {
      morePriList: []
    }
  },
  created() {
    console.log('created');
    // this.getList()
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
        this.morePriList = list 
      }).catch(err => {
        console.log(err);
      })
    }
  }
  
}
</script>

<style>

</style>