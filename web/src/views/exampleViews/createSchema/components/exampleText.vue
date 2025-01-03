<template>
    <div style="height: 25%">
        <h2 style="margin-bottom: 20px">文本片段示例:</h2>
        <span style="line-height: 1.8; height: 500px;font-size:medium"
            >长城汽车董事长魏建军于上周四（28日）以每股的平均价4.8962元，增持151.75万股H股；及于上周五（29日）以每股的平均价4.8923元，增持646.25万股；总金额为3904.65万元，增持后最新持股数目约为3799.85万股，最新持股比例为1.23%。</span
        >
    </div>

    <h2 style="margin-bottom: 20px; margin-top: 40px">事件抽取模板创建示例:</h2>
    <div>
        <h3 style="display: inline-block; margin-right: 10px; margin-left: 20px">
            <span style="color: #f56c6c">* </span>事件类型：
        </h3>
        <span class="text-example"> 股东增持 </span>
    </div>
    <div style="margin-top: 10px">
        <h3 style="display: inline-block; margin-right: 10px; margin-left: 20px">
            <span style="color: #f56c6c">* </span>事件要素：
        </h3>
        <span class="text-example"> 股票简称,增持部分占所持比例,交易股票/股份数量,披露时间 </span>
        <div style="display: flex; justify-content: center; padding: 10px">
            <el-descriptions
                border
                column="1"
                style="margin-left: 20px; width: 500px; margin-top: 20px;"
                label-width="50%"
            >
                <el-descriptions-item label="股票简称">长城汽车</el-descriptions-item>
                <el-descriptions-item label="交易股票/股份数量">151.75万</el-descriptions-item>
                <el-descriptions-item label="增持部分占总股本比例">none</el-descriptions-item>
                <el-descriptions-item label="交易完成时间">28日,29日 </el-descriptions-item>
                <el-descriptions-item label="增持方"> 魏建军 </el-descriptions-item>
                <el-descriptions-item label="增持部分占所持比例">1.23% </el-descriptions-item>
                <el-descriptions-item label="披露时间">none </el-descriptions-item>
                <el-descriptions-item label="每股交易价格">4.8962元,4.8923元 </el-descriptions-item>

                <el-descriptions-item label="交易金额">904.65万元 </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.text-example {
    display: inline-block;
    font-size: 17px;
    background-color: #f0f2f5;
    border-radius: 2px;
    padding: 5px 10px;
}
</style>
