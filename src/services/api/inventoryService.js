import inventoryData from "@/services/mockData/inventory.json";

let items = [...inventoryData];

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

export const getAllItems = async () => {
  await delay();
  return [...items];
};

export const getItemById = async (itemId) => {
  await delay();
  const item = items.find(i => i.Id === parseInt(itemId));
  if (!item) {
    throw new Error("Item not found");
  }
  return { ...item };
};

export const createItem = async (itemData) => {
  await delay();
  const maxId = items.length > 0 ? Math.max(...items.map(i => i.Id)) : 0;
  const newItem = {
    Id: maxId + 1,
    ...itemData,
    lastUpdated: new Date().toISOString().split("T")[0]
  };
  items.push(newItem);
  return { ...newItem };
};

export const updateItem = async (itemId, updates) => {
  await delay();
  const index = items.findIndex(i => i.Id === parseInt(itemId));
  if (index === -1) {
    throw new Error("Item not found");
  }
  items[index] = { 
    ...items[index], 
    ...updates,
    lastUpdated: new Date().toISOString().split("T")[0]
  };
  return { ...items[index] };
};

export const deleteItem = async (itemId) => {
  await delay();
  const index = items.findIndex(i => i.Id === parseInt(itemId));
  if (index === -1) {
    throw new Error("Item not found");
  }
  items.splice(index, 1);
  return true;
};

export const getLowStockItems = async () => {
  await delay();
  return items.filter(item => item.quantity <= item.minStock);
};

export const getItemsByCategory = async (category) => {
  await delay();
  return items.filter(item => item.category === category);
};