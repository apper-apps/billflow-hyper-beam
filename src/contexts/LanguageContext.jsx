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
      success: "Success",
      days: "days",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      search: "Search",
      add: "Add"
    },
    navigation: {
      dashboard: "Dashboard",
      clients: "Clients",
      services: "Services",
      quotations: "Quotations",
      bills: "Bills",
      payments: "Payments",
      settings: "Settings"
    },
    clients: {
      title: "Clients",
      subtitle: "Manage your client relationships and payment history",
      empty: {
        title: "No clients yet",
        description: "Start building your client base by adding your first client.",
        action: "Add Client"
      },
      actions: {
        add: "Add Client",
        edit: "Edit Client",
        delete: "Delete Client"
      },
      search: {
        placeholder: "Search clients..."
      },
      card: {
        paymentTerms: "Payment Terms",
        totalBilled: "Total Billed",
        paidAmount: "Paid Amount",
        pending: "Pending",
        overdue: "Overdue",
        added: "Added",
        bills: "bills"
      },
      modal: {
        title: "Add New Client",
        create: "Create Client",
        creating: "Creating..."
      },
      form: {
        name: "Company Name",
        email: "Email",
        phone: "Phone",
        address: "Address",
        addressPlaceholder: "Enter full address",
        city: "City",
        cityPlaceholder: "Enter city",
        state: "State",
        statePlaceholder: "Enter state",
        country: "Country",
        countryPlaceholder: "Select country",
        paymentTerms: "Payment Terms (days)"
      }
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
      success: "Éxito",
      days: "días",
      create: "Crear",
      edit: "Editar",
      delete: "Eliminar",
      search: "Buscar",
      add: "Agregar"
    },
    navigation: {
      dashboard: "Panel",
      clients: "Clientes",
      services: "Servicios",
      quotations: "Cotizaciones",
      bills: "Facturas",
      payments: "Pagos",
      settings: "Configuración"
    },
    clients: {
      title: "Clientes",
      subtitle: "Gestiona las relaciones con tus clientes y el historial de pagos",
      empty: {
        title: "No hay clientes aún",
        description: "Comienza a construir tu base de clientes agregando tu primer cliente.",
        action: "Agregar Cliente"
      },
      actions: {
        add: "Agregar Cliente",
        edit: "Editar Cliente",
        delete: "Eliminar Cliente"
      },
      search: {
        placeholder: "Buscar clientes..."
      },
      card: {
        paymentTerms: "Términos de Pago",
        totalBilled: "Total Facturado",
        paidAmount: "Monto Pagado",
        pending: "Pendiente",
        overdue: "Vencido",
        added: "Agregado",
        bills: "facturas"
      },
      modal: {
        title: "Agregar Nuevo Cliente",
        create: "Crear Cliente",
        creating: "Creando..."
      },
      form: {
        name: "Nombre de la Empresa",
        email: "Email",
        phone: "Teléfono",
        address: "Dirección",
        addressPlaceholder: "Ingrese la dirección completa",
        city: "Ciudad",
        cityPlaceholder: "Ingrese ciudad",
        state: "Estado",
        statePlaceholder: "Ingrese estado",
        country: "País",
        countryPlaceholder: "Seleccionar país",
        paymentTerms: "Términos de Pago (días)"
      }
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
  },
  fr: {
    common: {
      save: "Enregistrer",
      cancel: "Annuler",
      update: "Mettre à jour",
      saving: "Enregistrement...",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      days: "jours",
      create: "Créer",
      edit: "Modifier",
      delete: "Supprimer",
      search: "Rechercher",
      add: "Ajouter"
    },
    navigation: {
      dashboard: "Tableau de bord",
      clients: "Clients",
      services: "Services",
      quotations: "Devis",
      bills: "Factures",
      payments: "Paiements",
      settings: "Paramètres"
    },
    clients: {
      title: "Clients",
      subtitle: "Gérez vos relations clients et l'historique des paiements",
      empty: {
        title: "Aucun client pour le moment",
        description: "Commencez à construire votre base de clients en ajoutant votre premier client.",
        action: "Ajouter un Client"
      },
      actions: {
        add: "Ajouter un Client",
        edit: "Modifier le Client",
        delete: "Supprimer le Client"
      },
      search: {
        placeholder: "Rechercher des clients..."
      },
      card: {
        paymentTerms: "Conditions de Paiement",
        totalBilled: "Total Facturé",
        paidAmount: "Montant Payé",
        pending: "En attente",
        overdue: "En retard",
        added: "Ajouté",
        bills: "factures"
      },
      modal: {
        title: "Ajouter un Nouveau Client",
        create: "Créer le Client",
        creating: "Création..."
      },
      form: {
        name: "Nom de l'Entreprise",
        email: "Email",
        phone: "Téléphone",
        address: "Adresse",
        addressPlaceholder: "Saisir l'adresse complète",
        city: "Ville",
        cityPlaceholder: "Saisir la ville",
        state: "État",
        statePlaceholder: "Saisir l'état",
        country: "Pays",
        countryPlaceholder: "Sélectionner le pays",
        paymentTerms: "Conditions de Paiement (jours)"
      }
    },
    settings: {
      company: {
        title: "Informations sur l'Entreprise",
        name: "Nom de l'Entreprise",
        email: "Adresse Email",
        phone: "Numéro de Téléphone",
        address: "Adresse",
        website: "Site Web",
        taxId: "Numéro Fiscal",
        saved: "Informations de l'entreprise enregistrées avec succès",
        error: "Échec de l'enregistrement des informations de l'entreprise"
      },
      security: {
        title: "Paramètres de Sécurité",
        updateEmail: "Mettre à jour l'Adresse Email",
        newEmail: "Nouvelle Adresse Email",
        changePassword: "Changer le Mot de Passe",
        currentPassword: "Mot de Passe Actuel",
        newPassword: "Nouveau Mot de Passe",
        confirmPassword: "Confirmer le Nouveau Mot de Passe",
        passwordMismatch: "Les mots de passe ne correspondent pas",
        passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
        passwordChanged: "Mot de passe changé avec succès",
        passwordError: "Échec du changement de mot de passe",
        emailUpdated: "Email mis à jour avec succès",
        emailError: "Échec de la mise à jour de l'email"
      },
      preferences: {
        title: "Préférences",
        currency: "Devise par Défaut",
        language: "Langue",
        saved: "Préférences enregistrées avec succès",
        error: "Échec de l'enregistrement des préférences"
      }
    }
  },
  de: {
    common: {
      save: "Speichern",
      cancel: "Abbrechen",
      update: "Aktualisieren",
      saving: "Speichere...",
      loading: "Lade...",
      error: "Fehler",
      success: "Erfolg",
      days: "Tage",
      create: "Erstellen",
      edit: "Bearbeiten",
      delete: "Löschen",
      search: "Suchen",
      add: "Hinzufügen"
    },
    navigation: {
      dashboard: "Dashboard",
      clients: "Kunden",
      services: "Dienstleistungen",
      quotations: "Angebote",
      bills: "Rechnungen",
      payments: "Zahlungen",
      settings: "Einstellungen"
    },
    clients: {
      title: "Kunden",
      subtitle: "Verwalten Sie Ihre Kundenbeziehungen und Zahlungshistorie",
      empty: {
        title: "Noch keine Kunden",
        description: "Beginnen Sie mit dem Aufbau Ihrer Kundenbasis, indem Sie Ihren ersten Kunden hinzufügen.",
        action: "Kunde Hinzufügen"
      },
      actions: {
        add: "Kunde Hinzufügen",
        edit: "Kunde Bearbeiten",
        delete: "Kunde Löschen"
      },
      search: {
        placeholder: "Kunden suchen..."
      },
      card: {
        paymentTerms: "Zahlungsbedingungen",
        totalBilled: "Gesamt Berechnet",
        paidAmount: "Bezahlter Betrag",
        pending: "Ausstehend",
        overdue: "Überfällig",
        added: "Hinzugefügt",
        bills: "rechnungen"
      },
      modal: {
        title: "Neuen Kunden Hinzufügen",
        create: "Kunde Erstellen",
        creating: "Erstelle..."
      },
      form: {
        name: "Firmenname",
        email: "E-Mail",
        phone: "Telefon",
        address: "Adresse",
        addressPlaceholder: "Vollständige Adresse eingeben",
        city: "Stadt",
        cityPlaceholder: "Stadt eingeben",
        state: "Bundesland",
        statePlaceholder: "Bundesland eingeben",
        country: "Land",
        countryPlaceholder: "Land auswählen",
        paymentTerms: "Zahlungsbedingungen (Tage)"
      }
    },
    settings: {
      company: {
        title: "Unternehmensinformationen",
        name: "Firmenname",
        email: "E-Mail-Adresse",
        phone: "Telefonnummer",
        address: "Adresse",
        website: "Website",
        taxId: "Steuer-ID",
        saved: "Unternehmensinformationen erfolgreich gespeichert",
        error: "Fehler beim Speichern der Unternehmensinformationen"
      },
      security: {
        title: "Sicherheitseinstellungen",
        updateEmail: "E-Mail-Adresse Aktualisieren",
        newEmail: "Neue E-Mail-Adresse",
        changePassword: "Passwort Ändern",
        currentPassword: "Aktuelles Passwort",
        newPassword: "Neues Passwort",
        confirmPassword: "Neues Passwort Bestätigen",
        passwordMismatch: "Passwörter stimmen nicht überein",
        passwordTooShort: "Passwort muss mindestens 8 Zeichen lang sein",
        passwordChanged: "Passwort erfolgreich geändert",
        passwordError: "Fehler beim Ändern des Passworts",
        emailUpdated: "E-Mail erfolgreich aktualisiert",
        emailError: "Fehler beim Aktualisieren der E-Mail"
      },
      preferences: {
        title: "Einstellungen",
        currency: "Standardwährung",
        language: "Sprache",
        saved: "Einstellungen erfolgreich gespeichert",
        error: "Fehler beim Speichern der Einstellungen"
      }
    }
  },
  it: {
    common: {
      save: "Salva",
      cancel: "Annulla",
      update: "Aggiorna",
      saving: "Salvando...",
      loading: "Caricando...",
      error: "Errore",
      success: "Successo",
      days: "giorni",
      create: "Crea",
      edit: "Modifica",
      delete: "Elimina",
      search: "Cerca",
      add: "Aggiungi"
    },
    navigation: {
      dashboard: "Dashboard",
      clients: "Clienti",
      services: "Servizi",
      quotations: "Preventivi",
      bills: "Fatture",
      payments: "Pagamenti",
      settings: "Impostazioni"
    },
    clients: {
      title: "Clienti",
      subtitle: "Gestisci le relazioni con i clienti e la cronologia dei pagamenti",
      empty: {
        title: "Nessun cliente ancora",
        description: "Inizia a costruire la tua base clienti aggiungendo il tuo primo cliente.",
        action: "Aggiungi Cliente"
      },
      actions: {
        add: "Aggiungi Cliente",
        edit: "Modifica Cliente",
        delete: "Elimina Cliente"
      },
      search: {
        placeholder: "Cerca clienti..."
      },
      card: {
        paymentTerms: "Termini di Pagamento",
        totalBilled: "Totale Fatturato",
        paidAmount: "Importo Pagato",
        pending: "In sospeso",
        overdue: "Scaduto",
        added: "Aggiunto",
        bills: "fatture"
      },
      modal: {
        title: "Aggiungi Nuovo Cliente",
        create: "Crea Cliente",
        creating: "Creando..."
      },
      form: {
        name: "Nome Azienda",
        email: "Email",
        phone: "Telefono",
        address: "Indirizzo",
        addressPlaceholder: "Inserisci indirizzo completo",
        city: "Città",
        cityPlaceholder: "Inserisci città",
        state: "Stato",
        statePlaceholder: "Inserisci stato",
        country: "Paese",
        countryPlaceholder: "Seleziona paese",
        paymentTerms: "Termini di Pagamento (giorni)"
      }
    },
    settings: {
      company: {
        title: "Informazioni Azienda",
        name: "Nome Azienda",
        email: "Indirizzo Email",
        phone: "Numero di Telefono",
        address: "Indirizzo",
        website: "Sito Web",
        taxId: "Codice Fiscale",
        saved: "Informazioni azienda salvate con successo",
        error: "Errore nel salvare le informazioni azienda"
      },
      security: {
        title: "Impostazioni Sicurezza",
        updateEmail: "Aggiorna Indirizzo Email",
        newEmail: "Nuovo Indirizzo Email",
        changePassword: "Cambia Password",
        currentPassword: "Password Attuale",
        newPassword: "Nuova Password",
        confirmPassword: "Conferma Nuova Password",
        passwordMismatch: "Le password non corrispondono",
        passwordTooShort: "La password deve essere di almeno 8 caratteri",
        passwordChanged: "Password cambiata con successo",
        passwordError: "Errore nel cambiare la password",
        emailUpdated: "Email aggiornata con successo",
        emailError: "Errore nell'aggiornare l'email"
      },
      preferences: {
        title: "Preferenze",
        currency: "Valuta Predefinita",
        language: "Lingua",
        saved: "Preferenze salvate con successo",
        error: "Errore nel salvare le preferenze"
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