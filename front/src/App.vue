<template>
    <canvas id="myCanvas" ref="myCanvasRef" @mousedown="handleMousedown" @touchstart="handleTouchstart" />
    <Sidebar
        v-model:lineWidth="lineWidth"
        v-model:strokeColor="strokeColor"
        @revoke="revoke"
        @clear="clear"
        @play="play"
        @download="downloadPng" />
</template>

<script>
    import { ref } from 'vue'
    import useCanvas from '@/useCanvas'
    import Sidebar from './Sidebar.vue'
    import { mydataCanvasRef } from "./useCanvas"
    import {socket} from './socketManager'

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
                revoke, clear, downloadPng, play,
            }
        },
        methods: {
        //example of network manipulate
            // socketIOTest: function (event) {
            //     // $socket is socket.io-client instance
            //     console.log("Emit!")
            //     // if you want to send information, just do like this:
            //     // event_name, json data
            //     socket.emit('emit_method test', {information:"click test infomation from client"})
            //     socket.sendData({testData:123,test2:"123asd",test3:{test4:[123,"1"],test5:2.5}});
            //     //socket.sendData({testData:123,test2:"123asd",test3:{test4:[123,"1"],test5:2.5}});
            //     console.log("End Emit!");
            // }
            // testHtml() {
            //     console.log("测试")
            //     //socket.emit('emit_method test', {information:"click test infomation from client"})
            //     socket.emit('chat message', {information:"11111"});
            // },
 
            // mounted() {
            // //定时任务方法
            //     this.$nextTick(() => {
            //     setInterval(this.testHtml, 5000);
            //     });
            // }
        }
    }

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
