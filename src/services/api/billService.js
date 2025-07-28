import { toast } from "react-toastify";
import { settingsService } from "./settingsService";

export const billService = {
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
          { field: { Name: "billNumber" } },
          { field: { Name: "items" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "clientId" } }
        ]
      };

      const response = await apperClient.fetchRecords('bill', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

// Handle lookup fields properly
      const data = response.data || [];
      return data.map(bill => ({
        ...bill,
        // Ensure clientId lookup is handled consistently
        clientId: typeof bill.clientId === 'object' ? bill.clientId : bill.clientId
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching bills:", error?.response?.data?.message);
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
          { field: { Name: "billNumber" } },
          { field: { Name: "items" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "clientId" } }
        ]
      };

      const response = await apperClient.getRecordById('bill', parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

const data = response.data;
      if (data) {
        // Ensure clientId lookup is handled consistently
        return {
          ...data,
          clientId: typeof data.clientId === 'object' ? data.clientId : data.clientId
        };
      }
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching bill with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async generatePDF(id, clientData) {
    try {
      const bill = await this.getById(id);
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
              <p style="margin: 5px 0;">${company.address ? company.address.replace(/\n/g, ', ') : ''}</p>
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
<p style="margin: 0; font-weight: bold; font-size: 16px;">${clientData.Name || clientData.name || 'Client Name'}</p>
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
              ${JSON.parse(bill.items || '[]').map(item => `
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
          { field: { Name: "billNumber" } },
          { field: { Name: "items" } },
          { field: { Name: "total" } },
          { field: { Name: "status" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "clientId" } }
        ],
        where: [
          {
            FieldName: "clientId",
            Operator: "EqualTo",
            Values: [parseInt(clientId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('bill', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching bills by client:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(billData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Name: billData.Name || `Bill-${Date.now()}`,
        billNumber: billData.billNumber,
        items: JSON.stringify(billData.items),
        total: parseFloat(billData.total),
        status: billData.status || "pending",
        dueDate: billData.dueDate,
        createdAt: new Date().toISOString(),
        clientId: parseInt(billData.clientId)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('bill', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create bill ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating bill:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, billData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: billData.Name,
        billNumber: billData.billNumber,
        items: JSON.stringify(billData.items),
        total: parseFloat(billData.total),
        status: billData.status,
        dueDate: billData.dueDate,
        clientId: parseInt(billData.clientId)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('bill', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update bill ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating bill:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('bill', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete bill ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting bill:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async markAsPaid(id) {
    try {
      return await this.update(id, { status: "paid" });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking bill as paid:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async processPayment(id, paymentData) {
    try {
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
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error processing payment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};