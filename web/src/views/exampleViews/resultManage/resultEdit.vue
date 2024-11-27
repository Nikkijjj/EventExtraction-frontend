<template>
    <div style="display: flex; justify-content: space-between; margin-top: 10px;margin-bottom: 10px;">
        <el-button style="margin-left: 30px;" @click="goBack"><el-icon><ArrowLeft /></el-icon>返回</el-button>
        <el-button style="margin-right: 30px;" @click="downloadData"><el-icon><Download /></el-icon>下载</el-button>
    </div>
    <div class="demo-collapse">
        <el-collapse v-model="activeName" accordion class="custom-collapse">
            <el-collapse-item v-for="(item, index) in tableData" :key="item.id" :name="(index + 1).toString()"
                class="custom-collapse-item">
                <template #title>
                    <span
                        v-html="`&nbsp;&nbsp;&nbsp;<strong>公告编号: ${item.id}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.title}`"></span>
                </template>
                <div class="content">
                    {{ item.content }}
                    <!-- 根据数据的抽取模板，从后端获取每一个公告数据所对应的抽取模板，提取出模板中的元素，做成文本框 -->
                    <div class="button-container">
                        <el-button @click="save(item.id)">保存修改记录并计数</el-button>
                        <el-button @click="goToDetail(item.id)">详情查看</el-button>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>



<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import * as XLSX from 'xlsx';
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

const activeName = ref('1');
let selectedIds: number[] = [];
const tableData: Announcement[] = [
    { id: 1, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, template: '模板1', result: '结果1' },
    { id: 2, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, template: '模板2', result: '结果2' },
    { id: 3, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, template: '模板1', result: '结果1' },
    { id: 4, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, template: '模板2', result: '结果2' },
    { id: 5, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, template: '模板1', result: '结果1' },
    { id: 6, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, template: '模板2', result: '结果2' },
    { id: 7, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, template: '模板1', result: '结果1' },
    { id: 8, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, template: '模板2', result: '结果2' },
    { id: 9, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, template: '模板1', result: '结果1' },
    { id: 10, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, template: '模板2', result: '结果2' },
];

onMounted(async () => {
    await loadAllAnnouncements();
})

const goBack = async () => {
    router.push({
        name: 'result-manage'
    });
}

const downloadData = async () => {
    if (tableData.length <= 0) {
        ElMessage.info('没有可导出的数据！');
        return;
    }
    let tableDataForExport = [
        ['序号', '公告编号', '标题', '内容', '事件抽取结果'],
    ];
    tableData.forEach((item, index) => {
        let rowData = [
            index + 1,  // 序号
            item.id,    // 公告编号
            item.title, // 标题
            item.content, //内容
            item.result,  // 事件抽取结果
        ];
        tableDataForExport.push(rowData);
    });
    const workSheet = XLSX.utils.aoa_to_sheet(tableDataForExport);
    const bookNew = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(bookNew, workSheet, '公告数据'); // 工作簿名称
    const fileName = `修改公告数据导出.xlsx`; // 导出的文件名
    XLSX.writeFile(bookNew, fileName); // 保存的文件名
}

const loadAllAnnouncements = async () => {
    const storedIds = localStorage.getItem('editId');
    if (storedIds) {
        selectedIds = JSON.parse(storedIds);
    }
    //从后端数据库中获取需要修改的公告的详情数据，存入tableData中

}

const save = async (id: number) => {
    //获取修改后的信息更新id对应的公告数据
}

const goToDetail = async (id: number) => {
    localStorage.setItem('detailId', JSON.stringify(id));
    router.push({
        name: 'result-detail'
    });
}

</script>

<style lang="scss">
.demo-collapse {
    width: 95%;
    margin: 0 auto;
    max-height: 90%;
    overflow-y: auto;
}

.custom-collapse {
    border-radius: 5px;
}

.custom-collapse-item {
    font-size: 14px;
    margin-bottom: 3px;
}

.custom-collapse-item .el-collapse-item__header {
    font-size: 15px;
    font-weight: bold;
    padding: 3px;
    border-radius: 7px;
}

.custom-collapse-item .content {
    padding: 10px;
    font-size: 14px;
    border-top: 1px solid #ddd;
    position: relative;
}

.custom-collapse-item .el-collapse-item__content {
    padding: 10px 20px;
    font-size: 13px;
    line-height: 1.5;
}

.custom-collapse-item .button-container {
    position: absolute;
    bottom: 3px;
    right: 8px;
    display: flex;
    gap: 10px;
}
</style>