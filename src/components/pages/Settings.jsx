import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { settingsService } from "@/services/api/settingsService";
import { LanguageContext } from "@/contexts/LanguageContext";
import { CurrencyContext } from "@/contexts/CurrencyContext";

const Settings = () => {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const { currency, setCurrency } = useContext(CurrencyContext);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [settings, setSettings] = useState({
    company: {
      name: "",
      email: "",
phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      website: "",
      taxId: ""
    },
    security: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    preferences: {
      currency: "USD",
      language: "en"
    }
  });
  const [saving, setSaving] = useState({
    company: false,
    security: false,
    preferences: false
  });

  const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "MXN", label: "Mexican Peso ($)" },
    { value: "BRL", label: "Brazilian Real (R$)" }
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const handleCompanyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value
      }
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const saveCompanyInfo = async (e) => {
    e.preventDefault();
    try {
      setSaving(prev => ({ ...prev, company: true }));
      await settingsService.updateCompanyInfo(settings.company);
      toast.success(t('settings.company.saved'));
    } catch (err) {
      toast.error(t('settings.company.error'));
    } finally {
      setSaving(prev => ({ ...prev, company: false }));
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    
    if (settings.security.newPassword !== settings.security.confirmPassword) {
      toast.error(t('settings.security.passwordMismatch'));
      return;
    }

    if (settings.security.newPassword.length < 8) {
      toast.error(t('settings.security.passwordTooShort'));
      return;
    }

    try {
      setSaving(prev => ({ ...prev, security: true }));
      await settingsService.changePassword(
        settings.security.currentPassword,
        settings.security.newPassword
      );
      
      setSettings(prev => ({
        ...prev,
        security: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }
      }));
      
      toast.success(t('settings.security.passwordChanged'));
    } catch (err) {
      toast.error(t('settings.security.passwordError'));
    } finally {
      setSaving(prev => ({ ...prev, security: false }));
    }
  };

  const updateEmail = async () => {
    try {
      await settingsService.updateEmail(settings.company.email);
      toast.success(t('settings.security.emailUpdated'));
    } catch (err) {
      toast.error(t('settings.security.emailError'));
    }
  };

  const savePreferences = async (e) => {
    e.preventDefault();
    try {
      setSaving(prev => ({ ...prev, preferences: true }));
      await settingsService.updatePreferences(settings.preferences);
      
      // Update contexts
      setLanguage(settings.preferences.language);
      setCurrency(settings.preferences.currency);
      
      toast.success(t('settings.preferences.saved'));
    } catch (err) {
      toast.error(t('settings.preferences.error'));
    } finally {
      setSaving(prev => ({ ...prev, preferences: false }));
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSettings} />;

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
            <ApperIcon name="Building" className="h-5 w-5 text-white" />
          </div>
          <h2 className="ml-3 text-xl font-semibold text-gray-900">
            {t('settings.company.title')}
          </h2>
        </div>

<form onSubmit={saveCompanyInfo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label={t('settings.company.name')}
              value={settings.company.name}
              onChange={(e) => handleCompanyChange('name', e.target.value)}
              required
            />
            <FormField
              type="email"
              label={t('settings.company.email')}
              value={settings.company.email}
              onChange={(e) => handleCompanyChange('email', e.target.value)}
              required
            />
            <FormField
              type="tel"
              label={t('settings.company.phone')}
              value={settings.company.phone}
onChange={(e) => handleCompanyChange('phone', e.target.value)}
            />
            <FormField
              label={t('settings.company.website')}
              value={settings.company.website}
              onChange={(e) => handleCompanyChange('website', e.target.value)}
              placeholder="https://www.example.com"
            />
            <FormField
              label={t('settings.company.taxId')}
              value={settings.company.taxId}
              onChange={(e) => handleCompanyChange('taxId', e.target.value)}
            />
          </div>

          <div>
            <FormField
              label={t('settings.company.address')}
              value={settings.company.address}
              onChange={(e) => handleCompanyChange('address', e.target.value)}
              placeholder={t('clients.form.addressPlaceholder')}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label={t('settings.company.city')}
              value={settings.company.city}
              onChange={(e) => handleCompanyChange('city', e.target.value)}
              placeholder={t('clients.form.cityPlaceholder')}
            />
            <FormField
              label={t('settings.company.state')}
              value={settings.company.state}
              onChange={(e) => handleCompanyChange('state', e.target.value)}
              placeholder={t('clients.form.statePlaceholder')}
            />
            <FormField
              label={t('settings.company.country')}
              value={settings.company.country}
              onChange={(e) => handleCompanyChange('country', e.target.value)}
              placeholder={t('clients.form.countryPlaceholder')}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving.company}
              className="flex items-center space-x-2"
            >
              {saving.company && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
              <span>{saving.company ? t('common.saving') : t('common.save')}</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg">
            <ApperIcon name="Shield" className="h-5 w-5 text-white" />
          </div>
          <h2 className="ml-3 text-xl font-semibold text-gray-900">
            {t('settings.security.title')}
          </h2>
        </div>

        <div className="space-y-6">
          {/* Email Update */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('settings.security.updateEmail')}
            </h3>
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <FormField
                  type="email"
                  label={t('settings.security.newEmail')}
                  value={settings.company.email}
                  onChange={(e) => handleCompanyChange('email', e.target.value)}
                />
              </div>
              <Button onClick={updateEmail} variant="outline">
                {t('common.update')}
              </Button>
            </div>
          </div>

          {/* Password Change */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('settings.security.changePassword')}
            </h3>
            <form onSubmit={changePassword} className="space-y-4">
              <FormField
                type="password"
                label={t('settings.security.currentPassword')}
                value={settings.security.currentPassword}
                onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="password"
                  label={t('settings.security.newPassword')}
                  value={settings.security.newPassword}
                  onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                  required
                />
                <FormField
                  type="password"
                  label={t('settings.security.confirmPassword')}
                  value={settings.security.confirmPassword}
                  onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={saving.security}
                  className="flex items-center space-x-2"
                >
                  {saving.security && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
                  <span>{saving.security ? t('common.saving') : t('settings.security.changePassword')}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg">
            <ApperIcon name="Settings" className="h-5 w-5 text-white" />
          </div>
          <h2 className="ml-3 text-xl font-semibold text-gray-900">
            {t('settings.preferences.title')}
          </h2>
        </div>

        <form onSubmit={savePreferences} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              type="select"
              label={t('settings.preferences.currency')}
              value={settings.preferences.currency}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              options={currencies}
            />
            <FormField
              type="select"
              label={t('settings.preferences.language')}
              value={settings.preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              options={languages}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving.preferences}
              className="flex items-center space-x-2"
            >
              {saving.preferences && <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />}
              <span>{saving.preferences ? t('common.saving') : t('common.save')}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Settings;