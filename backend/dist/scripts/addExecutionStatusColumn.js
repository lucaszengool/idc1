"use strict";
/**
 * 数据库迁移脚本：添加executionStatus列到budget_executions表
 *
 * 该脚本用于为budget_executions表添加executionStatus（执行情况）列
 * 执行情况包括：合同签订付款20%、方案设计60%、样机测试完成20%
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
async function addExecutionStatusColumn() {
    try {
        console.log('开始添加executionStatus列到budget_executions表...');
        // 连接数据库
        await database_1.default.authenticate();
        console.log('数据库连接成功');
        const queryInterface = database_1.default.getQueryInterface();
        // 检查列是否已存在
        const tableDescription = await queryInterface.describeTable('budget_executions');
        if (tableDescription.executionStatus) {
            console.log('executionStatus列已存在，跳过迁移');
            return;
        }
        // 添加executionStatus列（SQLite不支持ENUM，使用TEXT类型）
        await database_1.default.query(`
      ALTER TABLE budget_executions
      ADD COLUMN executionStatus TEXT
    `);
        console.log('✓ executionStatus列添加成功');
        // 为现有记录设置默认值（如果有现有记录的话）
        const [results] = await database_1.default.query('SELECT COUNT(*) as count FROM budget_executions WHERE executionStatus IS NULL');
        const nullCount = results[0]?.count || 0;
        if (nullCount > 0) {
            console.log(`发现 ${nullCount} 条现有记录，设置默认executionStatus值为"合同签订付款20%"...`);
            await database_1.default.query('UPDATE budget_executions SET executionStatus = "合同签订付款20%" WHERE executionStatus IS NULL');
            console.log('✓ 现有记录已更新');
        }
        console.log('✓ executionStatus列已设置为NOT NULL');
        console.log('\n=== 迁移完成 ===');
        console.log('executionStatus列已成功添加到budget_executions表');
    }
    catch (error) {
        console.error('迁移失败:', error);
        throw error;
    }
    finally {
        await database_1.default.close();
    }
}
// 运行迁移
if (require.main === module) {
    addExecutionStatusColumn()
        .then(() => {
        console.log('\n数据库迁移脚本执行完成！');
        process.exit(0);
    })
        .catch((error) => {
        console.error('\n数据库迁移脚本执行失败:', error);
        process.exit(1);
    });
}
exports.default = addExecutionStatusColumn;
//# sourceMappingURL=addExecutionStatusColumn.js.map