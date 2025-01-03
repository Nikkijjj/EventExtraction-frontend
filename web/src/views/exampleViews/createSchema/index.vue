<template>
    <div class="main-container">
        <div class="header">
            <!-- 返回按钮 -->
            <el-button
                class="back-button"
                @click="goBack"
                type="primary"
                plain
                style="margin: 10px; margin-bottom: 0px"
                >返回</el-button
            >
        </div>
        <div class="example-container">
            <el-row>
                <el-col :span="12">
                    <div class="example">
                        <ExampleText />
                    </div>
                </el-col>
                <el-divider
                    direction="vertical"
                    style="height: auto; margin-top: 10px; margin-bottom: 10px"
                />
                <el-col :span="11">
                    <div class="operation-container">
                        <!-- 步骤条 -->
                        <div class="stepBarWrapper">
                            <el-steps class="stepBar" :active="currentStep">
                                <el-step
                                    title="创建事件抽取模板"
                                    @click.prevent="currentStep = 0"
                                    v-if="mode === 'create'"
                                ></el-step>
                                <el-step
                                    title="编辑事件抽取模板"
                                    @click.prevent="currentStep = 0"
                                    v-if="mode === 'edit'"
                                ></el-step>
                                <el-step
                                    title="完成创建"
                                    @click.prevent="currentStep = 1"
                                    v-if="mode === 'create'"
                                ></el-step>
                                <el-step
                                    title="完成修改"
                                    @click.prevent="currentStep = 1"
                                    v-if="mode === 'edit'"
                                ></el-step>
                            </el-steps>
                        </div>

                        <!-- 动态展示对应步骤组件 -->
                        <div class="step-Component">
                            <div v-if="currentStep === 0">
                                <el-form
                                    ref="formRef"
                                    :model="newSchemaForm"
                                    style="width: 500px; margin-top: 10px"
                                    :rules="rules"
                                    status-icon
                                    label-position="top"
                                    size="large"
                                >
                                    <el-form-item label="模板名称" prop="schema_name">
                                        <el-input v-model="newSchemaForm.schema_name" placeholder="请输入模板名称" />
                                    </el-form-item>
                                    <el-form-item label="事件类型" prop="event_type">
                                        <el-select
                                            v-model="newSchemaForm.event_type"
                                            label="event_type"
                                            placeholder="请选择事件类型"
                                            @change="handleEventTypeChange"
                                        >
                                            <!-- 使用 v-for 循环渲染事件类型 -->
                                            <el-option
                                                v-for="item in schemaList"
                                                :key="item.event_type"
                                                :label="item.event_type"
                                                :value="item.event_type"
                                            />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="事件要素" prop="event_Elements">
                                        <div>
                                            <el-tag
                                                v-for="(
                                                    element, index
                                                ) in newSchemaForm.event_Elements"
                                                :key="index"
                                                closable
                                                :disable-transitions="false"
                                                @close="removeTag(index)"
                                                size="large"
                                                style="margin-right: 15px"
                                            >
                                                {{ element }}
                                            </el-tag>
                                            <el-input
                                                v-if="inputVisible"
                                                ref="InputRef"
                                                v-model="inputValue"
                                                size="large"
                                                @keyup.enter="handleInputConfirm"
                                                @blur="handleInputConfirm"
                                                style="margin-top: 10px"
                                            />
                                            <el-button
                                                v-else
                                                class="button-new-tag"
                                                size="medium"
                                                @click="showInput"
                                            >
                                                + 新事件要素
                                            </el-button>
                                        </div>
                                    </el-form-item>
                                </el-form>
                                <el-divider />
                                <div class="button-container">
                                    <el-button
                                        plain
                                        type="info"
                                        style="margin-right: 10px"
                                        @click.prevent="resetForm(formRef)"
                                        >重置表单</el-button
                                    >
                                    <el-button type="primary" @click.prevent="submitForm(formRef)"
                                        >完成创建</el-button
                                    >
                                </div>
                            </div>
                            <div v-if="currentStep === 1">
                                <el-result
                                    icon="success"
                                    title="编辑事件属性抽取模板成功！"
                                    sub-title="您已成功编辑该模板，更改内容已存入数据库"
                                    v-if="mode === 'edit'"
                                >
                                    <template #extra>
                                        <el-button plain type="info" @clcik.prevent="gotoSchemaBase"
                                            >查看模板库</el-button
                                        >
                                        <el-button type="primary" @clcik.prevent="editAgain"
                                            >重新编辑</el-button
                                        >
                                    </template>
                                </el-result>
                                <el-result
                                    icon="success"
                                    title="创建新事件属性抽取模板成功！"
                                    sub-title="您已成功创建新模板，更新内容已存入数据库"
                                    v-if="mode === 'create'"
                                >
                                    <template #extra>
                                        <el-button plain type="info" @clcik.prevent="gotoSchemaBase"
                                            >查看模板库</el-button
                                        >
                                        <el-button type="primary" @clcik.prevent="createAgain"
                                            >再次创建</el-button
                                        >
                                    </template>
                                </el-result>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, watch, computed } from 'vue';
import ExampleText from './components/exampleText.vue';
import { useRoute, useRouter } from 'vue-router'; // 导入 vue-router
import { ElMessage, FormInstance, InputInstance } from 'element-plus';

const currentStep = ref(0);
const formRef = ref<FormInstance>();
const inputValue = ref('');
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();

// 获取 vue-router 实例
const router = useRouter();
const route = useRoute();
// 使用 computed 来创建响应式的查询参数
const mode = computed(() => route.query.mode as string);
const id = computed(() => route.query.id as string);

interface SchemaForm {
    schema_id: number;
    schema_name: string;
    author: string;
    // 当前选择的事件类型
    event_type: string;
    // 与所选事件类型相关的事件要素
    event_Elements: string[];
}
// 表单数据模型
const newSchemaForm = reactive<SchemaForm>({
    schema_id: 1,
    schema_name: '',
    // 当前选择的事件类型
    event_type: '',
    author: '111',
    // 与所选事件类型相关的事件要素
    event_Elements: [],
});
// 事件类型列表，包含每个事件类型对应的事件要素
const schemaList = reactive<SchemaForm[]>([
    {
        schema_id: 1,
        schema_name: '',
        author: '111',
        event_type: '公司上市',
        event_Elements: ['上市公告', '发行股票', '证券注册'],
    },
    {
        schema_id: 1,
        schema_name: '',
        author: '111',
        event_type: '股票回购',
        event_Elements: ['公告回购', '回购计划', '回购股票'],
    },
    {
        schema_id: 1,
        schema_name: '',
        author: '111',
        event_type: '企业并购',
        event_Elements: ['合并协议', '并购审批', '股份交换'],
    },
]);

// 表单验证规则
const checkElements = (rule: any, value: any, callback: any) => {
    console.log('当前事件要素数量：' + newSchemaForm.event_Elements.length);
    if (newSchemaForm.event_Elements.length === 0) {
        callback(new Error('请至少选择一个事件要素！'));
    } else {
        if (newSchemaForm.event_Elements.length !== 0) {
            if (!formRef.value) return;
            formRef.value.validateField('event_Elements');
        }
        callback();
    }
};
const rules = {
    schema_name: [{required: true, message: '请输入模板名称', trigger: 'blur'}],
    event_type: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
    event_Elements: [{ required: true, validator: checkElements }],
};

// 根据选择的事件类型更新事件要素
const handleEventTypeChange = (newValue) => {
    const selectedSchema = schemaList.find((item) => item.event_type === newValue);
    newSchemaForm.event_Elements = selectedSchema ? selectedSchema.event_Elements : [];
};
// 删除标签
const removeTag = (index: number) => {
    newSchemaForm.event_Elements.splice(index, 1);
};
// 显示新增标签输入框
const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
        InputRef.value!.input!.focus();
    });
};
//处理新增标签
const handleInputConfirm = () => {
    if (inputValue.value) {
        newSchemaForm.event_Elements.push(inputValue.value);
    }
    inputVisible.value = false;
    inputValue.value = '';
};

// 提交表单方法
const submitForm = (formEl: FormInstance) => {
    formEl.validate((valid) => {
        if (valid) {
            //向后端发送数据
            //若为create模式 清空表单数据（等待重新创建）
            //若为edit模式 不清空表单数据（可能会重新编辑）
            // 验证通过，成功操作
            ElMessage.success('您已成功创建事件抽取模板！');
            currentStep.value = 1; // 进入完成步骤
        } else {
            // 验证失败，显示错误信息
            ElMessage.error('请选择事件类型并添加事件要素!');
        }
    });
};
//重置表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    newSchemaForm.event_type = '';
    newSchemaForm.event_Elements = [];
};
//跳转操作库界面
const gotoSchemaBase = () => {};
//重新编辑
const editAgain = () => {};
//再次创建
const createAgain = () => {};
// 返回上一个页面
const goBack = () => {
    router.go(-1); // 返回到上一个网址
};

/**注意待办：
 * 1.步骤条不可从后点到前
 * 2.在流程中跳出 需要提示用户是否保存流程数据 或直接删掉按钮
 * 3.每次创建/编辑退出后 一定要清空表单内容 把步骤变成1
 */
</script>

<style lang="scss" scoped>
.main-container {
    width: auto;
    margin: 10px;
    height: 97%; /* 确保容器的高度为视口高度 */
    border-radius: 10px;
    font-size: 15px;
    background-color: #fff;
}
.example-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.example {
    padding: 20px;
    margin-left: 30px;
}
.operation-container {
    height: 93%;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.stepBarWrapper {
    width: 100%;
    margin-bottom: 20px;
}
.stepBar {
    margin: 0 auto;
    margin-top: 30px;
    width: 500px;
}
.step-Component {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1; /* 使动态组件部分填满剩余空间 */
    margin-top: 20px;
}
.header {
    display: flex;
    justify-content: left;
}

/* 调整左侧表单的位置 */
.example-container .operation-container .step-Component {
    justify-content: flex-start; /* 左对齐表单 */
    align-items: flex-start; /* 上对齐表单 */
}

/* 增大表单项之间的间距 */
.el-form-item {
    margin-bottom: 50px; /* 增加每个表单项之间的间距 */
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.el-form-item {
    margin-bottom: 30px; /* 增加每个表单项之间的间距 */
}
.button-container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
}
</style>
