<template>
  <div v-bind:style="{ backgroundColor: color }" class="avatar-icon">
    <span class="white--text">{{ abrNick }}</span>
  </div>
</template>

<script lang="ts">
const avatarColors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#FF9800",
  "#FF5722"
];

export default {
  name: "Avatar",
  /*
  data: function () {
    return {
      color: avatarColors,
      nick: "",
      image: "" //todo: image based avatar
    };
  },*/
  props:{
    color:String,
    nick:String,
    image:String
  },
  computed:{
    abrNick:function() {
      if (this.nick != null && this.nick.length>=1) {
        let chr;
        const d = this.nick.toUpperCase();
        chr = d.split(" ");
        if (chr.length >= 2) {
          return chr[0][0]+chr[1][0];
        } else {
            if(this.nick.length==1){
                return d[0];
            }
            return d[0]+d[1];
        }
      }
      return "";
    },
  },
  methods: {
    
    getRandomColor() {
      let randomIndex = Math.floor(Math.random() * this.colors.length);
      return this.colors[randomIndex];
    },
  },
};
</script>

<style scoped>
.avatar-icon {
  display:table-cell;
  width: 24px;
  height: 24px;
  font-size: 8px;
  text-align: center;
  vertical-align:middle;
  color: #ffffff;
  border-radius: 50%;
}
</style>