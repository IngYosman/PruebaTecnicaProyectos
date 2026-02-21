import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Admin Pages
import AdminProjects from './pages/Admin/Projects';
import AdminUsers from './pages/Admin/Users';
import AdminTaskStatuses from './pages/Admin/TaskStatuses';
import AdminRates from './pages/Admin/Rates';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas Privadas / Usuario Normal */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proyectos/:id" element={<ProjectDetail />} />

            {/* Rutas Privadas / Administrador */}
            <Route element={<PrivateRoute requireAdmin={true} />}>
              <Route path="/admin/proyectos" element={<AdminProjects />} />
              <Route path="/admin/usuarios" element={<AdminUsers />} />
              <Route path="/admin/estados" element={<AdminTaskStatuses />} />
              <Route path="/admin/tarifas" element={<AdminRates />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
