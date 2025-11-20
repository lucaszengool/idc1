/**
 * 数据库迁移脚本：添加executionStatus列到budget_executions表
 *
 * 该脚本用于为budget_executions表添加executionStatus（执行情况）列
 * 执行情况包括：合同签订付款20%、方案设计60%、样机测试完成20%
 */
declare function addExecutionStatusColumn(): Promise<void>;
export default addExecutionStatusColumn;
//# sourceMappingURL=addExecutionStatusColumn.d.ts.map