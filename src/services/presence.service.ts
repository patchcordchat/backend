import UserSettings, { type UserStatus } from '@/models/user-settings';

export const setUserStatus = async (userId: string, status: UserStatus) => {
  try {
    await UserSettings.findOneAndUpdate(
      { user_id: userId },
      { status: status, updated_at: Date.now() },
      { upsert: true, new: true }
    );
    return status;
  } catch (error) {
    console.error('Error setting user status:', error);
    return null;
  }
};