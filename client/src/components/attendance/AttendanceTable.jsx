import StatusBadge from '../ui/StatusBadge';

export default function AttendanceTable({ records }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Date
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Day
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const date = new Date(record.date);
              return (
                <tr
                  key={record._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-900">
                    {date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={record.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
