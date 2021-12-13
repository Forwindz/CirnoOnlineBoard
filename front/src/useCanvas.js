import { nextTick, ref, onMounted } from 'vue'
import { throttle } from 'throttle-and-debounce'
import gdata from './data/rawData'
import { socket,fetchPacket } from './socketManager'

var path = [];
var self = null;
gdata.stack_g = [];


export default function useCanvas(myCanvasRef) {

    const initCanvasSize = () => {
        myCanvasRef.value.width = document.documentElement.clientWidth
        myCanvasRef.value.height = document.documentElement.clientHeight
        gdata.width = document.documentElement.clientWidth
        gdata.height = document.documentElement.clientHeight
    }
    let myCanvasCtx = {}
    let myCanvasCtx_2 = {}
    const clearRect = () => {
        myCanvasCtx.clearRect(0, 0, myCanvasRef.value.width, myCanvasRef.value.height)
    }

    onMounted(() => {
        myCanvasCtx = myCanvasRef.value.getContext('2d')
        myCanvasCtx_2 = myCanvasRef.value.getContext('2d')
        nextTick(() => {
            myCanvasCtx.lineJoin = 'round'
            myCanvasCtx.lineCap = 'round'
        })
        initCanvasSize()
        window.onresize = initCanvasSize
        
    })

    let isDrawing = false // 播放的时候通过变量打断动画

    let lineWidth = ref('10')
    let strokeColor = ref('rgba(0,0,0,0.6)')
    const stack = []

    // gdata.stack = stack;
    

    const revoke = () => {
        stack.pop()
        drawLine()
    }
    const clear = () => {
        stack.splice(0)
        clearRect()
    }

    const drawLine = () => {
        clearRect()
       
        stack.forEach(path => {
            path.forEach((value, index, array) => {
                if (index === 0) { // 该路径样式
                    myCanvasCtx.lineWidth = value.width
                    myCanvasCtx.strokeStyle = value.color

                } else if (index === 1) { // 该路径第一个点
                    myCanvasCtx.beginPath()
                    myCanvasCtx.moveTo(value.x, value.y)
                    myCanvasCtx.lineTo(value.x, value.y)

                } else { // 贝塞尔曲线优化
                    let x1 = array[index - 1].x, y1 = array[index - 1].y, x2 = value.x, y2 = value.y
                    let x3 = x1 / 2 + x2 / 2, y3 = y1 / 2 + y2 / 2
                    myCanvasCtx.quadraticCurveTo(x1, y1, x3, y3)
                }
                if (index === path.length - 1) {
                    myCanvasCtx.lineTo(value.x, value.y)
                    myCanvasCtx.stroke()
                }
            })
        })

        gdata.stack_g.forEach(path2 => {
                    path2.forEach((value, index, array) => {
                        if (index === 0) { // 该路径样式
                            myCanvasCtx.lineWidth = value.width
                            myCanvasCtx.strokeStyle = value.color
        
                        } else if (index === 1) { // 该路径第一个点
                            myCanvasCtx.beginPath()
                            myCanvasCtx.moveTo(value.x, value.y)
                            myCanvasCtx.lineTo(value.x, value.y)
        
                        } else { // 贝塞尔曲线优化
                            let x1 = array[index - 1].x, y1 = array[index - 1].y, x2 = value.x, y2 = value.y
                            let x3 = x1 / 2 + x2 / 2, y3 = y1 / 2 + y2 / 2
                            myCanvasCtx.quadraticCurveTo(x1, y1, x3, y3)
                        }
                        if (index === path2.length - 1) {
                            myCanvasCtx.lineTo(value.x, value.y)
                            myCanvasCtx.stroke()
                        }
                    })
                })      

    }


    // 鼠标事件
    const handleMousedown = e => {
        // drawLine();
        isDrawing = true
        let x = e.clientX, y = e.clientY
        path.push({ 'width': lineWidth.value, 'color': strokeColor.value })
        path.push({ x, y })

        gdata.style = []
        gdata.style.push({ 'width': lineWidth.value, 'color': strokeColor.value })
        gdata.mousedown = true
        gdata.mousemove = false
        gdata.mouseup = false
        gdata.position = []
        gdata.position.push(x)
        gdata.position.push(y)

        socket.sendData({ userWidth: gdata.width, userHeight: gdata.height, userStyle: gdata.style, userMousedown: gdata.mousedown, userMouseove: gdata.mousemove, userMouseup: gdata.mouseup, pos: gdata.position });

        stack.push(path)
        drawLine()

        //adddrawLine_v(myCanvasCtx);

        myCanvasRef.value.addEventListener('mousemove', handleMousemove, { passive: true })
        myCanvasRef.value.addEventListener('mouseup', handleMouseup)
    }
    const handleMousemoveCb = e => {
        let x = e.clientX, y = e.clientY
        if (isDistanceAllowed(path, x, y)) {
            path.push({ x, y })

            gdata.mousemove = true
            gdata.position = []
            gdata.position.push(x)
            gdata.position.push(y)

            socket.sendData({ userWidth: gdata.width, userHeight: gdata.height, userStyle: gdata.style, userMousedown: gdata.mousedown, userMouseove: gdata.mousemove, userMouseup: gdata.mouseup, pos: gdata.position });
            //adddrawLine_v(myCanvasCtx);
            drawLine()
            
        }
    }
    const handleMousemove = throttle(handleMousemoveCb, 8)
    const handleMouseup = () => {
        //drawLine_g()
        isDrawing = false
        path = []

        gdata.mouseup = true
        gdata.mousedown = false
        gdata.mousemove = false
        gdata.position = []

        socket.sendData({ userWidth: gdata.width, userHeight: gdata.height, userStyle: gdata.style, userMousedown: gdata.mousedown, userMouseove: gdata.mousemove, userMouseup: gdata.mouseup, pos: gdata.position });

        //drawLine()
        myCanvasRef.value.removeEventListener('mousemove', handleMousemove)
        myCanvasRef.value.removeEventListener('mouseup', handleMouseup)
    }

    // 触摸事件
    const handleTouchstart = e => {
        e.preventDefault()
        isDrawing = true
        let x = e.touches[0].clientX, y = e.touches[0].clientY
        path.push({ 'width': lineWidth.value, 'color': strokeColor.value })
        path.push({ x, y })
        stack.push(path)
        drawLine()
        myCanvasRef.value.addEventListener('touchmove', handleTouchmove)
        myCanvasRef.value.addEventListener('touchend', handleTouchend)
    }
    const handleTouchmoveCb = e => {
        e.preventDefault()
        let x = e.touches[0].clientX, y = e.touches[0].clientY
        if (isDistanceAllowed(path, x, y)) {
            path.push({ x, y })
            drawLine()
        }
    }
    const handleTouchmove = throttle(handleTouchmoveCb, 8)
    const handleTouchend = e => {
        e.preventDefault()
        isDrawing = false
        path = []
        myCanvasRef.value.removeEventListener('touchmove', handleTouchmove)
        myCanvasRef.value.removeEventListener('touchend', handleTouchend)
    }

    const play = () => {
        const taskList = stack.flat()
        const totalStep = taskList.length
        let currentStep = 0

        const animate = () => {
            currentStep += 1
            clearRect()
            for (let i = 0; i < currentStep; i++) {
                const currentDot = taskList[i]
                if (currentDot.width) {
                    console.log(currentDot.style)
                    myCanvasCtx.lineWidth = currentDot.width
                    myCanvasCtx.strokeStyle = currentDot.color
                } else {
                    const lastDot = taskList[i - 1], nextDot = taskList[i + 1]
                    if (lastDot.width) {
                        // 当前点为该路径起点
                        myCanvasCtx.beginPath()
                        myCanvasCtx.moveTo(currentDot.x, currentDot.y)
                        myCanvasCtx.lineTo(currentDot.x, currentDot.y)
                    } else {
                        let x1 = lastDot.x, y1 = lastDot.y, x2 = currentDot.x, y2 = currentDot.y
                        let x3 = x1 / 2 + x2 / 2, y3 = y1 / 2 + y2 / 2
                        myCanvasCtx.quadraticCurveTo(x1, y1, x3, y3)
                    }
                    if ((i === currentStep - 1) || nextDot.width) {
                        // 当前点为该路径终点
                        myCanvasCtx.lineTo(currentDot.x, currentDot.y)
                        myCanvasCtx.stroke()
                    }
                }
            }

            // 动画打断
            if (isDrawing) return drawLine()

            if (currentStep < totalStep) requestAnimationFrame(animate)
        }

        if (totalStep) requestAnimationFrame(animate)
    }

    const downloadPng = () => {
        const anchor = document.createElement('a')
        anchor.href = myCanvasRef.value.toDataURL('image/png')
        const ua = window.navigator.userAgent.toLowerCase()
        if (ua.match(/iphone|android|ipad/)) anchor.target = '_blank'
        else anchor.download = '图片'
        anchor.click()
    }

    self = {
                lineWidth, strokeColor,
                handleMousedown, handleTouchstart,drawLine,
                revoke, clear, downloadPng, play,
    }

    return self;

    // return {
    //     lineWidth, strokeColor,
    //     handleMousedown, handleTouchstart,drawLine,
    //     revoke, clear, downloadPng, play,
    // }

    // 判断两个点是否太靠近 太近的点不要
    function isDistanceAllowed(path, x, y) {
        const min = 8
        const latestX = path[path.length - 1].x
        const latestY = path[path.length - 1].y
        return Math.abs(x - latestX) >= min || Math.abs(y - latestY) >= min
    }
}


async function dome() {
    console.log('我着急')
    await delay(3000)
    console.log('我也是')
    function delay(num) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, num)
        })
    };
    let path2 = []
    while(true) {
        //console.log(1)

        let test = fetchPacket()


        if(test != null && test.uid != gdata.uid){
        
            if(test.data.pos[0] != undefined){

                console.log(test.data.pos)

                if(path2.length == 0){
                    path2.push({ 'width': test.data.userStyle[0].width, 'color': test.data.userStyle[0].color })   
                }

                let x = test.data.pos[0];
                let y = test.data.pos[1];
                path2.push({ x, y })  
                // gdata.stack_g.push(path2)
                // path2 = [];
            }
            else{
                gdata.stack_g.push(path2)
                
                path2 = [];
            }
            self.drawLine()
            console.log(path2)
                // console.log(gdata.stack_g.length);
            if(gdata.stack_g.length != 0){
                console.log(gdata.stack_g);
                // console.log(gdata.stack_g[0][0].width);
            }
    
        }
        await delay(0)
    }
}

dome()