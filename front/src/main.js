// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true, //enable debug?
  connection: 'http://localhost:8080',
  vuex: {
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  }
}))

/* eslint-disable no-new */
var appVue = new Vue({
  el: '#app',
  router,
  components: { App },
  sockets: {
    // this function will be invoked when connection is established
    connect: function () {
        console.log('socket connected')
    },
    // this will receive "customEmit" event information from the server
    // you can add other event, like "customEmit2", for the server side, I need to send data with event name "customEmit2"
    customEmit: function (data) {
        console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        console.log(data);
    }
  },
  template: '<App/>'
})
