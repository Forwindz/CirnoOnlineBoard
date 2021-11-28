import { createApp } from 'vue'
import App from './App'
<<<<<<< HEAD
import { Icon, Button, Input, Popper, ColorPicker  } from 'arman-ui'
=======
import router from './router'
import VueSocketIO from 'vue-socket.io'
>>>>>>> 36b170d951f7704072cef2505e22eb42b96deac8

const app = createApp(App)
app.component(Icon.name, Icon)
app.component(Button.name, Button)
app.component(Input.name, Input)
app.component(Popper.name, Popper)
app.component(ColorPicker.name, ColorPicker)

<<<<<<< HEAD
app.mount('#app')
=======
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
>>>>>>> 36b170d951f7704072cef2505e22eb42b96deac8
