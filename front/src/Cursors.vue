<template>
    <div>
        <component
          v-for="(item,index) in comName"
          :is="Cursor"
          :key="index"
          :item="item"
        ></component>
    </div>
</template>

<script>
import Cursor from "./Cursor.vue"
import gdata from "./data/rawData"
export default {
    name:"Cursors",
    components:{
        Cursor
    },
    data() {
        return {
            cursorsData: []
        };
    },
    setup() {
        gdata.userList.bindAttr(this.cursorsData);
    },
}
</script>

<style scoped>
</style>


