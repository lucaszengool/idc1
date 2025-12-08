"use strict";
// Seed 2025 Budget Projects - 更新于 2025-12-08
// 数据来源：用户提供的最新2025年研发项目执行情况
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed2025BudgetProjects = void 0;
const seed2025BudgetProjects = async () => {
    try {
        const { Project } = await Promise.resolve().then(() => __importStar(require('./models')));
        // ==================== 类别一：研发费-架构 (IDC架构研发) ====================
        // 总计: 2,272,000元 = 227.2万元
        const architectureProjects = [
            // 1. 节水版-一体冷源&风墙研发
            {
                projectCode: "RDBP202507280003",
                projectName: "TEG-2025-节水版-一体冷源&风墙研发",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-暖通",
                projectType: "重点",
                projectStatus: "完成",
                owner: "keweiliu",
                members: "keweiliu;jamesdqli;tianqingwu;jiabinzhang",
                projectGoal: "完成节水版一体冷源和双冷源风墙的研发和测试",
                projectBackground: "为了满足北方缺水场景应用JDM液冷方案，需要研发ICS-WS版本（节水版）的一体冷源",
                projectExplanation: "项目研发费用约35万；项目测试费用约15万",
                procurementCode: "RDBP202507280003",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-暖通",
                budgetYear: "2025",
                budgetOccupied: 45, // 450,000元
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 2. 弹性直流系统2.0自研项目
            {
                projectCode: "RDBP202507240006",
                projectName: "TEG-2025-弹性直流系统2.0自研项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "重点",
                projectStatus: "完成",
                owner: "jiabinzhang",
                members: "jiabinzhang;helenjwang;johnnyxia;mshuangliu",
                projectGoal: "输出一套一体柜2.0的技术方案和测试验证数据",
                projectBackground: "面对GPU单机柜功率的不断提升，目前一体柜的240kW输出功率能够支持单列机柜数受限",
                projectExplanation: "样机研发方案费用为35万；样机测试费用为10万",
                procurementCode: "RDBP202507240006",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 44, // 440,000元
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 3. TB架构研发-暖通-分体氟系
            {
                projectCode: "RDBP202507210001",
                projectName: "TEG-2025-TB架构研发-暖通-分体氟系",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-暖通",
                projectType: "重点",
                projectStatus: "完成",
                owner: "tianqingwu",
                members: "aggieliu;jamesdqli;keweiliu;tianqingwu;fennyliu",
                projectGoal: "新增多层建筑制冷解决方案（适配无水/缺水地区）",
                projectBackground: "匹配兼容未来高密的风/液机房需求和新的多层库TB架构",
                projectExplanation: "机组研发费用20万；样机测试费用20万",
                procurementCode: "RDBP202507210001",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-暖通",
                budgetYear: "2025",
                budgetOccupied: 40, // 400,000元
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 4. T-DOOR门禁产品自研项目
            {
                projectCode: "RDBP202507070001",
                projectName: "TEG-2025-T-DOOR门禁产品自研项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-弱电",
                projectType: "重点",
                projectStatus: "完成",
                owner: "davidlong",
                members: "davidlong;samizhang;terryxyan",
                projectGoal: "由集中布线改为就近布线，提升建设效率；统一自建机房门禁硬件软件",
                projectBackground: "为了提升数据中心安防门禁系统的建设效率，优化认证方式提升安全性",
                projectExplanation: "定制开发费用10万元；开模费用10万元",
                procurementCode: "RDBP202507070001",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-弱电",
                budgetYear: "2025",
                budgetOccupied: 20, // 200,000元
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 5. 自研低压柜研发项目
            {
                projectCode: "RDBP202506270004",
                projectName: "TEG-2025-自研低压柜研发项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "重点",
                projectStatus: "完成",
                owner: "leozhzou",
                members: "leozhzou;weikezheng;tomhuang;charlesgao",
                projectGoal: "三个合作厂家每家输出技术方案",
                projectBackground: "低压柜采用三大合资柜型，相同授权柜型开关不兼容，成本高",
                projectExplanation: "研发预算合计236485元",
                procurementCode: "RDBP202506270004",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 23.6485, // 236,485元
                budgetExecuted: 4.7297, // 47,297元
                orderAmount: 0,
                acceptanceAmount: 4.7297,
                contractOrderNumber: "T102-TEG-2025082700001",
                approvalStatus: "draft"
            },
            // 6. TONE扩展模块自研项目 (原7号)
            {
                projectCode: "RDBP202505060002",
                projectName: "TEG-2025-TONE扩展模块自研项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-弱电",
                projectType: "重点",
                projectStatus: "完成",
                owner: "samizhang",
                members: "samizhang;terryxyan",
                projectGoal: "提升TONE接入能力和扩展能力，实现对基础设施更全面更深入的监控",
                projectBackground: "为提升TONE的设备接入能力和扩展能力",
                projectExplanation: "测试物料采购费用21515元",
                procurementCode: "RDBP202505060002",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-弱电",
                budgetYear: "2025",
                budgetOccupied: 2.1515, // 21,515元
                budgetExecuted: 0.5958, // 5,958元
                orderAmount: 0,
                acceptanceAmount: 0.5958,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 7. 数据中心PDU合作研发 (原8号)
            {
                projectCode: "RDBP202412180006",
                projectName: "TEG-2024-数据中心PDU合作研发",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "重点",
                projectStatus: "完成",
                owner: "robinmqwu",
                members: "robinmqwu;johnnyxia;leozhzhou;felixjydeng;helenjwang",
                projectGoal: "通过PDU全面自研，申请腾讯自有专利，统一PDU规格",
                projectBackground: "当前集采PDU各厂商的PDU产品在外形尺寸、外观、接线形式差异较大",
                projectExplanation: "项目设计费用约2万元/家；研发及正式样机费用约6万元/家",
                procurementCode: "RDBP202412180006",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 15.4, // 154,000元
                budgetExecuted: 6.2, // 62,000元
                orderAmount: 0,
                acceptanceAmount: 6.2,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 8. 分布式备电架构自研项目 (原9号)
            {
                projectCode: "RDBP202412050003",
                projectName: "TEG-2024-分布式备电架构自研项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "常规",
                projectStatus: "完成",
                owner: "mshuangliu",
                members: "mshuangliu;seanzeng;leozhzhou;kasenwang;aggieliu;helenjwang",
                projectGoal: "验证数据中心分布式备电方案的可行性",
                projectBackground: "中压多机并联组网方式依然存在故障域大、系统单点等问题",
                projectExplanation: "设备采购和租赁费用约50万元；工程施工费用约17万元",
                procurementCode: "RDBP202412050003",
                completionStatus: "已结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 23, // 230,000元
                budgetExecuted: 23, // 230,000元 (已全部执行)
                orderAmount: 0,
                acceptanceAmount: 23,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 9. 2.5MW分布式柴油发电研发项目 (原10号 - RDBP202412050003第二条)
            {
                projectCode: "RDBP202412050003-2",
                projectName: "2.5MW 分布式柴油发电研发项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "常规",
                projectStatus: "进行中",
                owner: "mshuangliu",
                members: "mshuangliu",
                projectGoal: "研发2.5MW分布式柴发方仓",
                projectBackground: "分布式柴发备电方案研发",
                projectExplanation: "柴发方仓研发项目",
                procurementCode: "RDBP202412050003",
                completionStatus: "未结项",
                relatedBudgetProject: "—",
                budgetYear: "2025",
                budgetOccupied: 14, // 140,000元
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            }
        ];
        // ==================== 类别二：研发费-运营 (IDC运营-研发) ====================
        // 总计: 300,000元 = 30万元
        const operationProjects = [
            // 1. TB运营研发-辅助工具
            {
                projectCode: "RDBP202506230002",
                projectName: "TEG-2025-TB运营研发-辅助工具",
                category: "IDC运营-研发",
                subProjectName: "TB运营研发-辅助工具",
                projectType: "重点",
                projectStatus: "完成",
                owner: "shaunzhang",
                members: "shaunzhang;qingzhuhuo;marcowang;alanqykong;jzxjiang",
                projectGoal: "柴发维护优化、AHU运行优化、UPS电容实时监控",
                projectBackground: "柴油发电机虽然使用频次低，但仍需定期维护以保证启动可靠性",
                projectExplanation: "试点柴发检查改造5万；行业策略研究5万；AHU性能AI调优工具5万等",
                procurementCode: "RDBP202506230002",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB运营研发-辅助工具",
                budgetYear: "2025",
                budgetOccupied: 10, // 100,000元
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 2. TB运营研发-电池全容量核容工具
            {
                projectCode: "RDBP202507280004",
                projectName: "TEG-2025-TB运营研发-电池全容量核容工具",
                category: "IDC运营-研发",
                subProjectName: "TB运营研发-辅助工具",
                projectType: "重点",
                projectStatus: "完成",
                owner: "qingzhuhuo",
                members: "ariestzhang;chadxie;shaunzhang;dragonzhao",
                projectGoal: "核容工具实现电池按需维护",
                projectBackground: "蓄电池实际寿命与现场维护、使用情况有关，若仅按照生命周期年限触发更换，会产生很大的运营成本",
                projectExplanation: "电池全容量核容工具厂家合作研发费用15万；厂家实验室搭建测试平台进行安规测试、功能测试，现场安装调试费用及改造用配套物料的供应费用约5万",
                procurementCode: "RDBP202507280004",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB运营研发-辅助工具",
                budgetYear: "2025",
                budgetOccupied: 20, // 200,000元
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            }
        ];
        // ==================== 类别三：高校合作 ====================
        // 总计: 300,000元 = 30万元 (放在总看板上)
        const universityProjects = [
            {
                projectCode: "UNIV-2025-001",
                projectName: "2025年高校合作项目",
                category: "高校合作",
                subProjectName: "高校合作",
                projectType: "常规",
                projectStatus: "进行中",
                owner: "admin",
                members: "",
                projectGoal: "产学研合作",
                projectBackground: "与高校进行技术合作研究",
                projectExplanation: "高校合作费用30万",
                procurementCode: "",
                completionStatus: "未结项",
                relatedBudgetProject: "高校合作",
                budgetYear: "2025",
                budgetOccupied: 30, // 300,000元
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            }
        ];
        const allProjects = [...architectureProjects, ...operationProjects, ...universityProjects];
        console.log('📝 Seeding 2025 budget projects...');
        console.log('');
        // 输出类别统计
        const archTotal = architectureProjects.reduce((sum, p) => sum + p.budgetOccupied, 0);
        const archExecuted = architectureProjects.reduce((sum, p) => sum + p.budgetExecuted, 0);
        console.log(`📦 类别一 [研发费-架构]: ${architectureProjects.length}个项目`);
        console.log(`   预算占用: ${archTotal.toFixed(2)}万元 | 预算执行: ${archExecuted.toFixed(4)}万元 | 剩余: ${(archTotal - archExecuted).toFixed(2)}万元`);
        const opTotal = operationProjects.reduce((sum, p) => sum + p.budgetOccupied, 0);
        const opExecuted = operationProjects.reduce((sum, p) => sum + p.budgetExecuted, 0);
        console.log(`📦 类别二 [研发费-运营]: ${operationProjects.length}个项目`);
        console.log(`   预算占用: ${opTotal.toFixed(2)}万元 | 预算执行: ${opExecuted.toFixed(2)}万元 | 剩余: ${(opTotal - opExecuted).toFixed(2)}万元`);
        const univTotal = universityProjects.reduce((sum, p) => sum + p.budgetOccupied, 0);
        console.log(`📦 类别三 [高校合作]: ${universityProjects.length}个项目`);
        console.log(`   预算占用: ${univTotal.toFixed(2)}万元`);
        console.log('');
        console.log('----------------------------');
        const totalOccupied = archTotal + opTotal;
        const totalExecuted = archExecuted + opExecuted;
        console.log(`💰 研发费合计: 预算占用 ${totalOccupied.toFixed(2)}万元 = ${(totalOccupied * 10000).toFixed(0)}元`);
        console.log(`💰 研发费执行: ${totalExecuted.toFixed(4)}万元`);
        console.log(`💰 研发费待执行: ${(270 - totalOccupied).toFixed(2)}万元 = 12.8万元`);
        console.log(`💰 高校合作: ${univTotal.toFixed(2)}万元`);
        console.log(`💰 总预算: 270万(研发费) + 30万(高校合作) = 300万元`);
        console.log('----------------------------');
        console.log('');
        for (const projectData of allProjects) {
            await Project.create(projectData);
            console.log(`  ✓ Created: ${projectData.projectName} - ¥${projectData.budgetOccupied.toFixed(2)}万 (执行: ¥${projectData.budgetExecuted.toFixed(2)}万)`);
        }
        console.log('');
        console.log(`✅ Successfully seeded ${allProjects.length} projects for 2025`);
    }
    catch (error) {
        console.error('❌ Error seeding 2025 budget projects:', error);
    }
};
exports.seed2025BudgetProjects = seed2025BudgetProjects;
//# sourceMappingURL=seed2025.js.map