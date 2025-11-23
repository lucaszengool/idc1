"use strict";
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
        // Check if 2025 total budget already exists
        const existing2025Budget = await models_1.TotalBudget.findOne({
            where: { budgetYear: '2025' }
        });
        if (!existing2025Budget) {
            // Create 2025 total budget (300万元 based on the image: IDC架构研发240万 + IDC运营研发30万 + 高校合作30万)
            await models_1.TotalBudget.create({
                budgetYear: '2025',
                totalAmount: 300,
                createdBy: 'Admin'
            });
            console.log('✅ Created 2025 total budget: 300万元');
        }
        else {
            console.log('ℹ️  2025 total budget already exists');
        }
        // Check if 2025 projects already exist
        const existing2025Projects = await models_1.Project.count({
            where: { budgetYear: '2025' }
        });
        if (existing2025Projects === 0) {
            console.log('📝 Importing 2025 budget projects...');
            await (0, seed2025_1.seed2025BudgetProjects)();
        }
        else {
            console.log(`ℹ️  Found ${existing2025Projects} existing 2025 projects, skipping import`);
        }
        console.log('✅ 2025 budget setup completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error setting up 2025 budget:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=setup2025Budget.js.map