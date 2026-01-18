// Seed 2025 Budget Projects - 更新于 2025-01-18
// 数据来源：用户提供的最新2025年研发项目执行情况
//
// 25年架构研发中心总预算：300万元
// - 预提待使用预算：98.2万元
// - 已完成验收预算：101.24万元
// - 高校合作费：30万元
// - IDC运营研发费：30万元
// - 剩余未使用预算：40.56万元

export const seed2025BudgetProjects = async () => {
  try {
    const { Project } = await import('./models');

    // ==================== 预提待使用的预算：98.2万元 ====================
    // 这些项目已立项但尚未执行验收
    const pendingProjects = [
      // 1. 节水版一体冷源&风墙研发项目：45万元
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
        projectBackground: "为了满足北方缺水场景应用JDM液冷方案，需要研发ICS-WS版本（节水版）的一体冷源",
        projectExplanation: "项目研发费用约35万；项目测试费用约15万",
        procurementCode: "RDBP202507280003",
        completionStatus: "未结项",
        relatedBudgetProject: "N-TEG-2025-TB架构研发-暖通",
        budgetYear: "2025",
        budgetOccupied: 45, // 预算占用45万元
        budgetExecuted: 0, // 预提待使用，尚未执行
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      // 2. 弹性直流系统2.0自研项目：44万元
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
        projectBackground: "面对GPU单机柜功率的不断提升，目前一体柜的240kW输出功率能够支持单列机柜数受限",
        projectExplanation: "样机研发方案费用为35万；样机测试费用为10万",
        procurementCode: "RDBP202507240006",
        completionStatus: "未结项",
        relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
        budgetYear: "2025",
        budgetOccupied: 44, // 预算占用44万元
        budgetExecuted: 0, // 预提待使用，尚未执行
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      // 3. 数据中心PDU合作研发项目：9.2万元
      {
        projectCode: "RDBP202412180006",
        projectName: "TEG-2025-数据中心PDU合作研发项目",
        category: "IDC架构研发",
        subProjectName: "TB架构研发-电气",
        projectType: "重点",
        projectStatus: "进行中",
        owner: "robinmqwu",
        members: "robinmqwu;johnnyxia;leozhzhou;felixjydeng;helenjwang",
        projectGoal: "通过PDU全面自研，申请腾讯自有专利，统一PDU规格",
        projectBackground: "当前集采PDU各厂商的PDU产品在外形尺寸、外观、接线形式差异较大",
        projectExplanation: "项目设计费用约2万元/家；研发及正式样机费用约6万元/家",
        procurementCode: "RDBP202412180006",
        completionStatus: "未结项",
        relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
        budgetYear: "2025",
        budgetOccupied: 9.2, // 预算占用9.2万元
        budgetExecuted: 0, // 预提待使用，尚未执行
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      }
    ];

    // ==================== 已完成验收预算：101.24万元 ====================
    // 这些项目已经完成验收
    const completedProjects = [
      // 1. TONE扩展模块自研项目：0.5958万元
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
        projectExplanation: "测试物料采购费用",
        procurementCode: "RDBP202505060002",
        completionStatus: "已结项",
        relatedBudgetProject: "N-TEG-2025-TB架构研发-弱电",
        budgetYear: "2025",
        budgetOccupied: 0.5958, // 预算占用0.5958万元
        budgetExecuted: 0.5958, // 已验收0.5958万元
        orderAmount: 0.5958,
        acceptanceAmount: 0.5958,
        contractOrderNumber: "",
        approvalStatus: "approved"
      },
      // 2. 2.5MW分布式柴发方仓研发项目：14万元
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
        budgetOccupied: 14, // 预算占用14万元
        budgetExecuted: 14, // 已验收14万元
        orderAmount: 14,
        acceptanceAmount: 14,
        contractOrderNumber: "",
        approvalStatus: "approved"
      },
      // 3. 分布式备电架构自研项目：23万元
      {
        projectCode: "RDBP202412050003",
        projectName: "TEG-2025-分布式备电架构自研项目",
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
        budgetOccupied: 23, // 预算占用23万元
        budgetExecuted: 23, // 已验收23万元
        orderAmount: 23,
        acceptanceAmount: 23,
        contractOrderNumber: "",
        approvalStatus: "approved"
      },
      // 4. 自研低压柜研发项目：23.6485万元
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
        completionStatus: "已结项",
        relatedBudgetProject: "N-TEG-2025-TB架构研发-电气",
        budgetYear: "2025",
        budgetOccupied: 23.6485, // 预算占用23.6485万元
        budgetExecuted: 23.6485, // 已验收23.6485万元
        orderAmount: 23.6485,
        acceptanceAmount: 23.6485,
        contractOrderNumber: "T102-TEG-2025082700001",
        approvalStatus: "approved"
      },
      // 5. 暖通-分体氟泵SHU项目：40万元
      {
        projectCode: "RDBP202507210001",
        projectName: "TEG-2025-暖通-分体氟泵SHU项目",
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
        completionStatus: "已结项",
        relatedBudgetProject: "N-TEG-2025-TB架构研发-暖通",
        budgetYear: "2025",
        budgetOccupied: 40, // 预算占用40万元
        budgetExecuted: 40, // 已验收40万元
        orderAmount: 40,
        acceptanceAmount: 40,
        contractOrderNumber: "",
        approvalStatus: "approved"
      }
    ];

    // ==================== 高校合作费：30万元 ====================
    const universityProjects = [
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
        budgetOccupied: 30, // 预算占用30万元
        budgetExecuted: 30, // 已执行30万元
        orderAmount: 30,
        acceptanceAmount: 30,
        contractOrderNumber: "",
        approvalStatus: "approved"
      }
    ];

    // ==================== IDC运营研发费：30万元 ====================
    const operationProjects = [
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
        budgetOccupied: 30, // 预算占用30万元
        budgetExecuted: 30, // 已执行30万元
        orderAmount: 30,
        acceptanceAmount: 30,
        contractOrderNumber: "",
        approvalStatus: "approved"
      }
    ];

    const allProjects = [...pendingProjects, ...completedProjects, ...universityProjects, ...operationProjects];

    console.log('📝 Seeding 2025 budget projects...');
    console.log('');

    // 输出类别统计
    const pendingTotal = pendingProjects.reduce((sum, p) => sum + p.budgetOccupied, 0);
    const pendingExecuted = pendingProjects.reduce((sum, p) => sum + p.budgetExecuted, 0);
    console.log(`📦 预提待使用预算: ${pendingProjects.length}个项目`);
    console.log(`   预算占用: ${pendingTotal.toFixed(2)}万元 | 预算执行: ${pendingExecuted.toFixed(2)}万元`);

    const completedTotal = completedProjects.reduce((sum, p) => sum + p.budgetOccupied, 0);
    const completedExecuted = completedProjects.reduce((sum, p) => sum + p.budgetExecuted, 0);
    console.log(`📦 已完成验收预算: ${completedProjects.length}个项目`);
    console.log(`   预算占用: ${completedTotal.toFixed(4)}万元 | 预算执行: ${completedExecuted.toFixed(4)}万元`);

    const univTotal = universityProjects.reduce((sum, p) => sum + p.budgetOccupied, 0);
    const univExecuted = universityProjects.reduce((sum, p) => sum + p.budgetExecuted, 0);
    console.log(`📦 高校合作费: ${universityProjects.length}个项目`);
    console.log(`   预算占用: ${univTotal.toFixed(2)}万元 | 预算执行: ${univExecuted.toFixed(2)}万元`);

    const opTotal = operationProjects.reduce((sum, p) => sum + p.budgetOccupied, 0);
    const opExecuted = operationProjects.reduce((sum, p) => sum + p.budgetExecuted, 0);
    console.log(`📦 IDC运营研发费: ${operationProjects.length}个项目`);
    console.log(`   预算占用: ${opTotal.toFixed(2)}万元 | 预算执行: ${opExecuted.toFixed(2)}万元`);

    console.log('');
    console.log('----------------------------');
    const totalOccupied = pendingTotal + completedTotal + univTotal + opTotal;
    const totalExecuted = pendingExecuted + completedExecuted + univExecuted + opExecuted;
    const remainingBudget = 300 - totalOccupied;
    console.log(`💰 预算汇总:`);
    console.log(`   总预算: 300万元`);
    console.log(`   预提待使用: ${pendingTotal.toFixed(2)}万元`);
    console.log(`   已完成验收: ${completedTotal.toFixed(4)}万元`);
    console.log(`   高校合作费: ${univTotal.toFixed(2)}万元`);
    console.log(`   IDC运营研发费: ${opTotal.toFixed(2)}万元`);
    console.log(`   剩余未使用预算: ${remainingBudget.toFixed(2)}万元`);
    console.log(`   已占用总计: ${totalOccupied.toFixed(4)}万元`);
    console.log(`   已执行总计: ${totalExecuted.toFixed(4)}万元`);
    console.log('----------------------------');
    console.log('');

    for (const projectData of allProjects) {
      await Project.create(projectData as any);
      console.log(`  ✓ Created: ${projectData.projectName} - ¥${projectData.budgetOccupied.toFixed(2)}万 (执行: ¥${projectData.budgetExecuted.toFixed(2)}万)`);
    }

    console.log('');
    console.log(`✅ Successfully seeded ${allProjects.length} projects for 2025`);

  } catch (error) {
    console.error('❌ Error seeding 2025 budget projects:', error);
  }
};
