import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '@/i18n';
import ApperIcon from '@/components/ApperIcon';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import Loading from '@/components/ui/Loading';
import Layout from '@/components/organisms/Layout';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import CropCreateModal from '@/components/molecules/CropCreateModal';
import CropEditModal from '@/components/molecules/CropEditModal';
import CropDetailModal from '@/components/molecules/CropDetailModal';
import { getAllCrops, deleteCrop, createCrop, updateCrop } from '@/services/api/cropService';

const Crops = () => {
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCrops();
      setCrops(data || []);
    } catch (err) {
      setError('Failed to load crops');
      console.error('Error loading crops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCrop = async (cropData) => {
    try {
      const newCrop = await createCrop(cropData);
      if (newCrop) {
        setCrops(prev => [...prev, newCrop]);
        setIsCreateModalOpen(false);
        toast.success('Crop created successfully');
      }
    } catch (error) {
      console.error('Error creating crop:', error);
      toast.error('Failed to create crop');
    }
  };

  const handleUpdateCrop = async (cropId, updates) => {
    try {
      const updatedCrop = await updateCrop(cropId, updates);
      if (updatedCrop) {
        setCrops(prev => prev.map(crop => 
          crop.Id === cropId ? updatedCrop : crop
        ));
        setIsEditModalOpen(false);
        setSelectedCrop(null);
        toast.success('Crop updated successfully');
      }
    } catch (error) {
      console.error('Error updating crop:', error);
      toast.error('Failed to update crop');
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) {
      return;
    }

    try {
      await deleteCrop(cropId);
      setCrops(prev => prev.filter(crop => crop.Id !== cropId));
      toast.success('Crop deleted successfully');
    } catch (error) {
      console.error('Error deleting crop:', error);
      toast.error('Failed to delete crop');
    }
  };

  const handleViewCrop = (crop) => {
    setSelectedCrop(crop);
    setIsDetailModalOpen(true);
  };

  const handleEditCrop = (crop) => {
    setSelectedCrop(crop);
    setIsEditModalOpen(true);
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = !searchTerm || 
      crop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.cropVariety?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || crop.currentStage === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCrops} />;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              Crop Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage all your crops in one place.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            Add New Crop
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search crops by name or variety..."
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'seeding', label: 'Seeding' },
                { value: 'growing', label: 'Growing' },
                { value: 'ready', label: 'Ready' },
                { value: 'harvested', label: 'Harvested' }
              ]}
            />
          </div>
        </div>

        {/* Crops Grid */}
        {filteredCrops.length === 0 ? (
          <Empty
            title="No Crops Found"
            message={searchTerm || statusFilter !== 'all' 
              ? "No crops match your current search criteria." 
              : "Start managing your crops by adding your first crop."
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map(crop => (
              <Card key={crop.Id} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {crop.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {crop.cropVariety || 'No variety specified'}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(crop.currentStage)}>
                      {getStatusLabel(crop.currentStage)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Map" className="h-4 w-4 mr-2" />
                      {crop.area ? `${crop.area} acres` : 'Area not specified'}
                    </div>
                    {crop.plantDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                        Planted: {new Date(crop.plantDate).toLocaleDateString()}
                      </div>
                    )}
                    {crop.expectedHarvest && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                        Expected: {new Date(crop.expectedHarvest).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCrop(crop)}
                      className="flex items-center gap-1"
                    >
                      <ApperIcon name="Eye" className="h-4 w-4" />
                      View
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCrop(crop)}
                        className="flex items-center gap-1"
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCrop(crop.Id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CropCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCrop}
        />
      )}

      {isEditModalOpen && selectedCrop && (
        <CropEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCrop(null);
          }}
          onSubmit={(updates) => handleUpdateCrop(selectedCrop.Id, updates)}
          crop={selectedCrop}
        />
      )}

      {isDetailModalOpen && selectedCrop && (
        <CropDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCrop(null);
          }}
          crop={selectedCrop}
        />
      )}
    </Layout>
  );
};

export default Crops;