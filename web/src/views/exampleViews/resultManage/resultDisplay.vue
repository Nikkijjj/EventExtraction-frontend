<template>
    <div class="container1">
        <div class="card-container1">
            <div class="card1">
                <p class="intro-text1">本页面是抽取后结果的管理页面，可以进一步查看详情或针对缺失率进行缺失补全操作。</p>
                <p class="intro-text1">缺失补全：事件论元补全模块主要面向过程性事件完整事件数据构造，以及多文档联合事件抽取的缺失论元补全，从而优化抽取效果。</p>
            </div>
            <div class="card1">
                <div style="display: flex; gap: 20px;">
                    <el-col :span="8">
                        <el-statistic :value="eventType">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    任务文本事件类型
                                    <el-tooltip effect="dark" content="已抽取的公告的抽取事件类型" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="8">
                        <el-statistic :value="extractionTemplate">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    抽取模板
                                    <el-tooltip effect="dark" content="已抽取的公告的事件抽取模板" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="8">
                        <el-statistic :value="extractionModel">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    抽取模型
                                    <el-tooltip effect="dark" content="已抽取的公告的所选事件抽取模型" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </el-col>
                </div>
                <div style="display: flex; gap: 20px;">
                    <el-col :span="6">
                        <el-statistic :value="10" style="margin-top: 20px;">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    公告数量
                                    <el-tooltip effect="dark" content="已完成抽取的公告的数量" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic :value="0.17" style="margin-top: 20px;">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    平均缺失率
                                    <el-tooltip effect="dark" content="所有已抽取公告的事件要素缺失率的平均值" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic :value="0.28" style="margin-top: 20px;">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    最大缺失率
                                    <el-tooltip effect="dark" content="所有已抽取公告的事件要素缺失率的最大值" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic :value="0.12" style="margin-top: 20px;">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    最小缺失率
                                    <el-tooltip effect="dark" content="所有已抽取公告的事件要素缺失率的最小值" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </el-col>
                </div>
                <!-- <p class="event-type">当前任务文本事件类型为：<span>{{ eventType }}</span></p>
                <p class="event-type">当前任务抽取模板为：<span>{{ extractionTemplate }}</span></p>
                <p class="event-type">当前任务所选模型为：<span>{{ extractionModel }}</span></p> -->
            </div>
        </div>

        <div class="card1down">
            <p class="intro-text">以下是您已完成抽取的数据，请挑选您想要进一步处理的公告文本：</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <div style="flex-grow: 1;">
                    <el-input v-model="searchInput" style="max-width: 450px; margin-right: 15px;" placeholder="请输入搜索内容"
                        clearable>
                        <template #prepend>
                            <el-select v-model="searchSelect" placeholder="选择" style="width: 90px">
                                <el-option label="公告编号" value="1" />
                                <el-option label="标题" value="2" />
                                <el-option label="属性抽取结果" value="3" />
                                <el-option label="事件要素缺失率" value="4" />
                            </el-select>
                        </template>
                        <template #append>
                            <el-button :icon="Search" @click="searchData" />
                            <el-button :icon="Refresh" @click="resetData" />
                        </template>
                    </el-input>
                </div>
                <div>
                    <el-button @click="exportSelect()"><el-icon>
                            <Download />
                        </el-icon>导出选中</el-button>
                    <el-button @click="exportAll()"><el-icon>
                            <Download />
                        </el-icon>导出全部</el-button>
                    <el-button @click="batchCompletion"><el-icon>
                            <EditPen />
                        </el-icon>批量缺失补全</el-button>
                </div>
            </div>
            <el-table :data="searchResults.length > 0 ? searchResults : pagedData"
                style="width: 100%; margin-top: 12px; height: 200px; overflow-y: auto;" v-model:selection="selectdata"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column property="id" label="公告编号" width="100" sortable>
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column property="title" label="标题" width="250" />
                <el-table-column property="result" label="属性抽取结果" width="350" />
                <el-table-column property="rate" label="事件要素缺失率" width="180" sortable />
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button link type="primary" size="small" @click="goToEdit">修改</el-button>
                        <el-button link type="primary" size="small" @click="goToDetail">查看</el-button>
                        <el-button link type="primary" size="small" @click="deleteAnnouncement">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="width: 100%; display: flex; justify-content: flex-end; margin-top: 85px;">
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
import { Download, EditPen, Warning, Search, Refresh } from '@element-plus/icons-vue';
//分页的逻辑需要有数据之后才能补全，比如删除数据之后能不能不刷新就更新表格内容，页面挂载的时候需不需要也执行分页相关函数
//需要后端传来公告的基本信息
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

const router = useRouter();
const eventType = ref('公司上市');
const extractionTemplate = ref('模板1');
const extractionModel = ref('Model1');
const searchSelect = ref();
const searchInput = ref('');
const searchResults = ref<Announcement[]>([]);

const tableData: Announcement[] = [
    { id: 1, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, result: '结果1' },
    { id: 2, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, result: '结果2' },
    { id: 3, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, result: '结果1' },
    { id: 4, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, result: '结果2' },
    { id: 5, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, result: '结果1' },
    { id: 6, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, result: '结果2' },
    { id: 7, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, result: '结果1' },
    { id: 8, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, result: '结果2' },
];
const selectdata = ref<Announcement[]>([]);
const globalSelectData = ref<Announcement[]>([]);
const total = ref(10);  //表示公告总数
const currentPage = ref(1);  //表示当前页数
const pageSize = 5;  // 每页显示的公告数
const size = ref<ComponentSize>('default');

onMounted(async () => {
    await loadAllAnnouncments();
})

const handleSelectionChange = (val: Announcement[]) => {
    selectdata.value = val;
    globalSelectData.value = [...globalSelectData.value, ...val];
};

const exportSelect = async () => {
    if (globalSelectData.value.length <= 0) {
        ElMessage.info('请选择数据！');
        return;
    }
    let tableDataForExport = [
        ['序号', '公告编号', '标题', '事件抽取结果', '事件要素缺失率'],
    ];
    globalSelectData.value.forEach((item, index) => {
        let rowData = [
            index + 1,  // 序号
            item.id,    // 公告编号
            item.title, // 标题
            item.result,  // 事件抽取结果
            item.rate,  // 事件要素缺失率
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

const handleCurrentChange = (newPage: number) => {
    if (searchResults.value.length > 0) {
        // 如果是搜索结果，则不进行分页
        currentPage.value = 1;
        selectdata.value = [];
    } else {
        currentPage.value = newPage;
    }
};

const pagedData = computed(() => {
    if (searchResults.value.length === 0) {
        const start = (currentPage.value - 1) * pageSize;
        const end = currentPage.value * pageSize;
        return tableData.slice(start, end);
    }
    return searchResults.value;
});

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

//跳转到公告详情页面
const goToDetail = async (row) => {
    const selectedId = row.id;
    localStorage.setItem('detailId', JSON.stringify(selectedId));
    router.push({
        name: 'result-detail'
    });
}

//等待后端API，此方法用于删除表格中的数据
const deleteAnnouncement = async (row) => {
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
        const idsToDelete = row.id;
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

//进行单个数据编辑
const goToEdit = async (row) => {
    const selectedId = row.id;
    localStorage.setItem('editId', JSON.stringify(selectedId));
    router.push({ name: 'result-edit' });
};

//进行批量缺失补全
const batchCompletion = async () => {
    if (selectdata.value.length === 0) {
        ElMessage.warning('请先选择要执行缺失补全的公告！');
        return;
    }
    const selectedIds = selectdata.value.map(item => item.id);
    localStorage.setItem('completionId', JSON.stringify(selectedIds));
    router.push({ name: 'result-completion' });
};

//根据不同选择类别进行查询
const searchData = () => {
    if (!searchInput.value || !searchSelect.value) {
        searchResults.value = tableData;
        return;
    }

    const searchField = searchSelect.value;
    const searchKeyword = searchInput.value.toLowerCase();

    searchResults.value = tableData.filter(item => {
        switch (searchField) {
            case '1':
                return item.id.toString().includes(searchKeyword);
            case '2':
                return item.title.toLowerCase().includes(searchKeyword);
            case '3':
                return item.result.toLowerCase().includes(searchKeyword);
            case '4':
                return item.rate.toString().includes(searchKeyword);
            default:
                return false;
        }
    });
};

const resetData = async () => {
    searchInput.value = '';
    searchSelect.value = '';
    searchResults.value = [];
}
</script>

<style lang="scss">
.container1 {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
}

.card-container1 {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.card1 {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: auto;
    width: 48%;
    height: 16vh;
}

.card1down {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 54vh;
}

.intro-text1 {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
    margin-bottom: 12px;
}

.event-type {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
}

.event-type span {
    color: #5340ff;
}

.el-table {
    font-family: 'Arial', sans-serif !important;
    font-weight: normal !important;
    font-size: 13px !important;
    line-height: 4 !important;
    text-align: center !important;
    overflow: auto !important;
}

.el-table .el-table__header {
    background-color: #f2f3f5 !important;
}

.el-table th {
    height: 45px !important;
    font-size: 16px !important;
    font-weight: bold !important;
}
</style>