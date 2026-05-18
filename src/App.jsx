import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import DashboardLayout from './pages/DashboardLayout';
import NGODashboard from './pages/NGODashboard';
import NGOProfile from './pages/NGOProfile';
import BlogCreate from './pages/BlogCreate';
import DonorDashboard from './pages/DonorDashboard';
import Checkout from './pages/Checkout';
import Settings from './pages/Settings';
import Donations from './pages/Donations';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/ngo-profile" element={<NGOProfile />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Dashboard Routes with Sidebar */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<NGODashboard />} />
            <Route path="blog/create" element={<BlogCreate />} />
            <Route path="donor" element={<DonorDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="donations" element={<Donations />} />
            <Route path="ngo-profile" element={<NGOProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
