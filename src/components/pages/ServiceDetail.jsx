import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusPill from "@/components/molecules/StatusPill";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { serviceService } from "@/services/api/serviceService";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const loadService = async () => {
    try {
      setLoading(true);
      setError("");
      const serviceData = await serviceService.getById(id);
      setService(serviceData);
      setFormData(serviceData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      const updatedService = await serviceService.toggleActive(id);
      setService(updatedService);
      toast.success(`Service ${updatedService.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error("Failed to update service status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"? This action cannot be undone.`)) {
      try {
        await serviceService.delete(id);
        toast.success("Service deleted successfully");
        navigate("/services");
      } catch (err) {
        toast.error("Failed to delete service");
      }
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setFormData(service);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedService = await serviceService.update(id, formData);
      setService(updatedService);
      setEditing(false);
      toast.success("Service updated successfully");
    } catch (err) {
      toast.error("Failed to update service");
    }
  };

  useEffect(() => {
    loadService();
  }, [id]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Design": return "Palette";
      case "Development": return "Code";
      case "Marketing": return "TrendingUp";
      case "Writing": return "PenTool";
      case "Consulting": return "MessageCircle";
      default: return "Package";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadService} />;
  if (!service) return <Error message="Service not found" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/services")}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
            <p className="text-gray-600">Service Details</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <StatusPill status={service.isActive ? "active" : "inactive"} />
          {!editing && (
            <>
              <Button variant="secondary" onClick={handleEdit}>
                <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant={service.isActive ? "secondary" : "primary"}
                onClick={handleToggleActive}
              >
                <ApperIcon 
                  name={service.isActive ? "Pause" : "Play"} 
                  className="h-4 w-4 mr-2" 
                />
                {service.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                <ApperIcon 
                  name={getCategoryIcon(service.category)} 
                  className="h-6 w-6 text-indigo-600" 
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Service Information</h2>
                <p className="text-gray-600">Complete service details and pricing</p>
              </div>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Writing">Writing</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="project">project</option>
                      <option value="hour">hour</option>
                      <option value="day">day</option>
                      <option value="week">week</option>
                      <option value="month">month</option>
                      <option value="piece">piece</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-gray-900">{service.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Unit</p>
                    <p className="text-gray-900">{service.unit}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                ${service.price.toLocaleString()}
              </p>
              <p className="text-gray-600">per {service.unit}</p>
            </div>
          </Card>

          {/* Service Meta */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <StatusPill status={service.isActive ? "active" : "inactive"} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-900">
                  {format(parseISO(service.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate(`/bills/create?serviceId=${service.Id}`)}
              >
                <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
                Create Bill with Service
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start"
                onClick={() => navigate(`/quotations/create?serviceId=${service.Id}`)}
              >
                <ApperIcon name="Quote" className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;