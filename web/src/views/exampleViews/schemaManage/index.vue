<template>
    <div class="upper-container">
        <div class="text-line">
            这里显示所有已有的事件抽取模板
        </div>
        <div class="text-line">
            事件专员可以管理所有事件抽取模板
        </div>
    </div>
    <div class="dowm-container">
        <ChooseSchema :status="outProcess" />
    </div>
</template>

<script lang="ts" setup>
import ChooseSchema from '../extractionProcess/components/chooseSchema.vue';
const outProcess = 'outProcess';
</script>

<style lang="scss" scoped>
.upper-container {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */
    align-items: flex-start;
    border-radius: 5px;
    margin: 10px;
    margin-bottom: 0px;
    background-color: #ffffff;
    height: 18%;
    gap: 10px; /* 设置每行之间的间隔 */
}

.text-line {
    margin-left: 50px; /* 左侧边距 */
}

.dowm-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
