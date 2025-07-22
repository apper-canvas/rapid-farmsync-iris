import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '@/i18n';
import Modal from '@/components/atoms/Modal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import * as financeService from '@/services/api/financeService';
import fieldsData from '@/services/mockData/fields.json';

const HarvestEditModal = ({ isOpen, onClose, harvest, onHarvestUpdated }) => {
const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    Owner: '',
    date: '',
    cropId: '',
    fieldName: '',
    cropVariety: '',
    quantity: '',
    unit: 'lbs',
    quality: 'Grade A',
    revenue: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFields(fieldsData);
  }, []);
// Populate form with harvest data when modal opens
  useEffect(() => {
    if (harvest && isOpen) {
      setFormData({
        Name: harvest.Name || '',
        Tags: Array.isArray(harvest.Tags) ? harvest.Tags.join(', ') : harvest.Tags || '',
        Owner: harvest.Owner?.Id || harvest.Owner || '',
        date: harvest.date_c || harvest.date || '',
        cropId: harvest.cropId_c || harvest.cropId || '',
        fieldName: harvest.fieldName_c || harvest.fieldName || '',
        cropVariety: harvest.cropVariety_c || harvest.cropVariety || '',
        quantity: harvest.quantity_c || harvest.quantity || '',
        unit: harvest.unit_c || harvest.unit || 'lbs',
        quality: harvest.quality_c || harvest.quality || 'Grade A',
        revenue: harvest.revenue_c || harvest.revenue || ''
      });
      setErrors({});
    }
  }, [harvest, isOpen]);
const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleFieldSelection = (fieldId) => {
    const selectedField = fields.find(field => field.Id === parseInt(fieldId));
    if (selectedField) {
      setFormData(prev => ({
        ...prev,
        cropId: parseInt(fieldId),
        fieldName: selectedField.name,
        cropVariety: selectedField.cropVariety
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        cropId: '',
        fieldName: '',
        cropVariety: ''
      }));
    }
  };
const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = t('Date is required');
    }
    
    if (!formData.cropId) {
      newErrors.cropId = t('Field selection is required');
    }
    
    if (!formData.quantity || isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = t('Quantity must be a positive number');
    }
    
    if (!formData.revenue || isNaN(formData.revenue) || parseFloat(formData.revenue) <= 0) {
      newErrors.revenue = t('Revenue must be a positive number');
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
      // Map UI fields to service expected format
      const updateData = {
        Name: formData.Name || formData.cropVariety,
        Tags: formData.Tags,
        Owner: formData.Owner ? parseInt(formData.Owner) : undefined,
        cropId: formData.cropId ? parseInt(formData.cropId) : undefined,
        fieldName: formData.fieldName,
        cropVariety: formData.cropVariety,
        date: formData.date,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        quality: formData.quality,
        revenue: parseFloat(formData.revenue)
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
        date: '',
        cropId: '',
        fieldName: '',
        cropVariety: '',
        quantity: '',
        unit: 'lbs',
        quality: 'Grade A',
        revenue: ''
      });
      setErrors({});
      onClose();
    }
  };

  const units = ['lbs', 'bushels', 'tons', 'kg'];
  const qualities = ['Premium', 'Grade A', 'Grade B', 'Standard'];
if (!harvest) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('Edit Harvest')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label={t('Date')}
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              error={errors.date}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Field')} *
            </label>
            <Select
              value={formData.cropId}
              onChange={(e) => {
                handleInputChange('cropId', e.target.value);
                handleFieldSelection(e.target.value);
              }}
              className="w-full"
              disabled={loading}
            >
              <option value="">{t('Select a field')}</option>
              {fields.map(field => (
                <option key={field.Id} value={field.Id}>
                  {field.name} - {field.cropVariety}
                </option>
              ))}
            </Select>
            {errors.cropId && (
              <p className="mt-1 text-sm text-error">{errors.cropId}</p>
            )}
          </div>

          <div>
            <FormField
              label={t('Field Name')}
              type="text"
              value={formData.fieldName}
              onChange={(e) => handleInputChange('fieldName', e.target.value)}
              placeholder={t('Auto-filled from field selection')}
              disabled
            />
          </div>

          <div>
            <FormField
              label={t('Crop Variety')}
              type="text"
              value={formData.cropVariety}
              onChange={(e) => handleInputChange('cropVariety', e.target.value)}
              placeholder={t('Auto-filled from field selection')}
              disabled
            />
          </div>

          <div>
            <FormField
              label={t('Quantity')}
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              error={errors.quantity}
              placeholder="0"
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Unit')}
            </label>
            <Select
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-full"
              disabled={loading}
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Quality')}
            </label>
            <Select
              value={formData.quality}
              onChange={(e) => handleInputChange('quality', e.target.value)}
              className="w-full"
              disabled={loading}
            >
              {qualities.map(quality => (
                <option key={quality} value={quality}>{quality}</option>
              ))}
            </Select>
          </div>

          <div>
            <FormField
              label={t('Revenue ($)')}
              type="number"
              value={formData.revenue}
              onChange={(e) => handleInputChange('revenue', e.target.value)}
              error={errors.revenue}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 sm:flex-initial"
          >
            {t('Cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1 sm:flex-initial"
          >
            {loading ? t('Updating...') : t('Update Harvest')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HarvestEditModal;