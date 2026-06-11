// Select the target database
db = db.getSiblingDB('esggo');

// Optional: Create a dedicated user for your application
db.createUser({
    user: 'esggo_user',
    pwd: 'esggo_password',
    roles: [{ role: 'readWrite', db: 'esggo' }],
});

// Create collections and insert seed data
db.createCollection('users');
db.users.insertMany([
    { name: 'Admin User', email: 'admin@esggo.com', role: 'admin', createdAt: new Date() },
    { name: 'Test User', email: 'test@esggo.com', role: 'user', createdAt: new Date() }
]);

db.createCollection('settings');
db.settings.insertOne({
    theme: 'dark',
    notificationsEnabled: true
});

print('✅ MongoDB seeded successfully with initial data!');