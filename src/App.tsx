import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ComparisonBar from './components/ComparisonBar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import { CompareProvider } from './context/CompareContext'

import Home from './pages/Home'
import Inventory from './pages/Inventory'
import VehicleDetail from './pages/VehicleDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Account from './pages/Account'
import Favorites from './pages/Favorites'
import Compare from './pages/Compare'
import SellYourCar from './pages/SellYourCar'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVehicles from './pages/admin/AdminVehicles'
import AdminVehicleForm from './pages/admin/AdminVehicleForm'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminTestDrives from './pages/admin/AdminTestDrives'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminSellRequests from './pages/admin/AdminSellRequests'

export default function App() {
  return (
    <CompareProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sell-your-car" element={<SellYourCar />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="vehicles" element={<AdminVehicles />} />
              <Route path="vehicles/new" element={<AdminVehicleForm />} />
              <Route path="vehicles/:id/edit" element={<AdminVehicleForm />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="test-drives" element={<AdminTestDrives />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="sell-requests" element={<AdminSellRequests />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton floating />
        <ComparisonBar />
      </div>
    </CompareProvider>
  )
}
