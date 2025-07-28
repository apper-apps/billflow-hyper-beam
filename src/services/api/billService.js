import billsData from "@/services/mockData/bills.json";

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