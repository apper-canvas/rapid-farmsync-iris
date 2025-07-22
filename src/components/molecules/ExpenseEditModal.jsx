import React, { useState, useEffect } from 'react';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import * as financeService from '@/services/api/financeService';
import { useTranslation } from '@/i18n/index';

const ExpenseEditModal = ({ isOpen, onClose, onExpenseUpdated, expense }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
const [formData, setFormData] = useState({
    date: '',
    category: '',
    description: '',
    amount: '',
    fieldId: '',
    fieldName: ''
  });

  // Pre-populate form when expense data changes
  useEffect(() => {
if (expense) {
      setFormData({
        date: expense.date || '',
        category: expense.category || '',
        description: expense.description || '',
        amount: expense.amount || '',
        fieldId: expense.fieldId || '',
        fieldName: expense.fieldName || ''
      });
    }
  }, [expense]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

try {
      const updatedExpense = await financeService.updateExpense(expense.Id, {
        date: formData.date,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        fieldId: formData.fieldId ? parseInt(formData.fieldId) : null,
        fieldName: formData.fieldName || null
      });

      onExpenseUpdated(updatedExpense);
      onClose();
    } catch (error) {
      console.error('Failed to update expense:', error);
      toast.error(t('failedToUpdateExpense'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setErrors({});
    }
  };
const categories = ['Seeds', 'Fertilizers', 'Equipment', 'Labor', 'Pesticides', 'Utilities'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('editExpense')}
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
            {loading ? 'Updating...' : 'Update Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseEditModal;