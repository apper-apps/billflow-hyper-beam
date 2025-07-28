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
import { quotationService } from "@/services/api/quotationService";
import { clientService } from "@/services/api/clientService";

const Quotations = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [quotationsData, clientsData] = await Promise.all([
        quotationService.getAll(),
        clientService.getAll()
      ]);
      setQuotations(quotationsData);
      setClients(clientsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getClientName = (clientId) => {
    const client = clients.find(c => c.Id === clientId);
    return client ? client.name : "Unknown Client";
  };

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = getClientName(quotation.clientId)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (quotationId, newStatus, e) => {
    e.stopPropagation();
    try {
      await quotationService.updateStatus(quotationId, newStatus);
      toast.success("Quotation status updated");
      loadData();
    } catch (err) {
      toast.error("Failed to update quotation status");
    }
  };

  if (loading) return <Loading type="table" count={5} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (quotations.length === 0) {
    return (
      <Empty
        icon="Quote"
        title="No quotations yet"
        description="Create your first quotation to start sending proposals to clients."
        actionLabel="Create Quotation"
        onAction={() => navigate("/quotations/create")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-600">Manage your proposals and quotations</p>
        </div>
        <Button onClick={() => navigate("/quotations/create")} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Quotation
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search quotations..."
          />
        </div>
        <div className="flex space-x-2">
          {["all", "draft", "sent", "accepted", "rejected"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "primary" : "secondary"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Quotations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotations.map((quotation) => (
          <Card
            key={quotation.Id}
            className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            onClick={() => navigate(`/quotations/${quotation.Id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <ApperIcon name="Quote" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getClientName(quotation.clientId)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quotation #{quotation.Id.toString().padStart(3, "0")}
                  </p>
                </div>
              </div>
              <StatusPill status={quotation.status} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${quotation.total.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Valid Until</span>
                <span className="font-medium text-gray-900">
                  {format(parseISO(quotation.validUntil), "MMM dd, yyyy")}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Items</span>
                <span className="font-medium text-gray-900">
                  {quotation.items.length} item{quotation.items.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Created {format(parseISO(quotation.createdAt), "MMM dd, yyyy")}
                </span>
                
                <div className="flex space-x-2">
                  {quotation.status === "draft" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => handleUpdateStatus(quotation.Id, "sent", e)}
                    >
                      <ApperIcon name="Send" className="h-3 w-3 mr-1" />
                      Send
                    </Button>
                  )}
                  
                  {quotation.status === "sent" && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={(e) => handleUpdateStatus(quotation.Id, "accepted", e)}
                      >
                        <ApperIcon name="CheckCircle" className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => handleUpdateStatus(quotation.Id, "rejected", e)}
                      >
                        <ApperIcon name="XCircle" className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredQuotations.length === 0 && quotations.length > 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Search" className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotations found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Quotations;