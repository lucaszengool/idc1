"use strict";
// Update 2025 Budget Data Script
// 更新于 2025-12-08
// 此脚本用于清理旧的2025年数据并导入最新数据
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const models_1 = require("../models");
const seed2025_1 = require("../seed2025");
async function main() {
    try {
        console.log('🔄 Connecting to database...');
        await database_1.default.authenticate();
        console.log('✅ Database connected');
        // Step 1: 删除旧的2025年项目数据
        console.log('\n📦 Step 1: 清理旧的2025年项目数据...');
        // 先获取所有2025年项目的ID
        const existingProjects = await models_1.Project.findAll({
            where: { budgetYear: '2025' },
            attributes: ['id', 'projectName']
        });
        if (existingProjects.length > 0) {
            console.log(`   找到 ${existingProjects.length} 个旧项目，正在清理...`);
            // 删除相关的所有关联记录
            for (const project of existingProjects) {
                // 删除执行记录
                await models_1.BudgetExecution.destroy({
                    where: { projectId: project.id }
                });
                // 删除预算调整记录
                await models_1.BudgetAdjustment.destroy({
                    where: { originalProjectId: project.id }
                });
                // 删除月度执行记录
                await models_1.MonthlyExecution.destroy({
                    where: { projectId: project.id }
                });
                // 删除项目转移记录
                await models_1.ProjectTransfer.destroy({
                    where: { projectId: project.id }
                });
                console.log(`   - 清理项目关联记录: ${project.projectName}`);
            }
            // 删除项目
            await models_1.Project.destroy({
                where: { budgetYear: '2025' }
            });
            console.log(`   ✅ 已删除 ${existingProjects.length} 个旧项目及其关联数据`);
        }
        else {
            console.log('   ℹ️  没有找到旧的2025年项目');
        }
        // Step 2: 更新2025年总预算
        console.log('\n📦 Step 2: 更新2025年总预算...');
        const [totalBudget, created] = await models_1.TotalBudget.findOrCreate({
            where: { budgetYear: '2025' },
            defaults: {
                budgetYear: '2025',
                totalAmount: 300, // 300万元 = 研发费270万 + 高校合作30万
                createdBy: 'Admin',
                description: '2025年研发费预算：研发费270万元 + 高校合作30万元 = 300万元'
            }
        });
        if (!created) {
            await totalBudget.update({
                totalAmount: 300,
                description: '2025年研发费预算：研发费270万元 + 高校合作30万元 = 300万元'
            });
            console.log('   ✅ 已更新2025年总预算为300万元');
        }
        else {
            console.log('   ✅ 已创建2025年总预算：300万元');
        }
        // Step 3: 导入新的2025年项目数据
        console.log('\n📦 Step 3: 导入新的2025年项目数据...');
        await (0, seed2025_1.seed2025BudgetProjects)();
        // Step 4: 验证数据
        console.log('\n📦 Step 4: 验证导入的数据...');
        const newProjects = await models_1.Project.findAll({
            where: { budgetYear: '2025' }
        });
        const totalOccupied = newProjects.reduce((sum, p) => sum + Number(p.budgetOccupied), 0);
        const totalExecuted = newProjects.reduce((sum, p) => sum + Number(p.budgetExecuted), 0);
        console.log('\n===== 2025年预算汇总 =====');
        console.log(`总项目数: ${newProjects.length}`);
        console.log(`总预算占用: ${totalOccupied.toFixed(2)}万元`);
        console.log(`总预算执行: ${totalExecuted.toFixed(4)}万元`);
        console.log(`剩余可用: ${(300 - totalOccupied).toFixed(2)}万元`);
        console.log('===========================');
        // 按类别统计
        const categories = ['IDC架构研发', 'IDC运营-研发', '高校合作'];
        for (const cat of categories) {
            const catProjects = newProjects.filter(p => p.category === cat);
            const catOccupied = catProjects.reduce((sum, p) => sum + Number(p.budgetOccupied), 0);
            const catExecuted = catProjects.reduce((sum, p) => sum + Number(p.budgetExecuted), 0);
            console.log(`\n${cat}:`);
            console.log(`  项目数: ${catProjects.length}`);
            console.log(`  预算占用: ${catOccupied.toFixed(2)}万元`);
            console.log(`  预算执行: ${catExecuted.toFixed(4)}万元`);
        }
        console.log('\n✅ 2025年预算数据更新完成！');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error updating 2025 data:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=update2025Data.js.map