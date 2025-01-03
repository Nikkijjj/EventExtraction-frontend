<template>
    <div class="main-container"
    >
        <div class="header-container">
            <el-button style="margin-left: 10px" type="primary" :icon="CirclePlus">新增</el-button>
            <el-icon style="margin-left: 15px"><Warning /></el-icon>
            <span style="margin-left: 5px"
                >当前任务文本事件类型为：
                <span style="color: #f56c6c"
                    ><strong>{{ taskType }}</strong></span
                >
            </span>
            <div class="buttons-container">
                <el-button type="primary" @click="handleCreate">从操作库导入</el-button>
                <el-button type="success" @click="handleImport">批量导入</el-button>
                <el-button type="warning" @click="handleDownload">下载</el-button>
            </div>
        </div>
        <div class="table-container">
            <el-table
                ref="multipleTable"
                border
                :data="pagedData"
                @selection-change="handleSelectionChange"
                row-key="index"
                height="60vh"
                class="table"
                style="width: 82vw; border-radius: 10px; font-size: 15px"
                :header-cell-style="headerCellStyle"
            >
                <el-table-column type="selection" align="center" width="55" />
                <el-table-column
                    type="index"
                    align="center"
                    label="公告编号"
                    width="90"
                    fixed="left"
                />
                <el-table-column
                    label="标题"
                    show-overflow-tooltip
                    align="center"
                    prop="title"
                    width="200"
                />
                <el-table-column
                    label="内容"
                    show-overflow-tooltip
                    align="center"
                    prop="content"
                    width="600"
                />
                <el-table-column
                    label="发布时间"
                    show-overflow-tooltip
                    align="center"
                    prop="publishTime"
                    width="120"
                />
                <el-table-column
                    label="公告简介"
                    show-overflow-tooltip
                    align="center"
                    prop="summary"
                    width="200"
                />
                <el-table-column
                    label="操作"
                    width="130"
                    fixed="right"
                    class-name="small-padding fixed-width"
                    align="center"
                >
                    <template #default="scope">
                        <el-button
                            link
                            type="primary"
                            size="large"
                            @click="handleDetails(scope.row)"
                        >
                            查看
                        </el-button>
                        <el-button
                            link
                            size="large"
                            type="danger"
                            @click="handleDelete([scope.row])"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                layout="prev, pager, next"
                class="pagination-container"
                :total="tableData.length"
                :page-size="10"
                @current-change="handlePageChange"
                size="large"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessageBox, ElMessage }from 'element-plus';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useRouter } from 'vue-router';
import { CirclePlus, Warning } from '@element-plus/icons-vue';

// 定义响应式数据
const taskType = ref('');
// 定义一个响应式数据用于存储选中的行
const selectedRows = ref([]);
const router = useRouter();
// const tableData = ref([]);
const tableData = ref([
    {
        index: 1,
        title: '“谷子经济”突然火了！券商看好千亿市场规模增长空间',
        content:
            '“谷子”来自二次元文化，指的是漫画、动画、游戏等IP周边商品，比如徽章、卡片、挂件等，其是“Goods”的音译。最近市场中“谷子经济”概念股火热，多只个股出现连板现象。',
        publishTime: '2024-05-20',
        summary:
            'Z世代年轻人的“谷子经济”最近成为投资市场的新风口。“谷子”来自二次元文化，指的是漫画、动画、游戏等IP周边商品，比如徽章、卡片、挂件等，其是“Goods”的音译。最近市场中“谷子经济”概念股火热，多只个股出现连板现象。',
        detailUrl: 'https://finance.eastmoney.com/a/202411253250071411.html',
    },
    {
        index: 2,
        title: '新产品发布',
        content: '公司发布新产品的详细介绍。',
        publishTime: '2024-06-15',
        summary: '产品创新',
        detailUrl: 'http://example.com/details/1',
    },
    {
        index: 3,
        title: '年度财报',
        content: '公司年度财务报告摘要。',
        publishTime: '2024-07-30',
        summary: '财务稳健',
        detailUrl: 'http://example.com/details/1',
    },
]);

// 分页数据的计算属性
const pagedData = computed(() => {
    const currentPage = 1; // 假设默认显示第一页
    const pageSize = 5;
    const start = (currentPage - 1) * pageSize;
    return tableData.value.slice(start, start + pageSize);
});

// 行选择变更时的处理函数
const handleSelectionChange = (selection: any[]) => {
    selectedRows.value = selection;
    console.log('选中的行:', selectedRows.value);
};

// 分页改变时的处理函数
const handlePageChange = (page: number) => {
    ElMessage.success(`当前第${page}页`);
};

// 从后端获取数据
const fetchData = async () => {
    try {
        // 假设后端接口返回的数据格式如下
        // const response = await fetch('后端接口URL');
        // const data = await response.json();
        // taskType.value = data.taskType;
        // tableData.value = data.tableData;
        taskType.value = '公司上市';
    } catch (error) {
        console.error('获取数据失败:', error);
    }
};

onMounted(fetchData);

//查看详情
const handleDetails = (row: any[]) => {
    if (row.detailUrl) {
        window.open(row.detailUrl, '_blank');
    } else {
        console.log('row.detailUrl:' + row.detailUrl);
        ElMessage.error('详情页面 URL 不可用');
    }
};

const handleDelete = (rows: any[]) => {
    ElMessageBox.confirm(`是否确定要删除选中的${rows.length}条数据？`, '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            // 用户点击确定，执行删除操作
            tableData.value = tableData.value.filter((row) => !rows.includes(row)); // 从tableData中删除选中的行
            selectedRows.value = []; // 清空选中的行
            ElMessage.success(`删除${rows.length}条数据成功`);
        })
        .catch(() => {
            // 用户点击取消，取消操作
            ElMessage.info('删除已取消');
        });
};

// 下载表格内容的方法
const handleDownload = () => {
    ElMessageBox.confirm('是否确定要下载当前表格内容为Excel文件？', '下载确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            // 用户点击确定，执行下载操作
            const data = tableData.value; // 获取表格数据
            const worksheet = XLSX.utils.json_to_sheet(data); // 将数据转换为工作表
            const workbook = XLSX.utils.book_new(); // 创建一个新的工作簿
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // 将工作表添加到工作簿
            XLSX.writeFile(workbook, 'tableData.xlsx'); // 保存工作簿为Excel文件
            ElMessage.success('下载成功');
        })
        .catch(() => {
            // 用户点击取消，取消操作
            ElMessage.info('下载已取消');
        });
};

// 导入操作库的方法
const handleCreate = () => {
    ElMessage.success('从操作库导入');
    // 在这里添加从操作库导入数据的逻辑
    // 例如打开一个文件选择对话框，用户选择要导入的文件
    // 然后解析文件内容，将数据添加到tableData中
};

// 批量导入的方法
const handleImport = () => {
    ElMessage.success('批量导入');
    // 在这里添加批量导入数据的逻辑
    // 例如打开一个文件选择对话框，用户选择要导入的文件
    // 然后解析文件内容，将数据添加到tableData中
};
// 表头单元格样式
const headerCellStyle = (column: any) => {
    return {
        fontWeight: 'bold', // 设置字体加粗
        fontSize: '15px', // 设置字体大小
        textAlign: 'center', // 设置文本居中
        lineHeight: '15px',
    };
};
</script>

<style lang="css" scoped>
.main-container {
    width: calc(100% - 20px);  /* 总宽度减去左右 10px 间距 */
    border-radius: 5px;
    font-size: 15px;
    background-color: #fff;
    height: 70vh;
    margin: 10px;
    margin-bottom: 0px;
}
.header-container {
    display: flex;
    align-items: center; /* 垂直居中 */
    /* justify-content: space-between;  */
    margin-right: auto;
    width: 100%; /* 确保 header 容器占满整个父容器 */
    height: 5vh;
}

.buttons-container {
    display: flex;
    gap: 10px; /* 按钮之间的间隔 */
    justify-content: flex-end; /* 将按钮排列到容器的右侧 */
    flex-grow: 1; /* 让按钮容器占据剩余的空间 */
    margin-right: 10px;
}

.pagination-container {
    bottom: 75px; /* 距离底部20px */
    margin-right: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
