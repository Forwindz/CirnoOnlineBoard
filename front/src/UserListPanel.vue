<template>
    <div class = "floating-panel">
        <AvatarList/>
    </div>

</template>

<script>
    import { ref } from 'vue'
    import {socket} from './socketManager'
    import useCanvas from '@/useCanvas'
    import gdata from './data/rawData'
    import AvatarList from './AvatarList.vue'

    export default {
        components: { AvatarList },
        props: {
        },
        emits: [
        ]
    }
</script>

<style scoped>
    .floating-panel{
        position: fixed;
        top: 0;
        left: 0;
        margin: 24px;
        margin-left: 72px;
        z-index: 10;
        height: 50px;
    }
</style>