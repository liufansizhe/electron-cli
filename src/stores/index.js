import { defineStore } from 'pinia'
import { ref } from 'vue'

//demo
export const useDemo = defineStore('demo', () => {
    const demoRef = ref(null)
    return { demoRef }
})
