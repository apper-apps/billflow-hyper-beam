import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format, isAfter, parseISO } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusPill from "@/components/molecules/StatusPill";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { billService } from "@/services/api/billService";
import { clientService } from "@/services/api/clientService";
import { paymentService } from "@/services/api/paymentService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [billsData, clientsData, paymentsData] = await Promise.all([
        billService.getAll(),
        clientService.getAll(),
        paymentService.getAll()
      ]);
      
      setBills(billsData);
      setClients(clientsData);
      setPayments(paymentsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const calculateStats = () => {
    const totalRevenue = bills
      .filter(bill => bill.status === "paid")
      .reduce((sum, bill) => sum + bill.total, 0);
    
    const pendingAmount = bills
      .filter(bill => bill.status === "pending")
      .reduce((sum, bill) => sum + bill.total, 0);
    
    const overdueAmount = bills
      .filter(bill => bill.status === "overdue" || 
        (bill.status === "pending" && isAfter(new Date(), parseISO(bill.dueDate))))
      .reduce((sum, bill) => sum + bill.total, 0);
    
    const thisMonthRevenue = bills
      .filter(bill => 
        bill.status === "paid" && 
        new Date(bill.createdAt).getMonth() === new Date().getMonth()
      )
      .reduce((sum, bill) => sum + bill.total, 0);

    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      thisMonthRevenue,
      totalClients: clients.length,
      totalBills: bills.length
    };
  };

  const getRecentBills = () => {
    return bills
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.Id === clientId);
    return client ? client.name : "Unknown Client";
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = calculateStats();
  const recentBills = getRecentBills();

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          trend="up"
          trendValue="+12.5%"
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Pending Payments"
          value={`$${stats.pendingAmount.toLocaleString()}`}
          icon="Clock"
          trend="down"
          trendValue="-3.2%"
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Overdue Amount"
          value={`$${stats.overdueAmount.toLocaleString()}`}
          icon="AlertCircle"
          gradient="from-red-500 to-red-600"
        />
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon="Users"
          trend="up"
          trendValue="+5"
          gradient="from-indigo-500 to-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6" gradient>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600">Create new bills and manage your billing workflow</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate("/bills/create")}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Create Bill
            </Button>
            <Button variant="secondary" onClick={() => navigate("/quotations/create")}>
              <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
              New Quotation
            </Button>
          </div>
        </div>
      </Card>

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
            {recentBills.length > 0 ? (
              recentBills.map((bill) => (
                <div
                  key={bill.Id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer"
                  onClick={() => navigate(`/bills/${bill.Id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{bill.billNumber}</p>
                      <StatusPill status={bill.status} />
                    </div>
                    <p className="text-sm text-gray-600">{getClientName(bill.clientId)}</p>
                    <p className="text-xs text-gray-500">
                      Due: {format(parseISO(bill.dueDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-gray-900">
                      ${bill.total.toLocaleString()}
                    </p>
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

        {/* Monthly Overview */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Overview</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-800">This Month Revenue</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    ${stats.thisMonthRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                  <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-800">Total Bills</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.totalBills}</p>
                </div>
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <ApperIcon name="FileText" className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-800">Collection Rate</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {stats.totalRevenue > 0 ? 
                      Math.round((stats.totalRevenue / (stats.totalRevenue + stats.pendingAmount)) * 100) : 0}%
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                  <ApperIcon name="Target" className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;