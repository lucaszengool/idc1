import { seed2025BudgetProjects } from '../seed2025';
import sequelize from '../config/database';

async function main() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Import 2025 budget projects
    await seed2025BudgetProjects();

    console.log('✅ 2025 data import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing 2025 data:', error);
    process.exit(1);
  }
}

main();
