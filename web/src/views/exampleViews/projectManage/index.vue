<template>
    <el-row :gutter="20" style="margin-right: 15px; margin-left: -5px" type="flex">
        <el-col v-for="(item, index) in projectData.projectList" :key="index" :span="6">
            <el-card class="box-card" shadow="always" :body-style="{ padding: '0px' }">
                <div slot="header" class="header">
                    <svg
                        t="1732552423815"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="3665"
                        width="20"
                        height="20"
                        class="icon"
                    >
                        <path
                            d="M951.9 323.4c-6.8-7.2-16.5-11.4-26.4-11.4h-56.6v-69.8c0-24.4-19.9-44.3-44.3-44.3H562.8l-18.7-59.5-0.6-1.4c-6.9-16.6-22.9-27.3-40.9-27.3H198.7c-24.4 0-44.3 19.9-44.3 44.3v158H100c-10 0-19.6 4.2-26.4 11.4-6.8 7.2-10.4 17.1-9.8 27.1l30.8 523.8c1.1 19.2 17.1 34.2 36.3 34.2H896c19.2 0 35.2-15.1 36.3-34.3L962 350.4c0.4-10-3.2-19.8-10.1-27zM224.4 179.6h259.3l18.7 59.5 0.6 1.4c6.9 16.6 22.9 27.3 40.9 27.3h255V312H224.4V179.6z m639.7 658.8H162.5L135.7 382h754.2l-25.8 456.4z"
                            p-id="3666"
                        ></path>
                        <path
                            d="M353.8 537.3h312.1c19.3 0 35-15.7 35-35s-15.7-35-35-35H353.8c-19.3 0-35 15.7-35 35s15.7 35 35 35z"
                            p-id="3667"
                        ></path>
                    </svg>
                    <span class="header-label"> {{ item.project_name }}</span>
                    <el-tag
                        :type="
                            item.ee_progress === '已完成'
                                ? 'success'
                                : item.ee_progress === '进行中'
                                ? 'primary'
                                : 'danger'
                        "
                        style="margin-left: auto"
                        size="large"
                        class="progress-tag"
                    >
                        {{ item.ee_progress }}
                    </el-tag>
                </div>
                <div style="margin: 15px" class="card-body">
                    <div>
                        <div class="card-label">事件类型</div>
                        <span>{{ item.event_type }}</span>
                    </div>
                    <div>
                        <div class="card-label">事件抽取模板</div>
                        <span>{{ item.ee_schema === null ? '无' : item.ee_schema }}</span>
                    </div>
                    <div>
                        <div class="card-label">模型选择</div>
                        <span>{{ item.ee_model === null ? '无' : item.ee_model }}</span>
                    </div>
                    <div>
                        <div class="card-label">抽取进展</div>
                        <span>{{ item.ee_progress }}</span>
                    </div>
                </div>
                <div class="footer">
                    <div style="display: flex; align-items: center">
                        <el-button
                            type="text"
                            style="color: rgb(34, 125, 251)"
                            @click.prevent="editProject(item)"
                            >编辑项目</el-button
                        >
                    </div>
                    <div style="display: flex; align-items: center; color: #cccccc">|</div>
                    <div style="display: flex; align-items: center">
                        <el-popconfirm
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon-color="#626AEF"
                            title="确定删除此条模板?"
                            @confirm="deleteProject(item.project_id)"
                        >
                            <template #reference>
                                <el-button type="text" style="color: #18c8bd">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </el-card>
        </el-col>
        <!-- 新增项目卡片 -->
        <el-col :span="6">
            <el-card class="add-box-card">
                <div class="add-card-body">
                    <el-button
                        class="no-change-on-hover"
                        type="primary"
                        text
                        :icon="Plus"
                        style="
                            width: 250px;
                            height: 158px;
                            font-size: 70px;
                            padding: 0;
                            background-color: transparent;
                            color: #18c8bd;
                        "
                        @click.prevent="addProjectDialoagVisible = true"
                    >
                        <!-- Plus icon -->
                    </el-button>
                </div>
                <p style="text-align: center; font-size: 15px">点击创建新的事件抽取项目</p>
            </el-card>
        </el-col>
    </el-row>
    <!--新增项目对话框-->
    <el-dialog v-model="addProjectDialoagVisible" title="新建事件抽取项目" width="700" align-center>
        <el-form :model="newProjectForm" label-width="auto" style="max-width: 600px">
            <el-form-item label="项目名称" style="margin-top: 20px">
                <el-input v-model="newProjectForm.project_name" />
            </el-form-item>
            <el-form-item label="事件抽取模板">
                <el-select
                    v-model="newProjectForm.ee_schema"
                    placeholder="请选择事件抽取模板"
                    style="width: 600px"
                >
                    <el-option label="公司上市" value="公司上市" />
                    <el-option label="Zone two" value="beijing" />
                </el-select>
            </el-form-item>
            <el-form-item label="事件抽取用途">
                <el-input
                    v-model="newProjectForm.use"
                    style="width: 600px"
                    :rows="6"
                    type="textarea"
                    placeholder="请输入事件抽取任务用途"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click.prevent="addProjectDialoagVisible = false">取消</el-button>
                <el-button type="primary" @click.prevent="addProject"> 确认 </el-button>
            </div>
        </template>
    </el-dialog>
    <!--分页-->
    <div class="pagination-block">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 36, 48]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalProjects"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
interface Project {
    project_id: number;
    project_name: string;
    event_type: string;
    ee_schema: string;
    ee_model: string;
    ee_progress: string;
    use: string;
}
const projectData = reactive<{
    projectList: Project[];
}>({
    projectList: [
        {
            project_id: 1,
            project_name: '产研院项目01',
            event_type: '公司上市',
            ee_schema: '公司上市（专家推荐）',
            ee_model: 'UIE-base',
            ee_progress: '已完成',
            use: '',
        },
        {
            project_id: 2,
            project_name: '产研院项目02',
            event_type: '公司上市',
            ee_schema: '公司上市（个人创建）',
            ee_model: 'UIE-Finace',
            ee_progress: '进行中',
            use: '',
        },
        {
            project_id: 2,
            project_name: '产研院项目03',
            event_type: '企业中标',
            ee_schema: '企业中标',
            ee_model: 'UIE-Finace',
            ee_progress: '未开始',
            use: '',
        },
        {
            project_id:2,
            project_name: '产研院项目04',
            event_type: '高管变动',
            ee_schema: '高管变动',
            ee_model: 'UIE-base-en',
            ee_progress: '已完成',
            use: '',
        },
        {
            project_id: 3,
            project_name: '产研院项目05',
            event_type: '企业收购',
            ee_schema: '企业收购',
            ee_model: 'UIE-base',
            ee_progress: '已完成',
            use: '',
        },
    ],
});
const addProjectDialoagVisible = ref(false);
const newProjectForm = reactive<Project>({
    project_id: '',
    project_name: '',
    event_type: '',
    ee_schema: '',
    ee_model: '',
    ee_progress: '未开始',
    use: '',
});
const totalProjects = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);

// 分页大小变化时的处理函数
const handleSizeChange = (size: number) => {
    pageSize.value = size;
    //   searchMeetings(currentPage.value, pageSize.value); // 重新加载数据
    currentPage.value = 1;
};
// 分页当前页变化时的处理函数
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    console.log('页' + currentPage.value);
    //   searchMeetings(currentPage.value, pageSize.value); // 重新加载数据
};
//跳转到抽取流程界面
function editProject(project: Project) {
    //跳转时将项目信息存储到localStorage 使用JSON.parse(p).project_name使用
    localStorage.setItem('project', JSON.stringify(project));
    const p = localStorage.getItem('project');
    console.log('存储的项目信息：' + JSON.parse(p).project_name);
    //跳转到事件抽取流程页面
    router.push({ name: 'extraction-process' });
}
//删除已有项目
function deleteProject(project_id: string) {
    ElMessage.success('成功删除一条模板！');
}
//新增事件属性抽取项目
function addProject() {
    addProjectDialoagVisible.value = false;
    ElMessage.success('成功新增一个事件属性抽取项目！');
}
</script>

<style scoped lang="scss">
/* 禁用按钮悬停和点击时的样式变化 */
.no-change-on-hover:hover,
.no-change-on-hover:active {
    background-color: transparent !important; /* 禁止背景色变更 */
    border-color: transparent !important; /* 禁止边框色变更 */
    color: inherit !important; /* 保持文本颜色不变 */
}
.add-box-card {
    transition: background-color 0.3s ease; /* 平滑过渡 */
}
.add-box-card:hover {
    background-color: rgba(0, 0, 0, 0.073); /* 光标悬停时背景变灰 */
}
.add-card-body {
    display: flex;
    align-items: center;
    justify-content: center;
}
.card-body {
    font-size: 14px;
}
.el-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    max-height: 730px; /* 限制最大高度 */
    overflow-y: auto; /* 启用滚动 */
}
.el-row .el-card {
    margin-top: 25px;
    min-width: 100%;
    height: 100%;
    margin-right: 20px;
    margin-left: 10px;
    transition: all 0.5s;
}
.el-card {
    border-radius: 5px;
}
.el-form-item {
    margin-bottom: 20px;
    margin-left: 35px;
}

.box-card {
    .header {
        display: flex; /* 使用 flexbox 布局 */
        align-items: center; /* 垂直居中对齐 */
        position: relative;
        padding-bottom: 5px; /* 增加底部间距，使得分割线不与内容直接接触 */
        border-bottom: 1px solid #d6d8dd; /* 添加分割线 */
        .icon {
            margin-top: 10px;
            padding: 0 15px;
        }
        .header-label {
            font-size: 16px;
            font-weight: 600;
            margin-top: 10px;
        }
        .progress-tag {
            width: 68px;
            height: 30px;
            margin-top: 10px;
            margin-right: 10px;
        }
    }
    .footer {
        font-size: 20px !important;
        background-color: rgb(245, 247, 251);
        display: flex;
        height: 50px;
        justify-content: space-evenly;
    }
    .card-label {
        color: rgb(197, 197, 197);
        margin-right: 8px;
        width: 100px;
        display: inline-block;
        margin-bottom: 5px;
    }
}
.pagination-block {
    position: fixed; /* 设置为固定定位 */
    bottom: 20px; /* 距离底部20px */
    left: 60%; /* 水平居中 */
    transform: translateX(-50%); /* 修正居中位置，使其完全居中 */
}
</style>
