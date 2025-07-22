import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '@/i18n';
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import * as fieldService from '@/services/api/fieldService';

const FieldCreateModal = ({ isOpen, onClose, onFieldCreated }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    cropVariety: '',
    currentStage: 'seeding'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Field name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.size.trim() || isNaN(formData.size) || parseFloat(formData.size) <= 0) {
      newErrors.size = 'Valid size is required';
    }
    
    if (!formData.cropVariety.trim()) {
      newErrors.cropVariety = 'Crop variety is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
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
      const newField = await fieldService.createField({
        name: formData.name.trim(),
        location: formData.location.trim(),
        size: parseFloat(formData.size),
        cropVariety: formData.cropVariety.trim(),
        currentStage: formData.currentStage,
        plantedDate: new Date().toISOString().split('T')[0],
        soilType: 'Loamy', // Default value
        irrigationStatus: 'Active' // Default value
      });
      
      toast.success('Field created successfully');
      onFieldCreated(newField);
      handleClose();
    } catch (error) {
      toast.error('Failed to create field');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      location: '',
      size: '',
      cropVariety: '',
      currentStage: 'seeding'
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('addNewField')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Name *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter field name"
            error={errors.name}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <Input
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter field location"
            error={errors.location}
            disabled={loading}
          />
          {errors.location && (
            <p className="text-sm text-red-600 mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size (acres) *
          </label>
          <Input
            type="number"
            value={formData.size}
            onChange={(e) => handleInputChange('size', e.target.value)}
            placeholder="Enter field size"
            error={errors.size}
            disabled={loading}
            step="0.1"
            min="0.1"
          />
          {errors.size && (
            <p className="text-sm text-red-600 mt-1">{errors.size}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crop Variety *
          </label>
          <Input
            value={formData.cropVariety}
            onChange={(e) => handleInputChange('cropVariety', e.target.value)}
            placeholder="Enter crop variety"
            error={errors.cropVariety}
            disabled={loading}
          />
          {errors.cropVariety && (
            <p className="text-sm text-red-600 mt-1">{errors.cropVariety}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Stage
          </label>
          <Select
            value={formData.currentStage}
            onChange={(e) => handleInputChange('currentStage', e.target.value)}
            disabled={loading}
          >
            <option value="seeding">{t('seeding')}</option>
            <option value="growing">{t('growing')}</option>
            <option value="ready">{t('ready')}</option>
            <option value="harvested">{t('harvested')}</option>
          </Select>
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