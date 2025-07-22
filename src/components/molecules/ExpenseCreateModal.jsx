import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '@/i18n';
import Modal from '@/components/atoms/Modal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import * as financeService from '@/services/api/financeService';

const ExpenseCreateModal = ({ isOpen, onClose, onExpenseCreated }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Seeds',
    description: '',
    amount: '',
    fieldId: '',
    fieldName: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (formData.fieldId && (isNaN(formData.fieldId) || parseInt(formData.fieldId) <= 0)) {
      newErrors.fieldId = 'Field ID must be a positive number';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        date: formData.date,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        fieldId: formData.fieldId ? parseInt(formData.fieldId) : null,
        fieldName: formData.fieldName || null
      };

      const newExpense = await financeService.createExpense(expenseData);
      toast.success('Expense created successfully');
      onExpenseCreated(newExpense);
      handleClose();
    } catch (err) {
      toast.error('Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'Seeds',
        description: '',
        amount: '',
        fieldId: '',
        fieldName: ''
      });
      setErrors({});
      onClose();
    }
  };

  const categories = ['Seeds', 'Fertilizers', 'Equipment', 'Labor', 'Pesticides', 'Utilities'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('addExpense')}
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
              Category *
            </label>
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            {errors.category && (
              <p className="mt-1 text-sm text-error">{errors.category}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Description"
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={errors.description}
              placeholder="Enter expense description"
              required
            />
          </div>

          <div>
            <FormField
              label="Amount ($)"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              error={errors.amount}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <FormField
              label="Field ID"
              type="number"
              value={formData.fieldId}
              onChange={(e) => handleInputChange('fieldId', e.target.value)}
              error={errors.fieldId}
              placeholder="Field ID (optional)"
              min="1"
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Field Name"
              type="text"
              value={formData.fieldName}
              onChange={(e) => handleInputChange('fieldName', e.target.value)}
              placeholder="Field name (optional)"
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
            {loading ? 'Creating...' : 'Create Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseCreateModal;