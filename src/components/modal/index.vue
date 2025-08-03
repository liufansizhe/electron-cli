<script setup>
import { toRefs } from 'vue'

const emit = defineEmits(['close'])
const props = defineProps({ title: String, isShow: Boolean })
const { title, isShow } = toRefs(props)
const closeHandle = () => {
    emit('close')
}
</script>
<template>
    <div class="common-modal" v-if="isShow">
        <div class="common-body">
            <div class="common-head">
                <div class="title">
                    {{ $t(title) }}
                </div>
                <div class="close" @click="closeHandle">
                    <svg-icon iconName="close" />
                </div>
            </div>
            <div class="common-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
@use '@/styles/base.scss';
.common-modal {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    .common-body {
        background: rgba(255, 255, 255, 1);
        border-radius: 20px;
        display: flex;
        align-items: center;
        flex-direction: column;
        .common-head {
            height: 60px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            .close {
                font-size: 24px;
                cursor: pointer;
            }
            .title {
                font-family: Arial;
                font-weight: 700;
                font-size: 16px;
                line-height: 24px;
                letter-spacing: 0%;
                color: rgba(0, 0, 0, 0.9);
            }
        }
        .common-content {
            width: 100%;
        }
        .el-form-item__label {
            color: rgba(0, 0, 0, 0.6) !important;
        }
        .el-input__wrapper {
            border-radius: 10px !important;
        }
        @extend .form-consume;
    }
}
</style>
