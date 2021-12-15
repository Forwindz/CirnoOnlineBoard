<template>
    <canvas id="myCanvas" ref="myCanvasRef" @mousedown="handleMousedown" @touchstart="handleTouchstart" />
    <Sidebar
        v-model:lineWidth="lineWidth"
        v-model:strokeColor="strokeColor"
        @revoke="revoke"
        @clear="clear"
        @play="play"
        @download="downloadPng" />
    <UserListPanel/>
</template>

<script>
    import { ref } from 'vue'
    import useCanvas from '@/useCanvas'
    import {self} from '@/useCanvas'
    import Sidebar from './Sidebar.vue'
    import {socket} from './socketManager'
    import gdata from './data/rawData'
    import UserListPanel from './UserListPanel.vue'
    import {dome} from './ReceivePackage'

    export default {
        components: { Sidebar,UserListPanel },
        setup () {
            const myCanvasRef = ref(null)

            const {
                //lineWidth, strokeColor, 
                selfUserState,
                handleLineWidthChange,handleStrokeColorChange,
                handleMousedown, handleTouchstart,drawLine,
                revoke, clear, downloadPng, play

            } = useCanvas(myCanvasRef)

            return {
                //lineWidth, strokeColor,
                myCanvasRef, handleMousedown, handleTouchstart,
                revoke, clear, downloadPng, play,
            }
        },
        data:function() {
            return {
                strokeColor:'#000000EE',
                lineWidth:10
            }
        },
        methods: {
       
        },
        watch:{
            lineWidth:function (newv,oldv){
                self.handleLineWidthChange(newv,oldv);
            },
            strokeColor:function(newv,oldv){
                self.handleStrokeColorChange(newv,oldv);
            }
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