import quotationsData from "@/services/mockData/quotations.json";
import html2pdf from "html2pdf.js";
import { settingsService } from "./settingsService";

let quotations = [...quotationsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const quotationService = {
  async getAll() {
    await delay(300);
    return [...quotations];
  },

async getById(id) {
    await delay(200);
    const quotation = quotations.find(q => q.Id === parseInt(id));
    if (!quotation) {
      throw new Error("Quotation not found");
    }
    return { ...quotation };
  },

  async generatePDF(id, clientData) {
    await delay(300);
    const quotation = quotations.find(q => q.Id === parseInt(id));
    if (!quotation) {
      throw new Error("Quotation not found");
    }

    const settings = await settingsService.getSettings();
    const company = settings.company;

    const pdfContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Company Header -->
        <div style="text-align: center; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0; font-size: 28px;">${company.name}</h1>
          <div style="margin-top: 10px; color: #666;">
            <p style="margin: 5px 0;">${company.email} | ${company.phone}</p>
            <p style="margin: 5px 0;">${company.address.replace(/\n/g, ', ')}</p>
            ${company.website ? `<p style="margin: 5px 0;">${company.website}</p>` : ''}
            ${company.taxId ? `<p style="margin: 5px 0;">Tax ID: ${company.taxId}</p>` : ''}
          </div>
        </div>

        <!-- Quotation Header -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h2 style="color: #333; margin: 0;">QUOTATION</h2>
            <p style="margin: 5px 0; font-size: 18px; font-weight: bold;">Quote #${quotation.Id.toString().padStart(6, '0')}</p>
            <p style="margin: 5px 0; color: #666;">Date: ${new Date(quotation.createdAt).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #666;">Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}</p>
          </div>
          <div style="text-align: right;">
            <div style="background: #faf5ff; padding: 15px; border-radius: 8px;">
              <p style="margin: 0; color: #666; font-size: 14px;">Total Amount</p>
              <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold; color: #7c3aed;">$${quotation.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <!-- Client Info -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px;">Prepared For:</h3>
          <div style="background: #faf5ff; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">${clientData.name}</p>
            <p style="margin: 5px 0; color: #666;">${clientData.email}</p>
            ${clientData.phone ? `<p style="margin: 5px 0; color: #666;">${clientData.phone}</p>` : ''}
            ${clientData.address ? `<p style="margin: 5px 0; color: #666;">${clientData.address}</p>` : ''}
          </div>
        </div>

        <!-- Proposal Items -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #7c3aed; color: white;">
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Qty</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Rate</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${quotation.items.map(item => `
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">${item.description}</td>
                <td style="padding: 12px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$${item.rate.toLocaleString()}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">$${item.amount.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #faf5ff; font-weight: bold;">
              <td colspan="3" style="padding: 12px; text-align: right; border: 1px solid #ddd;">Total:</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-size: 18px;">$${quotation.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Terms -->
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Terms & Conditions:</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>This quotation is valid until ${new Date(quotation.validUntil).toLocaleDateString()}</li>
            <li>Payment terms: ${clientData.paymentTerms} days from invoice date</li>
            <li>Prices are subject to change without notice after expiry date</li>
            <li>Additional terms may apply based on project scope</li>
          </ul>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
          <p>Thank you for considering our services!</p>
          <p>We look forward to working with you.</p>
        </div>
      </div>
    `;

    return pdfContent;
  },

  async getByClientId(clientId) {
    await delay(250);
    return quotations.filter(q => q.clientId === parseInt(clientId));
  },

  async create(quotationData) {
    await delay(400);
    const maxId = Math.max(...quotations.map(q => q.Id), 0);
    const newQuotation = {
      ...quotationData,
      Id: maxId + 1,
      status: "draft",
      createdAt: new Date().toISOString()
    };
    quotations.push(newQuotation);
    return { ...newQuotation };
  },

  async update(id, quotationData) {
    await delay(300);
    const index = quotations.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Quotation not found");
    }
    quotations[index] = { ...quotations[index], ...quotationData };
    return { ...quotations[index] };
  },

  async delete(id) {
    await delay(200);
    const index = quotations.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Quotation not found");
    }
    quotations.splice(index, 1);
    return true;
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = quotations.findIndex(q => q.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Quotation not found");
    }
    quotations[index].status = status;
    return { ...quotations[index] };
  }
};