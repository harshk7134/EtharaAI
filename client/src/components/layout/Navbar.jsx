import { Menu } from 'lucide-react';

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>
      <div className="ml-4 lg:ml-0">
        <p className="text-sm text-gray-500">Welcome back, <span className="font-medium text-gray-700">Admin</span></p>
      </div>
    </header>
  );
}
