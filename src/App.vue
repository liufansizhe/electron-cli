<script setup>
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const locale = zhCn
</script>

<template>
    <el-config-provider :locale="locale">
        <RouterView />
    </el-config-provider>
</template>

<style lang="scss">
#app {
    height: 100%;
    width: 100%;
}
</style>
