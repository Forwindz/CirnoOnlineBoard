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
      gdata.userList.bindAttr(this.names);
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