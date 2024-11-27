<template>
    <div class="container">
        <div class="card left-card">
            <el-button class="card-btn1" @click="goBack"><el-icon><ArrowLeft /></el-icon>返回</el-button>
        </div>

        <div class="card right-card">
            <el-button class="card-btn2"><el-icon><Download /></el-icon>下载</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

axios.defaults.withCredentials = true;

const router = useRouter();

const goBack = async () => {
    router.push({
        name: 'result-manage'
    });
}
</script>

<style lang="scss">
.container {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 20px;
}

.card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: auto;
    width: 50%;
    height: 100%;
    overflow-y: auto;
    position: relative;
}

.card-btn1, .card-btn2 {
    position: absolute;
    top: 10px;
}

.left-card .card-btn1 {
    left: 10px;
}

.right-card .card-btn2 {
    right: 10px;
}
</style>
