import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MeusAgendamentos from './pages/paciente/MeusAgendamentos';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/paciente/agendamentos"
            element={
              <PrivateRoute>
                <MeusAgendamentos />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
