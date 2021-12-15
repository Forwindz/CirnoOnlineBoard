<template>
    <div style="pointer-events:none;">
        <Cursor
          v-for="(it, index) in cursorsData"
          :key="index"
          :nick="it.nick"
          :color="it.color"
          :hintColor="it.hintColor"
          :x="it.x"
          :y="it.y"
          :uid="it.uid"
          :index="index"
        />
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import Cursor from "./Cursor.vue"
import gdata from "./data/rawData"
import AttrManager from './utils/ValueChangeManager.js'
export default {
    name:"Cursors",
    components:{
        Cursor
    },
    data:()=>{
        return {
            cursorsData:[]
        }
    },
    methods:{
    },
    created() {
        gdata.userList.addUserEvent.add((source,e)=>{
                this.cursorsData.push(e);
                AttrManager.addPropertyListener(e,"x",()=>{this.$forceUpdate()});
                AttrManager.addPropertyListener(e,"y",()=>{this.$forceUpdate()});
                AttrManager.addPropertyListener(e,"hintColor",()=>{this.$forceUpdate()});
            });
            gdata.userList.removeUserEvent.remove((source,userInfo)=>{
            let i=0;
            for (;i<this.cursorsData.length;i++){
              if(this.cursorsData[i].uid==userInfo.uid){
                break;
              }
            }
            if(i<this.cursorsData.length){
              this.cursorsData = this.cursorsData.splice(i,1);
            }
        });
    },
    watch:{
    },
    computed:{
    }
}
</script>

<style scoped>
</style>


