import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { paymentService } from "@/services/api/paymentService";
import { billService } from "@/services/api/billService";
import { clientService } from "@/services/api/clientService";

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [paymentsData, billsData, clientsData] = await Promise.all([
        paymentService.getAll(),
        billService.getAll(),
        clientService.getAll()
      ]);
      setPayments(paymentsData);
      setBills(billsData);
      setClients(clientsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getBillInfo = (billId) => {
    const bill = bills.find(b => b.Id === billId);
    if (!bill) return { billNumber: "Unknown Bill", clientName: "Unknown Client" };
    
    const client = clients.find(c => c.Id === bill.clientId);
    return {
      billNumber: bill.billNumber,
      clientName: client ? client.name : "Unknown Client"
    };
  };

  const filteredPayments = payments.filter(payment => {
    const billInfo = getBillInfo(payment.billId);
    const matchesSearch = 
      billInfo.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billInfo.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    
    return matchesSearch && matchesMethod;
  });

  const calculateStats = () => {
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const thisMonthPayments = payments
      .filter(payment => 
        new Date(payment.date).getMonth() === new Date().getMonth() &&
        new Date(payment.date).getFullYear() === new Date().getFullYear()
      )
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const methodStats = payments.reduce((acc, payment) => {
      acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
      return acc;
    }, {});

    return {
      totalPayments,
      thisMonthPayments,
      totalCount: payments.length,
      methodStats
    };
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "Cash": return "Banknote";
      case "Bank Transfer": return "CreditCard";
      case "Check": return "FileText";
      case "Credit Card": return "CreditCard";
      case "PayPal": return "Wallet";
      default: return "DollarSign";
    }
  };

  if (loading) return <Loading type="table" count={6} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (payments.length === 0) {
    return (
      <Empty
        icon="CreditCard"
        title="No payments yet"
        description="Payment records will appear here once you start receiving payments."
        actionLabel="View Bills"
        onAction={() => navigate("/bills")}
      />
    );
  }

  const stats = calculateStats();
  const uniqueMethods = [...new Set(payments.map(p => p.method))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Track all payment transactions and history</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <ApperIcon name="DollarSign" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.totalPayments.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Received</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <ApperIcon name="Calendar" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.thisMonthPayments.toLocaleString()}</p>
          <p className="text-sm text-gray-600">This Month</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <ApperIcon name="Hash" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCount}</p>
          <p className="text-sm text-gray-600">Total Payments</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalCount > 0 ? Math.round(stats.totalPayments / stats.totalCount).toLocaleString() : 0}
          </p>
          <p className="text-sm text-gray-600">Average Payment</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search payments..."
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant={methodFilter === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setMethodFilter("all")}
          >
            All Methods
          </Button>
          {uniqueMethods.map((method) => (
            <Button
              key={method}
              variant={methodFilter === method ? "primary" : "secondary"}
              size="sm"
              onClick={() => setMethodFilter(method)}
            >
              {method}
            </Button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill & Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const billInfo = getBillInfo(payment.billId);
                return (
                  <tr
                    key={payment.Id}
                    className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                          <ApperIcon name="CheckCircle" className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">Payment #{payment.Id}</p>
                          {payment.notes && (
                            <p className="text-sm text-gray-500">{payment.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{billInfo.billNumber}</p>
                        <p className="text-sm text-gray-500">{billInfo.clientName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xl font-bold text-emerald-600">
                        ${payment.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded shadow-sm">
                          <ApperIcon name={getMethodIcon(payment.method)} className="h-3 w-3 text-white" />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900">{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {format(parseISO(payment.date), "MMM dd, yyyy")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(payment.date), "h:mm a")}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/bills/${payment.billId}`)}
                      >
                        <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
                        View Bill
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredPayments.length === 0 && payments.length > 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Search" className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Payments;