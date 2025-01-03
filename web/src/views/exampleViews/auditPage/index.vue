<template>
    <div class="container5">
        <div class="card-container5">
            <div class="card5">
                <p class="intro-text3"><strong>操作思路：</strong>对于缺失率较高的结果，考虑到是模型对这类文本的抽取能力可能较差，或者schema生成的不对。</p>
                <p class="intro-text3"><strong>指导意见：</strong>这些样本单独列为新的训练集，二次微调抽取模型，完成模型优化。</p>
                <p class="intro-text3"><strong>评估意见：</strong>通过准确率（修改标记），缺失率可以评估模型工作情况以及schema是否需要调整。</p>
            </div>
        </div>
        <div class="card5down">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <p class="intro-text3" style="flex-grow: 1;">以下是专员全部的抽取结果数据，包括后台每天自动参与抽取的数据：</p>
                <el-input v-model="searchInput" style="max-width: 450px;" placeholder="输入标题关键词" clearable>
                    <template #append>
                        <el-button :icon="Search" @click="searchData" />
                        <el-button :icon="Refresh" @click="resetData" />
                    </template>
                </el-input>
            </div>
            <div>
                <el-table :data="searchResults.length > 0 ? searchResults : pagedData"
                    style="width: 100%; margin-top: 12px" :max-height="200" v-model:selection="selectdata"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="80" />
                    <el-table-column property="id" label="公告编号" width="110">
                        <template v-slot="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column prop="title" label="标题" width="110" />
                    <el-table-column prop="result" label="属性抽取结果" width="230" />
                    <el-table-column prop="modifyFlag" label="修改标记" width="105">
                        <template v-slot="scope">
                            <el-tag :type="scope.row.modifyFlag === 1 ? 'success' : 'info'">
                                {{ scope.row.modifyFlag === 1 ? '已修改' : '未修改' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rate" label="缺失率" width="105" />
                    <el-table-column prop="model" label="模型选择" width="105" />
                    <el-table-column prop="template" label="模板选择" width="105" />
                    <el-table-column prop="type" label="事件类型" width="105" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <!-- <el-button :disabled="scope.row.modifyFlag === 1"
                                :type="scope.row.modifyFlag === 1 ? 'default' : 'primary'" :size="'small'"
                                @click="goToModify(scope.row)" link>
                                {{ scope.row.modifyFlag === 1 ? '已修改' : '未修改' }}
                            </el-button> -->
                            <el-button link type="primary" size="small" @click="goToDetail">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 100px;">
                <el-button @click="downloadJson">导出选中为json</el-button>
                <el-button @click="downloadTxt">导出选中为txt</el-button>
                <el-button @click="downloadAllJson">导出全部为json</el-button>
                <el-button @click="downloadAllTxt">导出全部为txt</el-button>
            </div>
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 12px;">
                <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :size="size" :disabled="false"
                    :background="false" layout="total, prev, pager, next" :total="total"
                    @current-change="handleCurrentChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { ElTable } from 'element-plus';
import type { ComponentSize } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Search, Refresh } from '@element-plus/icons-vue';

interface Announcement {
    id: number
    title: string
    content: string
    type: string
    completion: number
    rate: number
    result: string
    model: string
    template: string
    modifyFlag: number
}

const router = useRouter();
const selectdata = ref<Announcement[]>([]);

const total = ref(10);  //表示公告总数
const currentPage = ref(1);  //表示当前页数
const pageSize = 5;  // 每页显示的公告数
const size = ref<ComponentSize>('default');
const tableData: Announcement[] = [
    { id: 1, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, result: '结果1', model: '模型1', template: '模板1', modifyFlag: 1 },
    { id: 2, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, result: '结果2', model: '模型2', template: '模板2', modifyFlag: 0 },
    { id: 3, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, result: '结果1', model: '模型1', template: '模板1', modifyFlag: 0 },
    { id: 4, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, result: '结果2', model: '模型2', template: '模板2', modifyFlag: 0 },
    { id: 5, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, result: '结果1', model: '模型1', template: '模板1', modifyFlag: 0 },
    { id: 6, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, result: '结果2', model: '模型2', template: '模板2', modifyFlag: 0 },
    { id: 7, title: '公告1', content: '内容1', type: '类型1', completion: 1, rate: 95, result: '结果1', model: '模型1', template: '模板1', modifyFlag: 1 },
    { id: 8, title: '公告2', content: '内容2', type: '类型2', completion: 0, rate: 85, result: '结果2', model: '模型2', template: '模板2', modifyFlag: 0 },
];

const searchInput = ref('');
const searchResults = ref<Announcement[]>([]);

onMounted(async () => {
    await loadAnnouncments();
})

//从数据库中找到所有的公告数据
const loadAnnouncments = async () => {
    //const res = await axios.get('',);
    // if (res.data.isOK) {
    //     tableData.length = 0;  // 清空旧数据
    //     tableData.push(...res.data);  // 将新数据填入
    //     total.value = tableData.length;  // 更新总数据条数
    // } else {
    //     ElMessage({ message: res.data.msg, type: 'error' });
    // }
}

const handleSelectionChange = (val: Announcement[]) => {
    selectdata.value = val;
};

const pagedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = currentPage.value * pageSize;
    return tableData.slice(start, end);
});

const handleCurrentChange = (newPage: number) => {
    currentPage.value = newPage;  // 更新当前页
};

const searchData = () => {
    if (!searchInput.value) {
        searchResults.value = tableData;
        return;
    }
    const searchKeyword = searchInput.value.toLowerCase();
    searchResults.value = tableData.filter(item => {
        return item.title.toLowerCase().includes(searchKeyword);
    });
};

const resetData = async () => {
    searchInput.value = '';
    searchResults.value = [];
};

const goToDetail = async (row) => {
    const selectedId = row.id;
    localStorage.setItem('detailId', JSON.stringify(selectedId));
    router.push({
        name: 'result-detail'
    });
};

const downloadJson = async () => {

};

const downloadTxt = async () => {

};

const downloadAllJson = async () => {

};

const downloadAllTxt = async () => {

};
</script>

<style lang="scss">
.container5 {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
}

.card-container5 {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.card5 {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    overflow: auto;
    width: 100%;
    height: 14vh;
}

.card5down {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 56vh;
}

.intro-text3 {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
    margin-bottom: 12px;
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