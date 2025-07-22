const expenseTableName = 'expense_c';
const harvestTableName = 'harvest_c';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Define expense table fields for fetchRecords
const expenseFields = [
  { "field": { "Name": "Name" } },
  { "field": { "Name": "Tags" } },
  { "field": { "Name": "Owner" } },
  { "field": { "Name": "CreatedOn" } },
  { "field": { "Name": "CreatedBy" } },
  { "field": { "Name": "ModifiedOn" } },
  { "field": { "Name": "ModifiedBy" } },
  { "field": { "Name": "date_c" } },
  { "field": { "Name": "category_c" } },
  { "field": { "Name": "description_c" } },
  { "field": { "Name": "amount_c" } },
  { "field": { "Name": "fieldId_c" } },
  { "field": { "Name": "fieldName_c" } }
];

// Define harvest table fields for fetchRecords
const harvestFields = [
  { "field": { "Name": "Name" } },
  { "field": { "Name": "Tags" } },
  { "field": { "Name": "Owner" } },
  { "field": { "Name": "CreatedOn" } },
  { "field": { "Name": "CreatedBy" } },
  { "field": { "Name": "ModifiedOn" } },
  { "field": { "Name": "ModifiedBy" } },
  { "field": { "Name": "cropId_c" } },
  { "field": { "Name": "fieldName_c" } },
  { "field": { "Name": "cropVariety_c" } },
  { "field": { "Name": "date_c" } },
  { "field": { "Name": "quantity_c" } },
  { "field": { "Name": "unit_c" } },
  { "field": { "Name": "quality_c" } },
  { "field": { "Name": "revenue_c" } }
];

export const getAllExpenses = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: expenseFields,
      orderBy: [
        { "fieldName": "date_c", "sorttype": "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(expenseTableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Map database fields to UI format
    return response.data.map(expense => ({
      Id: expense.Id,
      date: expense.date_c,
      category: expense.category_c,
      description: expense.description_c,
      amount: expense.amount_c,
      fieldId: expense.fieldId_c?.Id || expense.fieldId_c,
      fieldName: expense.fieldName_c,
      Tags: expense.Tags,
      Owner: expense.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching expenses:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getAllHarvests = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: harvestFields,
      orderBy: [
        { "fieldName": "date_c", "sorttype": "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(harvestTableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Map database fields to UI format
    return response.data.map(harvest => ({
      Id: harvest.Id,
      cropId: harvest.cropId_c,
      fieldName: harvest.fieldName_c,
      cropVariety: harvest.cropVariety_c,
      date: harvest.date_c,
      quantity: harvest.quantity_c,
      unit: harvest.unit_c,
      quality: harvest.quality_c,
      revenue: harvest.revenue_c,
      Tags: harvest.Tags,
      Owner: harvest.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching harvests:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getExpenseById = async (expenseId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: expenseFields
    };
    
    const response = await apperClient.getRecordById(expenseTableName, parseInt(expenseId), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      return null;
    }
    
    // Map database fields to UI format
    const expense = response.data;
    return {
      Id: expense.Id,
      date: expense.date_c,
      category: expense.category_c,
      description: expense.description_c,
      amount: expense.amount_c,
      fieldId: expense.fieldId_c?.Id || expense.fieldId_c,
      fieldName: expense.fieldName_c,
      Tags: expense.Tags,
      Owner: expense.Owner
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching expense with ID ${expenseId}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createExpense = async (expenseData) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbExpenseData = {
      Name: expenseData.description || expenseData.Name,
      date_c: expenseData.date,
      category_c: expenseData.category,
      description_c: expenseData.description,
      amount_c: expenseData.amount,
      fieldId_c: expenseData.fieldId ? parseInt(expenseData.fieldId) : null,
      fieldName_c: expenseData.fieldName,
      Tags: expenseData.Tags || "",
      Owner: expenseData.Owner ? parseInt(expenseData.Owner) : null
    };
    
    const params = {
      records: [dbExpenseData]
    };
    
    const response = await apperClient.createRecord(expenseTableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create expenses ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to create expense");
      }
      
      if (successfulRecords.length > 0) {
        const createdExpense = successfulRecords[0].data;
        return {
          Id: createdExpense.Id,
          date: createdExpense.date_c,
          category: createdExpense.category_c,
          description: createdExpense.description_c,
          amount: createdExpense.amount_c,
          fieldId: createdExpense.fieldId_c?.Id || createdExpense.fieldId_c,
          fieldName: createdExpense.fieldName_c,
          Tags: createdExpense.Tags,
          Owner: createdExpense.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating expense:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateExpense = async (expenseId, updates) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbUpdates = {
      Id: parseInt(expenseId)
    };
    
    if (updates.description !== undefined) {
      dbUpdates.Name = updates.description;
      dbUpdates.description_c = updates.description;
    }
    if (updates.date !== undefined) dbUpdates.date_c = updates.date;
    if (updates.category !== undefined) dbUpdates.category_c = updates.category;
    if (updates.amount !== undefined) dbUpdates.amount_c = updates.amount;
    if (updates.fieldId !== undefined) dbUpdates.fieldId_c = updates.fieldId ? parseInt(updates.fieldId) : null;
    if (updates.fieldName !== undefined) dbUpdates.fieldName_c = updates.fieldName;
    if (updates.Tags !== undefined) dbUpdates.Tags = updates.Tags;
    if (updates.Owner !== undefined) dbUpdates.Owner = updates.Owner ? parseInt(updates.Owner) : null;
    
    const params = {
      records: [dbUpdates]
    };
    
    const response = await apperClient.updateRecord(expenseTableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update expenses ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error("Failed to update expense");
      }
      
      if (successfulUpdates.length > 0) {
        const updatedExpense = successfulUpdates[0].data;
        return {
          Id: updatedExpense.Id,
          date: updatedExpense.date_c,
          category: updatedExpense.category_c,
          description: updatedExpense.description_c,
          amount: updatedExpense.amount_c,
          fieldId: updatedExpense.fieldId_c?.Id || updatedExpense.fieldId_c,
          fieldName: updatedExpense.fieldName_c,
          Tags: updatedExpense.Tags,
          Owner: updatedExpense.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating expense:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(expenseId)]
    };
    
    const response = await apperClient.deleteRecord(expenseTableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete expenses ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error("Failed to delete expense");
      }
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting expense:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createHarvest = async (harvestData) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbHarvestData = {
      Name: harvestData.cropVariety || harvestData.Name,
      cropId_c: harvestData.cropId,
      fieldName_c: harvestData.fieldName,
      cropVariety_c: harvestData.cropVariety,
      date_c: harvestData.date,
      quantity_c: harvestData.quantity,
      unit_c: harvestData.unit,
      quality_c: harvestData.quality,
      revenue_c: harvestData.revenue,
      Tags: harvestData.Tags || "",
      Owner: harvestData.Owner ? parseInt(harvestData.Owner) : null
    };
    
    const params = {
      records: [dbHarvestData]
    };
    
    const response = await apperClient.createRecord(harvestTableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create harvests ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to create harvest");
      }
      
      if (successfulRecords.length > 0) {
        const createdHarvest = successfulRecords[0].data;
        return {
          Id: createdHarvest.Id,
          cropId: createdHarvest.cropId_c,
          fieldName: createdHarvest.fieldName_c,
          cropVariety: createdHarvest.cropVariety_c,
          date: createdHarvest.date_c,
          quantity: createdHarvest.quantity_c,
          unit: createdHarvest.unit_c,
          quality: createdHarvest.quality_c,
          revenue: createdHarvest.revenue_c,
          Tags: createdHarvest.Tags,
          Owner: createdHarvest.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating harvest:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getExpensesByCategory = async (category) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: expenseFields,
      where: [
        {
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(expenseTableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Map database fields to UI format
    return response.data.map(expense => ({
      Id: expense.Id,
      date: expense.date_c,
      category: expense.category_c,
      description: expense.description_c,
      amount: expense.amount_c,
      fieldId: expense.fieldId_c?.Id || expense.fieldId_c,
      fieldName: expense.fieldName_c,
      Tags: expense.Tags,
      Owner: expense.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching expenses by category:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getExpensesByDateRange = async (startDate, endDate) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: expenseFields,
      where: [
        {
          "FieldName": "date_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [startDate]
        },
        {
          "FieldName": "date_c",
          "Operator": "LessThanOrEqualTo",
          "Values": [endDate]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(expenseTableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      return [];
    }
    
    // Map database fields to UI format
    return response.data.map(expense => ({
      Id: expense.Id,
      date: expense.date_c,
      category: expense.category_c,
      description: expense.description_c,
      amount: expense.amount_c,
      fieldId: expense.fieldId_c?.Id || expense.fieldId_c,
      fieldName: expense.fieldName_c,
      Tags: expense.Tags,
      Owner: expense.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching expenses by date range:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};