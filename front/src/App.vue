<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <button v-on:click="socketIOTest">Socket IO test</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    //example of network manipulate
    socketIOTest: function (event) {
        // $socket is socket.io-client instance
        console.log("Emit!")
        // if you want to send information, just do like this:
        this.$socket.emit('emit_method test', {information:"infomation from client"})
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
