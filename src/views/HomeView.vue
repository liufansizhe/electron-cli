<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
const clickHandle = async () => {
    // window.electronAPI.minimize()
    // const folder = await window.electronAPI.getDefaultPath()
    // console.log(folder)
    // // const data = await window.electronAPI.getDiskSpace(folder)
    // window.electronAPI.getDownloadProgress((data) => {
    //     console.log('--', data)
    // })
    const data = await window.electronAPI.download({
        url: 'https://mj-rmbg.luluhero.com:9443/file/GetRes?sid=RMBG-108ad7b9-a344-4e31-b50c-02465d574b14&type=Output&resid=1755048852714_0_7ed5d49fa1ad49869925a83cf5e466ab.mp4&file_type=video',
        savePath: folder
    })
    // console.log(data)
}
onMounted(() => {})
</script>
<template>
    <RouterView />
    <div class="T" @click="clickHandle">demo</div>
</template>
<style scoped lang="scss"></style>
