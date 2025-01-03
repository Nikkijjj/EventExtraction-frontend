<template>
    <div class="container">
        <div class="card" style="height: 150px;">
            <p class="intro-text">页面介绍：操作库页面</p>
            <p class="intro-text">权限：事件专员</p>
            <p class="intro-text">数据：后台每天批量导入（事件专员）, 手动从数据库导入, 键入（事件专员）</p>
            <p class="intro-text">页面功能：预览待处理数据，从数据库导入文本，点击新建可以新建一条不属于数据库内容的文本，点击批量导入可以导入多条公告到自己的操作库中</p>
        </div>

        <div class="card" style="height: 530px;">
            <div class="header-container">
                <h3>以下是数据库导入的数据</h3>
                <div class="buttons-container">
                    <el-input
                   
                        style="width: 240px"
                        placeholder="输入标题关键词"
                        :prefix-icon="Search"
                        />
                    <el-button type="primary" @click="addNewDialogVisible = true">新建</el-button>
                    <el-button type="success" @click="handleImport">批量导入</el-button>
                    <el-button type="warning" @click="handleDownload">下载</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                border
                :data="pagedData"
                @selection-change="handleSelectionChange"
                row-key="index"
                height="50vh"
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
      <!-- 对话框 -->
      <el-dialog v-model="addNewDialogVisible" title="新建公告">
        <el-form class="upload-form">
          <el-form-item label="公告编号">
            <el-input v-model="newNotice.noticeId" placeholder="请输入公告编号"/>
          </el-form-item>
          <el-form-item label="公告标题">
            <el-input v-model="newNotice.title" placeholder="请输入公告标题"/>
          </el-form-item>
          <el-form-item label="公告内容">
            <el-input type="textarea" v-model="newNotice.content" placeholder="请输入公告内容"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addNewDialogVisible = false">取 消</el-button>
          <el-button type="primary" >添 加</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessageBox, ElMessage }from 'element-plus';

import * as XLSX from 'xlsx';
import { useRouter } from 'vue-router';
import { CirclePlus, Warning,Search } from '@element-plus/icons-vue';


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
    {
        index: 4,
        title: '2023年度业绩预告：实现稳健增长，展望未来机遇',
        content: '在充满挑战与机遇的2023年，公司凭借卓越的团队合作和战略规划，实现了显著的业绩增长。我们的总收入达到了历史新高，这一成绩的取得，得益于我们对市场趋势的敏锐洞察和对客户需求的深刻理解。',
        publishTime: '2024-08-15',
        summary: '业绩预期',
        detailUrl: 'http://example.com/details/1',
    },  
]);

const newNotice = ref({
    noticeId: '',
    title: '',
    content: '',
});

// 分页数据的计算属性
const pagedData = computed(() => {
    const currentPage = 1; // 假设默认显示第一页
    const pageSize = 5;
    const start = (currentPage - 1) * pageSize;
    return tableData.value.slice(start, start + pageSize);
});

const addNewDialogVisible = ref(false);

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

<style lang="css">
.header-container {
    display: flex;
    align-items: center; /* 垂直居中 */
    /* justify-content: space-between;  */
    margin-left: auto;
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

.upload-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin:20px;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
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