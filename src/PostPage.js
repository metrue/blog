import Vue from 'vue'
import Post from './components/Post'
import Header from './components/Header'
import Footer from './components/Footer'

export default function(filename, markdownContent) {
  return new Vue({
    render: h => {
      return (
        <html>
          <Header />
          <Post filename={ filename } markdownContent={ markdownContent } />
          <Footer />
        </html>
      )
    }
  })
}
