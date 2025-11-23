"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const models_1 = require("../models");
const crypto_1 = __importDefault(require("crypto"));
async function initializeData() {
    try {
        await database_1.default.authenticate();
        console.log('Database connected');
        // Create test PM users
        const pmUsers = [
            { username: 'keisenzeng', displayName: '曾启森', role: 'pm' },
            { username: 'jamesdqli', displayName: '李大强', role: 'pm' },
            { username: 'keweiliu', displayName: '刘克威', role: 'pm' },
            { username: 'tianqingwu', displayName: '吴天青', role: 'employee' },
            { username: 'jiabinzhang', displayName: '张家斌', role: 'employee' },
            { username: 'qingzhuhuo', displayName: '霍青竹', role: 'employee' },
            { username: 'mshuangliu', displayName: '刘明双', role: 'employee' }
        ];
        console.log('Creating users...');
        for (const pmData of pmUsers) {
            let user = await models_1.User.findOne({ where: { username: pmData.username } });
            if (!user) {
                const accessKey = crypto_1.default.randomBytes(16).toString('hex');
                await models_1.User.create({
                    accessKey,
                    username: pmData.username,
                    displayName: pmData.displayName,
                    role: pmData.role,
                    isActive: true
                });
                console.log(`✅ User ${pmData.displayName} created`);
            }
            else {
                console.log(`⏭️  User ${pmData.displayName} already exists`);
            }
        }
        // Create test groups
        const pm1 = await models_1.User.findOne({ where: { username: 'keisenzeng' } });
        const pm2 = await models_1.User.findOne({ where: { username: 'jamesdqli' } });
        const pm3 = await models_1.User.findOne({ where: { username: 'keweiliu' } });
        if (pm1 && pm2 && pm3) {
            const testGroups = [
                { groupName: 'IDC架构研发', pmId: pm1.id, createdBy: pm1.id },
                { groupName: 'IDC运营研发', pmId: pm2.id, createdBy: pm2.id },
                { groupName: 'TB架构研发', pmId: pm3.id, createdBy: pm3.id }
            ];
            console.log('Creating groups...');
            for (const groupData of testGroups) {
                let group = await models_1.Group.findOne({ where: { groupName: groupData.groupName } });
                if (!group) {
                    await models_1.Group.create(groupData);
                    console.log(`✅ Group ${groupData.groupName} created`);
                }
                else {
                    console.log(`⏭️  Group ${groupData.groupName} already exists`);
                }
            }
        }
        console.log('✅ Data initialization completed');
        process.exit(0);
    }
    catch (error) {
        console.error('Initialization error:', error);
        process.exit(1);
    }
}
initializeData();
//# sourceMappingURL=initializeData.js.map