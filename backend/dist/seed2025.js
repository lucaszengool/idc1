"use strict";
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
// Seed 2025 Budget Projects
const seed2025BudgetProjects = async () => {
    try {
        const { Project } = await Promise.resolve().then(() => __importStar(require('./models')));
        const projects2025 = [
            // 1. 电池全容量核容工具
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
                projectExplanation: "1. 电池全容量核容工具厂家合作研发费用15万；2. 厂家实验室搭建测试平台进行安规测试、功能测试，现场安装调试费用及改造用配套物料的供应费用约5万",
                procurementCode: "RDBP202507280004",
                completionStatus: "未结项",
                relatedBudgetProject: "TB运营研发-辅助工具",
                budgetYear: "2025",
                budgetOccupied: 200000,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 2. 节水版一体冷源&风墙研发
            {
                projectCode: "RDBP202507280003",
                projectName: "TEG-2025-节水版一体冷源&风墙研发",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-暖通",
                projectType: "重点",
                projectStatus: "完成",
                owner: "keweiliu",
                members: "keweiliu;jamesdqli;tianqingwu;jiabinzhang",
                projectGoal: "完成节水版一体冷源和双冷源风墙的研发和测试",
                projectBackground: "为了满足北方缺水场景应用JDM液冷方案，需要研发ICS-WS版本（节水版）的一体冷源",
                projectExplanation: "1. 项目研发费用约35万；2. 项目测试费用约15万",
                procurementCode: "RDBP202507280003",
                completionStatus: "未结项",
                relatedBudgetProject: "TB架构研发-暖通",
                budgetYear: "2025",
                budgetOccupied: 450000,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 3. 弹性直流系统2.0自研项目
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
                relatedBudgetProject: "TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 440000,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 4. 分体氟泵
            {
                projectCode: "RDBP202507210001",
                projectName: "TEG-2025-TB架构研发-暖通-分体氟泵",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-暖通",
                projectType: "重点",
                projectStatus: "完成",
                owner: "tianqingwu",
                members: "aggieliu;jamesdqli;keweiliu;tianqingwu;fennyliu",
                projectGoal: "新增多层建筑制冷解决方案（适配无水/缺水地区）",
                projectBackground: "匹配兼容未来高密的风/液机房需求和新的多层库TB架构",
                projectExplanation: "机组研发费用20万；样机测试费用20万；成套补液装置研发费15万；系统测试费用20万等",
                procurementCode: "RDBP202507210001",
                completionStatus: "未结项",
                relatedBudgetProject: "TB架构研发-暖通",
                budgetYear: "2025",
                budgetOccupied: 400000,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 5. T-DOOR门禁产品自研
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
                relatedBudgetProject: "TB架构研发-弱电",
                budgetYear: "2025",
                budgetOccupied: 200000,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "T105-TEG-2025063000003",
                approvalStatus: "draft"
            },
            // 6. 自研低压柜研发项目
            {
                projectCode: "RDBP202506270004",
                projectName: "TEG-2025-自研低压柜研发项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "重点",
                projectStatus: "完成",
                owner: "leozhzhou",
                members: "leozhzhou;weikezheng;tomhuang;charlesgao",
                projectGoal: "三个合作厂家每家输出技术方案",
                projectBackground: "低压柜采用三大合资柜型，相同授权柜型开关不兼容，成本高",
                projectExplanation: "研发预算合计236485元",
                procurementCode: "RDBP202506270004",
                completionStatus: "未结项",
                relatedBudgetProject: "TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 236485,
                budgetExecuted: 47297,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "T102-TEG-2025082700001",
                approvalStatus: "draft"
            },
            // 7. TB运营研发-辅助工具
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
                relatedBudgetProject: "TB运营研发-辅助工具",
                budgetYear: "2025",
                budgetOccupied: 100000,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 8. TONE扩展模块自研
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
                relatedBudgetProject: "TB架构研发-弱电",
                budgetYear: "2025",
                budgetOccupied: 21515,
                budgetExecuted: 5958,
                orderAmount: 0,
                acceptanceAmount: 5958,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 9. PDU合作研发
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
                relatedBudgetProject: "TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 154000,
                budgetExecuted: 62000,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 10. 分布式备电架构自研
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
                projectExplanation: "设备采购和租赁费用约50万元；工程施工费用约17万元；人力资源投入约15万元",
                procurementCode: "RDBP202412050003",
                completionStatus: "已结项",
                relatedBudgetProject: "TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 230000,
                budgetExecuted: 230000,
                orderAmount: 0,
                acceptanceAmount: 230000,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            // 11. 2.5MW分布式柴发方仓
            {
                projectCode: "TEG-2025-CFDC",
                projectName: "2.5MW分布式柴发方仓研发项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "常规",
                projectStatus: "进行中",
                owner: "mshuangliu",
                members: "",
                projectGoal: "研发2.5MW分布式柴发方仓",
                projectBackground: "分布式柴发备电方案研发",
                projectExplanation: "柴发方仓研发项目",
                procurementCode: "",
                completionStatus: "未结项",
                relatedBudgetProject: "TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 140000,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            }
        ];
        console.log('📝 Seeding 2025 budget projects...');
        for (const projectData of projects2025) {
            await Project.create(projectData);
            console.log(`  ✓ Created: ${projectData.projectName} - ¥${(projectData.budgetOccupied / 10000).toFixed(1)}万`);
        }
        console.log(`✅ Successfully seeded ${projects2025.length} projects for 2025`);
        console.log(`💰 Total 2025 budget: ¥${(projects2025.reduce((sum, p) => sum + p.budgetOccupied, 0) / 10000).toFixed(1)}万元`);
    }
    catch (error) {
        console.error('❌ Error seeding 2025 budget projects:', error);
    }
};
exports.seed2025BudgetProjects = seed2025BudgetProjects;
//# sourceMappingURL=seed2025.js.map