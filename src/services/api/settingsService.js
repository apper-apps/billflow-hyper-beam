import settingsData from "@/services/mockData/settings.json";

class SettingsService {
  constructor() {
    this.settings = { ...settingsData };
  }

  async getSettings() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.settings };
  }

  async updateCompanyInfo(companyInfo) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.settings.company = {
      ...this.settings.company,
      ...companyInfo
    };
    
    return { ...this.settings.company };
  }

  async changePassword(currentPassword, newPassword) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you would validate the current password
    if (!currentPassword) {
      throw new Error("Current password is required");
    }

    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Password changed successfully (in real app, this would be handled by backend)
    return { success: true };
  }

  async updateEmail(newEmail) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!newEmail || !newEmail.includes('@')) {
      throw new Error("Valid email address is required");
    }

    this.settings.company.email = newEmail;
    return { success: true };
  }

  async updatePreferences(preferences) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    this.settings.preferences = {
      ...this.settings.preferences,
      ...preferences
    };
    
    return { ...this.settings.preferences };
  }

  async resetToDefaults() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.settings = { ...settingsData };
    return { ...this.settings };
  }
}

export const settingsService = new SettingsService();