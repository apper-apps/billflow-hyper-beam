import paymentsData from "@/services/mockData/payments.json";
import html2pdf from "html2pdf.js";
import { settingsService } from "./settingsService";

let payments = [...paymentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const paymentService = {
  async getAll() {
    await delay(300);
    return [...payments];
  },

async getById(id) {
    await delay(200);
    const payment = payments.find(p => p.Id === parseInt(id));
    if (!payment) {
      throw new Error("Payment not found");
    }
    return { ...payment };
  },

  async generateReceiptPDF(id, billData, clientData) {
    await delay(300);
    const payment = payments.find(p => p.Id === parseInt(id));
    if (!payment) {
      throw new Error("Payment not found");
    }

    const settings = await settingsService.getSettings();
    const company = settings.company;

    const pdfContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Company Header -->
        <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #10b981; margin: 0; font-size: 28px;">${company.name}</h1>
          <div style="margin-top: 10px; color: #666;">
            <p style="margin: 5px 0;">${company.email} | ${company.phone}</p>
            <p style="margin: 5px 0;">${company.address.replace(/\n/g, ', ')}</p>
            ${company.website ? `<p style="margin: 5px 0;">${company.website}</p>` : ''}
            ${company.taxId ? `<p style="margin: 5px 0;">Tax ID: ${company.taxId}</p>` : ''}
          </div>
        </div>

        <!-- Receipt Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0;">PAYMENT RECEIPT</h2>
          <p style="margin: 10px 0; font-size: 18px; font-weight: bold;">Receipt #${payment.Id.toString().padStart(6, '0')}</p>
          <p style="margin: 5px 0; color: #666;">Date: ${new Date(payment.date).toLocaleDateString()}</p>
        </div>

        <!-- Payment Summary -->
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">Amount Paid</p>
          <p style="margin: 10px 0 0 0; font-size: 36px; font-weight: bold; color: #10b981;">$${payment.amount.toLocaleString()}</p>
          <p style="margin: 10px 0 0 0; color: #666;">via ${payment.method}</p>
        </div>

        <!-- Client Info -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px;">Paid By:</h3>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">${clientData.name}</p>
            <p style="margin: 5px 0; color: #666;">${clientData.email}</p>
            ${clientData.phone ? `<p style="margin: 5px 0; color: #666;">${clientData.phone}</p>` : ''}
          </div>
        </div>

        <!-- Bill Reference -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px;">For Bill:</h3>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">${billData.billNumber}</p>
            <p style="margin: 5px 0; color: #666;">Bill Total: $${billData.total.toLocaleString()}</p>
            <p style="margin: 5px 0; color: #666;">Due Date: ${new Date(billData.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        ${payment.notes ? `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">Notes:</h3>
            <p style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 0; color: #666;">${payment.notes}</p>
          </div>
        ` : ''}

        <!-- Footer -->
        <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
          <p>Thank you for your payment!</p>
          <p>This receipt serves as proof of payment.</p>
        </div>
      </div>
    `;

    return pdfContent;
  },

  async getByBillId(billId) {
    await delay(250);
    return payments.filter(p => p.billId === parseInt(billId));
  },

  async create(paymentData) {
    await delay(400);
    const maxId = Math.max(...payments.map(p => p.Id), 0);
    const newPayment = {
      ...paymentData,
      Id: maxId + 1,
      date: new Date().toISOString()
    };
    payments.push(newPayment);
    return { ...newPayment };
  },

  async update(id, paymentData) {
    await delay(300);
    const index = payments.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Payment not found");
    }
    payments[index] = { ...payments[index], ...paymentData };
    return { ...payments[index] };
  },

  async delete(id) {
    await delay(200);
    const index = payments.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Payment not found");
    }
payments.splice(index, 1);
    return true;
  },

  async processPaystackPayment(paymentData) {
    await delay(800);
    const { amount, email, currency = "USD" } = paymentData;
    
    // Simulate Paystack payment processing
    const success = Math.random() > 0.1; // 90% success rate
    if (!success) {
      throw new Error("Paystack payment failed");
    }

    return {
      success: true,
      transactionId: `ps_${Date.now()}`,
      reference: `ps_ref_${Date.now()}`,
      gateway: "paystack",
      amount,
      currency,
      status: "success"
    };
  },

  async processFlutterwavePayment(paymentData) {
    await delay(700);
    const { amount, email, currency = "USD" } = paymentData;
    
    // Simulate Flutterwave payment processing
    const success = Math.random() > 0.15; // 85% success rate
    if (!success) {
      throw new Error("Flutterwave payment failed");
    }

    return {
      success: true,
      transactionId: `flw_${Date.now()}`,
      reference: `flw_ref_${Date.now()}`,
      gateway: "flutterwave",
      amount,
      currency,
      status: "success"
    };
  },

  async verifyPayment(transactionId, gateway) {
    await delay(300);
    
    // Simulate payment verification
    return {
      verified: true,
      transactionId,
      gateway,
      status: "success"
    };
  }
};