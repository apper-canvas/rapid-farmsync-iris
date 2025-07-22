import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '@/i18n';
import Modal from '@/components/atoms/Modal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import * as financeService from '@/services/api/financeService';
import fieldsData from '@/services/mockData/fields.json';

const HarvestCreateModal = ({ isOpen, onClose, onHarvestCreated }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.cropId) {
      newErrors.cropId = 'Field selection is required';
    }
    
    if (!formData.quantity || isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    if (!formData.revenue || isNaN(formData.revenue) || parseFloat(formData.revenue) <= 0) {
      newErrors.revenue = 'Revenue must be a positive number';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const harvestData = {
        date: formData.date,
        cropId: formData.cropId,
        fieldName: formData.fieldName,
        cropVariety: formData.cropVariety,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        quality: formData.quality,
        revenue: parseFloat(formData.revenue)
      };

      const newHarvest = await financeService.createHarvest(harvestData);
      toast.success('Harvest record created successfully');
      onHarvestCreated(newHarvest);
      handleClose();
    } catch (err) {
      toast.error('Failed to create harvest record');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('recordHarvest')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              error={errors.date}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field *
            </label>
            <Select
              value={formData.cropId}
              onChange={(e) => {
                handleInputChange('cropId', e.target.value);
                handleFieldSelection(e.target.value);
              }}
              className="w-full"
            >
              <option value="">Select a field</option>
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
              label="Field Name"
              type="text"
              value={formData.fieldName}
              onChange={(e) => handleInputChange('fieldName', e.target.value)}
              placeholder="Auto-filled from field selection"
              disabled
            />
          </div>

          <div>
            <FormField
              label="Crop Variety"
              type="text"
              value={formData.cropVariety}
              onChange={(e) => handleInputChange('cropVariety', e.target.value)}
              placeholder="Auto-filled from field selection"
              disabled
            />
          </div>

          <div>
            <FormField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              error={errors.quantity}
              placeholder="0"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <Select
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-full"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality
            </label>
            <Select
              value={formData.quality}
              onChange={(e) => handleInputChange('quality', e.target.value)}
              className="w-full"
            >
              {qualities.map(quality => (
                <option key={quality} value={quality}>{quality}</option>
              ))}
            </Select>
          </div>

          <div>
            <FormField
              label="Revenue ($)"
              type="number"
              value={formData.revenue}
              onChange={(e) => handleInputChange('revenue', e.target.value)}
              error={errors.revenue}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
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
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1 sm:flex-initial"
          >
            {loading ? 'Creating...' : 'Create Harvest Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HarvestCreateModal;