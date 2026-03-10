import express from 'express';
import { Project, BudgetAdjustment, BudgetExecution, User } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// 重新初始化2025年预算数据
router.post('/reinit-2025', async (req, res) => {
  try {
    console.log('📝 开始重新初始化2025年预算数据...');

    // 删除所有2025年项目
    const deletedCount = await Project.destroy({
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
      await Project.create(projectData as any);
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
  } catch (error) {
    console.error('重新初始化2025年数据失败:', error);
    res.status(500).json({ success: false, message: '重新初始化失败' });
  }
});

// 修复2025年数据 - 删除测试项目并恢复正确的预算值
router.post('/fix-2025-data', async (req, res) => {
  try {
    console.log('🔧 开始修复2025年数据...');

    // 0. 先查找要删除的测试项目ID
    const testProjects = await Project.findAll({
      where: {
        budgetYear: '2025',
        projectCode: {
          [Op.like]: 'ADJ-%'
        }
      }
    });
    const testProjectIds = testProjects.map(p => p.id);
    console.log(`找到 ${testProjectIds.length} 个测试项目: ${testProjectIds.join(', ')}`);

    // 1. 先删除关联的预算调整记录
    if (testProjectIds.length > 0) {
      const deletedAdjustments = await BudgetAdjustment.destroy({
        where: {
          originalProjectId: { [Op.in]: testProjectIds }
        }
      });
      console.log(`🗑️ 已删除 ${deletedAdjustments} 条关联的预算调整记录`);
    }

    // 2. 删除测试项目
    const deletedCount = await Project.destroy({
      where: {
        budgetYear: '2025',
        projectCode: {
          [Op.like]: 'ADJ-%'
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
      const [updated] = await Project.update(
        {
          budgetOccupied: fix.budgetOccupied,
          budgetExecuted: fix.budgetExecuted,
          orderAmount: fix.budgetOccupied,
          acceptanceAmount: fix.budgetOccupied
        },
        { where: { projectCode: fix.projectCode, budgetYear: '2025' } }
      );
      if (updated > 0) {
        fixedCount++;
        console.log(`✅ 已修复: ${fix.projectCode} -> ${fix.budgetOccupied}万元`);
      }
    }

    // 3. 计算统计
    const projects2025 = await Project.findAll({ where: { budgetYear: '2025' } });
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
  } catch (error) {
    console.error('修复2025年数据失败:', error);
    res.status(500).json({ success: false, message: '修复失败', error: String(error) });
  }
});

// 清理前端测试数据 - 仅删除截图中红圈标注的测试数据
router.post('/cleanup-test-data', async (req, res) => {
  try {
    console.log('🧹 开始清理前端测试数据...');
    const results: any = {};

    // 1. 删除4条执行记录 (执行历史中的测试数据)
    // ID 15: 视觉技术 ¥4.00 by xxxxx
    // ID 16: 水质检测工具模块 ¥5.00 by test
    // ID 17: 氟-水CDU ¥12.00 by jessy
    // ID 18: 视觉技术 ¥0.80 by jessyyang
    const executionIds = [15, 16, 17, 18];
    const deletedExecutions = await BudgetExecution.destroy({
      where: { id: { [Op.in]: executionIds } }
    });
    results.deletedExecutions = deletedExecutions;
    console.log(`🗑️ 已删除 ${deletedExecutions} 条执行记录`);

    // 2. 删除6条预算调整记录
    // ID 3: TEG-2025-暖通-分体氟泵SHU项目 → test ¥20.00
    // ID 5: TEG-2025-数据中心PDU → ccccccc ¥9.00
    // ID 6: 视觉技术 → xxxxx ¥16.00
    // ID 7: 直流一体柜及其配套设备 → xxxxxxxtest ¥20.00
    // ID 8: 氟-水CDU → test1 ¥20.00
    // ID 9: 电池全容量核容工具pro版 → hhhhh ¥10.00
    const adjustmentIds = [3, 5, 6, 7, 8, 9];
    const deletedAdjustments = await BudgetAdjustment.destroy({
      where: { id: { [Op.in]: adjustmentIds } }
    });
    results.deletedAdjustments = deletedAdjustments;
    console.log(`🗑️ 已删除 ${deletedAdjustments} 条预算调整记录`);

    // 3. 删除4个测试项目 (IDC-架构研发分类下的测试项目 + hhhhh)
    // ID 58: xxxxx (IDC-架构研发, 16万, owner: jessy)
    // ID 59: xxxxxxxtest (IDC-架构研发, 20万, owner: test)
    // ID 60: test1 (IDC-架构研发, 20万, owner: test1)
    // ID 61: hhhhh (IDC运营-研发, 10万, owner: hhh)
    const testProjectIds = [58, 59, 60, 61];
    const deletedProjects = await Project.destroy({
      where: { id: { [Op.in]: testProjectIds } }
    });
    results.deletedProjects = deletedProjects;
    console.log(`🗑️ 已删除 ${deletedProjects} 个测试项目`);

    // 4. 恢复被预算调整修改过的原项目的预算占用金额
    // 视觉技术 (ID 57): budgetOccupied 从4改回20, budgetExecuted 从4.80改回0
    await Project.update(
      { budgetOccupied: 20, budgetExecuted: 0 },
      { where: { id: 57 } }
    );
    console.log('✅ 已恢复视觉技术项目预算: budgetOccupied=20, budgetExecuted=0');

    // 氟-水CDU (ID 51): budgetOccupied 从40改回60, budgetExecuted 从12改回0
    await Project.update(
      { budgetOccupied: 60, budgetExecuted: 0 },
      { where: { id: 51 } }
    );
    console.log('✅ 已恢复氟-水CDU项目预算: budgetOccupied=60, budgetExecuted=0');

    // 水质检测工具模块 (ID 53): budgetExecuted 从5改回0
    await Project.update(
      { budgetExecuted: 0 },
      { where: { id: 53 } }
    );
    console.log('✅ 已恢复水质检测工具模块: budgetExecuted=0');

    // 直流一体柜及其配套设备 (ID 50): budgetOccupied 从10改回30
    await Project.update(
      { budgetOccupied: 30 },
      { where: { id: 50 } }
    );
    console.log('✅ 已恢复直流一体柜项目预算: budgetOccupied=30');

    // 电池全容量核容工具pro版 (ID 10): budgetOccupied 从20改回30
    await Project.update(
      { budgetOccupied: 30 },
      { where: { id: 10 } }
    );
    console.log('✅ 已恢复电池全容量核容工具: budgetOccupied=30');

    // 5. 删除待审批的测试用户 (isActive=false)
    // 使用原始SQL绕过FK约束，先删除所有关联记录
    const pendingUserIds = [1, 2, 4, 5, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19];
    const sequelize = (await import('../config/database')).default;

    // 删除所有关联表中引用这些用户的记录
    await sequelize.query(`DELETE FROM approvals WHERE "requesterId" IN (${pendingUserIds.join(',')}) OR "approverId" IN (${pendingUserIds.join(',')})`);
    await sequelize.query(`DELETE FROM project_transfers WHERE "fromUserId" IN (${pendingUserIds.join(',')}) OR "toUserId" IN (${pendingUserIds.join(',')}) OR "requesterId" IN (${pendingUserIds.join(',')}) OR "approverId" IN (${pendingUserIds.join(',')})`);
    await sequelize.query(`DELETE FROM group_members WHERE "userId" IN (${pendingUserIds.join(',')})`);
    await sequelize.query(`UPDATE groups SET "pmId" = NULL WHERE "pmId" IN (${pendingUserIds.join(',')})`);
    await sequelize.query(`UPDATE groups SET "createdBy" = NULL WHERE "createdBy" IN (${pendingUserIds.join(',')})`);
    console.log('✅ 已清理所有关联记录');

    const deletedUsers = await User.destroy({
      where: { id: { [Op.in]: pendingUserIds } }
    });
    results.deletedUsers = deletedUsers;
    console.log(`🗑️ 已删除 ${deletedUsers} 个待审批测试用户`);

    console.log('✅ 前端测试数据清理完成!');
    res.json({
      success: true,
      message: '前端测试数据已清理完成',
      data: results
    });
  } catch (error) {
    console.error('清理测试数据失败:', error);
    res.status(500).json({ success: false, message: '清理失败', error: String(error) });
  }
});

export default router;
