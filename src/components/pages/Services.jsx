import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StatusPill from "@/components/molecules/StatusPill";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { serviceService } from "@/services/api/serviceService";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");
      const servicesData = await serviceService.getAll();
      setServices(servicesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await serviceService.toggleActive(id);
      toast.success("Service status updated successfully");
      loadServices();
    } catch (err) {
      toast.error("Failed to update service status");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await serviceService.delete(id);
        toast.success("Service deleted successfully");
        loadServices();
      } catch (err) {
        toast.error("Failed to delete service");
      }
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && service.isActive) ||
                         (statusFilter === "inactive" && !service.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(services.map(s => s.category))];
  
  const calculateStats = () => {
    const totalServices = services.length;
    const activeServices = services.filter(s => s.isActive).length;
    const avgPrice = services.length > 0 
      ? services.reduce((sum, s) => sum + s.price, 0) / services.length 
      : 0;
    
    return { totalServices, activeServices, avgPrice };
  };

  const stats = calculateStats();

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
  if (error) return <Error message={error} onRetry={loadServices} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services & Products</h1>
          <p className="text-gray-600">Manage your service catalog and pricing</p>
        </div>
        <Button onClick={() => navigate("/services/create")}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <ApperIcon name="Package" className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.activeServices}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <ApperIcon name="CheckCircle" className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Price</p>
              <p className="text-2xl font-bold text-purple-600">${stats.avgPrice.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ApperIcon name="DollarSign" className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search services..."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <Empty 
          title="No services found" 
          description="No services match your current filters."
          action={
            <Button onClick={() => navigate("/services/create")}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                    <ApperIcon 
                      name={getCategoryIcon(service.category)} 
                      className="h-5 w-5 text-indigo-600" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.category}</p>
                  </div>
                </div>
                <StatusPill status={service.isActive ? "active" : "inactive"} />
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${service.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">per {service.unit}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Created {format(parseISO(service.createdAt), "MMM d, yyyy")}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/services/${service.Id}`)}
                  className="flex-1"
                >
                  <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
                  View
                </Button>
                
                <Button
                  variant={service.isActive ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => handleToggleActive(service.Id)}
                >
                  <ApperIcon 
                    name={service.isActive ? "Pause" : "Play"} 
                    className="h-4 w-4" 
                  />
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(service.Id, service.name)}
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;