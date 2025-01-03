/*jshint esversion: 9 */
import { service } from './request';
import qs from 'qs';

/** 公用接口 */
const allApi = {
    login() {
        // return service({
        //     url:"/public/captcha",
        //     method:'get',
        // });
        return Promise.resolve({
            msg: '操作成功',
            code: 200,
            token: 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImJmMmYyMWRlLTUwNzctNDUxNy1hYmRlLTA0NGE4NzNhMzE0ZSJ9.DOnUxWppbtKyJGlvSBZqdExf5hrt0EdWalanz_op7rvyc9v-itJJZXbW0xn_yS5SZfXLYn1BRMlTdxadUmRmAg',
        });
    },
    getUserInfo() {
        return Promise.resolve({
            msg: '操作成功',
            code: 200,
            data: {
                userName: 'admin',
                nickName: '管理员',
                avatar: 'https://s11.ax1x.com/2023/12/15/pihx4js.jpg',
            },
        });
    },
    getMenuList() {
        let menuList = [
            {
                name: 'main-index',
                title: '首页',
                content: '',
                isCache: true,
                fixed: true,
                iconName: 'svg:main-index.svg',
            },
            {
                name: 'project-manage',
                title: '项目管理空间',
                isCache: true,
                content: '',
                iconName: 'svg:project-manage.svg',
                showTagIcon: true,
                hidden:true
            },
            {
                name: 'text-preprocess',
                title: '文本数据预处理',
                isCache: true,
                content: '',
                iconName: 'svg:text-preprocess.svg',
                showTagIcon: true,
            },
            {
                name: 'hotWord-find',
                title: '热词发现',
                isCache: true,
                content: '',
                iconName: 'svg:hotWord-find.svg',
                showTagIcon: true,
            },
            {
                name: 'hotEvent-recommand',
                title: '热门事件推荐',
                isCache: true,
                content: '',
                iconName: 'svg:hotEvent-recommand.svg',
                showTagIcon: true,
            },

            {
                name: 'schema-manage',
                title: '事件属性抽取模式定义',
                isCache: true,
                content: '',
                iconName: 'svg:schema-create.svg',
                showTagIcon: true,
            },
            {
                name: 'sample-label',
                title: '事件属性抽取样本标注',
                isCache: true,
                content: '',
                iconName: 'svg:sample-label.svg',
                showTagIcon: true,
            },
            {
                name: 'model-tune',
                title: '事件属性抽取模型微调',
                isCache: true,
                content: '',
                iconName: 'svg:model-tune.svg',
                showTagIcon: true,
            },
            {
                name: 'project-manage',
                title: '事件属性抽取项目管理',
                isCache: true,
                content: '',
                iconName: 'svg:extraction-process.svg',
                showTagIcon: true,
            },
            {
                name: 'result-audit',
                title: '事件属性抽取结果审核',
                isCache: true,
                content: '',
                iconName: 'svg:result-audit.svg',
                showTagIcon: true,
            },
            //隐藏
            {
                name: 'extraction-process',
                title: '事件属性抽取流程',
                isCache: true,
                content: '',
                showTagIcon: true,
                hidden: true,
            },
            {
                name: 'schema-create',
                title: '创建模板',
                isCache: true,
                content: '',
                showTagIcon: true,
                hidden: true,
            },
            {
                name: 'result-manage',
                title: '抽取结果管理',
                isCache: true,
                content: '',
                showTagIcon: true,
                hidden: true,
            },
            {
                name: 'result-completion',
                title: '缺失补全',
                isCache: true,
                content: '',
                showTagIcon: true,
                hidden: true,
            },
            {
                name: 'result-edit',
                title: '编辑结果',
                isCache: true,
                content: '',
                showTagIcon: true,
                hidden: true,
            },
            {
                name: 'result-detail',
                title: '结果详情',
                isCache: true,
                content: '',
                showTagIcon: true,
                hidden: true,
            },

        ];
        return Promise.resolve({
            msg: '操作成功',
            code: 200,
            data: menuList,
        });
    },
};

export default allApi;
