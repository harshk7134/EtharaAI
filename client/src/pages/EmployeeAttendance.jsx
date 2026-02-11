import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Calendar,
  UserCheck,
  UserX,
  Filter,
} from 'lucide-react';
import { getAttendance } from '../api/attendanceApi';
import AttendanceTable from '../components/attendance/AttendanceTable';
import AttendanceForm from '../components/attendance/AttendanceForm';
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function EmployeeAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const fetchData = async (filterDate = '') => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filterDate) params.date = filterDate;
      const response = await getAttendance(id, params);
      setRecords(response.data);
      setSummary(response.summary);
      setEmployee(response.employee);
    } catch (err) {
      if (err.status === 404) {
        navigate('/employees');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleFilter = () => {
    fetchData(dateFilter);
  };

  const clearFilter = () => {
    setDateFilter('');
    fetchData('');
  };

  if (loading && !employee)
    return <LoadingSpinner message="Loading attendance..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => fetchData()} />;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/employees"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft size={16} />
          Back to Employees
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {employee?.fullName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {employee?.employeeId} · {employee?.department}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Records"
          value={summary.total}
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Present Days"
          value={summary.present}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Absent Days"
          value={summary.absent}
          icon={UserX}
          color="red"
        />
      </div>

      {/* Date filter (bonus) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleFilter}
            disabled={!dateFilter}
            className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Filter
          </button>
          {dateFilter && (
            <button
              onClick={clearFilter}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Attendance records */}
      {loading ? (
        <LoadingSpinner message="Loading records..." />
      ) : records.length === 0 ? (
        <EmptyState
          title="No attendance records"
          description={
            dateFilter
              ? 'No records found for this date.'
              : 'Start by marking attendance for this employee.'
          }
          icon={Calendar}
          action={
            !dateFilter && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
              >
                <Plus size={16} />
                Mark Attendance
              </button>
            )
          }
        />
      ) : (
        <AttendanceTable records={records} />
      )}

      {/* Mark Attendance Modal */}
      <AttendanceForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={() => fetchData(dateFilter)}
        employeeId={id}
        employeeName={employee?.fullName}
      />
    </div>
  );
}
