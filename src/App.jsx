import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Settings from "@/components/pages/Settings";
import Login from "@/components/pages/Login";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/index.css";
import Layout from "@/components/organisms/Layout";
import Payments from "@/components/pages/Payments";
import CreateService from "@/components/pages/CreateService";
import Services from "@/components/pages/Services";
import CreateQuotation from "@/components/pages/CreateQuotation";
import Clients from "@/components/pages/Clients";
import ServiceDetail from "@/components/pages/ServiceDetail";
import CreateBill from "@/components/pages/CreateBill";
import BillDetail from "@/components/pages/BillDetail";
import Bills from "@/components/pages/Bills";
import ClientDetail from "@/components/pages/ClientDetail";
import Dashboard from "@/components/pages/Dashboard";
import Quotations from "@/components/pages/Quotations";
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
<AuthProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="bills" element={<Bills />} />
                <Route path="bills/create" element={<CreateBill />} />
                <Route path="bills/:id" element={<BillDetail />} />
                <Route path="quotations" element={<Quotations />} />
                <Route path="quotations/create" element={<CreateQuotation />} />
                <Route path="services" element={<Services />} />
                <Route path="services/create" element={<CreateService />} />
                <Route path="services/:id" element={<ServiceDetail />} />
                <Route path="payments" element={<Payments />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </CurrencyProvider>
        </LanguageProvider>
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;