<template>
    <div class="extract-wait" style="width: 82vw; border-radius: 10px; font-size: 15px; background-color: #fff;height: 70vh;">
        <el-row>
          <el-col :span="8" v-for="(card, index) in cards" :key="index">
            <el-card class="custom-card" style="max-width: 100%; position: relative;">
              <template #header>
                <div class="card-header">
                  <span>{{ card.title }}</span>
                  <el-tag :type="card.statusType">{{ card.status }}</el-tag>
                </div>
              </template>
              <div>
                <div class="model-info">
                  <div>
                    <div class="card-label1">基座模型</div>
                    <span>{{ card.baseModel }}</span>    
                  </div>
                  <div> 
                    <div class="card-label1">模型结构</div>
                    <span>{{ card.modelStructure }}</span>    
                  </div>
                  <div> 
                    <div class="card-label1">模型规模</div>
                    <span>{{ card.modelScale }}</span>   
                  </div> 
                  <div> 
                    <div class="card-label1">适用领域</div>
                    <span>{{ card.applyField }}</span>    
                  </div>
                  <div> 
                    <div class="card-label1">模型语言</div>
                    <span>{{ card.modelLanguage }}</span>    
                  </div>
                </div>
              </div>
              <div class="button-container">
                <el-button class="btn-footer" type="primary" @click="applyModel(index)" :disabled="card.status === '未开通'">应用模型</el-button>
                <el-button class="btn-footer" type="primary" @click="uploadDialogVisible = true" :disabled="card.status === '已开通'">上传模型</el-button>
              </div>
            </el-card>
          </el-col>
    
          <!-- 对话框 -->
          <el-dialog v-model="uploadDialogVisible" title="上传模型 UIE-Finace">
            <el-form class="upload-form">
              <el-form-item label="基座模型">
                <el-input v-model="cards.baseModel" placeholder="请输入基座模型"/>
              </el-form-item>
              <el-form-item label="模型结构">
                <el-input v-model="cards.modelStructure" placeholder="请输入模型结构"/>
              </el-form-item>
              <el-form-item label="模型规模">
                <el-input v-model="cards.modelScale" placeholder="请输入模型规模"/>
              </el-form-item>
              <el-form-item label="适用领域">
                <el-input v-model="cards.applyField" placeholder="请输入适用领域"/>
              </el-form-item>
              <el-form-item label="模型语言">
                <el-select v-model="selectedLanguage" placeholder="请选择模型语言">
                  <el-option
                    v-for="language in languages"
                    :key="language.value"
                    :label="language.label"
                    :value="language.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="模型URL">
                <el-upload
                  action="你的服务器上传URL"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload"
                  :on-error="handleError"
                  :show-file-list="false">
                  <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                </el-upload>
              </el-form-item>
              <!-- 其他表单项 -->
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="uploadDialogVisible = false">取 消</el-button>
              <el-button type="primary" >确 定</el-button>
            </span>
          </el-dialog>
    
          <!-- 新增项目卡片 -->
          <el-col :span="8">
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
                            @click="addModel()"
                        >
                            <!-- Plus icon -->
                        </el-button>
                    </div>
                    <p style="text-align: center; font-size: 15px">点击创建新的事件抽取模型</p>
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
    import {ElMessage} from 'element-plus';
    import { Plus } from '@element-plus/icons-vue';
    // const cards = ref([]);
    
    //自定义的假数据
    const cards = ref([
      { title: 'UIE-Base', baseModel: 'Paddlenlp ERNIE3.0 Base',modelStructure: '12-layers,768-hidden-size,12-heads', modelScale:'449MB', applyField:'医疗、互联网',modelLanguage:'中文', status: '已开通', statusType: 'success' },
      { title: 'UIE-Base-en', baseModel: 'Paddlenlp ERNIE3.0 Health',modelStructure: '12-layers,768-hidden-size,12-heads', modelScale:'449MB', applyField:'医疗、互联网',modelLanguage:'英文', status: '已开通', statusType: 'success' },
      { title: 'UIE-Finace', baseModel: 'UIE-Base',modelStructure: '12-layers,768-hidden-size,12-heads', modelScale:'449MB', applyField:'金融',modelLanguage:'英文', status: '未开通', statusType: 'success' },
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
    
    // 选择的语言
    const selectedLanguage = ref('');
    
    // 语言选项
    const languages = ref([
      { value: 'zh', label: '中文' },
      { value: 'en', label: '英文' },
      // 添加更多语言选项
      { value: 'fr', label: '法文' },
      { value: 'de', label: '德文' },
      { value: 'es', label: '西班牙文' },
      { value: 'ru', label: '俄文' },
      // ... 其他语言 ...
    ]);
    
    // 文件上传成功后的处理函数
    const handleSuccess = (response, file, fileList) => {
      console.log('文件上传成功', response);
      ElMessage.success('模型文件上传成功');
    };
    
    // 上传前的钩子函数
    const beforeUpload = (file) => {
      // 可以在这里进行文件类型或大小的检查
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        ElMessage.error('上传文件大小不能超过 2MB!');
      }
      return isLt2M;
    };
    
    // 上传失败的处理函数
    const handleError = (err, file, fileList) => {
      console.error('文件上传失败', err);
      ElMessage.error('模型文件上传失败');
    };
    
    const applyModel = (index: number) => {
      ElMessage.success(`上传成功 - ${cards.value[index].title}`);
      // EventBus.$emit('updateModel', cards.value[index]);
    };
    
    // 对话框可见性
    const uploadDialogVisible = ref(false);
    
    const uplodeModel = (index: number) => {  
      ElMessage.success(`上传成功 - ${cards.value[index].title}`);
      uploadDialogVisible.value = false;
      // EventBus.$emit('updateModel', cards.value[index]);
    };
    
    const addModel = () => {
      ElMessage.success('创建成功');
      // EventBus.$emit('addModel');
    };
    
    </script>
    
    <style lang="scss" scoped>
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
    }
    
    .item {
      margin: 10px;
    }
    
    .icon-filter {
      font-size: 20px;
      margin-right: 10px;
    }
    
    .upload-form {
      margin: 50px;
    }
    
    .el-card {
      max-width: auto; /* 这可能导致卡片宽度超出其内容宽度，考虑移除或替换为具体宽度值 */
      height: 288px; /* 设置卡片的固定高度 */
      overflow: auto; /* 如果内容超出卡片高度，允许滚动 */
      display: flex;
      flex-direction: column; /* 使卡片内容垂直排列 */
      margin-left: 25px;
      margin-right: 25px;
      margin-top: 20px;
    
    }
    
    .el-card__header {
      flex-shrink: 0; /* 防止头部在卡片缩小时被压缩 */
    }
    
    .el-card__body {
      flex-grow: 1; /* 允许主体部分填充剩余空间 */
      overflow: auto; /* 如果主体内容超出卡片高度，允许滚动 */
    }
    
    .add-card-body {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .card-label1 {
            color: rgb(197, 197, 197);
            width: 63px;
            display: inline-block;
            margin-bottom: 5px;
        }
    
    // .btn-footer {
    //   position: absolute;
    //   bottom: 10px; /* 距离底部的距离 */
    //   right: 10px; /* 距离右侧的距离 */
    // }
    
    .button-container {
      display: flex; /* 使用 Flexbox 布局 */
      justify-content: space-between; /* 按钮之间保持一定的间距 */
      align-items: center; /* 垂直居中对齐按钮 */
      position: absolute;
      bottom: 10px; /* 距离底部的距离 */
      right: 10px; /* 距离右侧的距离 */
    }
    
    .model-info {
      font-size: 14.3px;
    }
    
    
    </style>