import { toast } from "react-toastify";

class SettingsService {
  constructor() {
    this.cachedSettings = null;
  }

  async getSettings() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "company" } },
          { field: { Name: "preferences" } },
          { field: { Name: "security" } }
        ]
      };

      const response = await apperClient.fetchRecords('setting', params);

      if (!response.success) {
        console.error(response.message);
        // Return default settings if fetch fails
        return this.getDefaultSettings();
      }

      if (response.data && response.data.length > 0) {
        const setting = response.data[0];
        const parsedSettings = {
          Id: setting.Id,
          company: JSON.parse(setting.company || '{}'),
          preferences: JSON.parse(setting.preferences || '{}'),
          security: JSON.parse(setting.security || '{}')
        };
        this.cachedSettings = parsedSettings;
        return parsedSettings;
      } else {
        // Create initial settings if none exist
        return await this.createInitialSettings();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching settings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      Id: 1,
      company: {
        name: "Your Agency Name",
        email: "admin@youragency.com",
        phone: "+1 (555) 123-4567",
        city: "New York",
        state: "NY",
        country: "United States",
        website: "https://www.youragency.com",
        taxId: "12-3456789"
      },
      preferences: {
        currency: "USD",
        language: "en",
        timezone: "America/New_York",
        dateFormat: "MM/DD/YYYY",
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: "2024-01-15T10:30:00Z",
        sessionTimeout: 480
      }
    };
  }

  async createInitialSettings() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const defaultSettings = this.getDefaultSettings();

      const updateableData = {
        Name: "Default Settings",
        company: JSON.stringify(defaultSettings.company),
        preferences: JSON.stringify(defaultSettings.preferences),
        security: JSON.stringify(defaultSettings.security)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('setting', params);

      if (!response.success) {
        console.error(response.message);
        return defaultSettings;
      }

      if (response.results && response.results.length > 0) {
        const created = response.results[0];
        if (created.success) {
          this.cachedSettings = {
            ...defaultSettings,
            Id: created.data.Id
          };
          return this.cachedSettings;
        }
      }

      return defaultSettings;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating initial settings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return this.getDefaultSettings();
    }
  }

  async updateCompanyInfo(companyInfo) {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        company: {
          ...currentSettings.company,
          ...companyInfo
        }
      };

      const success = await this.updateSettings(updatedSettings);
      if (success) {
        this.cachedSettings = updatedSettings;
        return updatedSettings.company;
      }
      return currentSettings.company;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating company info:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      // In a real app, you would validate the current password
      if (!currentPassword) {
        throw new Error("Current password is required");
      }

      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Update security settings
      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        security: {
          ...currentSettings.security,
          lastPasswordChange: new Date().toISOString()
        }
      };

      const success = await this.updateSettings(updatedSettings);
      if (success) {
        this.cachedSettings = updatedSettings;
      }

      // Password changed successfully (in real app, this would be handled by backend)
      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error changing password:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async updateEmail(newEmail) {
    try {
      if (!newEmail || !newEmail.includes('@')) {
        throw new Error("Valid email address is required");
      }

      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        company: {
          ...currentSettings.company,
          email: newEmail
        }
      };

      const success = await this.updateSettings(updatedSettings);
      if (success) {
        this.cachedSettings = updatedSettings;
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating email:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async updatePreferences(preferences) {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        preferences: {
          ...currentSettings.preferences,
          ...preferences
        }
      };

      const success = await this.updateSettings(updatedSettings);
      if (success) {
        this.cachedSettings = updatedSettings;
        return updatedSettings.preferences;
      }
      return currentSettings.preferences;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating preferences:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async updateSettings(settings) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateableData = {
        Id: parseInt(settings.Id),
        Name: settings.Name || "Default Settings",
        company: JSON.stringify(settings.company),
        preferences: JSON.stringify(settings.preferences),
        security: JSON.stringify(settings.security)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('setting', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update settings ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating settings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async resetToDefaults() {
    try {
      const defaultSettings = this.getDefaultSettings();
      const success = await this.updateSettings(defaultSettings);
      if (success) {
        this.cachedSettings = defaultSettings;
        return defaultSettings;
      }
      return this.cachedSettings || defaultSettings;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error resetting to defaults:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export const settingsService = new SettingsService();