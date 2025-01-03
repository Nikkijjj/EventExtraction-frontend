<template>
  <div class="container">
          <!-- 表格容器 -->
      <div class="table-container">
          <h3 class="table-title">热点事件推荐</h3>
          <el-table :data="tableData" @row-click="handleRowClick" style="height: 720px;">
              <el-table-column prop="rank" label="Rank" width="60"></el-table-column>
              <el-table-column prop="event" label="Event" width="300"></el-table-column>
          </el-table>
      </div>

  <main class="content">
    <div class="chart">
      <div class="wordcloud-container">
        <h3 class="wordcloud-title">{{ wordCloudTitle }}</h3>
        <div id="wordcloud"></div>
      </div>
      <!-- <div class="echart-container">
        <h3 class="echart-title">{{ chartTitle }}</h3>
        <div id="mychart" :style="myChartStyle"></div>
      </div> -->
      <div class="summary-container">
        <h3 class="summary-title">{{ summaryTitle }}</h3>
        <p class="summary-content">{{ postSummary }}</p>
      </div>
    </div>
  </main>

</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import axios from 'axios';
import ElementPlus, { ElMessage } from 'element-plus';
import { ElSelect, ElOption, ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { pa } from 'element-plus/es/locales.mjs';

export default defineComponent({
components: {
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
  ElPagination
},
setup() {
  const selectedEvent = ref<string>('');
  const selectRank = ref<number>(1);
  const selectedTimePeriod = ref<string>('');
  // const xData = ref<string[]>([]);
  // const yData = ref<number[]>([]);
  // const wordCloudData = ref<{ name: string; value: number }[]>([]);
  // const myChartStyle = ref<{ float: string; width: string; height: string }>({ float: 'left', width: '600px', height: '340px' });
  // const postSummary = ref<string>('');

  const tableData = ref([]);

  const wordCloudTitle = ref<string>('评论词云');
  const summaryTitle = ref<string>('事件摘要');

  // 假设的情感分析数据
  // const xData = ref<string[]>(['平和', '生气', '疑惑', '期待', '开心', '失望', '惊讶']);
  // const yData = ref<number[]>([0.30, 0.25, 0.16, 0.14, 0.15, 0.08, 0.02]);

  // 假设的词云数据
  // const wordCloudData = ref<{ name: string; value: number }[]>([
  //   { name: '股市', value: 100 },
  //   { name: '投资', value: 95 },
  //   { name: '交易', value: 90 },
  //   { name: '大盘', value: 85 },
  //   { name: '指数', value: 80 },
  //   { name: '涨跌', value: 75 },
  //   { name: '蓝筹股', value: 70 },
  //   { name: '成长股', value: 65 },
  //   { name: '风险', value: 60 },
  //   { name: '收益', value: 55 }
  // ]);
  const wordCloudData = ref<{ name: string; value: number }[]>([]);
  const myChartStyle = ref<{ float: string; width: string; height: string }>({
    float: 'left', // 确保值是字符串，所以需要引号
    width: '800px',
    height: '340px'
  });

  //ai生成的摘要
  const postSummary = ref<string>('这是后端AI生成的事件摘要，请注意辨别真伪。');

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get('/api/data');
  //     const { sentimentData, wordCloudData: wordCloudResponse } = response.data;
  //     xData.value = sentimentData.map(item => item.name);
  //     yData.value = sentimentData.map(item => item.value);
  //     wordCloudData.value = wordCloudResponse;
  //     postSummary.value = response.data.postSummary;
  //     initEcharts();
  //     initWordCloud();
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const fetchWordCloudData = async (selectRank: number) => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/get_keywords', { params: { rank: selectRank } });
      const { wordCloudData: wordCloudResponse } = response.data;
      wordCloudData.value = wordCloudResponse;
      console.log("词云数据返回"+wordCloudData.value);
      initWordCloud();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataForEvent = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/ranking');
      const data = response.data;
      tableData.value = data.map((item, index) => ({
        rank: index + 1,
        event: item.title
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRowClick = (row: any) => {
    selectedEvent.value = row.event;
    selectRank.value = row.rank;
    fetchWordCloudData(selectRank.value);
    ElMessage.success(`排名 :${row.rank} `);
    // fetchDataForEvent(row.event);
    wordCloudTitle.value = `${row.event}-评论词云`; // 更新 wordCloudTitle 的值
    // chartTitle.value = `${row.event}-热词数据`; // 更新 chartTitle 的值
    summaryTitle.value = `${row.event}-事件摘要`; // 更新 summaryTitle 的值

    ElMessage.success(`已选择事件：${row.event}`);
  };

  // const initEcharts = () => {
  //   const myChart = echarts.init(document.getElementById('mychart')!);
  //   myChart.setOption({
  //     xAxis: { data: xData.value },
  //     yAxis: {},
  //     tooltip: { trigger: 'item', formatter: (params) => `${params.name}: ${params.value}` },
  //     series: [{ type: 'bar', data: yData.value.map((value, index) => ({ value, name: xData.value[index], itemStyle: { color: getColor(index) } })) }]
  //   });
  //   window.addEventListener('resize', () => myChart.resize());
  // };

  // const getColor = (index: number): string => {
  //   const colors = ['#ff5722', '#4caf50', '#ffc107', '#f44336', '#9c27b0', '#3f51b5', '#00bcd4'];
  //   return colors[index % colors.length];
  // };

  const initWordCloud = () => {
    const mychart = echarts.init(document.getElementById('wordcloud')!);
    mychart.setOption({
      tooltip: { show: true, formatter: (params) => `${params.name}: ${params.value}` },
      series: [{
        type: 'wordCloud', shape: 'circle', keepAspect: false, left: 'center', top: 'center', width: '70%', height: '80%',
        sizeRange: [12, 60], rotationRange: [-90, 90], rotationStep: 45, gridSize: 8, drawOutOfBound: false, layoutAnimation: true,
        textStyle: { fontFamily: 'sans-serif', fontWeight: 'bold', color: () => `rgb(${[Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',')})` },
        emphasis: { focus: 'self', textStyle: { textShadowBlur: 10, textShadowColor: '#333' } },
        data: wordCloudData.value
      }]
    });
  };

  onMounted(() => {
    // fetchData();
    // initEcharts();
    initWordCloud();
    fetchDataForEvent();
    fetchWordCloudData(selectRank.value);
  });

  return {
    selectedTimePeriod,
    selectRank,
    // xData,
    // yData,
    wordCloudData,
    myChartStyle,
    postSummary,
    summaryTitle,
    tableData,
    wordCloudTitle,
    // chartTitle,
    selectedEvent,
    handleRowClick,
    fetchDataForEvent,
    fetchWordCloudData
  };
}
});
</script>

<style>
.container {
font-family: Arial, sans-serif;
margin: 0;
padding: 0;
display: flex; /* 启用Flexbox布局 */
flex-direction: row; /* 水平排列子元素 */
}

.table-container {
margin: 20px;
margin-right: 50px;
font-size: 16px;
}

.table-title {
text-align: center; /* 文本居中 */
margin: 10px 5px; /* 上下边距 */
}

.chart {
display: flex;
flex-direction: column; /* 子元素垂直排列 */
align-items: flex-start; /* 子元素在交叉轴上靠左对齐 */
gap: 50px; /* 子元素之间的间隔 */
margin-top: 20px;
width: auto;
}

#wordcloud {
height: 300px;
width: 800px;
margin-right: 10px; /* 确保词云不会贴紧容器边缘 */
}

.wordcloud-container {
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
margin-top: 20px;
margin-right: 20px;
}

#mychart {
height: 300px;
width: 800px;
margin-right: 10px;
}

.echart-container {
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
margin-top: 20px;
margin-right: 20px;
}


.echart-title {
margin-right: 20px;
}

.summary-container {
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
margin-top: 20px;
margin-right: 20px;
}

.summary-title {
margin-right: 20px;
}

.summary-content {
border: 1px solid #ccc;
  padding: 10px;
  background-color: #ffffff;
  width: 700px;
  height: 250px;
  overflow: auto;
  word-wrap: break-word;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
}

.content {
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
margin-top: 20px;
margin-right: 20px;
}

.el-pagination {
display: flex;
justify-content: center;
margin-top: 20px;
}
</style>