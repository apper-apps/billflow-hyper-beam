import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import html2pdf from "html2pdf.js";
import { clientService } from "@/services/api/clientService";
import { quotationService } from "@/services/api/quotationService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import StatusPill from "@/components/molecules/StatusPill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
const Quotations = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

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
const handlePDFPreview = async (quotation, e) => {
    e.stopPropagation();
    try {
      const client = clients.find(c => c.Id === quotation.clientId);
      if (!client) {
        toast.error("Client data not found");
        return;
      }
      setSelectedQuotation({ ...quotation, client });
      setShowPDFModal(true);
    } catch (err) {
      toast.error("Failed to generate PDF preview");
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
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handlePDFPreview(quotation, e)}
                  >
                    <ApperIcon name="FileText" className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
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
{/* PDF Preview Modal */}
      {showPDFModal && selectedQuotation && (
        <QuotationPDFModal
          quotation={selectedQuotation}
          onClose={() => {
            setShowPDFModal(false);
            setSelectedQuotation(null);
          }}
        />
      )}
    </div>
  );
};

// Quotation PDF Preview Modal Component
const QuotationPDFModal = ({ quotation, onClose }) => {
  const [pdfContent, setPdfContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePreview = async () => {
      try {
        const content = await quotationService.generatePDF(quotation.Id, quotation.client);
        setPdfContent(content);
      } catch (err) {
        toast.error("Failed to generate PDF preview");
      } finally {
        setLoading(false);
      }
    };
    generatePreview();
  }, [quotation]);

  const handleDownload = () => {
    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    
    const opt = {
      margin: 1,
      filename: `Quotation-${quotation.Id.toString().padStart(6, '0')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Quotation PDF Preview</h2>
          <div className="flex space-x-2">
            <Button onClick={handleDownload} disabled={loading}>
              <ApperIcon name="Download" className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div 
              className="bg-white shadow-lg rounded-lg"
              dangerouslySetInnerHTML={{ __html: pdfContent }}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Quotations;