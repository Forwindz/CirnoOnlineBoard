<template>
    <div v-bind:style = "posStyle">
        <svg style="width:18px;height:18px">
            <g>
                <polygon class="lineStyle" v-bind:style="svgStyle" points="7 6 12 18 14 13 19 11 7 6"/>
            </g>
        </svg>
        <span class="mouseText">{{shortNick}}</span>
    </div>
</template>

<script>

export default {
    name:"Cursor",
    props:{
        color:String,
        nick:String,
        x:[String,Number],
        y:[String,Number]
    },
    setup() {
        
    },
    computed:{
        edgeColor(){
            return this.color;
        },
        fillColor(){
            return this.color;
        },
        svgStyle(){
            return "stroke:"+this.edgeColor+";fill:"+this.fillColor+";";
        },
        posStyle(){
            return "padding:"+this.y+"px "+this.x+"px; position:fixed;pointer-events:none;display: inline-block;width:36px;height:24px"
        },
        shortNick(){
            if(this.nick.length>7){
                return this.nick.substring(6);
            }
            return this.nick;
        }
    }
}
</script>

<style scoped>
    .lineStyle{
        stroke-linecap:round;
        stroke-linejoin:round;
    }
    .mouseText{
        font-size: 6px;
        display: inline-block;
        padding: 1px 1px;
    }
</style>


