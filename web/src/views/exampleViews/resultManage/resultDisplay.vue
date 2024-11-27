<template>
    <div class="container">
        <div class="card" style="height: 100px;">
            <p class="intro-text">本页面是抽取后结果的管理页面，可以进一步查看详情或针对缺失率进行缺失补全操作。</p>
            <p class="intro-text">缺失补全：事件论元补全模块主要面向过程性事件完整事件数据构造，以及多文档联合事件抽取的缺失论元补全，从而优化抽取效果。</p>
            <p class="event-type">当前任务文本事件类型为：<span>{{ eventType }}</span></p>
        </div>

        <div class="card" style="height: 370px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <p class="intro-text">以下是您已完成抽取的数据，请挑选您想要进一步处理的公告文本：</p>
                <el-button style="margin-left: auto;" @click="exportSelect()"><el-icon>
                        <Download />
                    </el-icon>导出选中</el-button>
                <el-button style="margin-left: auto;" @click="exportAll()"><el-icon>
                        <Download />
                    </el-icon>导出全部</el-button>
            </div>
            <el-table :data="pagedData" style="width: 100%; margin-top: 12px" :max-height="240"
                v-model:selection="selectdata" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column property="id" label="公告编号" width="80" sortable>
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column property="title" label="标题" width="200" />
                <el-table-column property="completion" label="是否已执行缺失补全" width="180" sortable>
                    <template v-slot="scope">
                        <el-button 
                            :disabled="scope.row.completion === 1" size="small" @click="goToComplete(scope.row)">
                            {{ scope.row.completion === 0 ? '点击补全' : '已补全' }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column property="rate" label="事件要素缺失率" width="160" sortable />
                <el-table-column property="template" label="抽取模板" width="130" sortable />
                <el-table-column property="result" label="属性抽取结果" width="220" />
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button link type="primary" size="small" @click="goToDetail">查看</el-button>
                        <el-button link type="primary" size="small" @click="deleteAnnouncement()">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div
                style="position: absolute; bottom: 70px; right: 35px; display: flex; align-items: center; justify-content: space-between;">
                <el-button style="margin-left: auto;" @click="batchEdit">批量修改</el-button>
                <el-button style="margin-left: auto;" @click="batchCompletion">批量缺失补全</el-button>
            </div>
            <div
                style="position: absolute; bottom: 28px; right: 25px; width: 100%; display: flex; justify-content: flex-end;">
                <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :size="size" :disabled="false"
                    :background="false" layout="total, prev, pager, next" :total="total"
                    @current-change="handleCurrentChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElTable, ElMessage, ElMessageBox } from 'element-plus';
import type { ComponentSize } from 'element-plus';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useRouter } from 'vue-router';
//分页的逻辑需要有数据之后才能补全，比如删除数据之后能不能不刷新就更新表格内容，页面挂载的时候需不需要也执行分页相关函数
//页面跳转逻辑都没写
//需要后端传来公告的基本信息
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
const eventType = ref('公司上市');

const tableData: Announcement[] = [
    { id: 1, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, template: '模板1', result: '结果1' },
    { id: 2, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, template: '模板2', result: '结果2' },
    { id: 3, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, template: '模板1', result: '结果1' },
    { id: 4, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, template: '模板2', result: '结果2' },
    { id: 5, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, template: '模板1', result: '结果1' },
    { id: 6, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, template: '模板2', result: '结果2' },
    { id: 7, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, template: '模板1', result: '结果1' },
    { id: 8, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, template: '模板2', result: '结果2' },
];
const selectdata = ref<Announcement[]>([]);
const total = ref(10);  //表示公告总数
const currentPage = ref(1);  //表示当前页数
const pageSize = 5;  // 每页显示的公告数
const size = ref<ComponentSize>('default');

onMounted(async () => {
    await loadAllAnnouncments();
})

const handleSelectionChange = (val: Announcement[]) => {
    selectdata.value = val;
}

const exportSelect = async () => {
    if (selectdata.value.length <= 0) {
        ElMessage.info('请选择数据！');
        return;
    }
    let tableDataForExport = [
        ['序号', '公告编号', '标题', '是否已执行缺失补全', '事件要素缺失率', '抽取模板', '事件抽取结果'],
    ];
    selectdata.value.forEach((item, index) => {
        let rowData = [
            index + 1,  // 序号
            item.id,    // 公告编号
            item.title, // 标题
            item.completion === 0 ? '未补全' : '已补全',  // 是否已执行缺失补全
            item.rate,  // 事件要素缺失率
            item.template,  // 抽取模板
            item.result,  // 事件抽取结果
        ];
        tableDataForExport.push(rowData);
    });
    const workSheet = XLSX.utils.aoa_to_sheet(tableDataForExport);
    const bookNew = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(bookNew, workSheet, '公告数据'); // 工作簿名称
    const fileName = `公告数据导出.xlsx`; // 导出的文件名
    XLSX.writeFile(bookNew, fileName); // 保存的文件名
};

const exportAll = async () => {
    if (tableData.length <= 0) {
        ElMessage.info('没有可导出的数据！');
        return;
    }
    let tableDataForExport = [
        ['序号', '公告编号', '标题', '是否已执行缺失补全', '事件要素缺失率', '抽取模板', '事件抽取结果'],
    ];
    tableData.forEach((item, index) => {
        let rowData = [
            index + 1,  // 序号
            item.id,    // 公告编号
            item.title, // 标题
            item.completion === 0 ? '未补全' : '已补全',  // 是否已执行缺失补全
            item.rate,  // 事件要素缺失率
            item.template,  // 抽取模板
            item.result,  // 事件抽取结果
        ];
        tableDataForExport.push(rowData);
    });
    const workSheet = XLSX.utils.aoa_to_sheet(tableDataForExport);
    const bookNew = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(bookNew, workSheet, '公告数据'); // 工作簿名称
    const fileName = `所有公告数据导出.xlsx`; // 导出的文件名
    XLSX.writeFile(bookNew, fileName); // 保存的文件名
};

const pagedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = currentPage.value * pageSize;
    return tableData.slice(start, end);  // 返回当前页的数据
});

const handleCurrentChange = (newPage: number) => {
    currentPage.value = newPage;  // 更新当前页
};

//等待后端API，此方法用于加载表格中的所有数据
const loadAllAnnouncments = async () => {
    //const res = await axios.get('',);

    // if (res.data.isOK) {
    //     tableData.length = 0;  // 清空旧数据
    //     tableData.push(...res.data);  // 将新数据填入
    //     total.value = tableData.length;  // 更新总数据条数
    // } else {
    //     ElMessage({ message: res.data.msg, type: 'error' });
    // }
}

const goToComplete = async (row) => {
    const selectedId = row.id;
    localStorage.setItem('completionId', JSON.stringify(selectedId));
    router.push({
        name: 'result-completion'
    });
}

//等待配置路由，跳转到公告详情页面
const goToDetail = async (row) => {
    const selectedId = row.id;
    localStorage.setItem('detailId', JSON.stringify(selectedId));
    router.push({
        name: 'result-detail'
    });
}

//等待后端API，此方法用于删除表格中的数据
const deleteAnnouncement = async () => {
    if (selectdata.value.length === 0) {
        ElMessage.warning('请先选择要删除的公告！');
        return;
    }
    const confirmDelete = await ElMessageBox.confirm(
        '您确定要删除选中的公告吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    );
    if (confirmDelete === 'confirm') {
        const idsToDelete = selectdata.value.map(item => item.id);
        //const res = await axios.post('',);
        // if (res.data.isOK) {
        //     ElMessage.success('公告删除成功！');
        //     selectdata.value = [];
        //     await loadAllAnnouncments();
        // } else {
        //     ElMessage.error('删除失败：' + res.data.msg);
        // }
    }
}

//等待配置路由，进行批量编辑
const batchEdit = async () => {
    if (selectdata.value.length === 0) {
        ElMessage.warning('请先选择要修改的公告！');
        return;
    }
    const selectedIds = selectdata.value.map(item => item.id);
    localStorage.setItem('editId', JSON.stringify(selectedIds));
    router.push({ name: 'result-edit' });
};

const batchCompletion = async () => {
    if (selectdata.value.length === 0) {
        ElMessage.warning('请先选择要执行缺失补全的公告！');
        return;
    }
    const selectedIds = selectdata.value.map(item => item.id);
    localStorage.setItem('completionId', JSON.stringify(selectedIds));
    router.push({ name: 'result-completion' });

};
</script>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: auto;
}

.intro-text {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
    margin-bottom: 12px;
}

.event-type {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.event-type span {
    color: #007bff;
}

.el-table {
    font-family: 'Arial', sans-serif;
    font-weight: normal;
    font-size: 13px;
    line-height: 4;
    text-align: center;
    overflow: auto;
}

.el-table .el-table__header {
    background-color: #f2f3f5;
}

.el-table th {
    height: 45px;
    font-size: 16px;
    font-weight: bold;
}
</style>