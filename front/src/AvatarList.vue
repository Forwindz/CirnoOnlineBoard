<template>
  <div>
    <div v-for="(name, index) in names" :key="index" class="list-style">
      <Avatar v-bind:color="name.color" v-bind:nick="name.nick" image="" />
    </div>
  </div>
</template>
 
<script>
import Avatar from "./Avatar";
import gdata from "./data/rawData"
export default {
  name: "MainComponent",
  components: {
    Avatar,
  },
  data() {
    return {
      names: []
    };
  },
  created: function(){
      gdata.userList.addUserEvent.add((source,userInfo)=>{
          this.names.push(userInfo)
      })
      gdata.userList.removeUserEvent.add((source,userInfo)=>{
          let i=0;
          console.log(source);
          console.log(userInfo);
          for (;i<this.names.length;i++){
            if(this.names[i].uid==userInfo.uid){
              break;
            }
          }
          if(i<this.names.length){
            this.names = this.names.splice(i,1);
          }
      })
  }
};
</script>

<style scoped>
.list-style {
  padding: 5px 5px;
  display: inline-block;
  text-align: left;
}
</style>