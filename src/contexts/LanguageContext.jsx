import React, { createContext, useState, useEffect } from "react";

const translations = {
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
      update: "Update",
      saving: "Saving...",
      loading: "Loading...",
      error: "Error",
      success: "Success"
    },
    settings: {
      company: {
        title: "Company Information",
        name: "Company Name",
        email: "Email Address",
        phone: "Phone Number",
        address: "Address",
        website: "Website",
        taxId: "Tax ID",
        saved: "Company information saved successfully",
        error: "Failed to save company information"
      },
      security: {
        title: "Security Settings",
        updateEmail: "Update Email Address",
        newEmail: "New Email Address",
        changePassword: "Change Password",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmPassword: "Confirm New Password",
        passwordMismatch: "Passwords do not match",
        passwordTooShort: "Password must be at least 8 characters",
        passwordChanged: "Password changed successfully",
        passwordError: "Failed to change password",
        emailUpdated: "Email updated successfully",
        emailError: "Failed to update email"
      },
      preferences: {
        title: "Preferences",
        currency: "Default Currency",
        language: "Language",
        saved: "Preferences saved successfully",
        error: "Failed to save preferences"
      }
    }
  },
  es: {
    common: {
      save: "Guardar",
      cancel: "Cancelar",
      update: "Actualizar",
      saving: "Guardando...",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito"
    },
    settings: {
      company: {
        title: "Información de la Empresa",
        name: "Nombre de la Empresa",
        email: "Dirección de Email",
        phone: "Número de Teléfono",
        address: "Dirección",
        website: "Sitio Web",
        taxId: "ID Fiscal",
        saved: "Información de la empresa guardada exitosamente",
        error: "Error al guardar la información de la empresa"
      },
      security: {
        title: "Configuración de Seguridad",
        updateEmail: "Actualizar Dirección de Email",
        newEmail: "Nueva Dirección de Email",
        changePassword: "Cambiar Contraseña",
        currentPassword: "Contraseña Actual",
        newPassword: "Nueva Contraseña",
        confirmPassword: "Confirmar Nueva Contraseña",
        passwordMismatch: "Las contraseñas no coinciden",
        passwordTooShort: "La contraseña debe tener al menos 8 caracteres",
        passwordChanged: "Contraseña cambiada exitosamente",
        passwordError: "Error al cambiar la contraseña",
        emailUpdated: "Email actualizado exitosamente",
        emailError: "Error al actualizar el email"
      },
      preferences: {
        title: "Preferencias",
        currency: "Moneda Predeterminada",
        language: "Idioma",
        saved: "Preferencias guardadas exitosamente",
        error: "Error al guardar las preferencias"
      }
    }
  }
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("app-language");
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem("app-language", newLanguage);
    }
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};