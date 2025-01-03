<template>
    <div class="container4">
        <div class="card4 left-card1">
            <el-button class="card-btn1" @click="goBack"><el-icon>
                    <ArrowLeft />
                </el-icon>返回</el-button>
            <div style="font-size: 19px; font-weight: bold; margin-top: 30px;">公告标题：<span
                    style="font-weight: normal;">{{ announcement?.title }}</span></div>
            <div style="margin-top: 8px; font-size: 19px; font-weight: bold;">公告内容：<div
                    style="font-weight: normal; margin-top: 8px; font-size: 19px;">
                    {{ announcement?.content }}
                </div>
            </div>
        </div>

        <div class="card4 right-card1">
            <div style="font-size: 19px; font-weight: bold; margin-top: 10px;">抽取结果修改：</div>
            <el-form :model="Event" label-width="auto" style="margin-top: 15px;">
                <div v-for="(eventItem, index) in eventList" :key="index">
                    <el-form-item style="margin-bottom: 15px;">
                        <el-form-item :label="'事件 ' + (index + 1)" style="margin-bottom: 10px;">
                            <el-input v-model="eventList[index].ele1" placeholder="事件 1" style="width: 370px;"/>
                        </el-form-item>
                        <el-form-item label="收购方" style="margin-bottom: 10px;">
                            <el-input v-model="eventList[index].ele2" placeholder="事件 2" style="width: 370px;"/>
                        </el-form-item>
                        <el-form-item label="收购完成时间" style="margin-bottom: 10px;">
                            <el-input v-model="eventList[index].ele3" placeholder="事件 3" style="width: 370px;"/>
                        </el-form-item>
                        <el-form-item label="收购标的" style="margin-bottom: 10px;">
                            <el-input v-model="eventList[index].ele4" placeholder="事件 4" style="width: 370px;"/>
                        </el-form-item>
                        <el-form-item label="披露时间" style="margin-bottom: 10px;">
                            <el-input v-model="eventList[index].ele5" placeholder="事件 5" style="width: 370px;"/>
                        </el-form-item>
                        <el-form-item label="交易金额" style="margin-bottom: 10px;">
                            <el-input v-model="eventList[index].ele6" placeholder="事件 6" style="width: 370px;"/>
                        </el-form-item>
                        <el-form-item label="被收购方" style="margin-bottom: 10px;">
                            <el-input v-model="eventList[index].ele7" placeholder="事件 7" style="width: 370px;"/>
                        </el-form-item>
                    </el-form-item>
                </div>
            </el-form>
            <div style="display: flex; justify-content: flex-end">
                <el-button @click="downloadData">下载</el-button>
                <el-button @click="goToDetail">查看详情</el-button>
                <el-button @click="save">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import FileSaver from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";
import { ArrowLeft, Download } from '@element-plus/icons-vue';

axios.defaults.withCredentials = true;

interface Announcement {
    id: number
    title: string
    content: string
    type: string
    completion: number
    rate: number
    result: string
}

interface Event {
    ele1: string
    ele2: string
    ele3: string
    ele4: string
    ele5: string
    ele6: string
    ele7: string
}

const router = useRouter();

let selectedId: number[] = [];
const announcement = ref<Announcement>();
let eventNum: number = 3;  // 假设事件数量是 3，可以从后端获取
// const eventList = ref<Event[]>([]);  // 存放所有事件的数组
const eventList: Event[] = [
    { ele1: '1', ele2: '2', ele3: '3', ele4: '4', ele5: '5', ele6: '6', ele7: '7' },
    { ele1: '1', ele2: '2', ele3: '3', ele4: '4', ele5: '5', ele6: '6', ele7: '7' },
    { ele1: '1', ele2: '2', ele3: '3', ele4: '4', ele5: '5', ele6: '6', ele7: '7' },
    { ele1: '1', ele2: '2', ele3: '3', ele4: '4', ele5: '5', ele6: '6', ele7: '7' },
];
onMounted(async () => {
    await loadAllAnnouncements();
    loadEventData();
})

const goBack = async () => {
    router.push({
        name: 'result-manage'
    });
}

const downloadData = async () => {
    // 生成左侧卡片的 HTML 内容
    const leftCardContent = `
        <div>
            <h2>公告信息</h2>
            <p>公告标题：${announcement.value?.title || '无'}</p>
            <p>公告内容：</p>
            <div>${announcement.value?.content || '无'}</div>
        </div>
    `;

    // 生成右侧卡片的 HTML 内容
    const rightCardContent = `
        <div>
            <h2>事件信息</h2>
            ${eventList.map((eventItem, index) => {
                return `
                <div>
                    <h3>事件 ${index + 1}：</h3>
                    <p>事件1：${eventItem.ele1}</p>
                    <p>事件2：${eventItem.ele2}</p>
                    <p>事件3：${eventItem.ele3}</p>
                    <p>事件4：${eventItem.ele4}</p>
                    <p>事件5：${eventItem.ele5}</p>
                    <p>事件6：${eventItem.ele6}</p>
                    <p>事件7：${eventItem.ele7}</p>
                </div>
                `;
            }).join('')}
        </div>
    `;

    // 使用 html-docx-js 将 HTML 内容转换为 DOCX 格式
    const leftCardDocx = htmlDocx.asBlob(leftCardContent, { orientation: 'portrait' });
    const rightCardDocx = htmlDocx.asBlob(rightCardContent, { orientation: 'portrait' });

    // 保存生成的 DOCX 文件
    FileSaver.saveAs(leftCardDocx, '公告信息.docx');
    FileSaver.saveAs(rightCardDocx, '修改事件信息.docx');
};


const loadAllAnnouncements = async () => {
    const storedId = localStorage.getItem('editId');
    if (storedId) {
        selectedId = JSON.parse(storedId);
    }
    // 从后端数据库中获取公告详情数据，存入announcement
    // 这里假设已经从后端获取了数据
    announcement.value = {
        id: 1,
        title: '公告标题',
        content: '公告内容',
        type: '公告类型',
        completion: 100,
        rate: 0,
        result: '抽取结果'
    }
}

const loadEventData = () => {
    // 假设事件数据是从后端获取的，事件数量是 eventNum
    // 这里根据 eventNum 动态生成 eventList
    eventList.value = Array.from({ length: eventNum }, (_, index) => ({
        ele1: '',
        ele2: '',
        ele3: '',
        ele4: '',
        ele5: '',
        ele6: '',
        ele7: ''
    }));
}

const save = async (id: number) => {
    // 获取修改后的信息更新 id 对应的公告数据
}

const goToDetail = async (id: number) => {
    localStorage.setItem('detailId', JSON.stringify(id));
    router.push({
        name: 'result-detail'
    });
}

</script>

<style lang="scss">
.container4 {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 20px;
}

.card4 {
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

.card-btn {
    position: absolute;
    top: 10px;
}
</style>