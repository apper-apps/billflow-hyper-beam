import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import html2pdf from "html2pdf.js";
import { billService } from "@/services/api/billService";
import { clientService } from "@/services/api/clientService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import StatusPill from "@/components/molecules/StatusPill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
const Bills = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [billsData, clientsData] = await Promise.all([
        billService.getAll(),
        clientService.getAll()
      ]);
      setBills(billsData);
      setClients(clientsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load bills");
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

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(bill.clientId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsPaid = async (billId, e) => {
    e.stopPropagation();
    try {
      await billService.markAsPaid(billId);
      toast.success("Bill marked as paid");
      loadData();
    } catch (err) {
      toast.error("Failed to update bill status");
    }
  };

const handlePDFPreview = async (bill, e) => {
    e.stopPropagation();
    try {
      const client = clients.find(c => c.Id === bill.clientId);
      if (!client) {
        toast.error("Client data not found");
        return;
      }
      setSelectedBill({ ...bill, client });
      setShowPDFModal(true);
    } catch (err) {
      toast.error("Failed to generate PDF preview");
    }
  };

  if (loading) return <Loading type="table" count={6} />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (bills.length === 0) {
    return (
      <Empty
        icon="FileText"
        title="No bills yet"
        description="Create your first bill to start tracking payments."
        actionLabel="Create Bill"
        onAction={() => navigate("/bills/create")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
          <p className="text-gray-600">Manage and track your billing</p>
        </div>
        <Button onClick={() => navigate("/bills/create")} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Bill
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bills..."
          />
        </div>
        <div className="flex space-x-2">
          {["all", "pending", "paid", "overdue"].map((status) => (
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

      {/* Bills Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr
                  key={bill.Id}
                  className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/bills/${bill.Id}`)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{bill.billNumber}</p>
                      <p className="text-sm text-gray-500">
                        Created {format(parseISO(bill.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <ApperIcon name="Building2" className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{getClientName(bill.clientId)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-lg font-bold text-gray-900">
                      ${bill.total.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {format(parseISO(bill.dueDate), "MMM dd, yyyy")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={bill.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
<div className="flex items-center justify-end space-x-2">
                      {bill.status === "pending" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={(e) => handleMarkAsPaid(bill.Id, e)}
                        >
                          <ApperIcon name="CheckCircle" className="h-4 w-4 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => handlePDFPreview(bill, e)}
                      >
                        <ApperIcon name="FileText" className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/bills/${bill.Id}`);
                        }}
                      >
                        <ApperIcon name="Eye" className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredBills.length === 0 && bills.length > 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Search" className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bills found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
</div>
      )}

      {/* PDF Preview Modal */}
      {showPDFModal && selectedBill && (
        <PDFPreviewModal
          bill={selectedBill}
          onClose={() => {
            setShowPDFModal(false);
            setSelectedBill(null);
          }}
        />
      )}
    </div>
  );
};
// PDF Preview Modal Component
const PDFPreviewModal = ({ bill, onClose }) => {
  const [pdfContent, setPdfContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePreview = async () => {
      try {
        const content = await billService.generatePDF(bill.Id, bill.client);
        setPdfContent(content);
      } catch (err) {
        toast.error("Failed to generate PDF preview");
      } finally {
        setLoading(false);
      }
    };
    generatePreview();
  }, [bill]);

  const handleDownload = () => {
    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    
    const opt = {
      margin: 1,
      filename: `Bill-${bill.billNumber}.pdf`,
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
          <h2 className="text-xl font-bold text-gray-900">PDF Preview - {bill.billNumber}</h2>
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
              <ApperIcon name="Loader2" className="h-8 w-8 animate-spin text-indigo-600" />
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

export default Bills;