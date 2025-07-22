import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "@/i18n";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FieldGrid from "@/components/organisms/FieldGrid";
import Layout from "@/components/organisms/Layout";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import FieldCreateModal from "@/components/molecules/FieldCreateModal";
import * as fieldService from "@/services/api/fieldService";

const Fields = () => {
  const { t } = useTranslation();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadFields = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fieldService.getAllFields();
      setFields(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load fields");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleDeleteField = async (fieldId) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      try {
        await fieldService.deleteField(fieldId);
        setFields(fields.filter(field => field.Id !== fieldId));
        toast.success("Field deleted successfully");
      } catch (err) {
        toast.error("Failed to delete field");
      }
    }
};

  const handleCreateField = (newField) => {
    setFields(prevFields => [...prevFields, newField]);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

const filteredFields = fields.filter((field) => {
    const matchesSearch = field?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field?.cropVariety?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || field?.currentStage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout>
        <Loading type="cards" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Error
          title="Fields Error"
          message={error}
          onRetry={loadFields}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
<div>
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
              {t('fieldsManagement')}
            </h1>
            <p className="text-gray-600">
              {t('fieldsDescription')}
            </p>
          </div>
          
<Button 
            variant="primary" 
            className="mt-4 lg:mt-0"
            onClick={handleOpenCreateModal}
>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {t('addNewField')}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
<div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchFields')}
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="lg:w-48"
>
            <option value="all">{t('allStatus')}</option>
            <option value="seeding">{t('seeding')}</option>
            <option value="growing">{t('growing')}</option>
            <option value="ready">{t('ready')}</option>
            <option value="harvested">{t('harvested')}</option>
          </Select>
        </div>

        {/* Fields Grid */}
{filteredFields.length === 0 ? (
          <Empty
            title={t('noFieldsFound')}
            message={fields.length === 0 
              ? t('noFieldsMessage')
              : t('noFieldsSearchMessage')
            }
            actionText={t('addField')}
            onAction={() => toast.info("Add field form coming soon")}
            icon="MapPin"
          />
        ) : (
          <FieldGrid
            fields={filteredFields}
            onSelectField={(field) => toast.info(`Viewing field: ${field.name}`)}
            onEditField={(field) => toast.info(`Editing field: ${field.name}`)}
            onDeleteField={handleDeleteField}
          />
)}
      </div>

      <FieldCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onFieldCreated={handleCreateField}
      />
    </Layout>
  );
};

export default Fields;