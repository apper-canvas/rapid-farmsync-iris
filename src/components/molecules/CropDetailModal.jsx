import React from 'react';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const CropDetailModal = ({ isOpen, onClose, crop }) => {
  if (!crop) return null;

  const getStatusColor = (stage) => {
    switch (stage) {
      case 'seeding': return 'info';
      case 'growing': return 'warning';
      case 'ready': return 'success';
      case 'harvested': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (stage) => {
    switch (stage) {
      case 'seeding': return 'Seeding';
      case 'growing': return 'Growing';
      case 'ready': return 'Ready';
      case 'harvested': return 'Harvested';
      default: return stage || 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCoordinates = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return 'Not specified';
    }
    return coordinates.join(', ');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crop Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">{crop.name}</h2>
            <p className="text-gray-600">{crop.cropVariety || 'No variety specified'}</p>
          </div>
          <Badge variant={getStatusColor(crop.currentStage)}>
            {getStatusLabel(crop.currentStage)}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <ApperIcon name="Map" className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Area</p>
                  <p className="text-gray-900">
                    {crop.area ? `${crop.area} acres` : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <ApperIcon name="Layers" className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Soil Type</p>
                  <p className="text-gray-900">{crop.soilType || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <ApperIcon name="Hash" className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Crop ID</p>
                  <p className="text-gray-900">{crop.cropId || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <ApperIcon name="MapPin" className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Coordinates</p>
                  <p className="text-gray-900">{formatCoordinates(crop.coordinates)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <ApperIcon name="Calendar" className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Plant Date</p>
                  <p className="text-gray-900">{formatDate(crop.plantDate)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <ApperIcon name="Clock" className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Expected Harvest</p>
                  <p className="text-gray-900">{formatDate(crop.expectedHarvest)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <ApperIcon name="Activity" className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-gray-900">
                    {crop.status === 'active' ? 'Active' : 'Completed'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {crop.Tags && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {crop.Tags.split(',').map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Owner Information */}
        {crop.Owner && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Owner</h3>
            <div className="flex items-center">
              <ApperIcon name="User" className="h-5 w-5 text-gray-400 mr-3" />
              <p className="text-gray-900">
                {typeof crop.Owner === 'object' ? crop.Owner.Name : crop.Owner}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CropDetailModal;