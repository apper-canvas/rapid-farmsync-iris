const tableName = 'inventory_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Define table fields for fetchRecords
const tableFields = [
  { "field": { "Name": "Name" } },
  { "field": { "Name": "Tags" } },
  { "field": { "Name": "Owner" } },
  { "field": { "Name": "CreatedOn" } },
  { "field": { "Name": "CreatedBy" } },
  { "field": { "Name": "ModifiedOn" } },
  { "field": { "Name": "ModifiedBy" } },
  { "field": { "Name": "category_c" } },
  { "field": { "Name": "quantity_c" } },
  { "field": { "Name": "unit_c" } },
  { "field": { "Name": "minStock_c" } },
  { "field": { "Name": "lastUpdated_c" } }
];

export const getAllItems = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields,
      orderBy: [
        { "fieldName": "Name", "sorttype": "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Map database fields to UI format
    return response.data.map(item => ({
      Id: item.Id,
      name: item.Name,
      category: item.category_c,
      quantity: item.quantity_c,
      unit: item.unit_c,
      minStock: item.minStock_c,
      lastUpdated: item.lastUpdated_c,
      Tags: item.Tags,
      Owner: item.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching inventory items:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getItemById = async (itemId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields
    };
    
    const response = await apperClient.getRecordById(tableName, parseInt(itemId), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      return null;
    }
    
    // Map database fields to UI format
    const item = response.data;
    return {
      Id: item.Id,
      name: item.Name,
      category: item.category_c,
      quantity: item.quantity_c,
      unit: item.unit_c,
      minStock: item.minStock_c,
      lastUpdated: item.lastUpdated_c,
      Tags: item.Tags,
      Owner: item.Owner
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching item with ID ${itemId}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createItem = async (itemData) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbItemData = {
      Name: itemData.name || itemData.Name,
      category_c: itemData.category,
      quantity_c: itemData.quantity,
      unit_c: itemData.unit,
      minStock_c: itemData.minStock,
      lastUpdated_c: new Date().toISOString().split("T")[0],
      Tags: itemData.Tags || "",
      Owner: itemData.Owner ? parseInt(itemData.Owner) : null
    };
    
    const params = {
      records: [dbItemData]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create inventory items ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to create inventory item");
      }
      
      if (successfulRecords.length > 0) {
        const createdItem = successfulRecords[0].data;
        return {
          Id: createdItem.Id,
          name: createdItem.Name,
          category: createdItem.category_c,
          quantity: createdItem.quantity_c,
          unit: createdItem.unit_c,
          minStock: createdItem.minStock_c,
          lastUpdated: createdItem.lastUpdated_c,
          Tags: createdItem.Tags,
          Owner: createdItem.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating inventory item:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateItem = async (itemId, updates) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbUpdates = {
      Id: parseInt(itemId),
      lastUpdated_c: new Date().toISOString().split("T")[0]
    };
    
    if (updates.name !== undefined) dbUpdates.Name = updates.name;
    if (updates.category !== undefined) dbUpdates.category_c = updates.category;
    if (updates.quantity !== undefined) dbUpdates.quantity_c = updates.quantity;
    if (updates.unit !== undefined) dbUpdates.unit_c = updates.unit;
    if (updates.minStock !== undefined) dbUpdates.minStock_c = updates.minStock;
    if (updates.Tags !== undefined) dbUpdates.Tags = updates.Tags;
    if (updates.Owner !== undefined) dbUpdates.Owner = updates.Owner ? parseInt(updates.Owner) : null;
    
    const params = {
      records: [dbUpdates]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update inventory items ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error("Failed to update inventory item");
      }
      
      if (successfulUpdates.length > 0) {
        const updatedItem = successfulUpdates[0].data;
        return {
          Id: updatedItem.Id,
          name: updatedItem.Name,
          category: updatedItem.category_c,
          quantity: updatedItem.quantity_c,
          unit: updatedItem.unit_c,
          minStock: updatedItem.minStock_c,
          lastUpdated: updatedItem.lastUpdated_c,
          Tags: updatedItem.Tags,
          Owner: updatedItem.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating inventory item:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(itemId)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete inventory items ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error("Failed to delete inventory item");
      }
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting inventory item:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getLowStockItems = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields,
      where: [
        {
          "FieldName": "quantity_c",
          "Operator": "LessThanOrEqualTo",
          "Values": ["minStock_c"]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Map database fields to UI format
    return response.data.map(item => ({
      Id: item.Id,
      name: item.Name,
      category: item.category_c,
      quantity: item.quantity_c,
      unit: item.unit_c,
      minStock: item.minStock_c,
      lastUpdated: item.lastUpdated_c,
      Tags: item.Tags,
      Owner: item.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching low stock items:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getItemsByCategory = async (category) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields,
      where: [
        {
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Map database fields to UI format
    return response.data.map(item => ({
      Id: item.Id,
      name: item.Name,
      category: item.category_c,
      quantity: item.quantity_c,
      unit: item.unit_c,
      minStock: item.minStock_c,
      lastUpdated: item.lastUpdated_c,
      Tags: item.Tags,
      Owner: item.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching items by category:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};