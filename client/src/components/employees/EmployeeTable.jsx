import { useNavigate } from 'react-router-dom';
import { Trash2, Calendar, UserCircle } from 'lucide-react';

export default function EmployeeTable({ employees, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Employee
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Email
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Department
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Joined
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {emp.fullName}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {emp.employeeId}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{emp.email}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {emp.department}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {new Date(emp.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        navigate(`/employees/${emp._id}/attendance`)
                      }
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Attendance"
                    >
                      <Calendar size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(emp)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Employee"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
