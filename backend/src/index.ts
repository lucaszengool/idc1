import express from 'express';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sequelize from './config/database';
import corsMiddleware from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import { defineAssociations } from './models';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Security middleware
app.use(helmet());

// CORS middleware
app.use(corsMiddleware);

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
import { ensureUploadsDir } from './config/uploads';
const uploadsDir = ensureUploadsDir();

// Static file serving for uploads - use the same directory as uploads
app.use('/uploads', express.static(uploadsDir));
console.log(`📁 Serving uploads from: ${uploadsDir}`);

// Health check endpoint
app.get('/health', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'disconnected';
  }

  res.json({
    success: true,
    message: 'DCOPS Budget System API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus
  });
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Database connection and server startup
const startServer = async () => {
  // Start server immediately for health checks
  const server = app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Server is running on ${HOST}:${PORT}`);
    console.log(`📊 DCOPS Budget Management System API`);
    console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
    console.log(`📚 API base URL: http://${HOST}:${PORT}/api`);
  });

  // Initialize database in background
  initializeDatabase();

  return server;
};

// Seed 2026 Budget Projects
const seed2026BudgetProjects = async () => {
  try {
    const { Project } = await import('./models');

    // 删除旧的2026年项目，确保数据一致性
    const deletedCount = await Project.destroy({
      where: { budgetYear: '2026' }
    });
    if (deletedCount > 0) {
      console.log(`🗑️ 已删除 ${deletedCount} 个旧的2026年项目`);
    }

    const projects2026 = [
      // IDC架构研发 - T-AIDC架构研发 - 拆分为5个子项目 (共160万元)
      {
        projectCode: "IDC-2026-001A",
        projectName: "底座封闭通道等结构设备",
        category: "IDC架构研发",
        subProjectName: "T-AIDC架构研发",
        projectType: "重点",
        projectStatus: "待开始",
        owner: "seanzeng",
        members: "",
        projectGoal: "研发基础底座、辅助类含封层结构件及分区交互组件",
        projectBackground: "T-AIDC(含LC-MDC)架构研发-结构设备",
        projectExplanation: "研发基础底座、辅助类含封层结构件及分区交互组件",
        procurementCode: "TBD-2026-001A",
        completionStatus: "未结项",
        relatedBudgetProject: "T-AIDC架构研发",
        budgetYear: "2026",
        budgetOccupied: 30,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "IDC-2026-001B",
        projectName: "直流一体柜及其配套设备",
        category: "IDC架构研发",
        subProjectName: "T-AIDC架构研发",
        projectType: "重点",
        projectStatus: "待开始",
        owner: "seanzeng",
        members: "",
        projectGoal: "研发小母线、电容补偿、≥400V高压技术提高配电系统效率及稳定性",
        projectBackground: "T-AIDC(含LC-MDC)架构研发-配电设备",
        projectExplanation: "研发小母线、电容补偿、≥400V高压技术提高配电系统效率及稳定性",
        procurementCode: "TBD-2026-001B",
        completionStatus: "未结项",
        relatedBudgetProject: "T-AIDC架构研发",
        budgetYear: "2026",
        budgetOccupied: 30,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "IDC-2026-001C",
        projectName: "氟-水CDU、CT500/1000等制冷设备",
        category: "IDC架构研发",
        subProjectName: "T-AIDC架构研发",
        projectType: "重点",
        projectStatus: "待开始",
        owner: "seanzeng",
        members: "",
        projectGoal: "研发氟-水/低水温CDU等空调设备，支持风冷热量换兼容设计",
        projectBackground: "T-AIDC(含LC-MDC)架构研发-制冷设备",
        projectExplanation: "研发氟-水/低水温CDU等空调设备，支持风冷热量换兼容设计",
        procurementCode: "TBD-2026-001C",
        completionStatus: "未结项",
        relatedBudgetProject: "T-AIDC架构研发",
        budgetYear: "2026",
        budgetOccupied: 60,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "IDC-2026-001D",
        projectName: "弱电监控",
        category: "IDC架构研发",
        subProjectName: "T-AIDC架构研发",
        projectType: "重点",
        projectStatus: "待开始",
        owner: "seanzeng",
        members: "",
        projectGoal: "研发一体化交付弱电系统，集成配电、暖通等设备监控系统",
        projectBackground: "T-AIDC(含LC-MDC)架构研发-弱电监控",
        projectExplanation: "研发一体化交付弱电系统，集成配电、暖通等设备监控系统",
        procurementCode: "TBD-2026-001D",
        completionStatus: "未结项",
        relatedBudgetProject: "T-AIDC架构研发",
        budgetYear: "2026",
        budgetOccupied: 15,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "IDC-2026-001E",
        projectName: "水质检测工具模块",
        category: "IDC架构研发",
        subProjectName: "T-AIDC架构研发",
        projectType: "重点",
        projectStatus: "待开始",
        owner: "seanzeng",
        members: "",
        projectGoal: "基于25年高校合作机理研究成果，研发液冷水质自动检测装置",
        projectBackground: "T-AIDC(含LC-MDC)架构研发-水质检测",
        projectExplanation: "基于25年高校合作机理研究成果，研发液冷水质自动检测装置",
        procurementCode: "TBD-2026-001E",
        completionStatus: "未结项",
        relatedBudgetProject: "T-AIDC架构研发",
        budgetYear: "2026",
        budgetOccupied: 25,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "IDC-2026-002",
        projectName: "分布式柴发备电方案(电气)",
        category: "IDC架构研发",
        subProjectName: "T-AIDC架构研发",
        projectType: "重点",
        projectStatus: "待开始",
        owner: "mshuangliu",
        members: "",
        projectGoal: "柴发产品国产化、模块化及分布式架构研发",
        projectBackground: "分布式柴发备电方案",
        projectExplanation: "1、柴发产品国产化，解决进口柴发供应问题及成本问题；2、柴发产品模块化，提升产品质量和交付可靠性；3、分布式柴发备电架构，减小故障阈，提升可靠性。",
        procurementCode: "TBD-2026-002",
        completionStatus: "未结项",
        relatedBudgetProject: "T-AIDC架构研发",
        budgetYear: "2026",
        budgetOccupied: 70,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "IDC-2026-003",
        projectName: "JDM暖通空调产品优化升级研究(暖通)",
        category: "IDC架构研发",
        subProjectName: "T-AIDC架构研发",
        projectType: "常规",
        projectStatus: "待开始",
        owner: "keiweiliu",
        members: "",
        projectGoal: "通过部件国产化降低成本，采用紧凑型换热器提高能效",
        projectBackground: "JDM暖通空调产品优化升级研究",
        projectExplanation: "1、通过部件国产化，降低成本；2、采用紧凑型换热器提高能效；3、配备智能控制系统提高机组智能化程度。",
        procurementCode: "TBD-2026-003",
        completionStatus: "未结项",
        relatedBudgetProject: "T-AIDC架构研发",
        budgetYear: "2026",
        budgetOccupied: 25,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "IDC-2026-004",
        projectName: "CFD驱动的空调控制策略调优研究(暖通)",
        category: "IDC架构研发",
        subProjectName: "T-AIDC架构研发",
        projectType: "常规",
        projectStatus: "待开始",
        owner: "fennyliu",
        members: "",
        projectGoal: "通过CFD联合开发，对空调设备进行调优，并验证线上化CFD技术可行性",
        projectBackground: "CFD驱动的空调控制策略调优研究",
        projectExplanation: "通过CFD联合开发，对空调设备进行调优，并验证线上化CFD技术可行性：1、空调控制：实时分析机房负荷、空调及环境数据，同步仿真计算并下发策略；2、故障预测：实时采集部件状态与模拟部件预期状态比对，进行部件故障预测；",
        procurementCode: "TBD-2026-004",
        completionStatus: "未结项",
        relatedBudgetProject: "T-AIDC架构研发",
        budgetYear: "2026",
        budgetOccupied: 20,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "IDC-2026-005A",
        projectName: "控制技术",
        category: "IDC架构研发",
        subProjectName: "传感网络技术研发",
        projectType: "常规",
        projectStatus: "待开始",
        owner: "terryxyan",
        members: "",
        projectGoal: "研发设施控制器PIC，国产化切换、逻辑自编程自仿真",
        projectBackground: "传感网络技术研发-控制技术",
        projectExplanation: "研发设施控制器PIC，国产化切换、逻辑自编程自仿真",
        procurementCode: "TBD-2026-005A",
        completionStatus: "未结项",
        relatedBudgetProject: "传感网络技术研发",
        budgetYear: "2026",
        budgetOccupied: 20,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "IDC-2026-005B",
        projectName: "视觉技术",
        category: "IDC架构研发",
        subProjectName: "传感网络技术研发",
        projectType: "常规",
        projectStatus: "待开始",
        owner: "terryxyan",
        members: "",
        projectGoal: "研发融合摄像头，探索视觉和设施健康度融合管理",
        projectBackground: "传感网络技术研发-视觉技术",
        projectExplanation: "研发融合摄像头，探索视觉和设施健康度融合管理",
        procurementCode: "TBD-2026-005B",
        completionStatus: "未结项",
        relatedBudgetProject: "传感网络技术研发",
        budgetYear: "2026",
        budgetOccupied: 20,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      // 高校合作 (30万元)
      {
        projectCode: "IDC-2026-006",
        projectName: "暖通基础设施健康度和可靠性研究(暖通)",
        category: "高校合作",
        subProjectName: "暖通基础设施健康度研究",
        projectType: "常规",
        projectStatus: "待开始",
        owner: "dowpuyang",
        members: "",
        projectGoal: "基础设施核心部件和整机的健康度评估",
        projectBackground: "暖通基础设施健康度和可靠性研究",
        projectExplanation: "暖IDM基础设施核心部件和整机的健康度评估",
        procurementCode: "TBD-2026-006",
        completionStatus: "未结项",
        relatedBudgetProject: "高校合作",
        budgetYear: "2026",
        budgetOccupied: 30,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      // IDC运营-研发 (65万元)
      {
        projectCode: "OPS-2026-001",
        projectName: "AHU性能AI调优工具",
        category: "IDC运营-研发",
        subProjectName: "AHU性能AI调优",
        projectType: "常规",
        projectStatus: "待开始",
        owner: "ariestzhang",
        members: "",
        projectGoal: "通过试点落地AI技术，期望未来批量化实现对AHU的精细化能耗管理",
        projectBackground: "AHU性能AI调优工具",
        projectExplanation: "通过试点落地AI技术，期望未来批量化实现对AHU的精细化能耗管理。",
        procurementCode: "TBD-2026-007",
        completionStatus: "未结项",
        relatedBudgetProject: "IDC运营辅助工具",
        budgetYear: "2026",
        budgetOccupied: 10,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "OPS-2026-002",
        projectName: "液冷测试用假负载自研项目",
        category: "IDC运营-研发",
        subProjectName: "液冷假负载自研",
        projectType: "常规",
        projectStatus: "待开始",
        owner: "ariestzhang",
        members: "",
        projectGoal: "完成2台样机定制和测试，实现液冷项目验证测试设备的智能化和标准化管理",
        projectBackground: "液冷测试用假负载自研项目",
        projectExplanation: "液冷项目规模持续扩大，需要匹配新型液冷假负载完成验证测试工作：1、计划完成2台样机定制和测试：编制并发布详细的产品技术规格书和使用说明；2、升级腾讯自动化验证测试工作指导及竞争性谈判技术文件：实现未来腾讯液冷项目中验证测试设备的智能化和标准化管理。",
        procurementCode: "TBD-2026-008",
        completionStatus: "未结项",
        relatedBudgetProject: "IDC运营辅助工具",
        budgetYear: "2026",
        budgetOccupied: 15,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "OPS-2026-003",
        projectName: "中低压配电逻辑自动化测试工具",
        category: "IDC运营-研发",
        subProjectName: "配电逻辑自动化测试",
        projectType: "常规",
        projectStatus: "待开始",
        owner: "ariestzhang",
        members: "",
        projectGoal: "设计自动化测试工具，实现中低压逻辑的自动测试和判定",
        projectBackground: "中低压配电逻辑自动化测试工具",
        projectExplanation: "设计一套自动化测试工具，通过预设程序自动模拟各路信号，接入被测中低压配电柜的电压采样回路，实现停电等故障场景的模拟，同时实时采样断路器的分合闸状态，实现中低压逻辑的自动测试和判定。",
        procurementCode: "TBD-2026-009",
        completionStatus: "未结项",
        relatedBudgetProject: "IDC运营辅助工具",
        budgetYear: "2026",
        budgetOccupied: 10,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      },
      {
        projectCode: "OPS-2026-004",
        projectName: "电池全容量核容工具pro版",
        category: "IDC运营-研发",
        subProjectName: "电池核容工具升级",
        projectType: "常规",
        projectStatus: "待开始",
        owner: "qinglzhuosu",
        members: "",
        projectGoal: "提升放电测试的便捷性、节能性、安全性，匹配新一代TB高压直流一体柜设计",
        projectBackground: "电池全容量核容工具pro版",
        projectExplanation: "为了提升放电测试的便捷性、节能性、安全性，同时也为了更好匹配新一代TB高压直流一体柜的设计(预留测试接口)，需预研新一代电池核容工具Pro版。",
        procurementCode: "TBD-2026-010",
        completionStatus: "未结项",
        relatedBudgetProject: "IDC运营辅助工具",
        budgetYear: "2026",
        budgetOccupied: 30,
        budgetExecuted: 0,
        orderAmount: 0,
        acceptanceAmount: 0,
        contractOrderNumber: "",
        approvalStatus: "draft"
      }
    ];

    console.log('📝 Seeding 2026 budget projects...');
    for (const projectData of projects2026) {
      await Project.create(projectData as any);
      console.log(`  ✓ Created: ${projectData.projectName}`);
    }
    console.log(`✅ Successfully seeded ${projects2026.length} projects for 2026`);

  } catch (error) {
    console.error('❌ Error seeding 2026 budget projects:', error);
  }
};

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');

    // Define model associations BEFORE sync
    console.log('Defining model associations...');
    defineAssociations();
    console.log('Model associations defined successfully.');

    // Test database connection with retry logic
    let retries = 5;
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        break;
      } catch (error) {
        retries--;
        console.log(`Database connection failed. Retries left: ${retries}`);
        if (retries === 0) {
          console.error('Failed to connect to database after all retries:', error);
          return; // Continue without database
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      }
    }

    // Sync database models AFTER defining associations
    console.log('Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Create initial users and groups if they don't exist
    console.log('Creating initial users and groups...');
    const { User, Group } = await import('./models');
    const crypto = await import('crypto');

    // Create test PM users if not exists
    const pmUsers = [
      { username: 'seanzeng', displayName: '曾启森', role: 'pm' as const },
      { username: 'jamesdqli', displayName: '李大强', role: 'pm' as const },
      { username: 'keweiliu', displayName: '刘克威', role: 'pm' as const },
      { username: 'tianqingwu', displayName: '吴天青', role: 'employee' as const },
      { username: 'jiabinzhang', displayName: '张家斌', role: 'employee' as const },
      { username: 'qingzhuhuo', displayName: '霍青竹', role: 'employee' as const },
      { username: 'mshuangliu', displayName: '刘明双', role: 'employee' as const },
      { username: 'jessyyang', displayName: '杨雯宇', role: 'pm' as const },
      { username: 'wenyuyang', displayName: '杨雯宇', role: 'pm' as const }
    ];

    const bcrypt = await import('bcryptjs');
    const DEFAULT_HASHED_PASSWORD = await bcrypt.hash('123456', 10);

    for (const pmData of pmUsers) {
      let user = await User.findOne({ where: { username: pmData.username } });
      if (!user) {
        const accessKey = crypto.randomBytes(16).toString('hex');
        await User.create({
          accessKey,
          username: pmData.username,
          password: DEFAULT_HASHED_PASSWORD,
          displayName: pmData.displayName,
          role: pmData.role,
          isActive: true
        });
        console.log(`✅ User ${pmData.displayName} created`);
      } else if (user.displayName !== pmData.displayName) {
        await user.update({ displayName: pmData.displayName, role: pmData.role });
        console.log(`✅ User ${pmData.displayName} updated`);
      }
    }

    // Set default password for all existing users without password
    const usersWithoutPassword = await User.findAll({
      where: { password: null as any }
    });
    for (const user of usersWithoutPassword) {
      await user.update({ password: DEFAULT_HASHED_PASSWORD });
      console.log(`✅ Default password set for ${user.username}`);
    }

    // Create test groups if not exists
    const pm1 = await User.findOne({ where: { username: 'seanzeng' } });
    const pm2 = await User.findOne({ where: { username: 'jamesdqli' } });
    const pm3 = await User.findOne({ where: { username: 'keweiliu' } });

    if (pm1 && pm2 && pm3) {
      const testGroups = [
        { groupName: 'IDC架构研发', pmId: pm1.id, createdBy: pm1.id },
        { groupName: 'IDC运营研发', pmId: pm2.id, createdBy: pm2.id },
        { groupName: 'TB架构研发', pmId: pm3.id, createdBy: pm3.id }
      ];

      for (const groupData of testGroups) {
        let group = await Group.findOne({ where: { groupName: groupData.groupName } });
        if (!group) {
          await Group.create(groupData);
          console.log(`✅ Group ${groupData.groupName} created`);
        }
      }
    }

    console.log('✅ Initial users and groups ready');

    // Create total budgets for 2025 and 2026
    console.log('Creating total budgets...');
    const { TotalBudget } = await import('./models');
    let budget2025 = await TotalBudget.findOne({ where: { budgetYear: '2025' } });
    if (!budget2025) {
      await TotalBudget.create({ budgetYear: '2025', totalAmount: 300, createdBy: 'Admin' });
    }
    let budget2026 = await TotalBudget.findOne({ where: { budgetYear: '2026' } });
    if (!budget2026) {
      await TotalBudget.create({ budgetYear: '2026', totalAmount: 410, createdBy: 'Admin' });
    } else if (parseFloat(budget2026.totalAmount?.toString() || '0') === 0) {
      await budget2026.update({ totalAmount: 410 });
    }
    console.log('✅ Total budgets created');

    // Seed 2026 budget projects
    await seed2026BudgetProjects();

    // Seed 2025 budget projects
    const { seed2025BudgetProjects } = await import('./seed2025');
    await seed2025BudgetProjects();

  } catch (error) {
    console.error('Database initialization error:', error);
    console.log('Server will continue running without database functionality.');
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server...');
  try {
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();