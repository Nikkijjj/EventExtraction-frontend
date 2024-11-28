<template>
    <div class="container">
        <div class="card left-card">
            <el-button class="card-btn1" @click="goBack"><el-icon><ArrowLeft /></el-icon>返回</el-button>
            <div style="text-align: center; width: 100%; margin-top: 30px; font-size: 22px; font-weight: bold;">属性信息</div>
        </div>

        <div class="card right-card">
            <el-button class="card-btn2"><el-icon><Download /></el-icon>下载</el-button>
            <div style="text-align: center; width: 100%; margin-top: 30px; font-size: 22px; font-weight: bold;">来源文本</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

axios.defaults.withCredentials = true;

interface Announcement {
    id: number
    title: string
    content: string
    type: string
    completion: number
    rate: number
    template: string
    result: string
}

const router = useRouter();
const anncouncement = ref<Announcement>();

onMounted(async () => {
    await loadAnnouncment();
})

const loadAnnouncment = async () => {
    const storedId = localStorage.getItem('editId');
    let selectedId = storedId;
    if (storedId) {
        selectedId = JSON.parse(storedId);
    }
    //传入selectedId，获取相应的公告数据放入announcement中
}

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
