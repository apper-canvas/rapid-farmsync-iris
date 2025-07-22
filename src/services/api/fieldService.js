const tableName = 'field_c';

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
  { "field": { "Name": "area_c" } },
  { "field": { "Name": "coordinates_c" } },
  { "field": { "Name": "cropId_c" } },
  { "field": { "Name": "soilType_c" } },
  { "field": { "Name": "cropVariety_c" } },
  { "field": { "Name": "plantDate_c" } },
  { "field": { "Name": "expectedHarvest_c" } },
  { "field": { "Name": "currentStage_c" } },
  { "field": { "Name": "status_c" } }
];

export const getAllFields = async () => {
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
    return response.data.map(field => {
      let coordinates = [];
      try {
        if (field.coordinates_c && typeof field.coordinates_c === 'string') {
          coordinates = JSON.parse(field.coordinates_c);
        } else if (Array.isArray(field.coordinates_c)) {
          coordinates = field.coordinates_c;
        }
      } catch (e) {
        coordinates = [];
      }
      
      return {
        Id: field.Id,
        name: field.Name,
        area: field.area_c,
        coordinates: coordinates,
        cropId: field.cropId_c,
        soilType: field.soilType_c,
        cropVariety: field.cropVariety_c,
        plantDate: field.plantDate_c,
        expectedHarvest: field.expectedHarvest_c,
        currentStage: field.currentStage_c,
        status: field.status_c,
        Tags: field.Tags,
        Owner: field.Owner
      };
    });
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching fields:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getFieldById = async (fieldId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields
    };
    
    const response = await apperClient.getRecordById(tableName, parseInt(fieldId), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      return null;
    }
    
    // Map database fields to UI format
    const field = response.data;
    let coordinates = [];
    try {
      if (field.coordinates_c && typeof field.coordinates_c === 'string') {
        coordinates = JSON.parse(field.coordinates_c);
      } else if (Array.isArray(field.coordinates_c)) {
        coordinates = field.coordinates_c;
      }
    } catch (e) {
      coordinates = [];
    }
    
    return {
      Id: field.Id,
      name: field.Name,
      area: field.area_c,
      coordinates: coordinates,
      cropId: field.cropId_c,
      soilType: field.soilType_c,
      cropVariety: field.cropVariety_c,
      plantDate: field.plantDate_c,
      expectedHarvest: field.expectedHarvest_c,
      currentStage: field.currentStage_c,
      status: field.status_c,
      Tags: field.Tags,
      Owner: field.Owner
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching field with ID ${fieldId}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createField = async (fieldData) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbFieldData = {
      Name: fieldData.name || fieldData.Name,
      area_c: fieldData.area,
      coordinates_c: fieldData.coordinates ? JSON.stringify(fieldData.coordinates) : "",
      cropId_c: fieldData.cropId,
      soilType_c: fieldData.soilType,
      cropVariety_c: fieldData.cropVariety,
      plantDate_c: fieldData.plantDate,
      expectedHarvest_c: fieldData.expectedHarvest,
      currentStage_c: fieldData.currentStage || "seeding",
      status_c: fieldData.status || "active",
      Tags: fieldData.Tags || "",
      Owner: fieldData.Owner ? parseInt(fieldData.Owner) : null
    };
    
    const params = {
      records: [dbFieldData]
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
        console.error(`Failed to create fields ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to create field");
      }
      
      if (successfulRecords.length > 0) {
        const createdField = successfulRecords[0].data;
        let coordinates = [];
        try {
          if (createdField.coordinates_c && typeof createdField.coordinates_c === 'string') {
            coordinates = JSON.parse(createdField.coordinates_c);
          } else if (Array.isArray(createdField.coordinates_c)) {
            coordinates = createdField.coordinates_c;
          }
        } catch (e) {
          coordinates = [];
        }
        
        return {
          Id: createdField.Id,
          name: createdField.Name,
          area: createdField.area_c,
          coordinates: coordinates,
          cropId: createdField.cropId_c,
          soilType: createdField.soilType_c,
          cropVariety: createdField.cropVariety_c,
          plantDate: createdField.plantDate_c,
          expectedHarvest: createdField.expectedHarvest_c,
          currentStage: createdField.currentStage_c,
          status: createdField.status_c,
          Tags: createdField.Tags,
          Owner: createdField.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating field:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateField = async (fieldId, updates) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbUpdates = {
      Id: parseInt(fieldId)
    };
    
    if (updates.name !== undefined) dbUpdates.Name = updates.name;
    if (updates.area !== undefined) dbUpdates.area_c = updates.area;
    if (updates.coordinates !== undefined) dbUpdates.coordinates_c = JSON.stringify(updates.coordinates);
    if (updates.cropId !== undefined) dbUpdates.cropId_c = updates.cropId;
    if (updates.soilType !== undefined) dbUpdates.soilType_c = updates.soilType;
    if (updates.cropVariety !== undefined) dbUpdates.cropVariety_c = updates.cropVariety;
    if (updates.plantDate !== undefined) dbUpdates.plantDate_c = updates.plantDate;
    if (updates.expectedHarvest !== undefined) dbUpdates.expectedHarvest_c = updates.expectedHarvest;
    if (updates.currentStage !== undefined) dbUpdates.currentStage_c = updates.currentStage;
    if (updates.status !== undefined) dbUpdates.status_c = updates.status;
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
        console.error(`Failed to update fields ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error("Failed to update field");
      }
      
      if (successfulUpdates.length > 0) {
        const updatedField = successfulUpdates[0].data;
        let coordinates = [];
        try {
          if (updatedField.coordinates_c && typeof updatedField.coordinates_c === 'string') {
            coordinates = JSON.parse(updatedField.coordinates_c);
          } else if (Array.isArray(updatedField.coordinates_c)) {
            coordinates = updatedField.coordinates_c;
          }
        } catch (e) {
          coordinates = [];
        }
        
        return {
          Id: updatedField.Id,
          name: updatedField.Name,
          area: updatedField.area_c,
          coordinates: coordinates,
          cropId: updatedField.cropId_c,
          soilType: updatedField.soilType_c,
          cropVariety: updatedField.cropVariety_c,
          plantDate: updatedField.plantDate_c,
          expectedHarvest: updatedField.expectedHarvest_c,
          currentStage: updatedField.currentStage_c,
          status: updatedField.status_c,
          Tags: updatedField.Tags,
          Owner: updatedField.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating field:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteField = async (fieldId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(fieldId)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete fields ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error("Failed to delete field");
      }
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting field:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};