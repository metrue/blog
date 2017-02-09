<template>
  <footer class="footer">
    Copyright ©2014-2017 <a href="https://github.com/***REMOVED***/Seal"> {{ domain }}</a> | Powered by <a href="https://github.com/***REMOVED***/Seal">Seal</a> on top of <a href="https://vuejs.org" target="_blank">Vue.js</a>
  </footer>
</template>

<style lang="stylus" src="./Footer.styl"></style>

<script>
  import CONFIG from '../../../config'

  export default {
    name: 'Footer',

    data() {
      return {
        domain: CONFIG.domain,
      }
    }
  }
</script>
