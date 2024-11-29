<template>
    <div class="container">
        <div class="card left-card">
            <el-button class="card-btn1" @click="goBack"><el-icon>
                    <ArrowLeft />
                </el-icon>返回</el-button>
            <div style="text-align: center; width: 100%; margin-top: 30px; font-size: 24px; font-weight: bold;">属性信息
            </div>
            <div v-for="i in num" :key="i" style="margin-top: 30px;">
                <div style="font-size: 19px; font-weight: bold;">事件{{ i }}：<span style="font-weight: normal;">{{
                        }}</span></div>
                <div style="margin-top: 8px; font-size: 19px; font-weight: bold;">事件所在句：<span
                        style="font-weight: normal;">{{ }}</span></div>
                <div style="margin-top: 8px; font-size: 19px; font-weight: bold;">事件所在公告编号：<span
                        style="font-weight: normal;">{{ }}</span></div>
                <el-table :data="result" border style="width: 100%; margin-top: 8px;">
                    <el-table-column prop="role" label="role" width="240" align="center" />
                    <el-table-column prop="argument" label="argument" align="center" />
                </el-table>
            </div>
        </div>

        <div class="card right-card">
            <el-button class="card-btn2" @click="downloadData"><el-icon>
                    <Download />
                </el-icon>下载</el-button>
            <div style="text-align: center; width: 100%; margin-top: 30px; font-size: 22px; font-weight: bold;">来源文本
            </div>
            <div style="font-size: 19px; font-weight: bold; margin-top: 30px;">公告编号：<span
                    style="font-weight: normal;">{{ }}</span></div>
            <div style="margin-top: 8px; font-size: 19px; font-weight: bold;">公告内容：<div
                    style="font-weight: normal; margin-top: 8px; font-size: 19px;">
                    {{ }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import FileSaver from "file-saver"; 
import htmlDocx from "html-docx-js/dist/html-docx";

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

interface Result {
    num: number //是第几个事件的结果
    role: string
    argument: string
}

const router = useRouter();
const announcement = ref<Announcement>();
const num = ref(3);
const result = ref<Result[]>([])

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
    //解析result，获取一共几个事件，获取事件的相关信息，并将要素等整理在表格中，存入result数组中
}

const goBack = async () => {
    router.push({
        name: 'result-manage'
    });
}

const downloadData = async () => {
    // 准备左侧卡片的 HTML 内容
    const leftCardContent = `
        <div>
            <h2>属性信息</h2>
            ${Array.from({ length: num.value }, (_, i) => {
                return `
                <div>
                    <h3>事件${i + 1}：</h3>
                    <p>事件所在句：${result.value[i]?.argument || '无'}</p>
                    <p>事件所在公告编号：${result.value[i]?.role || '无'}</p>
                    <table border="1" style="width: 100%;">
                        <thead>
                            <tr>
                                <th>role</th>
                                <th>argument</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.value.map(r => `
                                <tr>
                                    <td>${r.role}</td>
                                    <td>${r.argument}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                `;
            }).join('')}
        </div>
    `;

    // 准备右侧卡片的 HTML 内容
    const rightCardContent = `
        <div>
            <h2>来源文本</h2>
            <p>公告编号：${announcement.value?.id || '无'}</p>
            <p>公告内容：</p>
            <div>${announcement.value?.content || '无'}</div>
        </div>
    `;

    // 将 HTML 转换为 DOCX 格式
    const leftCardDocx = htmlDocx.asBlob(leftCardContent, { orientation: 'portrait' });
    const rightCardDocx = htmlDocx.asBlob(rightCardContent, { orientation: 'portrait' });

    // 保存文档
    FileSaver.saveAs(leftCardDocx, '属性信息.docx');
    FileSaver.saveAs(rightCardDocx, '来源文本.docx');
};
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
    overflow-y: auto;
    width: 50%;
    max-height: 80vh;
    /* 设置最大高度为屏幕的80% */
    position: relative;
}

.card-btn1,
.card-btn2 {
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
