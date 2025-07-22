import React from 'react';
import { format } from 'date-fns';
import Modal from '@/components/atoms/Modal';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const FieldDetailModal = ({ isOpen, onClose, field, onEdit }) => {
  if (!field) return null;

  const getStatusColor = (status) => {
    const colors = {
      seeding: "seeding",
      growing: "growing", 
      ready: "ready",
      harvested: "harvested"
    };
    return colors[status] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Field Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="MapPin" className="h-5 w-5 mr-2 text-primary" />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Field Name</label>
              <p className="text-gray-900 font-medium">{field.Name || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Area (acres)</label>
              <p className="text-gray-900">{field.area_c || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Soil Type</label>
              <p className="text-gray-900">{field.soilType_c || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <Badge variant={getStatusColor(field.status_c)}>
                {field.status_c || 'Not set'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Crop Information */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Sprout" className="h-5 w-5 mr-2 text-secondary" />
            Crop Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Crop ID</label>
              <p className="text-gray-900">{field.cropId_c || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Crop Variety</label>
              <p className="text-gray-900">{field.cropVariety_c || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Current Stage</label>
              <Badge variant={getStatusColor(field.currentStage_c)}>
                {field.currentStage_c || 'Not set'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Calendar" className="h-5 w-5 mr-2 text-accent" />
            Important Dates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Plant Date</label>
              <p className="text-gray-900">{formatDate(field.plantDate_c)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Expected Harvest</label>
              <p className="text-gray-900">{formatDate(field.expectedHarvest_c)}</p>
            </div>
          </div>
        </div>

        {/* Location & Coordinates */}
        {field.coordinates_c && (
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Map" className="h-5 w-5 mr-2 text-info" />
              Location Details
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Coordinates</label>
              <p className="text-gray-900 whitespace-pre-line">{field.coordinates_c}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {field.Tags && (
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {field.Tags.split(',').map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* System Information */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Info" className="h-5 w-5 mr-2 text-gray-500" />
            System Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created On</label>
              <p className="text-gray-900">{formatDateTime(field.CreatedOn)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created By</label>
              <p className="text-gray-900">{field.CreatedBy?.Name || 'Unknown'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Modified</label>
              <p className="text-gray-900">{formatDateTime(field.ModifiedOn)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Modified By</label>
              <p className="text-gray-900">{field.ModifiedBy?.Name || 'Unknown'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Owner</label>
              <p className="text-gray-900">{field.Owner?.Name || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              onEdit(field);
              onClose();
            }}
          >
            <ApperIcon name="Edit2" className="h-4 w-4 mr-2" />
            Edit Field
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FieldDetailModal;