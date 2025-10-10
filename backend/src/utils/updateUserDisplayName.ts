import sequelize from '../config/database';
import { User } from '../models';

/**
 * Update user displayName for jessyyang to 杨雯宇
 */
async function updateUserDisplayName() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Find user with username jessyyang
    const user = await User.findOne({ where: { username: 'jessyyang' } });

    if (user) {
      await user.update({ displayName: '杨雯宇' });
      console.log('✅ Successfully updated jessyyang displayName to: 杨雯宇');
    } else {
      // If user doesn't exist, create it
      const newUser = await User.create({
        username: 'jessyyang',
        displayName: '杨雯宇',
        role: 'pm',
        isActive: true,
        accessKey: require('crypto').randomBytes(16).toString('hex')
      });
      console.log('✅ Successfully created user jessyyang with displayName: 杨雯宇');
      console.log('Access Key:', newUser.accessKey);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    process.exit(1);
  }
}

updateUserDisplayName();
