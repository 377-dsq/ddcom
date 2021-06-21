<template>
  <div 
    class="com-waterfall"
    :style="{ height: height }"
    ref="vueWaterfall"
    id="vueWaterfall"
    :class="isTransition && 'is-transition'"
  >
    <div class="slot-box">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>