<template>
    <div
        style="
            width: 82vw;
            border-radius: 10px;
            font-size: 15px;
            background-color: #fff;
            height: 70vh;
        "
    >
        <!--新增按钮和提示文字-->
        <div class="upper-btn-container">
            <el-button style="margin-left: 10px" type="primary" :icon="CirclePlus">新增</el-button>
            <el-icon style="margin-left: 15px"><Warning /></el-icon>
            <span style="margin-left: 5px"
                >当前任务文本事件类型为：
                <span style="color: #f56c6c"
                    ><strong>{{ event_type }}</strong></span
                >
            </span>
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
            <el-table-column align="center" type="selection" width="55" />
            <el-table-column align="center" prop="schema_name" label="模板名称" width="200" />
            <el-table-column align="center" prop="author" label="作者" width="200" sortable />
            <el-table-column align="center" prop="argument_role" label="论元角色" width="700" />
            <el-table-column align="center" fixed="right" label="操作" min-width="120">
                <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        size="large"
                        @click.prevent="manageSchema([scope.row])"
                    >
                        管理
                    </el-button>
                    <el-popconfirm
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        icon-color="#626AEF"
                        title="确定删除此条模板?"
                        @confirm="deleteSchema([scope.row])"
                        @cancel="cancelEvent"
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
import { ElMessage, ElMessageBox } from 'element-plus';
interface Schema {
    schema_name: string;
    author: string;
    argument_role: string;
}
let tableData = reactive<Schema[]>([
    {
        schema_name: '公司上市',
        author: '系统推荐',
        argument_role: '[证券代码,披露时间,事件时间,发行价格,募资金额,市值]',
    },
    {
        schema_name: '公司上市1',
        author: '专家1',
        argument_role:
            '[股票简称,减持部分占所持比例,交易股票数量,披露时间,减持部分占总股本比例,每股交易价格,交易完成事件,交易金额,减持方]',
    },
    {
        schema_name: '上市1',
        author: '专家2',
        argument_role: '[证券代码,公司名称,上市时间,披露时间,发行价格,募资金额,市值]',
    },
    {
        schema_name: '上市2',
        author: '专家2',
        argument_role: '[证券代码,披露时间,事件时间,发行价格,募资金额,交易所名称]',
    },
]);

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
//删除模板
const deleteSchema = (rows: any[]) => {
    ElMessage.success("成功删除一条模板！");
};

// 分页当前页变化时的处理函数
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    console.log('页' + currentPage.value);
    //   searchMeetings(currentPage.value, 10); // 重新加载数据
};
</script>

<style lang="scss" scoped>
.upper-btn-container {
    display: flex;
    margin-left: auto;
    align-items: center;
    height: 5vh;
}
.pagination-block {
    bottom: 75px; /* 距离底部20px */
    margin-right: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
