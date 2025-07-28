import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { countries } from "@/utils/countries";
import { billService } from "@/services/api/billService";
import { clientService } from "@/services/api/clientService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import { LanguageContext } from "@/contexts/LanguageContext";

const Clients = () => {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [clients, setClients] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [clientsData, billsData] = await Promise.all([
        clientService.getAll(),
        billService.getAll()
      ]);
      setClients(clientsData);
      setBills(billsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const filteredClients = clients.filter(client =>
    (client.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientStats = (clientId) => {
    const clientBills = bills.filter(bill => bill.clientId === clientId);
    const totalBilled = clientBills.reduce((sum, bill) => sum + bill.total, 0);
    const paidAmount = clientBills
      .filter(bill => bill.status === "paid")
      .reduce((sum, bill) => sum + bill.total, 0);
    const pendingAmount = clientBills
      .filter(bill => bill.status === "pending")
      .reduce((sum, bill) => sum + bill.total, 0);
    const overdueAmount = clientBills
      .filter(bill => bill.status === "overdue")
      .reduce((sum, bill) => sum + bill.total, 0);

    return {
      totalBills: clientBills.length,
      totalBilled,
      paidAmount,
      pendingAmount,
      overdueAmount
    };
  };

  if (loading) return <Loading type="table" count={5} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (clients.length === 0) {
return (
      <Empty
        icon="Users"
        title={t('clients.empty.title')}
        description={t('clients.empty.description')}
        actionLabel={t('clients.empty.action')}
        onAction={() => setShowCreateModal(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
{/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('clients.title')}</h1>
          <p className="text-gray-600">{t('clients.subtitle')}</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {t('clients.actions.add')}
        </Button>
      </div>

      {/* Search */}
<div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('clients.search.placeholder')}
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const stats = getClientStats(client.Id);
          return (
            <Card
              key={client.Id}
              className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              onClick={() => navigate(`/clients/${client.Id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <ApperIcon name="Building2" className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
<h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    {client.address && (
                      <p className="text-sm text-gray-500">{client.address}</p>
                    )}
                  </div>
                </div>
<div className="text-right">
                  <p className="text-sm text-gray-500">{t('clients.card.paymentTerms')}</p>
                  <p className="font-medium text-gray-900">{client.paymentTerms} {t('common.days')}</p>
                </div>
              </div>

<div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('clients.card.totalBilled')}</span>
                  <span className="font-medium text-gray-900">
                    ${stats.totalBilled.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('clients.card.paidAmount')}</span>
                  <span className="font-medium text-emerald-600">
                    ${stats.paidAmount.toLocaleString()}
                  </span>
                </div>
                {stats.pendingAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('clients.card.pending')}</span>
                    <span className="font-medium text-amber-600">
                      ${stats.pendingAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                {stats.overdueAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('clients.card.overdue')}</span>
                    <span className="font-medium text-red-600">
                      ${stats.overdueAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

<div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{t('clients.card.added')} {format(parseISO(client.createdAt), "MMM dd, yyyy")}</span>
                  <span>{stats.totalBills} {t('clients.card.bills')}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Client Modal */}
      {showCreateModal && (
        <CreateClientModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Create Client Modal Component
const CreateClientModal = ({ onClose, onSuccess }) => {
const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    paymentTerms: 30
});
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await clientService.create(formData);
      toast.success("Client created successfully");
      onSuccess();
    } catch (err) {
      toast.error("Failed to create client");
    } finally {
      setLoading(false);
    }
  };

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "paymentTerms" ? parseInt(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
<Card className="w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('clients.modal.title')}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('clients.form.name')}
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
              {t('clients.form.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('clients.form.phone')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('clients.form.address')}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={t('clients.form.addressPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('clients.form.city')}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder={t('clients.form.cityPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('clients.form.state')}
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder={t('clients.form.statePlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('clients.form.country')}
              </label>
              <Select
                name="country"
                value={formData.country}
                onChange={handleChange}
                options={[
                  { value: "", text: t('clients.form.countryPlaceholder') },
                  ...countries.map(country => ({
                    value: country.name,
                    text: country.name
                  }))
                ]}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('clients.form.paymentTerms')}
            </label>
            <select
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={15}>15 {t('common.days')}</option>
              <option value={30}>30 {t('common.days')}</option>
              <option value={45}>45 {t('common.days')}</option>
              <option value={60}>60 {t('common.days')}</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('clients.modal.creating') : t('clients.modal.create')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Clients;