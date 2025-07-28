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
import { clientService } from "@/services/api/clientService";
import { billService } from "@/services/api/billService";
import { paymentService } from "@/services/api/paymentService";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [clientData, billsData, paymentsData] = await Promise.all([
        clientService.getById(id),
        billService.getByClientId(id),
        paymentService.getAll()
      ]);
      
      setClient(clientData);
      setBills(billsData);
      setPayments(paymentsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load client details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, [id]);

  const calculateStats = () => {
    const totalBilled = bills.reduce((sum, bill) => sum + bill.total, 0);
    const paidAmount = bills
      .filter(bill => bill.status === "paid")
      .reduce((sum, bill) => sum + bill.total, 0);
    const pendingAmount = bills
      .filter(bill => bill.status === "pending")
      .reduce((sum, bill) => sum + bill.total, 0);
    const overdueAmount = bills
      .filter(bill => bill.status === "overdue")
      .reduce((sum, bill) => sum + bill.total, 0);

    return {
      totalBills: bills.length,
      totalBilled,
      paidAmount,
      pendingAmount,
      overdueAmount
    };
  };

  const getPaymentHistory = () => {
    return payments
      .filter(payment => bills.some(bill => bill.Id === payment.billId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (loading) return <Loading type="cards" count={6} />;
  if (error) return <Error message={error} onRetry={loadClientData} />;
  if (!client) return <Error message="Client not found" onRetry={loadClientData} />;

  const stats = calculateStats();
  const paymentHistory = getPaymentHistory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate("/clients")} className="mr-4">
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">Client Details & Payment History</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => navigate(`/bills/create?client=${client.Id}`)}>
            <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
          <Button onClick={() => navigate(`/quotations/create?client=${client.Id}`)}>
            <ApperIcon name="Quote" className="h-4 w-4 mr-2" />
            New Quotation
          </Button>
        </div>
      </div>

      {/* Client Info */}
      <Card className="p-6" gradient>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center mb-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                <ApperIcon name="Mail" className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{client.email}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                <ApperIcon name="Phone" className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{client.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg">
                <ApperIcon name="Calendar" className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Payment Terms</p>
                <p className="font-medium text-gray-900">{client.paymentTerms} days</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <ApperIcon name="UserCheck" className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Client Since</p>
                <p className="font-medium text-gray-900">
                  {format(parseISO(client.createdAt), "MMM yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {client.address && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start">
              <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg shadow-lg">
                <ApperIcon name="MapPin" className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-900">{client.address}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <ApperIcon name="FileText" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalBills}</p>
          <p className="text-sm text-gray-600">Total Bills</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <ApperIcon name="DollarSign" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.totalBilled.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Billed</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <ApperIcon name="CheckCircle" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.paidAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Paid Amount</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center shadow-lg">
            <ApperIcon name="Clock" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.pendingAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bills */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Bills</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/bills")}>
              View All
              <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {bills.length > 0 ? (
              bills.slice(0, 5).map((bill) => (
                <div
                  key={bill.Id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/bills/${bill.Id}`)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{bill.billNumber}</p>
                    <p className="text-sm text-gray-600">
                      Due: {format(parseISO(bill.dueDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${bill.total.toLocaleString()}</p>
                    <StatusPill status={bill.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <ApperIcon name="FileText" className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-gray-600">No bills created yet</p>
              </div>
            )}
          </div>
        </Card>

        {/* Payment History */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment History</h2>
          
          <div className="space-y-4">
            {paymentHistory.length > 0 ? (
              paymentHistory.slice(0, 5).map((payment) => (
                <div key={payment.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                      <ApperIcon name="CheckCircle" className="h-4 w-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        {format(parseISO(payment.date), "MMM dd, yyyy")} • {payment.method}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <ApperIcon name="CreditCard" className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-gray-600">No payments recorded yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientDetail;