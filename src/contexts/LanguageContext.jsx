import React, { createContext, useEffect, useState } from "react";

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
      delete: "Eliminar",
      edit: "Editar",
      add: "Agregar",
      search: "Buscar",
      filter: "Filtrar",
      actions: "Acciones",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      confirmation: "Confirmación",
      yes: "Sí",
      no: "No",
      close: "Cerrar",
      view: "Ver",
      details: "Detalles",
      status: "Estado",
      date: "Fecha",
      amount: "Cantidad",
      total: "Total",
      subtotal: "Subtotal",
      tax: "Impuesto",
      discount: "Descuento",
      paid: "Pagado",
      pending: "Pendiente",
      overdue: "Vencido",
      draft: "Borrador"
    },
    navigation: {
      dashboard: "Panel",
      clients: "Clientes",
      services: "Servicios", 
      bills: "Facturas",
      quotations: "Cotizaciones",
      payments: "Pagos",
      settings: "Configuración"
    },
    auth: {
      login: "Iniciar Sesión",
      logout: "Cerrar Sesión",
      email: "Correo Electrónico",
      password: "Contraseña",
      emailPlaceholder: "Ingresa tu correo",
      passwordPlaceholder: "Ingresa tu contraseña",
      loginSubtitle: "Accede a tu panel de facturación",
      loginSuccess: "Sesión iniciada correctamente",
      loginError: "Credenciales inválidas",
      loggingIn: "Iniciando sesión...",
      demoCredentials: "Credenciales de demostración:"
    },
    dashboard: {
      title: "Panel de Control",
      totalRevenue: "Ingresos Totales",
      pendingInvoices: "Facturas Pendientes",
      paidInvoices: "Facturas Pagadas",
      totalClients: "Total de Clientes",
      recentBills: "Facturas Recientes",
      recentPayments: "Pagos Recientes",
      viewAll: "Ver Todo"
    },
    clients: {
      title: "Clientes",
      addClient: "Agregar Cliente",
      clientName: "Nombre del Cliente",
      email: "Correo Electrónico",
      phone: "Teléfono",
      totalBilled: "Total Facturado",
      paidAmount: "Cantidad Pagada",
      pendingAmount: "Cantidad Pendiente",
      overdueAmount: "Cantidad Vencida",
      paymentTerms: "Términos de Pago",
      createdAt: "Fecha de Creación",
      form: {
        name: "Nombre",
        namePlaceholder: "Ingresa el nombre del cliente",
        email: "Correo Electrónico",
        emailPlaceholder: "Ingresa el correo electrónico",
        phone: "Teléfono",
        phonePlaceholder: "Ingresa el número de teléfono",
        address: "Dirección",
        addressPlaceholder: "Ingresa la dirección",
        city: "Ciudad",
        cityPlaceholder: "Ingresa la ciudad",
        state: "Estado",
        statePlaceholder: "Ingresa el estado",
        country: "País",
        countryPlaceholder: "Selecciona el país",
        paymentTerms: "Términos de Pago (días)",
        paymentTermsPlaceholder: "30"
      },
      messages: {
        createSuccess: "Cliente creado exitosamente",
        updateSuccess: "Cliente actualizado exitosamente",
        deleteSuccess: "Cliente eliminado exitosamente",
        deleteConfirm: "¿Estás seguro de que quieres eliminar este cliente?"
      }
    },
    settings: {
      title: "Configuración",
      company: {
        title: "Información de la Empresa",
        name: "Nombre de la Empresa",
        email: "Correo Electrónico",
        phone: "Teléfono",
        address: "Dirección",
        city: "Ciudad",
        state: "Estado",
        country: "País",
        website: "Sitio Web",
        taxId: "ID Fiscal"
      },
      preferences: {
        title: "Preferencias",
        language: "Idioma",
        currency: "Moneda",
        timezone: "Zona Horaria",
        dateFormat: "Formato de Fecha"
      },
      security: {
        title: "Seguridad",
        changePassword: "Cambiar Contraseña",
        currentPassword: "Contraseña Actual",
        newPassword: "Nueva Contraseña",
        confirmPassword: "Confirmar Contraseña",
        twoFactor: "Autenticación de Dos Factores"
      },
      messages: {
        saveSuccess: "Configuración guardada exitosamente",
        passwordChanged: "Contraseña cambiada exitosamente"
passwordChanged: "Contraseña cambiada exitosamente"
      }
    }
  },
  fr: {
    common: {
      save: "Enregistrer",
      cancel: "Annuler", 
      delete: "Supprimer",
      edit: "Modifier",
      add: "Ajouter",
      search: "Rechercher",
      filter: "Filtrer",
      actions: "Actions",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      confirmation: "Confirmation",
      yes: "Oui",
      no: "Non",
      close: "Fermer",
      view: "Voir",
      details: "Détails",
      status: "Statut",
      date: "Date",
      amount: "Montant",
      total: "Total",
      subtotal: "Sous-total",
      tax: "Taxe",
      discount: "Remise",
      paid: "Payé",
      pending: "En attente",
      overdue: "En retard",
      draft: "Brouillon"
    },
    navigation: {
      dashboard: "Tableau de bord",
      clients: "Clients",
      services: "Services",
      bills: "Factures",
      quotations: "Devis",
      payments: "Paiements",
      settings: "Paramètres"
    },
    auth: {
      login: "Se connecter",
      logout: "Se déconnecter",
      email: "E-mail",
      password: "Mot de passe",
      emailPlaceholder: "Entrez votre e-mail",
      passwordPlaceholder: "Entrez votre mot de passe",
      loginSubtitle: "Accédez à votre panneau de facturation",
      loginSuccess: "Connexion réussie",
      loginError: "Identifiants invalides",
      loggingIn: "Connexion en cours...",
      demoCredentials: "Identifiants de démonstration:"
    },
    dashboard: {
      title: "Tableau de bord",
      totalRevenue: "Revenus totaux",
      pendingInvoices: "Factures en attente",
      paidInvoices: "Factures payées",
      totalClients: "Total des clients",
      recentBills: "Factures récentes",
      recentPayments: "Paiements récents",
      viewAll: "Voir tout"
    },
    clients: {
      title: "Clients",
      addClient: "Ajouter un client",
      clientName: "Nom du client",
      email: "E-mail",
      phone: "Téléphone",
      totalBilled: "Total facturé",
      paidAmount: "Montant payé",
      pendingAmount: "Montant en attente",
      overdueAmount: "Montant en retard",
      paymentTerms: "Conditions de paiement",
      createdAt: "Date de création",
      form: {
        name: "Nom",
        namePlaceholder: "Entrez le nom du client",
        email: "E-mail",
        emailPlaceholder: "Entrez l'e-mail",
        phone: "Téléphone",
        phonePlaceholder: "Entrez le numéro de téléphone",
        address: "Adresse",
        addressPlaceholder: "Entrez l'adresse",
        city: "Ville",
        cityPlaceholder: "Entrez la ville",
        state: "État",
        statePlaceholder: "Entrez l'état",
        country: "Pays",
        countryPlaceholder: "Sélectionnez le pays",
        paymentTerms: "Conditions de paiement (jours)",
        paymentTermsPlaceholder: "30"
      },
      messages: {
        createSuccess: "Client créé avec succès",
        updateSuccess: "Client mis à jour avec succès",
        deleteSuccess: "Client supprimé avec succès",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce client?"
      }
    },
    settings: {
      title: "Paramètres",
      company: {
        title: "Informations sur l'entreprise",
        name: "Nom de l'entreprise",
        email: "E-mail",
        phone: "Téléphone",
        address: "Adresse",
        city: "Ville",
        state: "État",
        country: "Pays",
        website: "Site web",
        taxId: "ID fiscal"
      },
      preferences: {
        title: "Préférences",
        language: "Langue",
        currency: "Devise",
        timezone: "Fuseau horaire",
        dateFormat: "Format de date"
      },
      security: {
        title: "Sécurité",
        changePassword: "Changer le mot de passe",
        currentPassword: "Mot de passe actuel",
        newPassword: "Nouveau mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        twoFactor: "Authentification à deux facteurs"
      },
      messages: {
        saveSuccess: "Paramètres enregistrés avec succès",
        passwordChanged: "Mot de passe changé avec succès"
}
    }
  },
  de: {
    common: {
      save: "Speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      add: "Hinzufügen",
      search: "Suchen",
      filter: "Filtern",
      actions: "Aktionen",
      loading: "Laden...",
      error: "Fehler",
      success: "Erfolg",
      confirmation: "Bestätigung",
      yes: "Ja",
      no: "Nein",
      close: "Schließen",
      view: "Ansehen",
      details: "Details",
      status: "Status",
      date: "Datum",
      amount: "Betrag",
      total: "Gesamt",
      subtotal: "Zwischensumme",
      tax: "Steuer",
      discount: "Rabatt",
      paid: "Bezahlt",
      pending: "Ausstehend",
      overdue: "Überfällig",
      draft: "Entwurf"
    },
    navigation: {
      dashboard: "Dashboard",
      clients: "Kunden",
      services: "Dienstleistungen",
      bills: "Rechnungen",
      quotations: "Angebote",
      payments: "Zahlungen",
      settings: "Einstellungen"
    },
    auth: {
      login: "Anmelden",
      logout: "Abmelden",
      email: "E-Mail",
      password: "Passwort",
      emailPlaceholder: "E-Mail eingeben",
      passwordPlaceholder: "Passwort eingeben",
      loginSubtitle: "Zugang zu Ihrem Abrechnungspanel",
      loginSuccess: "Erfolgreich angemeldet",
      loginError: "Ungültige Anmeldedaten",
      loggingIn: "Anmeldung läuft...",
      demoCredentials: "Demo-Anmeldedaten:"
    },
    dashboard: {
      title: "Dashboard",
      totalRevenue: "Gesamtumsatz",
      pendingInvoices: "Ausstehende Rechnungen",
      paidInvoices: "Bezahlte Rechnungen",
      totalClients: "Kunden insgesamt",
      recentBills: "Aktuelle Rechnungen",
      recentPayments: "Aktuelle Zahlungen",
      viewAll: "Alle anzeigen"
    },
    clients: {
      title: "Kunden",
      addClient: "Kunde hinzufügen",
      clientName: "Kundenname",
      email: "E-Mail",
      phone: "Telefon",
      totalBilled: "Gesamtrechnung",
      paidAmount: "Bezahlter Betrag",
      pendingAmount: "Ausstehender Betrag",
      overdueAmount: "Überfälliger Betrag",
      paymentTerms: "Zahlungsbedingungen",
      createdAt: "Erstellungsdatum",
      form: {
        name: "Name",
        namePlaceholder: "Kundenname eingeben",
        email: "E-Mail",
        emailPlaceholder: "E-Mail eingeben",
        phone: "Telefon",
        phonePlaceholder: "Telefonnummer eingeben",
        address: "Adresse",
        addressPlaceholder: "Adresse eingeben",
        city: "Stadt",
        cityPlaceholder: "Stadt eingeben",
        state: "Bundesland",
        statePlaceholder: "Bundesland eingeben",
        country: "Land",
        countryPlaceholder: "Land auswählen",
        paymentTerms: "Zahlungsbedingungen (Tage)",
        paymentTermsPlaceholder: "30"
      },
      messages: {
        createSuccess: "Kunde erfolgreich erstellt",
        updateSuccess: "Kunde erfolgreich aktualisiert",
        deleteSuccess: "Kunde erfolgreich gelöscht",
        deleteConfirm: "Sind Sie sicher, dass Sie diesen Kunden löschen möchten?"
      }
    },
    settings: {
      title: "Einstellungen",
      company: {
        title: "Unternehmensinformationen",
        name: "Unternehmensname",
        email: "E-Mail",
        phone: "Telefon",
        address: "Adresse",
        city: "Stadt",
        state: "Bundesland",
        country: "Land",
        website: "Website",
        taxId: "Steuer-ID"
      },
      preferences: {
        title: "Einstellungen",
        language: "Sprache",
        currency: "Währung",
        timezone: "Zeitzone",
        dateFormat: "Datumsformat"
      },
      security: {
        title: "Sicherheit",
        changePassword: "Passwort ändern",
        currentPassword: "Aktuelles Passwort",
        newPassword: "Neues Passwort",
        confirmPassword: "Passwort bestätigen",
        twoFactor: "Zwei-Faktor-Authentifizierung"
      },
      messages: {
        saveSuccess: "Einstellungen erfolgreich gespeichert",
        passwordChanged: "Passwort erfolgreich geändert"
}
    }
  },
  it: {
    common: {
      save: "Salva",
      cancel: "Annulla",
      delete: "Elimina", 
      edit: "Modifica",
      add: "Aggiungi",
      search: "Cerca",
      filter: "Filtra",
      actions: "Azioni",
      loading: "Caricamento...",
      error: "Errore",
      success: "Successo",
      confirmation: "Conferma",
      yes: "Sì",
      no: "No",
      close: "Chiudi",
      view: "Visualizza",
      details: "Dettagli",
      status: "Stato",
      date: "Data",
      amount: "Importo",
      total: "Totale",
      subtotal: "Subtotale",
      tax: "Tassa",
      discount: "Sconto",
      paid: "Pagato",
      pending: "In attesa",
      overdue: "Scaduto",
      draft: "Bozza"
    },
    navigation: {
      dashboard: "Dashboard",
      clients: "Clienti",
      services: "Servizi",
      bills: "Fatture",
      quotations: "Preventivi",
      payments: "Pagamenti",
      settings: "Impostazioni"
    },
    auth: {
      login: "Accedi",
      logout: "Esci",
      email: "Email",
      password: "Password",
      emailPlaceholder: "Inserisci la tua email",
      passwordPlaceholder: "Inserisci la tua password",
      loginSubtitle: "Accedi al tuo pannello di fatturazione",
      loginSuccess: "Accesso effettuato con successo",
      loginError: "Credenziali non valide",
      loggingIn: "Accesso in corso...",
      demoCredentials: "Credenziali demo:"
    },
    dashboard: {
      title: "Dashboard",
      totalRevenue: "Ricavi Totali",
      pendingInvoices: "Fatture in Attesa",
      paidInvoices: "Fatture Pagate",
      totalClients: "Totale Clienti",
      recentBills: "Fatture Recenti",
      recentPayments: "Pagamenti Recenti",
      viewAll: "Visualizza Tutto"
    },
    clients: {
      title: "Clienti",
      addClient: "Aggiungi Cliente",
      clientName: "Nome Cliente",
      email: "Email",
      phone: "Telefono",
      totalBilled: "Totale Fatturato",
      paidAmount: "Importo Pagato",
      pendingAmount: "Importo in Attesa",
      overdueAmount: "Importo Scaduto",
      paymentTerms: "Termini di Pagamento",
      createdAt: "Data di Creazione",
      form: {
        name: "Nome",
        namePlaceholder: "Inserisci il nome del cliente",
        email: "Email",
        emailPlaceholder: "Inserisci l'email",
        phone: "Telefono",
        phonePlaceholder: "Inserisci il numero di telefono",
        address: "Indirizzo",
        addressPlaceholder: "Inserisci l'indirizzo",
        city: "Città",
        cityPlaceholder: "Inserisci la città",
        state: "Provincia",
        statePlaceholder: "Inserisci la provincia",
        country: "Paese",
        countryPlaceholder: "Seleziona il paese",
        paymentTerms: "Termini di Pagamento (giorni)",
        paymentTermsPlaceholder: "30"
      },
      messages: {
        createSuccess: "Cliente creato con successo",
        updateSuccess: "Cliente aggiornato con successo", 
        deleteSuccess: "Cliente eliminato con successo",
        deleteConfirm: "Sei sicuro di voler eliminare questo cliente?"
      }
    },
    settings: {
      title: "Impostazioni",
      company: {
        title: "Informazioni Azienda",
        name: "Nome Azienda",
        email: "Email",
        phone: "Telefono",
        address: "Indirizzo",
        city: "Città",
        state: "Provincia",
        country: "Paese",
        website: "Sito Web",
        taxId: "Partita IVA"
      },
      preferences: {
        title: "Preferenze",
        language: "Lingua",
        currency: "Valuta",
        timezone: "Fuso Orario",
        dateFormat: "Formato Data"
      },
      security: {
        title: "Sicurezza",
        changePassword: "Cambia Password",
        currentPassword: "Password Attuale",
        newPassword: "Nuova Password",
        confirmPassword: "Conferma Password",
        twoFactor: "Autenticazione a Due Fattori"
      },
      messages: {
        saveSuccess: "Impostazioni salvate con successo",
        passwordChanged: "Password cambiata con successo"
}
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