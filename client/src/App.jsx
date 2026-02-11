import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeAttendance from './pages/EmployeeAttendance';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/:id/attendance" element={<EmployeeAttendance />} />
      </Routes>
    </Layout>
  );
}

export default App;
