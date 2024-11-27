<template>
    <div class="demo-block1">当前抽取进度</div>
    <div class="demo-block2">退出该页面不会影响抽取进度</div>
    <div class="demo-progress" style="margin-top: 20px; margin-left: 100px; margin-right: 100px;">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="extractProcess" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const extractProcess = ref(0); // 进度值
  
  // 从localStorage获取进度
  const loadProgress = () => {
    const savedProgress = localStorage.getItem('extractProgress');
    if (savedProgress) {
      extractProcess.value = parseInt(savedProgress, 10);
    }
  };
  
  // 保存进度到localStorage
  const saveProgress = () => {
    localStorage.setItem('extractProgress', extractProcess.value.toString());
  };
  
  // 模拟文本抽取过程
  const textExtraction = () => {
    const interval = setInterval(() => {
      if (extractProcess.value < 100) {
        extractProcess.value += 1; // 假设每次抽取增加1%的进度
      } else {
        clearInterval(interval); // 完成后清除定时器
      }
      saveProgress(); // 每次更新进度时保存进度
    }, 500); // 每500毫秒更新一次进度
  };
  
  // 在组件挂载后开始模拟文本抽取并加载进度
  onMounted(() => {
    loadProgress();
    textExtraction();
  });
  
  // 在组件卸载前保存进度
  onBeforeUnmount(() => {
    saveProgress();
  });
  </script>

<style lang="css"> 

.demo-block1 {
  font-size: 25px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.demo-block2 {
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
}

</style>