import React, { createContext, useState, useEffect } from "react";

export const CurrencyContext = createContext();

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  JPY: "¥",
  MXN: "$",
  BRL: "R$",
  GHS: "₵",
  NGN: "₦",
  ZAR: "R",
  XOF: "CFA"
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const savedCurrency = localStorage.getItem("app-currency");
    if (savedCurrency && currencySymbols[savedCurrency]) {
      setCurrency(savedCurrency);
    }
  }, []);

  const changeCurrency = (newCurrency) => {
    if (currencySymbols[newCurrency]) {
      setCurrency(newCurrency);
      localStorage.setItem("app-currency", newCurrency);
    }
  };

  const formatCurrency = (amount) => {
    const symbol = currencySymbols[currency] || "$";
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency: changeCurrency, 
      formatCurrency,
      currencySymbol: currencySymbols[currency] || "$"
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};