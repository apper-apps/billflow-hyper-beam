import billsData from "@/services/mockData/bills.json";
import html2pdf from "html2pdf.js";
import { settingsService } from "./settingsService";

let bills = [...billsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const billService = {
  async getAll() {
    await delay(300);
    return [...bills];
  },

async getById(id) {
    await delay(200);
    const bill = bills.find(b => b.Id === parseInt(id));
    if (!bill) {
      throw new Error("Bill not found");
    }
    return { ...bill };
  },

  async generatePDF(id, clientData) {
    await delay(300);
    const bill = bills.find(b => b.Id === parseInt(id));
    if (!bill) {
      throw new Error("Bill not found");
    }

    const settings = await settingsService.getSettings();
    const company = settings.company;

    const pdfContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Company Header -->
        <div style="text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">${company.name}</h1>
          <div style="margin-top: 10px; color: #666;">
            <p style="margin: 5px 0;">${company.email} | ${company.phone}</p>
            <p style="margin: 5px 0;">${company.address.replace(/\n/g, ', ')}</p>
            ${company.website ? `<p style="margin: 5px 0;">${company.website}</p>` : ''}
            ${company.taxId ? `<p style="margin: 5px 0;">Tax ID: ${company.taxId}</p>` : ''}
          </div>
        </div>

        <!-- Bill Header -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h2 style="color: #333; margin: 0;">BILL</h2>
            <p style="margin: 5px 0; font-size: 18px; font-weight: bold;">${bill.billNumber}</p>
            <p style="margin: 5px 0; color: #666;">Date: ${new Date(bill.createdAt).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #666;">Due: ${new Date(bill.dueDate).toLocaleDateString()}</p>
          </div>
          <div style="text-align: right;">
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
              <p style="margin: 0; color: #666; font-size: 14px;">Total Amount</p>
              <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold; color: #4f46e5;">$${bill.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <!-- Client Info -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px;">Bill To:</h3>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">${clientData.name}</p>
            <p style="margin: 5px 0; color: #666;">${clientData.email}</p>
            ${clientData.phone ? `<p style="margin: 5px 0; color: #666;">${clientData.phone}</p>` : ''}
            ${clientData.address ? `<p style="margin: 5px 0; color: #666;">${clientData.address}</p>` : ''}
          </div>
        </div>

        <!-- Line Items -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #4f46e5; color: white;">
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Qty</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Rate</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items.map(item => `
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">${item.description}</td>
                <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$${item.rate.toLocaleString()}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$${item.amount.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #f8fafc; font-weight: bold;">
              <td colspan="3" style="padding: 12px; text-align: right; border: 1px solid #ddd;">Total:</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-size: 18px;">$${bill.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Footer -->
        <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
          <p>Thank you for your business!</p>
          <p>Payment Terms: ${clientData.paymentTerms} days</p>
        </div>
      </div>
    `;

    return pdfContent;
  },

  async getByClientId(clientId) {
    await delay(250);
    return bills.filter(b => b.clientId === parseInt(clientId));
  },

  async create(billData) {
    await delay(400);
    const maxId = Math.max(...bills.map(b => b.Id), 0);
    const billCount = bills.length + 1;
    const newBill = {
      ...billData,
      Id: maxId + 1,
      billNumber: `BILL-2024-${billCount.toString().padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    bills.push(newBill);
    return { ...newBill };
  },

  async update(id, billData) {
    await delay(300);
    const index = bills.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }
    bills[index] = { ...bills[index], ...billData };
    return { ...bills[index] };
  },

  async delete(id) {
    await delay(200);
    const index = bills.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }
    bills.splice(index, 1);
    return true;
  },

async markAsPaid(id) {
    await delay(300);
    const index = bills.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Bill not found");
    }
    bills[index].status = "paid";
    return { ...bills[index] };
  },

  async processPayment(id, paymentData) {
    await delay(500);
    const { gateway, amount, method } = paymentData;
    
    // Simulate payment processing
    if (gateway === "paystack") {
      // Simulate Paystack API call
      const success = Math.random() > 0.1; // 90% success rate
      if (!success) {
        throw new Error("Paystack payment failed - insufficient funds");
      }
      return {
        success: true,
        transactionId: `ps_${Date.now()}`,
        gateway: "paystack",
        amount,
        method
      };
    } else if (gateway === "flutterwave") {
      // Simulate Flutterwave API call
      const success = Math.random() > 0.15; // 85% success rate
      if (!success) {
        throw new Error("Flutterwave payment failed - transaction declined");
      }
      return {
        success: true,
        transactionId: `flw_${Date.now()}`,
        gateway: "flutterwave", 
        amount,
        method
      };
    } else {
      // Traditional payment method
      return {
        success: true,
        transactionId: `manual_${Date.now()}`,
        gateway: "manual",
        amount,
        method
      };
    }
  }
};