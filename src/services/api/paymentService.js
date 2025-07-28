import paymentsData from "@/services/mockData/payments.json";

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