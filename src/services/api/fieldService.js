import fieldsData from "@/services/mockData/fields.json";

let fields = [...fieldsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const getAllFields = async () => {
  await delay();
  return [...fields];
};

export const getFieldById = async (fieldId) => {
  await delay();
  const field = fields.find(f => f.Id === parseInt(fieldId));
  if (!field) {
    throw new Error("Field not found");
  }
  return { ...field };
};

export const createField = async (fieldData) => {
  await delay();
  const maxId = fields.length > 0 ? Math.max(...fields.map(f => f.Id)) : 0;
  const newField = {
    Id: maxId + 1,
    ...fieldData,
    status: "active"
  };
  fields.push(newField);
  return { ...newField };
};

export const updateField = async (fieldId, updates) => {
  await delay();
  const index = fields.findIndex(f => f.Id === parseInt(fieldId));
  if (index === -1) {
    throw new Error("Field not found");
  }
  fields[index] = { ...fields[index], ...updates };
  return { ...fields[index] };
};

export const deleteField = async (fieldId) => {
  await delay();
  const index = fields.findIndex(f => f.Id === parseInt(fieldId));
  if (index === -1) {
    throw new Error("Field not found");
  }
  fields.splice(index, 1);
  return true;
};