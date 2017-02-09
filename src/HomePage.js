import Vue from 'vue'
import List from './components/List'
import Header from './components/Header'
import Footer from './components/Footer'

export default function(list) {
  return new Vue({
    render: h => {
      return (
        <html>
          <Header />
          <List list={ list } />
          <Footer></Footer>
        </html>
      )
    }
  })
}
