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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const cors_1 = __importDefault(require("./middleware/cors"));
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const models_1 = require("./models");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
// Security middleware
app.use((0, helmet_1.default)());
// CORS middleware
app.use(cors_1.default);
// Logging middleware
app.use((0, morgan_1.default)('combined'));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static file serving for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Create uploads directory if it doesn't exist
const fs_1 = __importDefault(require("fs"));
const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Health check endpoint
app.get('/health', async (req, res) => {
    let dbStatus = 'unknown';
    try {
        await database_1.default.authenticate();
        dbStatus = 'connected';
    }
    catch (error) {
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
app.use('/api', routes_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
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
        const { Project } = await Promise.resolve().then(() => __importStar(require('./models')));
        const projects2026 = [
            // IDC架构研发 - T-AIDC架构研发 (315万元)
            {
                projectCode: "IDC-2026-001",
                projectName: "T-AIDC(含LC-MDC)结构研发",
                category: "IDC架构研发",
                subProjectName: "T-AIDC架构研发",
                projectType: "重点",
                projectStatus: "待开始",
                owner: "keisenzeng",
                members: "",
                projectGoal: "研发基础底座、辅助类含封层结构件及分区交互组件",
                projectBackground: "T-AIDC(含LC-MDC)结构研发",
                projectExplanation: "1、结构：研发基础底座、辅助类含封层结构件及分区交互组件；2、配电：研发小母线、电容补偿、≥400V高压技术提高配电系统效率及稳定性；3、暖通：研发氟-水/低水温CDU等空调设备，支持风冷热量换兼容设计；4、弱电：研发一体化交付弱电系统，集成配电、暖通等设备监控系统；5、水质：基于25年高校合作机理研究成果，研发液冷水质自动检测装置；",
                procurementCode: "TBD-2026-001",
                completionStatus: "未结项",
                relatedBudgetProject: "T-AIDC架构研发",
                budgetYear: "2026",
                budgetOccupied: 160,
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
                budgetOccupied: 30,
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
                budgetOccupied: 15,
                budgetExecuted: 0,
                orderAmount: 0,
                acceptanceAmount: 0,
                contractOrderNumber: "",
                approvalStatus: "draft"
            },
            {
                projectCode: "IDC-2026-005",
                projectName: "传感网络技术研发(弱电)",
                category: "IDC架构研发",
                subProjectName: "T-AIDC架构研发",
                projectType: "常规",
                projectStatus: "待开始",
                owner: "terryxyan",
                members: "",
                projectGoal: "研发设施控制器PIC、定位设备及融合摄像头",
                projectBackground: "传感网络技术研发",
                projectExplanation: "1、控制技术：研发设施控制器PIC，国产化切换、逻辑自编程自仿真；2、定位技术：研发设施和人员定位设备，建设提效和人员精细化管理；3、视觉技术：研发融合摄像头，探索视觉和设施健康度融合管理。",
                procurementCode: "TBD-2026-005",
                completionStatus: "未结项",
                relatedBudgetProject: "T-AIDC架构研发",
                budgetYear: "2026",
                budgetOccupied: 40,
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
            await Project.create(projectData);
            console.log(`  ✓ Created: ${projectData.projectName}`);
        }
        console.log(`✅ Successfully seeded ${projects2026.length} projects for 2026`);
    }
    catch (error) {
        console.error('❌ Error seeding 2026 budget projects:', error);
    }
};
const initializeDatabase = async () => {
    try {
        console.log('Initializing database...');
        // Test database connection with retry logic
        let retries = 5;
        while (retries > 0) {
            try {
                await database_1.default.authenticate();
                console.log('Database connection has been established successfully.');
                break;
            }
            catch (error) {
                retries--;
                console.log(`Database connection failed. Retries left: ${retries}`);
                if (retries === 0) {
                    console.error('Failed to connect to database after all retries:', error);
                    return; // Continue without database
                }
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            }
        }
        // Sync database models BEFORE defining associations to avoid conflicts
        console.log('Syncing database models...');
        await database_1.default.sync({ force: true });
        console.log('Database models synchronized with force recreate.');
        // Define model associations after sync
        console.log('Defining model associations...');
        (0, models_1.defineAssociations)();
        console.log('Model associations defined successfully.');
        // Seed 2026 budget projects
        await seed2026BudgetProjects();
        // Seed 2025 budget projects
        const { seed2025BudgetProjects } = await Promise.resolve().then(() => __importStar(require('./seed2025')));
        await seed2025BudgetProjects();
    }
    catch (error) {
        console.error('Database initialization error:', error);
        console.log('Server will continue running without database functionality.');
    }
};
// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down server...');
    try {
        await database_1.default.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=index.js.map