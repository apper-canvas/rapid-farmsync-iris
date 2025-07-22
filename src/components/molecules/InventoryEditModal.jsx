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
    minStock: '',
    supplier: '',
    location: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});

  const categories = [
    'Seeds & Planting',
    'Fertilizers',
    'Pesticides',
    'Tools & Equipment',
    'Irrigation',
    'Harvesting Supplies',
    'Storage & Processing',
    'Other'
  ];

  const units = [
    'kg',
    'lbs',
    'tons',
    'liters',
    'gallons',
    'pieces',
    'boxes',
    'bags'
  ];

  // Pre-populate form when item changes
  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        quantity: item.quantity || '',
        unit: item.unit || '',
        minStock: item.minStock || '',
        supplier: item.supplier || '',
        location: item.location || '',
        description: item.description || ''
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

    if (parseFloat(formData.minStock) > parseFloat(formData.quantity)) {
      newErrors.minStock = 'Minimum stock cannot be higher than current quantity';
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
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        minStock: parseFloat(formData.minStock),
        supplier: formData.supplier.trim() || 'Unknown',
        location: formData.location.trim() || 'Not specified',
        description: formData.description.trim()
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
      minStock: '',
      supplier: '',
      location: '',
      description: ''
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
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter item name"
              error={errors.name}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              error={errors.category}
              disabled={loading}
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit *
            </label>
            <Select
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              error={errors.unit}
              disabled={loading}
            >
              <option value="">Select unit</option>
              {units.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Quantity *
            </label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Enter quantity"
              error={errors.quantity}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Stock *
            </label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={formData.minStock}
              onChange={(e) => handleInputChange('minStock', e.target.value)}
              placeholder="Enter minimum stock level"
              error={errors.minStock}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier
            </label>
            <Input
              type="text"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              placeholder="Enter supplier name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter storage location"
              disabled={loading}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter item description (optional)"
              rows={3}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            loading={loading}
          >
            {loading ? t('updating') : t('updateItem')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryEditModal;