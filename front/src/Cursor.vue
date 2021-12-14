<template>
    <div>
        <svg>
            <g>
                <polygon class="lineStyle" style="stroke:{{edgeColor}};fill:{{fillColor}}" points="7 6 12 18 14 13 19 11 7 6"/>
            </g>
        </svg>
        <span class="mouseText">{{nick}}</span>
    </div>
</template>

<script>

export default {
    name:"Cursor",
    props:{
        color:String,
        nick:String
    },
    setup() {
        
    },
    computed:{
        edgeColor(){
            return this.color;
        },
        fillColor(){
            return this.color;
        }
    }
}
</script>

<style scoped>
    .svgStyle
    .lineStyle{
        stroke-linecap:round;
        stroke-linejoin:round;
    }
    .mouseText{
        font-size: 6px;
    }
</style>


