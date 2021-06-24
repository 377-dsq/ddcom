<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {
    
  },
  mounted() {
    const html = document.documentElement
    const width = html.offsetWidth
    html.style.fontSize = width / 375 * 100 + 'px'
  }
}
</script>
<style>
html{ 
  font-size:100px;
  margin: 0;
  padding: 0;
}
body {
  font-size: 12px;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 3.75rem;
}
</style>
