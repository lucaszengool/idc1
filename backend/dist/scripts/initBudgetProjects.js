"use strict";
/**
 * 26年研发预算评审项目表初始化脚本
 *
 * 根据26年研发预算评审项目表录入预算项目
 * 注意：这些项目一旦录入，基本信息不能修改
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const Project_1 = __importDefault(require("../models/Project"));
// 26年研发预算评审项目数据
const budgetProjects = [
    // IDC-架构研发类别
    {
        category: 'IDC-架构研发',
        projectName: 'T-AIDC（多技术-MDC）数据库系统',
        subProjectName: 'T-AIDC数据库研发',
        content: `1、核心：财务核心系统、核心文件档案数据库技术及安装等相关技术优化；
2、信号：研发核心/多模态-MDC非业务数据库系统及安装技术优化；
3、信号：研发高分选版本（MDC安装优化数据库系统）;去除高参数版本优化技术；
4、研发分选及版本变更等安全优化框架技术优化；`,
        owner: 'seanzhong',
        budgetAmount: 160,
    },
    {
        category: 'IDC-架构研发',
        projectName: 'T-AIDC数据库研发（小于等于40万）',
        subProjectName: 'HDMI连接器产品方案化探索研究（数连）',
        content: `1、数字产品选版方案，移动版及多参数优化安全测试及数据库；
2、参考产品选版等增加，最近版测算与研发及产品技术；
3、研发更改复杂版等支撑产品、等级更新与精确优化安全测试技术；
5、在此1000版增强框架版等选择优化技术；`,
        owner: 'mishuang@o',
        budgetAmount: 70,
    },
    {
        category: 'IDC-架构研发',
        projectName: 'T-AIDC数据库研发（小于等于40万）',
        subProjectName: '分类别信息展示',
        content: '研发分类别数据展示技术及相关功能优化',
        owner: 'kercnhu',
        budgetAmount: 30,
    },
    {
        category: 'IDC-架构研发',
        projectName: 'IDC运营-研发',
        subProjectName: '维度全栈工具库（建立）',
        content: `1、针对业务及优化等相关全栈工具库建立，最更新版安装优化工程；更新版版本工具库整合全栈支撑；
2、改版结果：添加系统优化等优化，自研选版等，技术选择；
3、建立框架：提高代码优化选择、提高技术全栈数据库优化等移版技术及数据；`,
        owner: 'fanypu',
        budgetAmount: 15,
    },
    {
        category: 'IDC运营-研发',
        projectName: 'IDC运营-研发',
        subProjectName: '维度全栈工具库（延续）',
        content: '延续优化全栈工具库研发，提升系统稳定性和性能',
        owner: 'terrypepe',
        budgetAmount: 40,
    },
    {
        category: 'IDC运营-研发',
        projectName: 'IDC运营-研发',
        subProjectName: 'AI技术精准化研发支撑',
        content: '提高AI技术研发及选型支撑能力，实现精准化研发支撑',
        owner: 'shouyong',
        budgetAmount: 30,
    },
    // 高校合作类别
    {
        category: '高校合作',
        projectName: '高校合作（30亿元）',
        subProjectName: 'ATR技术鉴识化工具',
        content: '通过版本优化实现ATR技术鉴识化工具，实现技术选择及优化等功能等技术优化',
        owner: 'aitenhuang',
        budgetAmount: 10,
    },
    {
        category: '高校合作',
        projectName: '高校合作（30亿元）',
        subProjectName: 'IDC环境跨研发组件库调研/功能（研连）',
        content: '针对环境进行跨研发组件库调研并实现相关功能，提升研发效率',
        owner: 'aitenzhang',
        budgetAmount: 15,
    },
    {
        category: '高校合作',
        projectName: '高校合作（30亿元）',
        subProjectName: '半定点精度平台化预发布工具',
        content: '开发半定点精度平台化预发布工具，实现精确预发布功能',
        owner: 'aitenzhang',
        budgetAmount: 10,
    },
    {
        category: '高校合作',
        projectName: '高校合作（30亿元）',
        subProjectName: '包头全信态框架工具工程 prob',
        content: '研发包头全信态框架工具工程，提供prob相关技术支撑，优化IIDC版基础全模态验证及技术优化，需产品数量增加等技术',
        owner: 'qingshubun',
        budgetAmount: 30,
    },
];
async function initBudgetProjects() {
    try {
        console.log('开始初始化26年研发预算评审项目...');
        // 连接数据库
        await database_1.default.authenticate();
        console.log('数据库连接成功');
        // 同步数据库（确保表存在）
        await database_1.default.sync();
        console.log('数据库同步完成');
        // 插入项目数据
        let successCount = 0;
        let skipCount = 0;
        for (const projectData of budgetProjects) {
            try {
                // 生成项目编号
                const timestamp = Date.now();
                const projectCode = `BUDGET-2026-${timestamp}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                // 检查是否已存在相同的项目（基于项目名称和子项目名称）
                const existingProject = await Project_1.default.findOne({
                    where: {
                        projectName: projectData.projectName,
                        subProjectName: projectData.subProjectName,
                        category: projectData.category,
                    },
                });
                if (existingProject) {
                    console.log(`跳过已存在的项目: ${projectData.category} - ${projectData.subProjectName}`);
                    skipCount++;
                    continue;
                }
                // 创建项目
                await Project_1.default.create({
                    projectCode,
                    projectName: projectData.projectName,
                    projectType: '常规', // 默认为常规项目
                    projectStatus: '待开始', // 默认状态
                    owner: projectData.owner,
                    members: '', // 初始为空
                    projectGoal: `${projectData.subProjectName}的研发和实施`,
                    projectBackground: projectData.content,
                    projectExplanation: '根据26年研发预算评审项目表录入',
                    procurementCode: '', // 初始为空
                    completionStatus: '未结项',
                    relatedBudgetProject: projectData.subProjectName,
                    budgetYear: 2026,
                    budgetOccupied: projectData.budgetAmount,
                    budgetExecuted: 0,
                    orderAmount: 0,
                    acceptanceAmount: 0,
                    contractOrderNumber: '',
                    category: projectData.category,
                    subProjectName: projectData.subProjectName,
                });
                console.log(`✓ 成功创建项目: ${projectData.category} - ${projectData.subProjectName} (预算: ${projectData.budgetAmount}万元)`);
                successCount++;
                // 添加小延迟，避免时间戳冲突
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            catch (error) {
                console.error(`✗ 创建项目失败: ${projectData.subProjectName}`, error.message);
            }
        }
        console.log('\n=== 初始化完成 ===');
        console.log(`成功创建: ${successCount} 个项目`);
        console.log(`跳过已存在: ${skipCount} 个项目`);
        console.log(`总计: ${budgetProjects.length} 个项目`);
    }
    catch (error) {
        console.error('初始化失败:', error);
        throw error;
    }
    finally {
        await database_1.default.close();
    }
}
// 运行初始化
if (require.main === module) {
    initBudgetProjects()
        .then(() => {
        console.log('\n项目初始化脚本执行完成！');
        process.exit(0);
    })
        .catch((error) => {
        console.error('\n项目初始化脚本执行失败:', error);
        process.exit(1);
    });
}
exports.default = initBudgetProjects;
//# sourceMappingURL=initBudgetProjects.js.map