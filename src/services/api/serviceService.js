import servicesData from "@/services/mockData/services.json";

let services = [...servicesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const serviceService = {
  async getAll() {
    await delay(300);
    return [...services];
  },

  async getById(id) {
    await delay(200);
    const service = services.find(s => s.Id === parseInt(id));
    if (!service) {
      throw new Error("Service not found");
    }
    return { ...service };
  },

  async getByCategory(category) {
    await delay(250);
    return services.filter(s => s.category === category && s.isActive);
  },

  async getActive() {
    await delay(200);
    return services.filter(s => s.isActive);
  },

  async create(serviceData) {
    await delay(400);
    const maxId = Math.max(...services.map(s => s.Id), 0);
    const newService = {
      ...serviceData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    services.push(newService);
    return { ...newService };
  },

  async update(id, serviceData) {
    await delay(300);
    const index = services.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Service not found");
    }
    services[index] = { ...services[index], ...serviceData };
    return { ...services[index] };
  },

  async delete(id) {
    await delay(200);
    const index = services.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Service not found");
    }
    services.splice(index, 1);
    return true;
  },

  async toggleActive(id) {
    await delay(250);
    const index = services.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Service not found");
    }
    services[index].isActive = !services[index].isActive;
    return { ...services[index] };
  }
};