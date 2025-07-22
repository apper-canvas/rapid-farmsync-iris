import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/atoms/Modal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import * as financeService from '@/services/api/financeService';
import { useTranslation } from '@/i18n/index';

const HarvestEditModal = ({ isOpen, onClose, harvest, onHarvestUpdated }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    Owner: '',
    cropId_c: '',
    fieldName_c: '',
    cropVariety_c: '',
    date_c: '',
    quantity_c: '',
    unit_c: '',
    quality_c: '',
    revenue_c: ''
  });
  const [errors, setErrors] = useState({});

  // Populate form with harvest data when modal opens
  useEffect(() => {
    if (harvest && isOpen) {
      setFormData({
        Name: harvest.Name || '',
        Tags: Array.isArray(harvest.Tags) ? harvest.Tags.join(', ') : harvest.Tags || '',
        Owner: harvest.Owner?.Id || harvest.Owner || '',
        cropId_c: harvest.cropId_c || '',
        fieldName_c: harvest.fieldName_c || '',
        cropVariety_c: harvest.cropVariety_c || '',
        date_c: harvest.date_c || '',
        quantity_c: harvest.quantity_c || '',
        unit_c: harvest.unit_c || '',
        quality_c: harvest.quality_c || '',
        revenue_c: harvest.revenue_c || ''
      });
      setErrors({});
    }
  }, [harvest, isOpen]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = t('Name is required');
    }

    if (!formData.fieldName_c.trim()) {
      newErrors.fieldName_c = t('Field name is required');
    }

    if (!formData.cropVariety_c.trim()) {
      newErrors.cropVariety_c = t('Crop variety is required');
    }

    if (!formData.date_c) {
      newErrors.date_c = t('Harvest date is required');
    }

    if (!formData.quantity_c || formData.quantity_c <= 0) {
      newErrors.quantity_c = t('Quantity must be greater than 0');
    }

    if (!formData.unit_c.trim()) {
      newErrors.unit_c = t('Unit is required');
    }

    if (!formData.revenue_c || formData.revenue_c < 0) {
      newErrors.revenue_c = t('Revenue cannot be negative');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('Please fix the errors before submitting'));
      return;
    }

    setLoading(true);

    try {
      // Format data according to field types
      const updateData = {
        Name: formData.Name.trim(),
        Tags: formData.Tags.trim(),
        Owner: formData.Owner ? parseInt(formData.Owner) : undefined,
        cropId_c: formData.cropId_c ? parseInt(formData.cropId_c) : undefined,
        fieldName_c: formData.fieldName_c.trim(),
        cropVariety_c: formData.cropVariety_c.trim(),
        date_c: formData.date_c,
        quantity_c: parseInt(formData.quantity_c),
        unit_c: formData.unit_c.trim(),
        quality_c: formData.quality_c.trim(),
        revenue_c: parseFloat(formData.revenue_c)
      };

      // Remove undefined fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === '') {
          delete updateData[key];
        }
      });

      const updatedHarvest = await financeService.updateHarvest(harvest.Id, updateData);
      
      toast.success(t('Harvest updated successfully'));
      onHarvestUpdated(updatedHarvest);
      onClose();
    } catch (error) {
      console.error('Error updating harvest:', error);
      toast.error(error.message || t('Failed to update harvest'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        Name: '',
        Tags: '',
        Owner: '',
        cropId_c: '',
        fieldName_c: '',
        cropVariety_c: '',
        date_c: '',
        quantity_c: '',
        unit_c: '',
        quality_c: '',
        revenue_c: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!harvest) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('Edit Harvest')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label={t('Name')}
          type="text"
          value={formData.Name}
          onChange={(value) => handleInputChange('Name', value)}
          error={errors.Name}
          required
          disabled={loading}
        />

        <FormField
          label={t('Tags')}
          type="text"
          value={formData.Tags}
          onChange={(value) => handleInputChange('Tags', value)}
          error={errors.Tags}
          disabled={loading}
          placeholder={t('Enter tags separated by commas')}
        />

        <FormField
          label={t('Field Name')}
          type="text"
          value={formData.fieldName_c}
          onChange={(value) => handleInputChange('fieldName_c', value)}
          error={errors.fieldName_c}
          required
          disabled={loading}
        />

        <FormField
          label={t('Crop Variety')}
          type="text"
          value={formData.cropVariety_c}
          onChange={(value) => handleInputChange('cropVariety_c', value)}
          error={errors.cropVariety_c}
          required
          disabled={loading}
        />

        <FormField
          label={t('Harvest Date')}
          type="date"
          value={formData.date_c}
          onChange={(value) => handleInputChange('date_c', value)}
          error={errors.date_c}
          required
          disabled={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('Quantity')}
            type="number"
            value={formData.quantity_c}
            onChange={(value) => handleInputChange('quantity_c', value)}
            error={errors.quantity_c}
            required
            disabled={loading}
            min="0"
            step="1"
          />

          <FormField
            label={t('Unit')}
            type="text"
            value={formData.unit_c}
            onChange={(value) => handleInputChange('unit_c', value)}
            error={errors.unit_c}
            required
            disabled={loading}
            placeholder={t('kg, tons, boxes, etc.')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('Quality')}
            type="text"
            value={formData.quality_c}
            onChange={(value) => handleInputChange('quality_c', value)}
            error={errors.quality_c}
            disabled={loading}
            placeholder={t('Grade A, Premium, etc.')}
          />

          <FormField
            label={t('Revenue')}
            type="number"
            value={formData.revenue_c}
            onChange={(value) => handleInputChange('revenue_c', value)}
            error={errors.revenue_c}
            disabled={loading}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <FormField
          label={t('Crop ID')}
          type="number"
          value={formData.cropId_c}
          onChange={(value) => handleInputChange('cropId_c', value)}
          error={errors.cropId_c}
          disabled={loading}
          placeholder={t('Optional crop identifier')}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {t('Cancel')}
          </Button>
          
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? t('Updating...') : t('Update Harvest')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HarvestEditModal;