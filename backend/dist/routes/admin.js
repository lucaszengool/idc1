"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const router = express_1.default.Router();
// 重新初始化2025年预算数据
router.post('/reinit-2025', async (req, res) => {
    try {
        console.log('📝 开始重新初始化2025年预算数据...');
        // 删除所有2025年项目
        const deletedCount = await models_1.Project.destroy({
            where: { budgetYear: '2025' }
        });
        console.log(`🗑️ 已删除 ${deletedCount} 个旧的2025年项目`);
        // 预提待使用的预算：98.2万元
        const pendingProjects = [
            {
                projectCode: "RDBP202507280003",
                projectName: "TEG-2025-节水版一体冷源&风墙研发项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-暖通",
                projectType: "重点",
                projectStatus: "进行中",
                owner: "keweiliu",
                members: "keweiliu;jamesdqli;tianqingwu;jiabinzhang",
                projectGoal: "完成节水版一体冷源和双冷源风墙的研发和测试",
                projectBackground: "为了满足北方缺水场景应用JDM液冷方案",
                projectExplanation: "项目研发费用约35万；项目测试费用约15万",
                procurementCode: "RDBP202507280003",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-暖通",
                budgetYear: "2025",
                budgetOccupied: 45,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                approvalStatus: "draft"
            },
            {
                projectCode: "RDBP202507240006",
                projectName: "TEG-2025-弹性直流系统2.0自研项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "重点",
                projectStatus: "进行中",
                owner: "jiabinzhang",
                members: "jiabinzhang;helenjwang;johnnyxia;mshuangliu",
                projectGoal: "输出一套一体柜2.0的技术方案和测试验证数据",
                projectBackground: "面对GPU单机柜功率的不断提升",
                projectExplanation: "样机研发方案费用为35万；样机测试费用为10万",
                procurementCode: "RDBP202507240006",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 44,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                approvalStatus: "draft"
            },
            {
                projectCode: "RDBP202412180006",
                projectName: "TEG-2025-数据中心PDU合作研发项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "重点",
                projectStatus: "进行中",
                owner: "robinmqwu",
                members: "robinmqwu;johnnyxia;leozhzhou",
                projectGoal: "通过PDU全面自研，申请腾讯自有专利",
                projectBackground: "当前集采PDU各厂商的PDU产品差异较大",
                projectExplanation: "项目设计费用约2万元/家",
                procurementCode: "RDBP202412180006",
                completionStatus: "未结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 9.2,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                approvalStatus: "draft"
            }
        ];
        // 已完成验收预算：161.24万元
        const completedProjects = [
            {
                projectCode: "RDBP202505060002",
                projectName: "TEG-2025-TONE扩展模块自研项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-弱电",
                projectType: "重点",
                projectStatus: "完成",
                owner: "samizhang",
                members: "samizhang;terryxyan",
                projectGoal: "提升TONE接入能力和扩展能力",
                projectBackground: "为提升TONE的设备接入能力和扩展能力",
                projectExplanation: "测试物料采购费用",
                procurementCode: "RDBP202505060002",
                completionStatus: "已结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-弱电",
                budgetYear: "2025",
                budgetOccupied: 0.5958,
                budgetExecuted: 0.5958,
                orderAmount: 0.5958,
                acceptanceAmount: 0.5958,
                approvalStatus: "approved"
            },
            {
                projectCode: "RDBP202412050003-2",
                projectName: "TEG-2025-2.5MW分布式柴发方仓研发项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "常规",
                projectStatus: "完成",
                owner: "mshuangliu",
                members: "mshuangliu",
                projectGoal: "研发2.5MW分布式柴发方仓",
                projectBackground: "分布式柴发备电方案研发",
                projectExplanation: "柴发方仓研发项目",
                procurementCode: "RDBP202412050003",
                completionStatus: "已结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 14,
                budgetExecuted: 14,
                orderAmount: 14,
                acceptanceAmount: 14,
                approvalStatus: "approved"
            },
            {
                projectCode: "RDBP202412050003",
                projectName: "TEG-2025-分布式备电架构自研项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "常规",
                projectStatus: "完成",
                owner: "mshuangliu",
                members: "mshuangliu;seanzeng;leozhzhou",
                projectGoal: "验证数据中心分布式备电方案的可行性",
                projectBackground: "中压多机并联组网方式依然存在故障域大",
                projectExplanation: "设备采购和租赁费用约50万元",
                procurementCode: "RDBP202412050003",
                completionStatus: "已结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 23,
                budgetExecuted: 23,
                orderAmount: 23,
                acceptanceAmount: 23,
                approvalStatus: "approved"
            },
            {
                projectCode: "RDBP202506270004",
                projectName: "TEG-2025-自研低压柜研发项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-电气",
                projectType: "重点",
                projectStatus: "完成",
                owner: "leozhzou",
                members: "leozhzou;weikezheng;tomhuang",
                projectGoal: "三个合作厂家每家输出技术方案",
                projectBackground: "低压柜采用三大合资柜型",
                projectExplanation: "研发预算合计236485元",
                procurementCode: "RDBP202506270004",
                completionStatus: "已结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
                budgetYear: "2025",
                budgetOccupied: 23.6485,
                budgetExecuted: 23.6485,
                orderAmount: 23.6485,
                acceptanceAmount: 23.6485,
                approvalStatus: "approved"
            },
            {
                projectCode: "RDBP202507210001",
                projectName: "TEG-2025-暖通-分体氟泵SHU项目",
                category: "IDC架构研发",
                subProjectName: "TB架构研发-暖通",
                projectType: "重点",
                projectStatus: "完成",
                owner: "tianqingwu",
                members: "aggieliu;jamesdqli;keweiliu;tianqingwu",
                projectGoal: "新增多层建筑制冷解决方案",
                projectBackground: "匹配兼容未来高密的风/液机房需求",
                projectExplanation: "机组研发费用20万；样机测试费用20万",
                procurementCode: "RDBP202507210001",
                completionStatus: "已结项",
                relatedBudgetProject: "N-TEG-2025-TB架构研发-暖通",
                budgetYear: "2025",
                budgetOccupied: 40,
                budgetExecuted: 40,
                orderAmount: 40,
                acceptanceAmount: 40,
                approvalStatus: "approved"
            },
            {
                projectCode: "UNIV-2025-001",
                projectName: "2025年高校合作项目",
                category: "高校合作",
                subProjectName: "高校合作",
                projectType: "常规",
                projectStatus: "完成",
                owner: "admin",
                members: "",
                projectGoal: "产学研合作",
                projectBackground: "与高校进行技术合作研究",
                projectExplanation: "高校合作费用30万",
                procurementCode: "",
                completionStatus: "已结项",
                relatedBudgetProject: "高校合作",
                budgetYear: "2025",
                budgetOccupied: 30,
                budgetExecuted: 30,
                orderAmount: 30,
                acceptanceAmount: 30,
                approvalStatus: "approved"
            },
            {
                projectCode: "OPER-2025-001",
                projectName: "2025年IDC运营研发项目",
                category: "IDC运营-研发",
                subProjectName: "IDC运营研发",
                projectType: "常规",
                projectStatus: "完成",
                owner: "admin",
                members: "",
                projectGoal: "IDC运营研发相关费用",
                projectBackground: "IDC运营研发费用",
                projectExplanation: "IDC运营研发费用30万",
                procurementCode: "",
                completionStatus: "已结项",
                relatedBudgetProject: "IDC运营研发",
                budgetYear: "2025",
                budgetOccupied: 30,
                budgetExecuted: 30,
                orderAmount: 30,
                acceptanceAmount: 30,
                approvalStatus: "approved"
            }
        ];
        const allProjects = [...pendingProjects, ...completedProjects];
        // 创建所有项目
        for (const projectData of allProjects) {
            await models_1.Project.create(projectData);
            console.log(`✅ 已创建: ${projectData.projectName}`);
        }
        // 计算统计
        const pendingTotal = pendingProjects.reduce((sum, p) => sum + p.budgetOccupied, 0);
        const completedTotal = completedProjects.reduce((sum, p) => sum + p.budgetExecuted, 0);
        const remaining = 300 - pendingTotal - completedTotal;
        console.log('\n📊 统计结果:');
        console.log(`   预提待使用: ${pendingTotal.toFixed(2)}万元 (${pendingProjects.length}个项目)`);
        console.log(`   已完成验收: ${completedTotal.toFixed(4)}万元 (${completedProjects.length}个项目)`);
        console.log(`   剩余未使用: ${remaining.toFixed(2)}万元`);
        console.log(`   验证: ${pendingTotal} + ${completedTotal} + ${remaining} = ${pendingTotal + completedTotal + remaining}万元`);
        res.json({
            success: true,
            message: '2025年预算数据已重新初始化',
            data: {
                deletedCount,
                createdCount: allProjects.length,
                预提待使用: pendingTotal,
                已完成验收: completedTotal,
                剩余未使用: remaining
            }
        });
    }
    catch (error) {
        console.error('重新初始化2025年数据失败:', error);
        res.status(500).json({ success: false, message: '重新初始化失败' });
    }
});
// 修复2025年数据 - 删除测试项目并恢复正确的预算值
router.post('/fix-2025-data', async (req, res) => {
    try {
        console.log('🔧 开始修复2025年数据...');
        // 1. 删除测试项目（projectCode以ADJ开头的调整项目）
        const deletedCount = await models_1.Project.destroy({
            where: {
                budgetYear: '2025',
                projectCode: {
                    [sequelize_1.Op.like]: 'ADJ-%'
                }
            }
        });
        console.log(`🗑️ 已删除 ${deletedCount} 个测试/调整项目`);
        // 2. 修复已完成验收项目的预算值
        const completedProjectFixes = [
            { projectCode: 'RDBP202505060002', budgetOccupied: 0.5958, budgetExecuted: 0.5958 },
            { projectCode: 'RDBP202412050003-2', budgetOccupied: 14, budgetExecuted: 14 },
            { projectCode: 'RDBP202412050003', budgetOccupied: 23, budgetExecuted: 23 },
            { projectCode: 'RDBP202506270004', budgetOccupied: 23.6485, budgetExecuted: 23.6485 },
            { projectCode: 'RDBP202507210001', budgetOccupied: 40, budgetExecuted: 40 },
            { projectCode: 'UNIV-2025-001', budgetOccupied: 30, budgetExecuted: 30 },
            { projectCode: 'OPER-2025-001', budgetOccupied: 30, budgetExecuted: 30 }
        ];
        let fixedCount = 0;
        for (const fix of completedProjectFixes) {
            const [updated] = await models_1.Project.update({
                budgetOccupied: fix.budgetOccupied,
                budgetExecuted: fix.budgetExecuted,
                orderAmount: fix.budgetOccupied,
                acceptanceAmount: fix.budgetOccupied
            }, { where: { projectCode: fix.projectCode, budgetYear: '2025' } });
            if (updated > 0) {
                fixedCount++;
                console.log(`✅ 已修复: ${fix.projectCode} -> ${fix.budgetOccupied}万元`);
            }
        }
        // 3. 计算统计
        const projects2025 = await models_1.Project.findAll({ where: { budgetYear: '2025' } });
        const pendingTotal = projects2025
            .filter(p => p.completionStatus === '未结项')
            .reduce((sum, p) => sum + parseFloat(p.budgetOccupied.toString()), 0);
        const completedTotal = projects2025
            .filter(p => p.completionStatus === '已结项')
            .reduce((sum, p) => sum + parseFloat(p.budgetExecuted.toString()), 0);
        const remaining = 300 - pendingTotal - completedTotal;
        console.log('\n📊 修复后统计:');
        console.log(`   预提待使用: ${pendingTotal.toFixed(2)}万元`);
        console.log(`   已完成验收: ${completedTotal.toFixed(4)}万元`);
        console.log(`   剩余未使用: ${remaining.toFixed(2)}万元`);
        res.json({
            success: true,
            message: '2025年数据已修复',
            data: {
                deletedTestProjects: deletedCount,
                fixedProjects: fixedCount,
                预提待使用: pendingTotal,
                已完成验收: completedTotal,
                剩余未使用: remaining
            }
        });
    }
    catch (error) {
        console.error('修复2025年数据失败:', error);
        res.status(500).json({ success: false, message: '修复失败', error: String(error) });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map