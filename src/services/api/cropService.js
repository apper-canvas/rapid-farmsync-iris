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

export const getAllCrops = async () => {
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
    
    // Map database fields to UI format for crops
    return response.data.map(crop => {
      let coordinates = [];
      try {
        if (crop.coordinates_c && typeof crop.coordinates_c === 'string') {
          coordinates = JSON.parse(crop.coordinates_c);
        } else if (Array.isArray(crop.coordinates_c)) {
          coordinates = crop.coordinates_c;
        }
      } catch (e) {
        coordinates = [];
      }
      
      return {
        Id: crop.Id,
        name: crop.Name,
        area: crop.area_c,
        coordinates: coordinates,
        cropId: crop.cropId_c,
        soilType: crop.soilType_c,
        cropVariety: crop.cropVariety_c,
        plantDate: crop.plantDate_c,
        expectedHarvest: crop.expectedHarvest_c,
        currentStage: crop.currentStage_c,
        status: crop.status_c,
        Tags: crop.Tags,
        Owner: crop.Owner
      };
    });
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching crops:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const getCropById = async (cropId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: tableFields
    };
    
    const response = await apperClient.getRecordById(tableName, parseInt(cropId), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      return null;
    }
    
    // Map database fields to UI format
    const crop = response.data;
    let coordinates = [];
    try {
      if (crop.coordinates_c && typeof crop.coordinates_c === 'string') {
        coordinates = JSON.parse(crop.coordinates_c);
      } else if (Array.isArray(crop.coordinates_c)) {
        coordinates = crop.coordinates_c;
      }
    } catch (e) {
      coordinates = [];
    }
    
    return {
      Id: crop.Id,
      name: crop.Name,
      area: crop.area_c,
      coordinates: coordinates,
      cropId: crop.cropId_c,
      soilType: crop.soilType_c,
      cropVariety: crop.cropVariety_c,
      plantDate: crop.plantDate_c,
      expectedHarvest: crop.expectedHarvest_c,
      currentStage: crop.currentStage_c,
      status: crop.status_c,
      Tags: crop.Tags,
      Owner: crop.Owner
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching crop with ID ${cropId}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const createCrop = async (cropData) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbCropData = {
      Name: cropData.name || cropData.Name,
      area_c: cropData.area,
      coordinates_c: cropData.coordinates ? JSON.stringify(cropData.coordinates) : "",
      cropId_c: cropData.cropId,
      soilType_c: cropData.soilType,
      cropVariety_c: cropData.cropVariety,
      plantDate_c: cropData.plantDate,
      expectedHarvest_c: cropData.expectedHarvest,
      currentStage_c: cropData.currentStage || "seeding",
      status_c: cropData.status || "active",
      Tags: cropData.Tags || "",
      Owner: cropData.Owner ? parseInt(cropData.Owner) : null
    };
    
    const params = {
      records: [dbCropData]
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
        console.error(`Failed to create crops ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to create crop");
      }
      
      if (successfulRecords.length > 0) {
        const createdCrop = successfulRecords[0].data;
        let coordinates = [];
        try {
          if (createdCrop.coordinates_c && typeof createdCrop.coordinates_c === 'string') {
            coordinates = JSON.parse(createdCrop.coordinates_c);
          } else if (Array.isArray(createdCrop.coordinates_c)) {
            coordinates = createdCrop.coordinates_c;
          }
        } catch (e) {
          coordinates = [];
        }
        
        return {
          Id: createdCrop.Id,
          name: createdCrop.Name,
          area: createdCrop.area_c,
          coordinates: coordinates,
          cropId: createdCrop.cropId_c,
          soilType: createdCrop.soilType_c,
          cropVariety: createdCrop.cropVariety_c,
          plantDate: createdCrop.plantDate_c,
          expectedHarvest: createdCrop.expectedHarvest_c,
          currentStage: createdCrop.currentStage_c,
          status: createdCrop.status_c,
          Tags: createdCrop.Tags,
          Owner: createdCrop.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating crop:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const updateCrop = async (cropId, updates) => {
  try {
    const apperClient = getApperClient();
    
    // Map UI fields to database fields and include only Updateable fields
    const dbUpdates = {
      Id: parseInt(cropId)
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
        console.error(`Failed to update crops ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        throw new Error("Failed to update crop");
      }
      
      if (successfulUpdates.length > 0) {
        const updatedCrop = successfulUpdates[0].data;
        let coordinates = [];
        try {
          if (updatedCrop.coordinates_c && typeof updatedCrop.coordinates_c === 'string') {
            coordinates = JSON.parse(updatedCrop.coordinates_c);
          } else if (Array.isArray(updatedCrop.coordinates_c)) {
            coordinates = updatedCrop.coordinates_c;
          }
        } catch (e) {
          coordinates = [];
        }
        
        return {
          Id: updatedCrop.Id,
          name: updatedCrop.Name,
          area: updatedCrop.area_c,
          coordinates: coordinates,
          cropId: updatedCrop.cropId_c,
          soilType: updatedCrop.soilType_c,
          cropVariety: updatedCrop.cropVariety_c,
          plantDate: updatedCrop.plantDate_c,
          expectedHarvest: updatedCrop.expectedHarvest_c,
          currentStage: updatedCrop.currentStage_c,
          status: updatedCrop.status_c,
          Tags: updatedCrop.Tags,
          Owner: updatedCrop.Owner
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating crop:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const deleteCrop = async (cropId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(cropId)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete crops ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error("Failed to delete crop");
      }
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting crop:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};