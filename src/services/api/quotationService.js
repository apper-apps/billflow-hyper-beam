import { toast } from "react-toastify";
import { settingsService } from "./settingsService";

export const quotationService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "clientId" } },
          { field: { Name: "items" } },
          { field: { Name: "total" } },
          { field: { Name: "validUntil" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } }
        ]
      };

      const response = await apperClient.fetchRecords('quotation', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching quotations:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "clientId" } },
          { field: { Name: "items" } },
          { field: { Name: "total" } },
          { field: { Name: "validUntil" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } }
        ]
      };

      const response = await apperClient.getRecordById('quotation', parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching quotation with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async generatePDF(id, clientData) {
    try {
      const quotation = await this.getById(id);
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
              <p style="margin: 5px 0;">${company.address ? company.address.replace(/\n/g, ', ') : ''}</p>
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
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${clientData.Name || clientData.name}</p>
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
              ${JSON.parse(quotation.items || '[]').map(item => `
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
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error generating PDF:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getByClientId(clientId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "clientId" } },
          { field: { Name: "items" } },
          { field: { Name: "total" } },
          { field: { Name: "validUntil" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } }
        ],
        where: [
          {
            FieldName: "clientId",
            Operator: "EqualTo",
            Values: [parseInt(clientId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('quotation', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching quotations by client:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(quotationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Name: quotationData.Name || `Quotation-${Date.now()}`,
        clientId: parseInt(quotationData.clientId),
        items: JSON.stringify(quotationData.items),
        total: parseFloat(quotationData.total),
        validUntil: quotationData.validUntil,
        status: quotationData.status || "draft",
        createdAt: new Date().toISOString()
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('quotation', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create quotation ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating quotation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, quotationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: quotationData.Name,
        clientId: parseInt(quotationData.clientId),
        items: JSON.stringify(quotationData.items),
        total: parseFloat(quotationData.total),
        validUntil: quotationData.validUntil,
        status: quotationData.status
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('quotation', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update quotation ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating quotation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('quotation', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete quotation ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting quotation:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async updateStatus(id, status) {
    try {
      // First get the current quotation to preserve other data
      const currentQuotation = await this.getById(id);
      if (!currentQuotation) {
        throw new Error("Quotation not found");
      }

      // Update with new status
      return await this.update(id, {
        Name: currentQuotation.Name,
        clientId: currentQuotation.clientId,
        items: JSON.parse(currentQuotation.items || '[]'),
        total: currentQuotation.total,
        validUntil: currentQuotation.validUntil,
        status: status
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating quotation status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};