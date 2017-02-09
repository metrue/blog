<template>
  <section class="post-view">
    <h1 class="post-title">
      {{ title }}
      <time pubdate="pubdate" :datetime="publishDate | formatDate" :title="publishDate | formatDate" class="post-date">{{ publishDate | timeago }}</time>
    </h1>
    <article v-html="htmlFromMarkdown"></article>
  </section>
</template>

<style lang="stylus" src="./Post.styl"></style>

<script>
  import Vue from 'vue'
  import marked from '../../utils/render.js'
  import { parseName } from '../../utils'

  export default {
    name: 'postView',
    props: ['filename', 'markdownContent'],

    data () {
      const { title, publishDate } = parseName(this.filename)

      return {
        title: title,
        pubdate: publishDate,
        markdownContent: this.markdownContent,
      }
    },

    computed: {
      htmlFromMarkdown () {
        return marked(this.markdownContent)
      }
    },

    created () {
    },

    methods: {
      newTab () {
        Vue.nextTick(function () {
          // Load the external link into new tab
          const linksArray = Array.from(document.querySelectorAll('a'))
          const currentHost = window.location.host
          linksArray.forEach(el => {
            if (el.href && el.host !== currentHost) {
              el.target = '_blank'
              // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
              el.rel = 'noopener noreferrer'
            }
          })
        })
      }
    },

    watch: {
      'htmlFromMarkdown': 'newTab'
    }
  }
</script>
