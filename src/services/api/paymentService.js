import { toast } from "react-toastify";
import { settingsService } from "./settingsService";

export const paymentService = {
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
          { field: { Name: "amount" } },
          { field: { Name: "method" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { field: { Name: "billId" } }
        ]
      };

      const response = await apperClient.fetchRecords('payment', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching payments:", error?.response?.data?.message);
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
          { field: { Name: "amount" } },
          { field: { Name: "method" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { field: { Name: "billId" } }
        ]
      };

      const response = await apperClient.getRecordById('payment', parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching payment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async generateReceiptPDF(id, billData, clientData) {
    try {
      const payment = await this.getById(id);
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
              <p style="margin: 5px 0;">${company.address ? company.address.replace(/\n/g, ', ') : ''}</p>
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
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${clientData.Name || clientData.name}</p>
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
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error generating receipt PDF:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getByBillId(billId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "amount" } },
          { field: { Name: "method" } },
          { field: { Name: "date" } },
          { field: { Name: "notes" } },
          { field: { Name: "billId" } }
        ],
        where: [
          {
            FieldName: "billId",
            Operator: "EqualTo",
            Values: [parseInt(billId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('payment', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching payments by bill:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(paymentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Name: paymentData.Name || `Payment-${Date.now()}`,
        amount: parseFloat(paymentData.amount),
        method: paymentData.method,
        date: new Date().toISOString(),
        notes: paymentData.notes || "",
        billId: parseInt(paymentData.billId)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('payment', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create payment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating payment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, paymentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Id: parseInt(id),
        Name: paymentData.Name,
        amount: parseFloat(paymentData.amount),
        method: paymentData.method,
        date: paymentData.date,
        notes: paymentData.notes,
        billId: parseInt(paymentData.billId)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('payment', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update payment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating payment:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('payment', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete payment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting payment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async processPaystackPayment(paymentData) {
    try {
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
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error processing Paystack payment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async processFlutterwavePayment(paymentData) {
    try {
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
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error processing Flutterwave payment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async verifyPayment(transactionId, gateway) {
    try {
      // Simulate payment verification
      return {
        verified: true,
        transactionId,
        gateway,
        status: "success"
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error verifying payment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return {
        verified: false,
        transactionId,
        gateway,
        status: "failed"
      };
    }
  }
};