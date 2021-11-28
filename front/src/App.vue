<template>
<<<<<<< HEAD
    <canvas id="myCanvas" ref="myCanvasRef" @mousedown="handleMousedown" @touchstart="handleTouchstart" />
    <Sidebar
        v-model:lineWidth="lineWidth"
        v-model:strokeColor="strokeColor"
        @revoke="revoke"
        @clear="clear"
        @play="play"
        @download="downloadPng" 
        @eraser="eraser"/>
</template>

<script>
    import { ref } from 'vue'
    import useCanvas from '@/useCanvas'
    import Sidebar from './Sidebar.vue'

    export default {
        components: { Sidebar },
        setup () {
            const myCanvasRef = ref(null)

            const {
                lineWidth, strokeColor,
                handleMousedown, handleTouchstart,
                revoke, clear, downloadPng, play,
            } = useCanvas(myCanvasRef)

            return {
                lineWidth, strokeColor,
                myCanvasRef, handleMousedown, handleTouchstart,
                revoke, clear, downloadPng, play, eraser,
            }
        },
    }

=======
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
>>>>>>> 36b170d951f7704072cef2505e22eb42b96deac8
</script>

<style>
    @import "~@/css/reset.css";
    body {
        position: relative;
        overflow: hidden;
        #myCanvas {
            cursor: crosshair;
        }
    }
</style>
