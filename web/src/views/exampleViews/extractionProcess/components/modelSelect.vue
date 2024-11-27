<template>
  <div class="extract-wait">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(card, index) in cards" :key="index">
        <el-card class="custom-card" style="max-width: auto; position: relative;">
          <template #header>
            <div class="card-header">
              <span>{{ card.title }}</span>
              <el-tag :type="card.statusType">{{ card.status }}</el-tag>
            </div>
          </template>
          <div class="card-body">
            <p>{{ card.content }}</p>
          </div>
          <el-button class="btn-footer" type="primary" @click="handleButtonClick(index)">应用/上传模型</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>

// import  ElIcon from 'element-plus'
// import { Filter } from '@element-plus/icons-vue'

import { ref, onMounted } from 'vue';
import axios from 'axios';
import {ElMessage}  from 'element-plus';

// const cards = ref([]);

//自定义的假数据
const cards = ref([
  { title: 'UIE-Base', content: '111', status: '已开通', statusType: 'success' },
  { title: 'UIE-Finace', content: '222', status: '已开通', statusType: 'success' },
  { title: '新建模型', content: '333', status: '待开通', statusType: 'warning' }
]);

//从后端获取model数据
// const fetchData = async () => {
//   try {
//     const response = await axios.get('后端API地址');
//     cards.value = response.data.map((cardData) => ({
//       title: cardData.title,
//       content: cardData.content,
//       status: cardData.status === true ? '已开通' : '待开通', // 将布尔值转换为字符串描述
//       statusType: cardData.status === true ? 'success' : 'warning' // 根据布尔值设置状态类型
//     }));
//   } catch (error) {
//     console.error('获取数据失败:', error);
//   }
// };

// onMounted(fetchData);

const handleButtonClick = (index: number) => {
  ElMessage.success(`上传成功 - ${cards.value[index].title}`);
};

</script>

<style lang="css">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.extract-wait {
  padding: 20px;
}

.item {
  margin: 10px;
}

.icon-filter {
  font-size: 20px;
  margin-right: 10px;
}

.el-card {
  max-width: auto; /* 这可能导致卡片宽度超出其内容宽度，考虑移除或替换为具体宽度值 */
  height: 300px; /* 设置卡片的固定高度 */
  overflow: auto; /* 如果内容超出卡片高度，允许滚动 */
  display: flex;
  flex-direction: column; /* 使卡片内容垂直排列 */
}

.el-card__header {
  flex-shrink: 0; /* 防止头部在卡片缩小时被压缩 */
}

.el-card__body {
  flex-grow: 1; /* 允许主体部分填充剩余空间 */
  overflow: auto; /* 如果主体内容超出卡片高度，允许滚动 */
}

.btn-footer {
  position: absolute;
  bottom: 10px; /* 距离底部的距离 */
  right: 10px; /* 距离右侧的距离 */
}

</style>