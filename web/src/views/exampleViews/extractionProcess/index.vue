<template>
    <div class="stepBar-container">
        <!--步骤条-->
        <el-steps class="stepBar" :active="currentStep">
            <el-step title="抽取数据选择" @click.prevent="currentStep = 0"> </el-step>
            <el-step title="事件抽取模板选择" @click.prevent="currentStep = 1"> </el-step>
            <el-step title="事件抽取模型选择" @click.prevent="currentStep = 2"> </el-step>
            <el-step title="抽取等待" @click.prevent="currentStep = 3"> </el-step>
        </el-steps>
        <el-button
            style="margin-left: 50px"
            type="primary"
            :icon="Search"
            @click.prevent="tipDialogVisible = true"
            >查看提示</el-button
        >
    </div>
    <!--动态展示对应步骤组件-->
    <div class="step-Component">
        <div v-if="currentStep===0">
            <ExtractSample />
        </div>
        <div v-if="currentStep===1">
            <ChooseSchema :status="inProcess"/>
        </div>
        <div v-if="currentStep===2">
            <ModelSelect />
        </div>
        <div v-if="currentStep===3">
            <ExtractWait />
        </div>
    </div>
    <div class="btn-container">
        <el-button
            v-if="currentStep != 0 && currentStep !== 3"
            style="margin-top: 12px"
            @click="preStep"
            class="btn"
            >上一步</el-button
        >
        <el-button
            v-if="currentStep !== 3"
            style="margin-top: 12px"
            @click="saveAndExit"
            class="btn"
            >保存并退出</el-button
        >
        <el-button
            v-if="currentStep !== 3 && currentStep !== 2"
            style="margin-top: 12px"
            @click="nextStep"
            class="btn"
            >下一步</el-button
        >
        <el-button
            v-if="currentStep == 2"
            style="margin-top: 12px"
            @click="startExtraction"
            class="btn"
            >启动抽取</el-button
        >
        <el-button
            v-if="currentStep == 3"
            style="margin-top: 12px"
            @click="exitExtraction"
            class="btn"
            >退出</el-button
        >
        <el-button
            v-if="currentStep == 3"
            style="margin-top: 12px"
            @click="eddExtraction"
            class="btn"
            >终止</el-button
        >
        <el-button
            v-if="currentStep == 3"
            style="margin-top: 12px"
            @click="checkExtraction"
            class="btn"
            >查看</el-button
        >
    </div>

    <el-dialog v-model="tipDialogVisible" title="系统提示" width="800" align-center>
        <div style="padding: 30px; font-size: 16px; line-height: 1.8">
            <p>
                您正在开启一个新的事件抽取任务，该任务共有 <strong>4个必选流程</strong> 和
                <strong>1个可选流程</strong>，分别如下：
            </p>
            <ul style="margin-left: 20px">
                <li><strong>(1)</strong> 抽取数据选择;</li>
                <li><strong>(2)</strong> 事件抽取模板选择;</li>
                <li><strong>(3)</strong> Model选择;</li>
                <li><strong>(4)</strong> 抽取等待;</li>
                <li><strong>(a)</strong> <span style="color: #f56c6c">缺失补全</span>（可选）;</li>
            </ul>
            <p>请您依次选择您的抽取配置。如果没有对应配置，您可以自行创建。</p>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ChooseSchema from './components/chooseSchema.vue';
import ExtractSample from './components/extractSample.vue';
import ExtractWait from './components/extractWait.vue';
import ModelSelect from './components/modelSelect.vue';
import { Search } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentStep = ref(0);
const tipDialogVisible = ref(true);
const inProcess="inProcess";
//步骤条上一步
const preStep = () => {
    if (currentStep.value > 0) currentStep.value--;
};
//步骤条保存并退出
function saveAndExit() {
    //保存所有数据
    //跳转到项目管理页面
    router.push({ name: 'project-manage' });
}
//步骤条下一步
const nextStep = () => {
    if (currentStep.value++ > 3) currentStep.value = 0;
};
//启动抽取 调用组件内函数
function startExtraction() {
    currentStep.value = 3;
}
//退出抽取 调用组件内函数
function exitExtraction() {
    router.push({ name: 'project-manage' });
}
//终止抽取 调用组件内函数
function eddExtraction() {
    //发送请求终止
}
//查看抽取结果 调用组件内函数
function checkExtraction() {
    router.push({ name: 'result-manage' });
}
</script>

<style lang="scss" scoped>
.step-Component {
    display: flex;
    justify-content: center;
    align-items: center;
}
.stepBar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin: 10px;
    margin-bottom: 0px;
    background-color: #ffffff;
    height: 10vh;
}
.stepBar {
    width: 1200px;
    margin-top: 20px;
}
.btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn {
    width: 120px;
    height: 40px;
    font-size: 15px;
    margin-right: 15px;
}
</style>
