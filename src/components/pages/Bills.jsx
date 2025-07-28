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
import { billService } from "@/services/api/billService";
import { clientService } from "@/services/api/clientService";

const Bills = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      )}
    </div>
  );
};

export default Bills;