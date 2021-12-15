<template>
    <div v-bind:style = "posStyle" v-if="gdata.uid!=uid">
        <svg style="width:18px;height:18px" transform="translate(-4,-4)">
            <g>
                <polygon class="lineStyle" v-bind:style="svgStyle" points="7 6 12 18 14 13 19 11 7 6"/>
            </g>
        </svg>
        <span class="mouseText" v-bind:style="mouseStyle">{{shortNick}}</span>
    </div>
</template>

<script>
import gdata from "./data/rawData";

export default {
    name:"Cursor",
    props:{
        color:String,
        hintColor:String,
        nick:String,
        x:[String,Number],
        y:[String,Number],
        uid:Number
    },
    data:()=>{
        return {gdata:gdata}
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
            return "padding:"+this.y+"px "+this.x+"px; position:fixed;pointer-events:none;display: inline-block;width:36px;height:24px;margin: 0px 0px"
        },
        shortNick(){
            if(this.nick.length>7){
                return this.nick.substring(0,6);
            }
            return this.nick;
        },
        mouseStyle(){
            return "color:"+this.hintColor+";";
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


