import sequelize from '../config/database';
import { TotalBudget, Project } from '../models';
import { seed2025BudgetProjects } from '../seed2025';

async function main() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check if 2025 total budget already exists
    const existing2025Budget = await TotalBudget.findOne({
      where: { budgetYear: '2025' }
    });

    if (!existing2025Budget) {
      // Create 2025 total budget (300万元 based on the image: IDC架构研发240万 + IDC运营研发30万 + 高校合作30万)
      await TotalBudget.create({
        budgetYear: '2025',
        totalAmount: 300,
        createdBy: 'Admin'
      });
      console.log('✅ Created 2025 total budget: 300万元');
    } else {
      console.log('ℹ️  2025 total budget already exists');
    }

    // Check if 2025 projects already exist
    const existing2025Projects = await Project.count({
      where: { budgetYear: '2025' }
    });

    if (existing2025Projects === 0) {
      console.log('📝 Importing 2025 budget projects...');
      await seed2025BudgetProjects();
    } else {
      console.log(`ℹ️  Found ${existing2025Projects} existing 2025 projects, skipping import`);
    }

    console.log('✅ 2025 budget setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up 2025 budget:', error);
    process.exit(1);
  }
}

main();
