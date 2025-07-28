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
import { billService } from "@/services/api/billService";
import { clientService } from "@/services/api/clientService";
import { paymentService } from "@/services/api/paymentService";

const BillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [client, setClient] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const loadBillData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const billData = await billService.getById(id);
      setBill(billData);
      
      const [clientData, paymentsData] = await Promise.all([
        clientService.getById(billData.clientId),
        paymentService.getByBillId(id)
      ]);
      
      setClient(clientData);
      setPayments(paymentsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load bill details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillData();
  }, [id]);

  const handleMarkAsPaid = async () => {
    try {
      await billService.markAsPaid(bill.Id);
      toast.success("Bill marked as paid");
      loadBillData();
    } catch (err) {
      toast.error("Failed to update bill status");
    }
  };

  if (loading) return <Loading type="cards" count={4} />;
  if (error) return <Error message={error} onRetry={loadBillData} />;
  if (!bill || !client) return <Error message="Bill not found" onRetry={loadBillData} />;

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = bill.total - totalPaid;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate("/bills")} className="mr-4">
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{bill.billNumber}</h1>
            <p className="text-gray-600">Bill Details & Payment History</p>
          </div>
        </div>
        <div className="flex space-x-3">
          {bill.status === "pending" && (
            <>
              <Button variant="secondary" onClick={() => setShowPaymentModal(true)}>
                <ApperIcon name="CreditCard" className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
              <Button onClick={handleMarkAsPaid}>
                <ApperIcon name="CheckCircle" className="h-4 w-4 mr-2" />
                Mark as Paid
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bill Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6" gradient>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{bill.billNumber}</h2>
                <StatusPill status={bill.status} />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${bill.total.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bill Date</p>
                <p className="font-medium text-gray-900">
                  {format(parseISO(bill.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Due Date</p>
                <p className="font-medium text-gray-900">
                  {format(parseISO(bill.dueDate), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Terms</p>
                <p className="font-medium text-gray-900">{client.paymentTerms} days</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To</h3>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                    <ApperIcon name="Building2" className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-semibold text-gray-900">{client.name}</h4>
                    <p className="text-gray-600">{client.email}</p>
                    {client.phone && <p className="text-gray-600">{client.phone}</p>}
                    {client.address && (
                      <p className="text-gray-600 mt-2">{client.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium text-gray-900">${bill.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-medium text-emerald-600">${totalPaid.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Remaining</span>
                  <span className="font-bold text-gray-900">${remainingAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Progress</h3>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalPaid / bill.total) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {Math.round((totalPaid / bill.total) * 100)}% Paid
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Line Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bill.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{item.description}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-gray-900">{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gray-900">${item.rate.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-gray-900">${item.amount.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-900">
                  Total:
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-xl font-bold text-gray-900">
                    ${bill.total.toLocaleString()}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Payment History */}
      {payments.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
          <div className="space-y-4">
            {payments.map((payment) => (
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
                    {payment.notes && (
                      <p className="text-sm text-gray-500 mt-1">{payment.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <RecordPaymentModal
          bill={bill}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            loadBillData();
          }}
        />
      )}
    </div>
  );
};

// Record Payment Modal Component
const RecordPaymentModal = ({ bill, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: bill.total,
    method: "Cash",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await paymentService.create({
        billId: bill.Id,
        ...formData
      });
      toast.success("Payment recorded successfully");
      onSuccess();
    } catch (err) {
      toast.error("Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              max={bill.total}
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Additional notes about this payment..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Recording..." : "Record Payment"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BillDetail;