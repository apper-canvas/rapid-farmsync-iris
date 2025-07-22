import React, { useState, useEffect } from 'react';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import * as financeService from '@/services/api/financeService';
import { useTranslation } from '@/i18n/index';

const ExpenseEditModal = ({ isOpen, onClose, onExpenseUpdated, expense }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    fieldName: ''
  });

  // Pre-populate form when expense data changes
  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount || '',
        category: expense.category || '',
        date: expense.date || '',
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

    if (!formData.description.trim()) {
      newErrors.description = t('descriptionRequired');
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = t('validAmountRequired');
    }

    if (!formData.category.trim()) {
      newErrors.category = t('categoryRequired');
    }

    if (!formData.date) {
      newErrors.date = t('dateRequired');
    }

    return newErrors;
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
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category.trim(),
        date: formData.date,
        fieldName: formData.fieldName.trim() || null
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={t('editExpense')}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label={t('description')}
          type="text"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
          placeholder={t('expenseDescriptionPlaceholder')}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('amount')}
            type="number"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            error={errors.amount}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />

          <FormField
            label={t('category')}
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            error={errors.category}
            placeholder={t('expenseCategoryPlaceholder')}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('date')}
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            error={errors.date}
            required
          />

          <FormField
            label={t('fieldName')}
            type="text"
            value={formData.fieldName}
            onChange={(e) => handleInputChange('fieldName', e.target.value)}
            error={errors.fieldName}
            placeholder={t('fieldNamePlaceholder')}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
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
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <div className="flex items-center">
                <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                {t('updating')}
              </div>
            ) : (
              <div className="flex items-center">
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                {t('updateExpense')}
              </div>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseEditModal;