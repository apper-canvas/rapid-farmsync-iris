import React, { useState, useEffect } from 'react';
import Modal from '@/components/atoms/Modal';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import { useTranslation } from '@/i18n';

const InventoryEditModal = ({ isOpen, onClose, onSubmit, item }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    minStock: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-populate form when item changes
  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        quantity: item.quantity || '',
        unit: item.unit || '',
        minStock: item.minStock || ''
      });
      setErrors({});
    }
  }, [item, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }
    
    if (!formData.category.trim()) {
      newErrors.category = t('categoryRequired');
    }
    
    if (!formData.quantity || formData.quantity < 0) {
      newErrors.quantity = t('validQuantityRequired');
    }
    
    if (!formData.unit.trim()) {
      newErrors.unit = t('unitRequired');
    }
    
    if (!formData.minStock || formData.minStock < 0) {
      newErrors.minStock = t('validMinStockRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const updates = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit.trim(),
        minStock: parseInt(formData.minStock)
      };
      
      await onSubmit(item.Id, updates);
      handleClose();
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      quantity: '',
      unit: '',
      minStock: ''
    });
    setErrors({});
    onClose();
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('editInventoryItem')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('itemName')}
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder={t('enterItemName')}
          error={errors.name}
          required
        />

        <Input
          label={t('category')}
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          placeholder={t('enterCategory')}
          error={errors.category}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('quantity')}
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder={t('enterQuantity')}
            error={errors.quantity}
            min="0"
            step="0.1"
            required
          />

          <Input
            label={t('unit')}
            value={formData.unit}
            onChange={(e) => handleInputChange('unit', e.target.value)}
            placeholder={t('enterUnit')}
            error={errors.unit}
            required
          />
        </div>

        <Input
          label={t('minimumStock')}
          type="number"
          value={formData.minStock}
          onChange={(e) => handleInputChange('minStock', e.target.value)}
          placeholder={t('enterMinStock')}
          error={errors.minStock}
          min="0"
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? t('updating') : t('updateItem')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryEditModal;