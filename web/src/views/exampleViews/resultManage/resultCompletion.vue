<template>
    <div class="container">
        <div class="card" style="height: 30px;">
            <p class="intro-text">缺失补全：事件论元补全模块主要面向过程性事件完整事件数据构造，以及多文档联合事件抽取的缺失论元补全，从而优化抽取效果。</p>
        </div>

        <div class="card" style="height: 440px; position: relative;">
            <el-table :data="pagedData" style="width: 100%; margin-top: 12px" :max-height="240"
                v-model:selection="selectdata" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="80" />
                <el-table-column property="id" label="公告编号" width="110" sortable>
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column property="title" label="标题" width="210" />
                <el-table-column property="content" label="内容" width="340" sortable />
                <el-table-column property="type" label="事件类型" width="140" sortable />
                <el-table-column property="result" label="属性抽取结果" />
            </el-table>
            <div
                style="position: absolute; bottom: 28px; right: 25px; width: 100%; display: flex; justify-content: flex-end;">
                <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :size="size" :disabled="false"
                    :background="false" layout="total, prev, pager, next" :total="total"
                    @current-change="handleCurrentChange" />
            </div>
        </div>
        <div style="position: absolute; left: 50%; transform: translateX(-50%); bottom: 150px; width: 75%;text-align: center;">
            <p v-if="progress < 100">后台正在对您选择的数据执行缺失补全操作，请稍候...（注：退出不影响补全进度）</p>
            <p v-else>补全已完成！</p>
            <el-progress :percentage="progress" status="active" :text-inside="true" :stroke-width="26" style="margin-top: 20px;"></el-progress>
        </div>
        <div style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); width: 100%; display: flex; justify-content: center; align-items: center;">
            <el-button @click="progressEnd">流程终止</el-button>
            <el-button @click="goBack">返回</el-button>
            <el-button @click="resultCheck">结果查看</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { ElTable } from 'element-plus';
import type { ComponentSize } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';
//分页的逻辑需要有数据之后才能补全，比如删除数据之后能不能不刷新就更新表格内容，页面挂载的时候需不需要也执行分页相关函数
//页面跳转逻辑都没写
//需要后端传来公告的基本信息
//不确定进度条是否设置成功，无后端数据所以无法检验，这里是设置假进度条还是从后端获取进度有待商榷
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
let selectedIds: number[] = [];
const selectdata = ref<Announcement[]>([]);

const total = ref(10);  //表示公告总数
const currentPage = ref(1);  //表示当前页数
const pageSize = 5;  // 每页显示的公告数
const size = ref<ComponentSize>('default');
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

const progress = ref(0); // 进度百分比
let timer: number | null = null; // 定时器 ID

onMounted(async () => {
    await loadSelectedAnnouncments();
    await resultComplete();
    timer = setInterval(fetchProgress, 2000); // 每2秒获取一次进度
})

const handleSelectionChange = (val: Announcement[]) => {
    selectdata.value = val;
}

const pagedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = currentPage.value * pageSize;
    return tableData.slice(start, end);
});

const handleCurrentChange = (newPage: number) => {
    currentPage.value = newPage;  // 更新当前页
};

//从localStorage中读取选中缺失补全的id，从数据库中找到这些id对应的公告数据
const loadSelectedAnnouncments = async () => {
    const storedIds = localStorage.getItem('completionId');
    if (storedIds) {
        selectedIds = JSON.parse(storedIds);
    }
    //const res = await axios.get('',);
    // if (res.data.isOK) {
    //     tableData.length = 0;  // 清空旧数据
    //     tableData.push(...res.data);  // 将新数据填入
    //     total.value = tableData.length;  // 更新总数据条数
    // } else {
    //     ElMessage({ message: res.data.msg, type: 'error' });
    // }
}

const resultComplete = async () => {
    try {
        // 调用后端接口开始补全操作
        // const res = await axios.post('/api/start-completion', { ids: selectedIds });
        // if (res.data.isOK) {
        //     console.log('补全操作开始');
        // } else {
        //     ElMessage({ message: res.data.msg, type: 'error' });
        // }
    } catch (error) {
        console.error('启动补全操作失败', error);
    }
}

//等待后端接口获取进度
const fetchProgress = async () => {
    try {
        //const res = await axios.get('');
        // if (res.data.isOK) {
        //     progress.value = res.data.progress;
        //     if (progress.value >= 100) {
        //         clearInterval(timer!); // 完成后停止轮询
        //     }
        // }
    } catch (error) {
        console.error('获取进度失败', error);
    }
};

//进度条终止
const progressEnd = async () => {
    try {
        //await axios.post('/api/terminate-completion');
        clearInterval(timer!); // 停止进度轮询
    } catch (error) {
        console.error('终止进度失败', error);
    }
}

//返回到结果展示页面，此时补全操作可能未完成
const goBack = async () => {
    router.push({
        name: 'result-manage'
    });
}

//跳转到结果展示页面，此时补全操作已完成（可以设置成进度条100%才能点击，不然disabled
const resultCheck = async () => {
    router.push({
        name: 'result-manage'
    });
}

onUnmounted(() => {
    if (timer) {
        clearInterval(timer);
    }
});
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
