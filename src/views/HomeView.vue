<script setup>
import { Login } from '@/services'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
onMounted(() => {
    Login.post({ username: 'admin', password: '123456' })
})
</script>
<template>
    <RouterView />
    <div class="T">demo</div>
</template>
<style scoped lang="scss"></style>
