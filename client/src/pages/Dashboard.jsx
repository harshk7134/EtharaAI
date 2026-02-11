import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { getDashboardData } from '../api/dashboardApi';
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardData();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchDashboard} />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your HR metrics
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Employees"
          value={data.totalEmployees}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Present Today"
          value={data.todayAttendance.present}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Absent Today"
          value={data.todayAttendance.absent}
          icon={UserX}
          color="red"
        />
        <StatCard
          title="Unmarked Today"
          value={data.todayAttendance.unmarked}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Department distribution */}
      {data.departmentStats.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Department Distribution
          </h2>
          <div className="space-y-3">
            {data.departmentStats.map((dept) => (
              <div key={dept._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{dept._id}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{
                        width: `${(dept.count / data.totalEmployees) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {dept.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent employees */}
      {data.recentEmployees.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Employees
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentEmployees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-mono text-xs text-indigo-600">
                      {emp.employeeId}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {emp.fullName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{emp.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                        {emp.department}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
