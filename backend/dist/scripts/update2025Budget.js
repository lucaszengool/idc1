"use strict";
// 更新2025年预算数据脚本
// 运行: npx ts-node src/scripts/update2025Budget.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const models_1 = require("../models");
const update2025BudgetData = async () => {
    try {
        await database_1.default.authenticate();
        console.log('✅ Database connected');
        // 定义需要更新的项目数据
        // 已完成验收的项目 - 需要设置 budgetExecuted = budgetOccupied
        const completedProjectUpdates = [
            // a. TONE扩展模块自研项目：0.5958万元
            { projectNameLike: 'TONE扩展模块', budgetOccupied: 0.5958, budgetExecuted: 0.5958 },
            // b. 2.5MW分布式柴发方仓研发项目：14万元
            { projectNameLike: '2.5MW', budgetOccupied: 14, budgetExecuted: 14 },
            // c. 分布式备电架构自研项目：23万元
            { projectNameLike: '分布式备电架构', budgetOccupied: 23, budgetExecuted: 23 },
            // d. 自研低压柜研发项目：23.6485万元
            { projectNameLike: '自研低压柜', budgetOccupied: 23.6485, budgetExecuted: 23.6485 },
            // e. 暖通-分体氟泵SHU项目：40万元 (对应 TB架构研发-暖通-分体氟系)
            { projectNameLike: '分体氟', budgetOccupied: 40, budgetExecuted: 40 },
            // f. 高校合作费：30万元
            { projectNameLike: '高校合作', budgetOccupied: 30, budgetExecuted: 30 },
            // g. IDC运营研发费：30万元 - 需要合并运营类项目
        ];
        // 预提待使用的项目 - budgetExecuted = 0
        const pendingProjectUpdates = [
            // a. 节水版一体冷源&风墙研发项目：45万元
            { projectNameLike: '节水版', budgetOccupied: 45, budgetExecuted: 0 },
            // b. 弹性直流系统2.0自研项目：44万元
            { projectNameLike: '弹性直流', budgetOccupied: 44, budgetExecuted: 0 },
            // c. 数据中心PDU合作研发项目：9.2万元
            { projectNameLike: 'PDU', budgetOccupied: 9.2, budgetExecuted: 0 },
        ];
        console.log('\n📝 开始更新2025年预算数据...\n');
        // 更新已完成验收的项目
        console.log('=== 更新已完成验收项目 ===');
        for (const update of completedProjectUpdates) {
            const project = await models_1.Project.findOne({
                where: {
                    budgetYear: '2025',
                    projectName: { [require('sequelize').Op.like]: `%${update.projectNameLike}%` }
                }
            });
            if (project) {
                await project.update({
                    budgetOccupied: update.budgetOccupied,
                    budgetExecuted: update.budgetExecuted,
                    acceptanceAmount: update.budgetExecuted,
                    completionStatus: '已结项',
                    projectStatus: '完成'
                });
                console.log(`✅ 已更新: ${project.projectName}`);
                console.log(`   预算占用: ${update.budgetOccupied}万 | 已执行: ${update.budgetExecuted}万`);
            }
            else {
                console.log(`⚠️ 未找到项目: ${update.projectNameLike}`);
            }
        }
        // 更新预提待使用的项目
        console.log('\n=== 更新预提待使用项目 ===');
        for (const update of pendingProjectUpdates) {
            const project = await models_1.Project.findOne({
                where: {
                    budgetYear: '2025',
                    projectName: { [require('sequelize').Op.like]: `%${update.projectNameLike}%` }
                }
            });
            if (project) {
                await project.update({
                    budgetOccupied: update.budgetOccupied,
                    budgetExecuted: update.budgetExecuted,
                    acceptanceAmount: 0,
                    completionStatus: '未结项',
                    projectStatus: '进行中'
                });
                console.log(`✅ 已更新: ${project.projectName}`);
                console.log(`   预算占用: ${update.budgetOccupied}万 | 已执行: ${update.budgetExecuted}万`);
            }
            else {
                console.log(`⚠️ 未找到项目: ${update.projectNameLike}`);
            }
        }
        // 处理运营研发项目 - 合并为30万已验收
        console.log('\n=== 处理IDC运营研发项目 ===');
        const operationProjects = await models_1.Project.findAll({
            where: {
                budgetYear: '2025',
                category: 'IDC运营-研发'
            }
        });
        if (operationProjects.length > 0) {
            // 更新第一个运营项目为30万已执行，删除其他的
            const firstProject = operationProjects[0];
            await firstProject.update({
                projectName: '2025年IDC运营研发项目',
                budgetOccupied: 30,
                budgetExecuted: 30,
                acceptanceAmount: 30,
                completionStatus: '已结项',
                projectStatus: '完成'
            });
            console.log(`✅ 已更新运营项目: ${firstProject.projectName} -> 30万已执行`);
            // 删除其他运营项目
            for (let i = 1; i < operationProjects.length; i++) {
                await operationProjects[i].destroy();
                console.log(`🗑️ 已删除重复运营项目: ${operationProjects[i].projectName}`);
            }
        }
        // 删除不需要的项目
        console.log('\n=== 清理不需要的项目 ===');
        const projectsToDelete = ['T-DOOR', '辅助工具', '电池全容量核容'];
        for (const namePattern of projectsToDelete) {
            const projectsFound = await models_1.Project.findAll({
                where: {
                    budgetYear: '2025',
                    projectName: { [require('sequelize').Op.like]: `%${namePattern}%` }
                }
            });
            for (const p of projectsFound) {
                await p.destroy();
                console.log(`🗑️ 已删除: ${p.projectName}`);
            }
        }
        // 输出最终统计
        console.log('\n=== 最终统计 ===');
        const allProjects = await models_1.Project.findAll({ where: { budgetYear: '2025' } });
        let pendingTotal = 0;
        let completedTotal = 0;
        const pendingList = [];
        const completedList = [];
        for (const p of allProjects) {
            const executed = parseFloat(p.budgetExecuted?.toString() || '0');
            const occupied = parseFloat(p.budgetOccupied?.toString() || '0');
            if (executed === 0) {
                pendingTotal += occupied;
                pendingList.push(`  - ${p.projectName}: ${occupied}万`);
            }
            else {
                completedTotal += executed;
                completedList.push(`  - ${p.projectName}: ${executed}万`);
            }
        }
        console.log(`\n预提待使用: ${pendingTotal.toFixed(2)}万元 (${pendingList.length}个项目)`);
        pendingList.forEach(item => console.log(item));
        console.log(`\n已完成验收: ${completedTotal.toFixed(4)}万元 (${completedList.length}个项目)`);
        completedList.forEach(item => console.log(item));
        const remaining = 300 - pendingTotal - completedTotal;
        console.log(`\n剩余未使用: ${remaining.toFixed(2)}万元`);
        console.log(`\n验证: ${pendingTotal.toFixed(2)} + ${completedTotal.toFixed(4)} + ${remaining.toFixed(2)} = ${(pendingTotal + completedTotal + remaining).toFixed(2)}万元`);
        console.log('\n✅ 2025年预算数据更新完成!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ 更新失败:', error);
        process.exit(1);
    }
};
update2025BudgetData();
//# sourceMappingURL=update2025Budget.js.map