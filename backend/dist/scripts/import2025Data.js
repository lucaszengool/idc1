"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seed2025_1 = require("../seed2025");
const database_1 = __importDefault(require("../config/database"));
async function main() {
    try {
        console.log('🔄 Connecting to database...');
        await database_1.default.authenticate();
        console.log('✅ Database connected');
        // Import 2025 budget projects
        await (0, seed2025_1.seed2025BudgetProjects)();
        console.log('✅ 2025 data import completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error importing 2025 data:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=import2025Data.js.map