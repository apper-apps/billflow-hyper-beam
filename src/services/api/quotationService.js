import quotationsData from "@/services/mockData/quotations.json";

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