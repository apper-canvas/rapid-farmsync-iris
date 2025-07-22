import React, { useState } from "react";
import { toast } from "react-toastify";
import Select from "@/components/atoms/Select";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import * as fieldService from "@/services/api/fieldService";
import { useTranslation } from "@/i18n/index";
const FieldCreateModal = ({ isOpen, onClose, onFieldCreated }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
const [formData, setFormData] = useState({
    Name: '',
    area_c: '',
    soilType_c: '',
    cropVariety_c: '',
    cropId_c: '',
    currentStage_c: 'seeding',
    status_c: 'active',
    plantDate_c: '',
    expectedHarvest_c: '',
    coordinates_c: '',
    Tags: ''
  });
  const [errors, setErrors] = useState({});

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Field name is required';
    }
    
    if (formData.area_c && (isNaN(formData.area_c) || parseFloat(formData.area_c) <= 0)) {
      newErrors.area_c = 'Valid area is required';
    }
    
    if (formData.cropId_c && (isNaN(formData.cropId_c) || parseInt(formData.cropId_c) <= 0)) {
      newErrors.cropId_c = 'Valid crop ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

setLoading(true);
    try {
      // Prepare create data with only updateable fields
      const createData = {
        Name: formData.Name.trim(),
        area_c: formData.area_c ? parseFloat(formData.area_c) : null,
        soilType_c: formData.soilType_c.trim(),
        cropVariety_c: formData.cropVariety_c.trim(),
        cropId_c: formData.cropId_c ? parseInt(formData.cropId_c) : null,
        currentStage_c: formData.currentStage_c,
        status_c: formData.status_c,
        plantDate_c: formData.plantDate_c || null,
        expectedHarvest_c: formData.expectedHarvest_c || null,
        coordinates_c: formData.coordinates_c.trim(),
        Tags: formData.Tags.trim()
      };

      // Remove empty/null values
      Object.keys(createData).forEach(key => {
        if (createData[key] === '' || createData[key] === null) {
          delete createData[key];
        }
      });
      
      const newField = await fieldService.createField(createData);
      
      toast.success('Field created successfully');
      onFieldCreated(newField);
      handleClose();
    } catch (error) {
      toast.error('Failed to create field');
      console.error('Create field error:', error);
    } finally {
      setLoading(false);
    }
  };

const handleClose = () => {
    setFormData({
      Name: '',
      area_c: '',
      soilType_c: '',
      cropVariety_c: '',
      cropId_c: '',
      currentStage_c: 'seeding',
      status_c: 'active',
      plantDate_c: '',
      expectedHarvest_c: '',
      coordinates_c: '',
      Tags: ''
    });
    setErrors({});
    onClose();
  };

return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('addNewField')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Name *
            </label>
            <Input
              value={formData.Name}
              onChange={(e) => handleInputChange('Name', e.target.value)}
              placeholder="Enter field name"
              error={errors.Name}
              disabled={loading}
            />
            {errors.Name && (
              <p className="text-sm text-red-600 mt-1">{errors.Name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (acres)
            </label>
            <Input
              type="number"
              value={formData.area_c}
              onChange={(e) => handleInputChange('area_c', e.target.value)}
              placeholder="Enter area in acres"
              error={errors.area_c}
              disabled={loading}
              step="0.1"
              min="0.1"
            />
            {errors.area_c && (
              <p className="text-sm text-red-600 mt-1">{errors.area_c}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soil Type
            </label>
            <Input
              value={formData.soilType_c}
              onChange={(e) => handleInputChange('soilType_c', e.target.value)}
              placeholder="Enter soil type"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop ID
            </label>
            <Input
              type="number"
              value={formData.cropId_c}
              onChange={(e) => handleInputChange('cropId_c', e.target.value)}
              placeholder="Enter crop ID"
              error={errors.cropId_c}
              disabled={loading}
              min="1"
            />
            {errors.cropId_c && (
              <p className="text-sm text-red-600 mt-1">{errors.cropId_c}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crop Variety
          </label>
          <Input
            value={formData.cropVariety_c}
            onChange={(e) => handleInputChange('cropVariety_c', e.target.value)}
            placeholder="Enter crop variety"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Stage
            </label>
            <Select
              value={formData.currentStage_c}
              onChange={(e) => handleInputChange('currentStage_c', e.target.value)}
              disabled={loading}
            >
              <option value="seeding">{t('seeding')}</option>
              <option value="growing">{t('growing')}</option>
              <option value="ready">{t('ready')}</option>
              <option value="harvested">{t('harvested')}</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={formData.status_c}
              onChange={(e) => handleInputChange('status_c', e.target.value)}
              disabled={loading}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plant Date
            </label>
            <Input
              type="date"
              value={formData.plantDate_c}
              onChange={(e) => handleInputChange('plantDate_c', e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Harvest Date
            </label>
            <Input
              type="date"
              value={formData.expectedHarvest_c}
              onChange={(e) => handleInputChange('expectedHarvest_c', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coordinates
          </label>
          <textarea
            value={formData.coordinates_c}
            onChange={(e) => handleInputChange('coordinates_c', e.target.value)}
            placeholder="Enter field coordinates"
            disabled={loading}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <Input
            value={formData.Tags}
            onChange={(e) => handleInputChange('Tags', e.target.value)}
            placeholder="Enter tags separated by commas"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Field'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FieldCreateModal;