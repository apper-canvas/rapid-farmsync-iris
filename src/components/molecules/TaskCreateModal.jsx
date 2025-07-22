import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '@/i18n';
import Modal from '@/components/atoms/Modal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import * as taskService from '@/services/api/taskService';

const TaskCreateModal = ({ isOpen, onClose, onTaskCreated }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    fieldId: '',
    estimatedHours: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (formData.estimatedHours && (isNaN(formData.estimatedHours) || formData.estimatedHours <= 0)) {
      newErrors.estimatedHours = 'Estimated hours must be a positive number';
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
      const taskData = {
        ...formData,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
        fieldId: formData.fieldId ? parseInt(formData.fieldId) : null,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      const newTask = await taskService.createTask(taskData);
      toast.success('Task created successfully');
      onTaskCreated(newTask);
      handleClose();
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
        fieldId: '',
        estimatedHours: ''
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('createTask')}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField
              label="Task Title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div>
            <FormField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              error={errors.dueDate}
              required
            />
          </div>

          <div>
            <FormField
              label="Assigned To"
              type="text"
              value={formData.assignedTo}
              onChange={(e) => handleInputChange('assignedTo', e.target.value)}
              placeholder="Enter assignee name"
            />
          </div>

          <div>
            <FormField
              label="Estimated Hours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
              error={errors.estimatedHours}
              placeholder="0"
              min="1"
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Field ID"
              type="number"
              value={formData.fieldId}
              onChange={(e) => handleInputChange('fieldId', e.target.value)}
              placeholder="Enter field ID (optional)"
              min="1"
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
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskCreateModal;