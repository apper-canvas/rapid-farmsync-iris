import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const CropCreateModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    cropVariety: '',
    plantDate: '',
    expectedHarvest: '',
    currentStage: 'seeding',
    status: 'active',
    area: '',
    soilType: '',
    coordinates: '',
    cropId: '',
    Tags: '',
    Owner: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Crop name is required');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        area: formData.area ? parseFloat(formData.area) : null,
        cropId: formData.cropId ? parseInt(formData.cropId) : null,
        coordinates: formData.coordinates ? formData.coordinates.split(',').map(coord => parseFloat(coord.trim())) : [],
        Owner: formData.Owner ? parseInt(formData.Owner) : null
      };

      await onSubmit(submitData);
      setFormData({
        name: '',
        cropVariety: '',
        plantDate: '',
        expectedHarvest: '',
        currentStage: 'seeding',
        status: 'active',
        area: '',
        soilType: '',
        coordinates: '',
        cropId: '',
        Tags: '',
        Owner: ''
      });
    } catch (error) {
      console.error('Error submitting crop:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentStageOptions = [
    { value: 'seeding', label: 'Seeding' },
    { value: 'growing', label: 'Growing' },
    { value: 'ready', label: 'Ready' },
    { value: 'harvested', label: 'Harvested' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Crop"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Crop Name *"
            type="text"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            required
          />

          <FormField
            label="Crop Variety"
            type="text"
            value={formData.cropVariety}
            onChange={(value) => handleInputChange('cropVariety', value)}
          />

          <FormField
            label="Plant Date"
            type="date"
            value={formData.plantDate}
            onChange={(value) => handleInputChange('plantDate', value)}
          />

          <FormField
            label="Expected Harvest Date"
            type="date"
            value={formData.expectedHarvest}
            onChange={(value) => handleInputChange('expectedHarvest', value)}
          />

          <FormField
            label="Current Stage"
            type="select"
            value={formData.currentStage}
            onChange={(value) => handleInputChange('currentStage', value)}
            options={currentStageOptions}
          />

          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
            options={statusOptions}
          />

          <FormField
            label="Area (acres)"
            type="number"
            value={formData.area}
            onChange={(value) => handleInputChange('area', value)}
            step="0.1"
          />

          <FormField
            label="Soil Type"
            type="text"
            value={formData.soilType}
            onChange={(value) => handleInputChange('soilType', value)}
          />

          <FormField
            label="Crop ID"
            type="number"
            value={formData.cropId}
            onChange={(value) => handleInputChange('cropId', value)}
          />

          <FormField
            label="Tags"
            type="text"
            value={formData.Tags}
            onChange={(value) => handleInputChange('Tags', value)}
            placeholder="Comma-separated tags"
          />
        </div>

        <FormField
          label="Coordinates"
          type="text"
          value={formData.coordinates}
          onChange={(value) => handleInputChange('coordinates', value)}
          placeholder="Latitude, Longitude (comma-separated)"
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Crop'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CropCreateModal;