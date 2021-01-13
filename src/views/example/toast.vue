<template>
<div class="toast">
  <div class="btn" @click="toastInfo">信息提示</div>
  <div class="btn" @click="toastError">错误提示</div>
  <div class="btn" @click="toastWarn">警告提示</div>
  <div class="btn" @click="toastSuccess">成功提示</div>
</div>
</template>

<script>
export default {
  name: 'toast',
  methods: {
    toastInfo() {
      this.$toast.info('this is a message')
    },
    toastError() {
      this.$toast.error('this is a error message')
    },
    toastWarn() {
      this.$toast.warn('this is a warning message')
    },
    toastSuccess() {
      this.$toast.info('this is a success message')
    }
  }
}
</script>

<style lang="scss" scoped>
.toast{
  .btn{
    height: .2rem;
    margin: .2rem .3rem;
    border: 1px solid #333;
    border-radius: .2rem;
    padding: .1rem;
  }
}

</style>