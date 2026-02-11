export default function StatusBadge({ status }) {
  const styles = {
    Present: 'bg-green-100 text-green-700',
    Absent: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  );
}
