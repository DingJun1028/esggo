import User from '../models/User';
import Setting from '../models/Setting';

export async function seedDatabase() {
    try {
        // Check if users already exist
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('🌱 Seeding users...');
            await User.insertMany([
                { name: 'Admin User', email: 'admin@esggo.com', role: 'admin' },
                { name: 'Test User', email: 'test@esggo.com', role: 'user' }
            ]);
            console.log('✅ Users seeded successfully.');
        }

        // Check if settings already exist
        const settingCount = await Setting.countDocuments();
        if (settingCount === 0) {
            console.log('🌱 Seeding settings...');
            await Setting.create({
                theme: 'dark',
                notificationsEnabled: true
            });
            console.log('✅ Settings seeded successfully.');
        }
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
}