const tableName = 'task_c';

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
  { "field": { "Name": "title_c" } },
  { "field": { "Name": "description_c" } },
  { "field": { "Name": "fieldName_c" } },
  { "field": { "Name": "assignedTo_c" } },
  { "field": { "Name": "dueDate_c" } },
  { "field": { "Name": "status_c" } },
  { "field": { "Name": "priority_c" } },
  { "field": { "Name": "category_c" } },
  { "field": { "Name": "fieldId_c" } }
];

export const getAllTasks = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields,
      orderBy: [
        { "fieldName": "dueDate_c", "sorttype": "DESC" }
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
    return response.data.map(task => ({
      Id: task.Id,
      title: task.title_c,
      description: task.description_c,
      fieldId: task.fieldId_c?.Id || task.fieldId_c,
      fieldName: task.fieldName_c,
      assignedTo: task.assignedTo_c,
      dueDate: task.dueDate_c,
      status: task.status_c,
      priority: task.priority_c,
      category: task.category_c,
      Tags: task.Tags,
      Owner: task.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching tasks:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getTaskById = async (taskId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields
    };
    
    const response = await apperClient.getRecordById(tableName, parseInt(taskId), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      return null;
    }
    
    // Map database fields to UI format
    const task = response.data;
    return {
      Id: task.Id,
      title: task.title_c,
      description: task.description_c,
      fieldId: task.fieldId_c?.Id || task.fieldId_c,
      fieldName: task.fieldName_c,
      assignedTo: task.assignedTo_c,
      dueDate: task.dueDate_c,
      status: task.status_c,
      priority: task.priority_c,
      category: task.category_c,
      Tags: task.Tags,
      Owner: task.Owner
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching task with ID ${taskId}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbTaskData = {
      Name: taskData.title || taskData.Name,
      title_c: taskData.title,
      description_c: taskData.description,
      fieldName_c: taskData.fieldName,
      assignedTo_c: taskData.assignedTo,
      dueDate_c: taskData.dueDate,
      status_c: taskData.status || "pending",
      priority_c: taskData.priority || "medium",
      category_c: taskData.category,
      Tags: taskData.Tags || "",
      Owner: taskData.Owner ? parseInt(taskData.Owner) : null,
      fieldId_c: taskData.fieldId ? parseInt(taskData.fieldId) : null
    };
    
    const params = {
      records: [dbTaskData]
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
        console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to create task");
      }
      
      if (successfulRecords.length > 0) {
        const createdTask = successfulRecords[0].data;
        return {
          Id: createdTask.Id,
          title: createdTask.title_c,
          description: createdTask.description_c,
          fieldId: createdTask.fieldId_c?.Id || createdTask.fieldId_c,
          fieldName: createdTask.fieldName_c,
          assignedTo: createdTask.assignedTo_c,
          dueDate: createdTask.dueDate_c,
          status: createdTask.status_c,
          priority: createdTask.priority_c,
          category: createdTask.category_c,
          Tags: createdTask.Tags,
          Owner: createdTask.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating task:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbUpdates = {
      Id: parseInt(taskId)
    };
    
    if (updates.title !== undefined) dbUpdates.title_c = updates.title;
    if (updates.description !== undefined) dbUpdates.description_c = updates.description;
    if (updates.fieldName !== undefined) dbUpdates.fieldName_c = updates.fieldName;
    if (updates.assignedTo !== undefined) dbUpdates.assignedTo_c = updates.assignedTo;
    if (updates.dueDate !== undefined) dbUpdates.dueDate_c = updates.dueDate;
    if (updates.status !== undefined) dbUpdates.status_c = updates.status;
    if (updates.priority !== undefined) dbUpdates.priority_c = updates.priority;
    if (updates.category !== undefined) dbUpdates.category_c = updates.category;
    if (updates.Tags !== undefined) dbUpdates.Tags = updates.Tags;
    if (updates.Owner !== undefined) dbUpdates.Owner = updates.Owner ? parseInt(updates.Owner) : null;
    if (updates.fieldId !== undefined) dbUpdates.fieldId_c = updates.fieldId ? parseInt(updates.fieldId) : null;
    if (updates.Name !== undefined) dbUpdates.Name = updates.Name;
    
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
        console.error(`Failed to update tasks ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error("Failed to update task");
      }
      
      if (successfulUpdates.length > 0) {
        const updatedTask = successfulUpdates[0].data;
        return {
          Id: updatedTask.Id,
          title: updatedTask.title_c,
          description: updatedTask.description_c,
          fieldId: updatedTask.fieldId_c?.Id || updatedTask.fieldId_c,
          fieldName: updatedTask.fieldName_c,
          assignedTo: updatedTask.assignedTo_c,
          dueDate: updatedTask.dueDate_c,
          status: updatedTask.status_c,
          priority: updatedTask.priority_c,
          category: updatedTask.category_c,
          Tags: updatedTask.Tags,
          Owner: updatedTask.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating task:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(taskId)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete tasks ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error("Failed to delete task");
      }
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting task:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getTasksByStatus = async (status) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields,
      where: [
        {
          "FieldName": "status_c",
          "Operator": "EqualTo", 
          "Values": [status]
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
    return response.data.map(task => ({
      Id: task.Id,
      title: task.title_c,
      description: task.description_c,
      fieldId: task.fieldId_c?.Id || task.fieldId_c,
      fieldName: task.fieldName_c,
      assignedTo: task.assignedTo_c,
      dueDate: task.dueDate_c,
      status: task.status_c,
      priority: task.priority_c,
      category: task.category_c,
      Tags: task.Tags,
      Owner: task.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching tasks by status:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getTasksByField = async (fieldId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields,
      where: [
        {
          "FieldName": "fieldId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(fieldId)]
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
    return response.data.map(task => ({
      Id: task.Id,
      title: task.title_c,
      description: task.description_c,
      fieldId: task.fieldId_c?.Id || task.fieldId_c,
      fieldName: task.fieldName_c,
      assignedTo: task.assignedTo_c,
      dueDate: task.dueDate_c,
      status: task.status_c,
      priority: task.priority_c,
      category: task.category_c,
      Tags: task.Tags,
      Owner: task.Owner
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching tasks by field:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};