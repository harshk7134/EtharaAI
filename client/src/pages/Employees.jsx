import { useState, useEffect } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { getEmployees, deleteEmployee } from '../api/employeeApi';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeForm from '../components/employees/EmployeeForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteEmployee(deleteTarget._id);
      toast.success('Employee deleted successfully');
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.message || 'Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your employee directory ({employees.length} total)
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Search */}
      {employees.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading employees..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchEmployees} />
      ) : employees.length === 0 ? (
        <EmptyState
          title="No employees yet"
          description="Get started by adding your first employee."
          icon={Users}
          action={
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
            >
              <Plus size={16} />
              Add Employee
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results found"
          description={`No employees match "${search}". Try a different search.`}
        />
      ) : (
        <EmployeeTable employees={filtered} onDelete={setDeleteTarget} />
      )}

      {/* Add Employee Modal */}
      <EmployeeForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={fetchEmployees}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}? This will also remove all their attendance records. This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
}
