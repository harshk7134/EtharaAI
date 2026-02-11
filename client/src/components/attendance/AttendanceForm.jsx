import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { markAttendance } from '../../api/attendanceApi';

export default function AttendanceForm({
  open,
  onClose,
  onSuccess,
  employeeId,
  employeeName,
}) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = 'Date is required';
    if (!form.status) errs.status = 'Status is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await markAttendance({
        employeeId,
        date: form.date,
        status: form.status,
      });
      toast.success('Attendance marked successfully!');
      setForm({ date: new Date().toISOString().split('T')[0], status: '' });
      setErrors({});
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Mark Attendance
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{employeeName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-3">
              <label
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  form.status === 'Present'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Present"
                  checked={form.status === 'Present'}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="sr-only"
                />
                <span className="text-sm font-medium">✓ Present</span>
              </label>
              <label
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  form.status === 'Absent'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Absent"
                  checked={form.status === 'Absent'}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="sr-only"
                />
                <span className="text-sm font-medium">✗ Absent</span>
              </label>
            </div>
            {errors.status && (
              <p className="mt-1 text-xs text-red-500">{errors.status}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
