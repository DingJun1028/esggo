import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
    theme: { type: String, default: 'dark' },
    notificationsEnabled: { type: Boolean, default: true }
});

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);