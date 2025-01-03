<template>
    <div class="main-container">
        <!--新增按钮和提示文字-->
        <div class="upper-btn-container">
            <el-button
                style="margin-left: 10px"
                type="primary"
                :icon="CirclePlus"
                @click.prevent="addSchema"
                >新增</el-button
            >
            <div v-if="status === 'inProcess'">
                <el-icon style="margin-left: 15px"><Warning /></el-icon>
                <span style="margin-left: 5px">
                    当前任务文本事件类型为：
                    <span style="color: #f56c6c">
                        <strong>{{ event_type }}</strong>
                    </span>
                </span>
            </div>
        </div>
        <!--表格-->
        <el-table
            border
            :data="tableData"
            height="60vh"
            class="table"
            style="width: 82vw; border-radius: 10px; font-size: 15px"
            :header-cell-style="headerCellStyle"
            @selection-change="handleSelectionChange"
        >
            <el-table-column v-if="status === 'inProcess'" align="center" type="selection" width="55" />
            <el-table-column align="center" prop="schema_id" label="编号" width="80" />
            <el-table-column align="center" prop="schema_name" label="模板名称" width="150" />
            <el-table-column align="center" prop="author" label="作者" width="150" sortable />
            <el-table-column align="center" prop="event_type" label="事件类型" width="200" sortable />
            <el-table-column align="center" prop="event_Elements" label="论元角色" width="600" />
            <el-table-column align="center" fixed="right" label="操作" min-width="120">
                <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        size="large"
                        @click.prevent="manageSchema([scope.row])"
                    >
                        修改
                    </el-button>
                    <el-popconfirm
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        icon-color="#626AEF"
                        title="确定删除此条模板?"
                        @confirm="deleteSchema([scope.row])"
                    >
                        <template #reference>
                            <el-button link type="danger" size="large">刪除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination-block">
            <el-pagination
                v-model:current-page="currentPage"
                layout="prev, pager, next"
                :total="totalSchemas"
                @current-change="handleCurrentChange"
                size="large"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { CirclePlus, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
interface Schema {
    schema_id: number;
    schema_name: string;
    author: string;
    event_type:string;
    event_Elements: string;
}
let tableData = reactive<Schema[]>([
    {
        schema_id: 1,
        schema_name: '公司上市',
        author: '系统推荐',
        event_type:'公司上市',
        event_Elements: '[证券代码,披露时间,事件时间,发行价格,募资金额,市值]',
    },
    {
        schema_id: 2,
        schema_name: '公司上市1',
        author: '专家1',
        event_type:'公司上市1',
        event_Elements:
            '[股票简称,减持部分占所持比例,交易股票数量,披露时间,减持部分占总股本比例,每股交易价格,交易完成事件,交易金额,减持方]',
    },
    {
        schema_id: 3,
        schema_name: '上市1',
        author: '专家2',
        event_type:'上市1',
        event_Elements: '[证券代码,公司名称,上市时间,披露时间,发行价格,募资金额,市值]',
    },
    {
        schema_id: 4,
        schema_name: '上市2',
        author: '专家2',
        event_type:'上市2',
        event_Elements: '[证券代码,披露时间,事件时间,发行价格,募资金额,交易所名称]',
    },
]);
// 使用 `defineProps` 接收 `props`
const props = defineProps<{
    status: string;
}>();

// 你可以直接解构 `props` 来使用
const { status } = props;
const event_type = ref('公司上市');
const totalSchemas = ref(0);
const currentPage = ref(1);
// 表头单元格样式
const headerCellStyle = (column: any) => {
    return {
        fontWeight: 'bold', // 设置字体加粗
        fontSize: '15px', // 设置字体大小
        textAlign: 'center', // 设置文本居中
        lineHeight: '15px',
    };
};
// 行选择变更时的处理函数
const handleSelectionChange = (selection: any[]) => {
    // selectedRows.value = selection;
    // console.log('选中的行:', selectedRows.value);
};
//新增模板
function addSchema() {
    //跳转到新增模板页面
    router.push({ name: 'schema-create', query: { mode: 'create' } });
}
//编辑模板
const manageSchema = (row: Schema) => {
    //跳转到编辑模板页面（路由传参）
    router.push({ name: 'schema-create', query: { mode: 'edit', id: row.schema_id } });
};
//删除模板
const deleteSchema = (rows: Schema[]) => {
    ElMessage.success('成功删除一条模板！');
};

// 分页当前页变化时的处理函数
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    console.log('页' + currentPage.value);
    //   searchMeetings(currentPage.value, 10); // 重新加载数据
};
</script>

<style lang="scss" scoped>
.main-container {
    width: calc(100% - 20px); /* 总宽度减去左右 10px 间距 */
    border-radius: 5px;
    font-size: 15px;
    background-color: #fff;
    height: auto;
    margin: 10px;
    margin-bottom: 0px;
}
.upper-btn-container {
    display: flex;
    margin-right: auto;
    align-items: center;
    height: 5vh;
    width: 100%; /* 确保 header 容器占满整个父容器 */
}
.pagination-block {
    bottom: 75px; /* 距离底部20px */
    margin-right: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
