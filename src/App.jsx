import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Clients from "@/components/pages/Clients";
import ClientDetail from "@/components/pages/ClientDetail";
import Bills from "@/components/pages/Bills";
import BillDetail from "@/components/pages/BillDetail";
import CreateBill from "@/components/pages/CreateBill";
import Quotations from "@/components/pages/Quotations";
import CreateQuotation from "@/components/pages/CreateQuotation";
import Payments from "@/components/pages/Payments";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="bills" element={<Bills />} />
          <Route path="bills/create" element={<CreateBill />} />
          <Route path="bills/:id" element={<BillDetail />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="quotations/create" element={<CreateQuotation />} />
          <Route path="payments" element={<Payments />} />
        </Route>
      </Routes>
      
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