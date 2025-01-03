<template>
  <div class="container1">
  <!-- 时间筛选框 -->
  <div class="time-filter">
    <el-select v-model="selectedTimePeriod" @change="handleTimePeriodChange" placeholder="请按时间筛选样本">
      <el-option
        v-for="item in timePeriods"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>

  <main class="content1">
    <div class="chart1">
      <div class="wordcloud-container1">
        <h2 class="wordcloud-title">评论词云</h2>
        <div id="wordcloud"></div>
      </div>
      <div class="echart-container1">
        <h2 class="echart-title">热词数据</h2>
        <div id="mychart" :style="myChartStyle"></div>
      </div>
    </div>
  </main>

  <h2 class="table-title">热词来源展示</h2>

<!-- 表格 -->
<el-table :data="paginatedData" style="width: 100%">
    <el-table-column prop="keyword" label="热词" width="180">
    </el-table-column>
    <el-table-column prop="sources" label="样本来源">
      <template #default="scope">
        {{ scope.row.sources.join(', ') }}
      </template>
    </el-table-column>
  </el-table>
<div class="pagination-container">
  <!-- 分页 -->
  <el-pagination
    @current-change="handlePageChange"
    :current-page="currentPage"
    :page-size="pageSize"
    layout="total, prev, pager, next"
    :total="hotWords.length">
  </el-pagination>
</div>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import axios from 'axios';
import ElementPlus, { ElMessage } from 'element-plus';
import { ElSelect, ElOption, ElTable, ElTableColumn, ElPagination } from 'element-plus';

export default defineComponent({
components: {
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
  ElPagination
},
setup() {
  const selectedTimePeriod = ref<string>('');
  // const xData = ref<string[]>([]);
  // const yData = ref<number[]>([]);
  // const wordCloudData = ref<{ name: string; value: number }[]>([]);
  // const myChartStyle = ref<{ float: string; width: string; height: string }>({ float: 'left', width: '600px', height: '340px' });
  // const postSummary = ref<string>('');

  const timePeriods = ref([
    { value: 'last3Days', label: '最近三天' },
    { value: 'lastMonth', label: '最近一个月' },
    { value: 'last6Months', label: '最近半年' },
    { value: 'lastYear', label: '最近一年' }
  ]);

   //假设的热词数据
   const hotWords = ref([
    { keyword: '股市', sources: ['新浪财经', '腾讯财经'] },
    { keyword: '投资', sources: ['东方财富网', '雪球'] },
    { keyword: '交易', sources: ['和讯网', '金融界'] },
    { keyword: '大盘', sources: ['证券之星', '中金在线'] },
    { keyword: '指数', sources: ['上海证券报', '中国证券网'] },
    { keyword: '涨跌', sources: ['同花顺', '大智慧'] },
    { keyword: '蓝筹股', sources: ['搜狐财经', '网易财经'] },
    { keyword: '成长股', sources: ['财经网', '华尔街见闻'] },
    { keyword: '风险', sources: ['第一财经', '界面新闻'] },
    { keyword: '收益', sources: ['澎湃新闻', '经济观察网'] },
    // ... 其他热词数据
  ]);
  // const hotWords = ref([]);

  const currentPage = ref(1);
  const pageSize = 5;

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return hotWords.value.slice(start, end);
  });

  const handlePageChange = (page: number) => {
    currentPage.value = page;
  };


  // 假设的词云数据
  const wordCloudData = ref<{ name: string; value: number }[]>([
    { name: '股市', value: 100 },
    { name: '投资', value: 95 },
    { name: '交易', value: 90 },
    { name: '大盘', value: 85 },
    { name: '指数', value: 80 },
    { name: '涨跌', value: 75 },
    { name: '蓝筹股', value: 70 },
    { name: '成长股', value: 65 },
    { name: '风险', value: 60 },
    { name: '收益', value: 55 }
  ]);
  const myChartStyle = ref<{ float: string; width: string; height: string }>({
    float: 'left', // 确保值是字符串，所以需要引号
    width: '600px',
    height: '340px'
  });
  const postSummary = ref<string>('');

  // const handleTimePeriodChange = () => {
  //   fetchDataForSelectedPeriod();
  // };

  // const fetchDataForSelectedPeriod = async () => {
  //   try {
  //     const response = await axios.get('/api/data');
  //     console.log("响应数据"+response.data);
  //     const { sentimentData, wordCloudData: wordCloudResponse } = response.data;
  //     xData.value = sentimentData.map(item => item.name);
  //     yData.value = sentimentData.map(item => item.value);
  //     wordCloudData.value = wordCloudResponse.map(item => ({ name: item.name, value: item.value }));
  //     postSummary.value = response.data.postSummary;
  //     initEcharts();
  //     initWordCloud();
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };


  // const fetchDatahotWords = async () => {
  //   try {
  //     const response = await axios.get('/api/data');
  //     console.log("响应数据"+response.data);
  //     const { sentimentData, wordCloudData: wordCloudResponse } = response.data;
  //     xData.value = sentimentData.map(item => item.name);
  //     yData.value = sentimentData.map(item => item.value);
  //     wordCloudData.value = wordCloudResponse.map(item => ({ name: item.name, value: item.value }));
  //     postSummary.value = response.data.postSummary;
  //     initEcharts();
  //     initWordCloud();
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  let myChart; // 定义为全局变量，避免重复初始化

  const initEcharts = () => {
    myChart = echarts.init(document.getElementById('mychart')!);
    myChart.setOption({
      xAxis: { data: xData.value },
      yAxis: {},
      tooltip: { trigger: 'item', formatter: (params) => `${params.name}: ${params.value}` },
      series: [{ type: 'bar', data: yData.value.map((value, index) => ({ value, name: xData.value[index], itemStyle: { color: getColor(index) } })) }]
    });
    window.addEventListener('resize', () => myChart.resize());
  };

  const getColor = (index: number): string => {
    const colors = ['#ff5722', '#4caf50', '#ffc107', '#f44336', '#9c27b0', '#3f51b5', '#00bcd4'];
    return colors[index % colors.length];
  };

  // 假设的情感分析数据
  const xData = ref<string[]>(['平和', '生气', '疑惑', '期待', '开心', '失望', '惊讶']);
  const yData = ref([
  { value: 0.30, name: '平和', itemStyle: { color: getColor(0) } },
  { value: 0.25, name: '生气', itemStyle: { color: getColor(1) } },
  { value: 0.16, name: '疑惑', itemStyle: { color: getColor(2) } },
  { value: 0.14, name: '期待', itemStyle: { color: getColor(3) } },
  { value: 0.15, name: '开心', itemStyle: { color: getColor(4) } },
  { value: 0.08, name: '失望', itemStyle: { color: getColor(5) } },
  { value: 0.02, name: '惊讶', itemStyle: { color: getColor(6) } }
  ]);


  const updateEchartsData = (keyword) => {
    // 假设你有一个方法可以根据关键词获取情绪统计数据
    // 这里我们用一个假设的数据结构来模拟
    const emotionData = {
        "股市": { "平和": 0.15, "生气": 0.25, "疑惑": 0.35, "期待": 0.1, "开心": 0.1, "失望": 0.05, "惊讶": 0.0 },
        "投资": { "平和": 0.25, "生气": 0.15, "疑惑": 0.25, "期待": 0.15, "开心": 0.15, "失望": 0.05, "惊讶": 0.0 },
        "交易": { "平和": 0.3, "生气": 0.25, "疑惑": 0.2, "期待": 0.1, "开心": 0.1, "失望": 0.05, "惊讶": 0.0 },
        "大盘": { "平和": 0.2, "生气": 0.25, "疑惑": 0.3, "期待": 0.1, "开心": 0.1, "失望": 0.05, "惊讶": 0.0 },
        "指数": { "平和": 0.15, "生气": 0.3, "疑惑": 0.25, "期待": 0.15, "开心": 0.1, "失望": 0.05, "惊讶": 0.0 },
        "涨跌": { "平和": 0.1, "生气": 0.3, "疑惑": 0.25, "期待": 0.15, "开心": 0.15, "失望": 0.05, "惊讶": 0.0 },
        "蓝筹股": { "平和": 0.2, "生气": 0.15, "疑惑": 0.3, "期待": 0.1, "开心": 0.2, "失望": 0.05, "惊讶": 0.0 },
        "成长股": { "平和": 0.15, "生气": 0.25, "疑惑": 0.2, "期待": 0.25, "开心": 0.1, "失望": 0.05, "惊讶": 0.0 },
        "风险": { "平和": 0.1, "生气": 0.25, "疑惑": 0.35, "期待": 0.1, "开心": 0.15, "失望": 0.05, "惊讶": 0.0 },
        "收益": { "平和": 0.15, "生气": 0.2, "疑惑": 0.25, "期待": 0.25, "开心": 0.1, "失望": 0.05, "惊讶": 0.0 }
      // ... 其他热词的情绪数据
    };

    // 获取点击的热词的情绪数据
    // 获取点击的热词的情绪数据
    const data = emotionData[keyword];
    if (data) {
      xData.value = Object.keys(data);
      yData.value = Object.values(data).map((value, index) => ({
        value,
        name: xData.value[index],
        itemStyle: { color: getColor(index) } // 为每个数据点分配颜色
      }));
      myChart.setOption({
        xAxis: { data: xData.value },
        series: [{ data: yData.value }]
      });
    }
  };

  let mychart; // 定义为全局变量，避免重复初始化

  const initWordCloud = () => {
    mychart = echarts.init(document.getElementById('wordcloud')!);
    mychart.setOption({
      tooltip: { show: true, formatter: (params) => `${params.name}: ${params.value}` },
      series: [{
        type: 'wordCloud', shape: 'circle', keepAspect: false, left: 'center', top: 'center', width: '70%', height: '80%',
        sizeRange: [12, 60], rotationRange: [-90, 90], rotationStep: 45, gridSize: 8, drawOutOfBound: false, layoutAnimation: true,
        textStyle: { fontFamily: 'sans-serif', fontWeight: 'bold', color: () => `rgb(${[Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',')})` },
        emphasis: { focus: 'self', textStyle: { textShadowBlur: 10, textShadowColor: '#333' } },
        data: wordCloudData.value,
      }]
    });

    mychart.on('click', function (params) {
      if (params.componentType === 'series') {
        // 确保点击的对象是 series（即词云图中的一个词）
        ElMessage.success(`点击了 ${params.name}`);
        updateEchartsData(params.name);
      }
    });
  };

  onMounted(() => {
    // fetchDatahotWords();
    initEcharts();
    initWordCloud();
  });

  return {
    selectedTimePeriod,
    xData,
    yData,
    wordCloudData,
    myChartStyle,
    postSummary,
    // handleTimePeriodChange,
    timePeriods,
    hotWords,
    currentPage,
    pageSize,
    paginatedData,
    handlePageChange,
    initEcharts,
    initWordCloud,
    updateEchartsData
  };
}
});
</script>

<style>
.container1 {
font-family: Arial, sans-serif;
margin: 0;
padding: 0;
margin-left: 10px;
margin-right: 10px;
}

.time-filter {
margin: 20px;
margin-left: 5px;
width: 400px;
display: flex;
justify-content: space-between;
}

.time-filter select {
padding: 5px;
font-size: 16px;
}

#wordcloud {
height: 300px;
width: 600px;
margin-right: 0;
margin-left: auto;
float: right;
}

.wordcloud-container1 {
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
margin-top: 20px;
margin-right: 10px;
}

.wordcloud-title {
margin-right: 20px;
}

.echart-container1 {
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
margin-top: 20px;
margin-right: 10px;
}

.echart-title {
margin-right: 20px;
}

.chart1 {
display: flex;
justify-content: space-between;
align-items: flex-start;
margin-top: 20px;
}

.table-title {
text-align: center; /* 文本居中 */
margin: 20px 0; /* 上下边距 */
}

.pagination-container {
display: flex;
justify-content: center;
margin-top: 20px; /* 根据需要调整 */
}
</style>